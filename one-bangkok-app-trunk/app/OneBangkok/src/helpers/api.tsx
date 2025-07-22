import axios, {AxiosInstance} from 'axios';
import {isEmpty, mapKeys, snakeCase} from 'lodash';
import authenState from '~/states/authen/authenState';
import Config from 'react-native-config';
import util from 'util';
import appLanguageState from '~/states/appLanguage/appLanguageState';

import * as OB_IAM_SDK from 'ob-iam-sdk';
import * as OB_DOCUMENT_SDK from 'ob-document-sdk';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import * as OB_NOTI_SDK from 'ob-notification-sdk';
import * as OB_BUS_SDK from 'ob-bus-sdk';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import authenAction from '~/states/authen/authenAction';

const baseURLObIam: string = Config.OB_IAM_URL!;
const baseURLObDocument: string = Config.OB_DOCUMENT_URL!;
const baseURLObNotification: string = Config.OB_NOTI_URL!;

export const obIamClient = axios.create({baseURL: baseURLObIam});

export const obDocumentClient = axios.create({baseURL: baseURLObDocument});

export const obNotificationClient = axios.create({
  baseURL: baseURLObNotification,
});

export const mapKeysWithSnakeCase = (body: any) => {
  return mapKeys(body, function (value, key) {
    return snakeCase(key);
  });
};

export const apiEventEmitter = new EventEmitter();

export const headerAccessToken = () => {
  const token = authenState.token.get()!;
  let currentLanguage = appLanguageState.currentLanguage.get();
  if (!currentLanguage) {
    currentLanguage = appLanguageState.defaultLanguage.get();
  }
  return {
    headers: {
      'X-Access-Token': `Bearer ${token}`,
      'accept-language': currentLanguage,
    },
  };
};

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!isEmpty(refreshToken)) {
      const response = await OB_IAM_SDK.client.authRenew({
        data: {refresh_token: refreshToken},
        headers: {
          'X-Refresh-Token': `Bearer ${refreshToken}`,
        },
      });
      const token = response.data?.data?.token?.value;
      if (token) {
        setHeaderSDK(token);
        authenAction.storeToken(token);
        await AsyncStorage.setItem('token', token);
        return token;
      }
    }
    resetHeader();
    authenState.token.set('');
    authenAction.storeToken('');
    authenAction.storeRefreshToken('');
    apiEventEmitter.emit('unauthorized', '');
    return null;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
};
const requestQueue: any[] = [];
let isRefreshing = false; // Flag to indicate if token refresh is in progress

const enqueueRequest = (request: any) => {
  requestQueue.push(request);
};

const tokenRefreshLock = async (callback: () => Promise<any>) => {
  if (isRefreshing) {
    return new Promise(resolve => {
      const intervalId = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(intervalId);
          resolve(callback());
        }
      }, 500); // Check every 500ms if refresh is done
    });
  } else {
    isRefreshing = true;
    try {
      return await callback();
    } finally {
      isRefreshing = false;
    }
  }
};

const setupAxiosInterceptors = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    config => {
      console.log(
        '\x1b[42m[REQUEST]\x1b[0m',
        util.inspect({
          url: config.url,
          headers: config.headers,
          data: config.data,
          method: config.method,
          params: config.params,
        }),
      );
      return config;
    },
    (error: any): Promise<any> => {
      console.error('[REQUEST]', error.message);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    async response => {
      console.log(
        '\x1b[44m[RESPONSE]\x1b[0m',
        util.inspect(
          {
            url: response.config.url,
            status: response.status,
            data: JSON.stringify(response.data),
          },
          {colors: true},
        ),
      );
      if (response.data.error === 'token has been inactive') {
        const regex = /ob-iam\/auth\/renew/;
        if (regex.test(response.config.url!)) {
          resetHeader();
          authenState.token.set('');
          authenAction.storeToken('');
          authenAction.storeRefreshToken('');
          apiEventEmitter.emit('unauthorized', '');
          return;
        }
      }

      if (
        response &&
        response.status === 401 &&
        response.data.error.message !== 'unauthorized' &&
        response.data.error.message !== 'Login failed'
      ) {
        enqueueRequest(response.config);

        return tokenRefreshLock(async () => {
          const newToken = await refreshToken();
          if (!isEmpty(newToken)) {
            const retryPromises = requestQueue.map(requestConfig => {
              requestConfig.headers['X-Access-Token'] = `Bearer ${newToken}`;
              // Retry each request individually and handle errors
              return axiosInstance(requestConfig).catch(retryError => {
                console.error('Retry request failed:', retryError);
                return retryError; // Return the error to be handled later
              });
            });
            const retryResponses = await Promise.all(retryPromises);
            const failedRequests = retryResponses.filter(
              response => response instanceof Error,
            );

            if (failedRequests.length > 0) {
              return Promise.reject(failedRequests[0]);
            }

            requestQueue.length = 0;
          }

          return response;
        });
      }

      // Return the response object
      return response;
    },
    async (error: any): Promise<any> => {
      console.error(
        '[RESPONSE ERROR]',
        util.inspect(
          {
            message: error.message,
            response: error.response
              ? {
                  status: error.response.status,
                  data: error.response.data,
                }
              : 'No response',
          },
          false,
          null,
          false,
        ),
      );

      // // For test
      // Alert.alert(
      //   'Error',
      //   JSON.stringify({
      //     status: error?.response?.status,
      //     message: error.message,
      //     data: error?.response?.data,
      //   }),
      // );

      // Reject the error
      return Promise.reject(error);
    },
  );
};

export const settingSDK = () => {
  OB_IAM_SDK.setBaseUrl(Config.OB_IAM_URL ?? '');
  OB_IAM_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_IAM_SDK.axiosInstance);

  OB_DOCUMENT_SDK.setBaseUrl(Config.OB_DOCUMENT_URL ?? '');
  OB_DOCUMENT_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_DOCUMENT_SDK.axiosInstance);

  OB_BMS_SDK.setBaseUrl(Config.OB_BMS_URL ?? '');
  OB_BMS_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_BMS_SDK.axiosInstance);

  OB_NOTI_SDK.setBaseUrl(Config.OB_NOTI_URL ?? '');
  OB_NOTI_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_NOTI_SDK.axiosInstance);
  OB_BUS_SDK.setBaseUrl(Config.OB_BUS_SDK ?? '');
  OB_BUS_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_BUS_SDK.axiosInstance);

  OB_PARKING_SDK.setBaseUrl(Config.OB_PARKING_URL ?? '');
  OB_PARKING_SDK.axiosInstance.defaults.validateStatus = (): boolean => true;
  setupAxiosInterceptors(OB_PARKING_SDK.axiosInstance);

  setupAxiosInterceptors(instanceServiceMind);
  setupAxiosInterceptors(instanceNetatmoService);
};

export const setHeaderSDK = (token?: string) => {
  OB_IAM_SDK.setAcessToken(`${token}` ?? '');
  OB_DOCUMENT_SDK.setAcessToken(`${token}` ?? '');
  OB_NOTI_SDK.setAcessToken(`${token}` ?? '');
  OB_BMS_SDK.setAcessToken(`${token}` ?? '');
  OB_BUS_SDK.setAcessToken(`${token}` ?? '');
  OB_PARKING_SDK.setAcessToken(`${token}` ?? '');
};

export const resetHeader = () => {
  delete OB_IAM_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_DOCUMENT_SDK.axiosInstance.defaults.headers.common[
    'x-access-token'
  ];
  delete OB_NOTI_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_BMS_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_BUS_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_PARKING_SDK.axiosInstance.defaults.headers.common['x-access-token'];
};

export const instanceUploadImage = axios.create({
  baseURL: Config.UPLOAD_IMAGE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  maxBodyLength: Infinity,
  method: 'post',
});

export const instanceDownLoadTranslation = axios.create({
  baseURL: Config.S3_TRANSLATION_BUCKET_URL,
  timeout: 3000,
  method: 'get',
  headers: {
    'Cache-Control': 'no-cache', // Prevent caching
  },
});

export const instanceServiceMind = axios.create({
  baseURL: Config.OB_RESIDENTIAL_BASEURL,
  timeout: 30000,
  method: 'get',
  headers: {
    'Cache-Control': 'no-cache', // Prevent caching
  },
});
export const instanceNetatmoService = axios.create({
  baseURL: Config.OB_RESIDENTIAL_BASEURL,
  timeout: 30000,
  method: 'get',
  headers: {
    'Cache-Control': 'no-cache', // Prevent caching
  },
});

export function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
}
