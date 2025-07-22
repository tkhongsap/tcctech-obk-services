import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import cache from '../libs/cache';
import logging from '../utils/logging';
import { GetParkingDetailByPersonIDDataResponse } from './fs_parking_client';

interface BaseParkingResponse<T> {
  message: string;
  status: number;
  data: T;
  count: number;
}

interface getOauth2Response {
  token_type: string;
  access_token: string;
  expires_in: number;
}

class TCCClientService {
  public httpClient: AxiosInstance;
  public config = {
    baseUrl:
      process.env['TCC_API_URL'] ??
      'https://ec2-18-142-55-130.ap-southeast-1.compute.amazonaws.com',
    clientId:
      process.env['TCC_CLIENT_ID'] ?? 'qAVBaRmQdzK2PMptwXKJlGOKlbYGeMV2',
    clientSecret:
      process.env['TCC_CLIENT_SECRET'] ?? 'AKiMukKt9kDMXG6XBk1ST68M6L5lmmyd',
  };

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    this.httpClient.defaults.headers.common['Accept'] = 'application/json';
    this.httpClient.defaults.headers.common['Content-Type'] =
      'application/json';

    this.httpClient.interceptors.request.use(
      async (config) => {
        const cachedToken = (await cache.get('TCC_ACCESS_TOKEN')) as
          | string
          | null;
        if (cachedToken) {
          this.setToken(cachedToken);
        }
        config.headers['Authorization'] = 'Bearer ' + cachedToken;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
          const response = await this.getOauth2Token();
          await cache.set('TCC_ACCESS_TOKEN', response.data.access_token, 3540);

          return this.httpClient.request(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  public async setToken(token: string): Promise<void> {
    this.httpClient.defaults.headers.common['Authorization'] =
      'Bearer ' + token;
  }

  public async getOauth2Token(): Promise<AxiosResponse<getOauth2Response>> {
    const response = await this.httpClient.post('/obk/api/oauth2/token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
    });

    return response;
  }

  public async getParkingDetailByPersonID(
    personID: string
  ): Promise<
    AxiosResponse<BaseParkingResponse<GetParkingDetailByPersonIDDataResponse[]>>
  > {
    try {
      return this.httpClient.post(
        '/obk/api/v1/mt/parking/getParkingDetailByPersonId',
        {
          personID: personID,
          lostCard: false,
        }
      );
    } catch (error) {
      logging.error('getParkingDetailByPersonID error', error);
      throw error;
    }
  }
  public async health(): Promise<AxiosResponse<any>> {
    return await this.httpClient.get(
      `/health`
    );
  }
}

const TCCClient = new TCCClientService();

export default TCCClient;
