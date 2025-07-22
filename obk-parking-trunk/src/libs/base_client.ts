import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import logging from '../utils/logging';

const MAX_LOG_SIZE = 1024 * 1024; // 1MB
export class BaseHttpClient {
  protected httpClient: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.httpClient = axios.create({
      baseURL,
      ...config,
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor() {
    this.httpClient.interceptors.request.use(
      (config) => {
        const {accountId, traceId} = logging.getLogContext();
        config.headers.set('x-account-id', accountId);
        config.headers.set('x-trace-id', traceId);
        
        const logData: any = {
          method: config.method?.toUpperCase(),
          url: config.baseURL ? config.baseURL + config.url : config.url,
          headers: config.headers,
        };

        const body = config.data;
        if (body && JSON.stringify(body).length < MAX_LOG_SIZE) {
          logData.body = JSON.stringify(body);
        }

        logging.info('[HTTP REQUEST]', logData);
        return config;
      },
      (error) => {
        logging.error('[HTTP REQUEST ERROR]', error.message);
        return Promise.reject(error);
      }
    );
  }

  private initializeResponseInterceptor() {
    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => {
        const responseData: any = {
          status: `${response.status} ${response.statusText}`,
          url: response.config.baseURL
            ? response.config.baseURL + response.config.url
            : response.config.url,
          headers: response.headers,
        };

        if (response.data && JSON.stringify(response.data).length < MAX_LOG_SIZE) {
          responseData['response'] = JSON.stringify(response.data);
        }

        logging.info('[HTTP RESPONSE]', responseData);
        return response;
      },
      (error) => {
        if (error.response) {
          const errorLog = {
            status: `${error.response.status} ${error.response.statusText}`,
            url: error.config.baseURL
              ? error.config.baseURL + error.config.url
              : error.config.url,
            headers: error.response.headers,
            response:
              error.response.data &&
              JSON.stringify(error.response.data).length < MAX_LOG_SIZE
                ? error.response.data
                : '[Too Large]',
          };
          logging.error('[HTTP ERROR RESPONSE]', errorLog);
        } else {
          logging.error('[HTTP ERROR]', error.message);
        }

        return Promise.reject(error);
      }
    );
  }
  // Set or update headers
  public setHeader(key: string, value: string) {
    this.httpClient.defaults.headers.common[key] = value;
  }

  // Set base URL
  public setBaseUrl(url: string) {
    this.httpClient.defaults.baseURL = url;
  }
}
