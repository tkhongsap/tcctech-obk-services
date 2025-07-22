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
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import authenAction from '~/states/authen/authenAction';

const baseURLObIam: string = 'https://dev.glorymtel.xyz/ob-iam';
const baseURLObDocument: string = 'https://dev.glorymtel.xyz/ob-document';
const baseURLObNotification: string =
  'https://dev.glorymtel.xyz/ob-notification';

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
        '[REQUEST]',
        util.inspect(
          {
            url: config.url,
            headers: config.headers,
            data: config.data,
            method: config.method,
            params: config.params,
          },
          false,
          null,
          false,
        ),
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
        '[RESPONSE]',
        util.inspect(
          {
            url: response.config.url,
            status: response.status,
            data: response.data,
          },
          false,
          null,
          false,
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
        response.data.error.message !== 'unauthorized'
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
};

export const setHeaderSDK = (token?: string) => {
  OB_IAM_SDK.setAcessToken(`${token}` ?? '');
  OB_DOCUMENT_SDK.setAcessToken(`${token}` ?? '');
  OB_NOTI_SDK.setAcessToken(`${token}` ?? '');
  OB_BMS_SDK.setAcessToken(`${token}` ?? '');
};

export const resetHeader = () => {
  delete OB_IAM_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_DOCUMENT_SDK.axiosInstance.defaults.headers.common[
    'x-access-token'
  ];
  delete OB_NOTI_SDK.axiosInstance.defaults.headers.common['x-access-token'];
  delete OB_BMS_SDK.axiosInstance.defaults.headers.common['x-access-token'];
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
