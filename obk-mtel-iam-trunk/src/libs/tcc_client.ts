import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import cache from '../libs/cache';

interface getOauth2Response {
  token_type: string;
  access_token: string;
  expires_in: number;
}

interface CreateUser {
  RequestBody: {
    emailOrPhone: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  ResponseData: {
    username: string;
  };
}

interface Login {
  RequestBody: {
    username: string;
    password: string;
  };
  ResponseData: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

interface CreateAuthAlias {
  RequestBody: {
    username: string;
    newAttribute: string;
  };
  ResponseData: {
    authAttributes: string[];
  };
}

interface RemoveAuthAlias
  {
  RequestBody: {
    username: string;
    removeAttribute: string;
  };
  ResponseData: {
    authAttributes: string[];
  };
}

interface CheckAndBindingAccountResident
  {
  RequestBody: {
    provider: string;
    tenantEmail?: string;
    phoneNumber?: string;
    countryCode?: string;
  };
  ResponseData: {
    data: {
      syncToMtel: boolean;
      syncToBim: boolean;
    }
  };
}

export interface CreateAccountRegisterEVResident
  {
  RequestBody: {
    accid: string;
    token: string;
  };
  ResponseData: {
      token: string;
      message: string;
      errcode: number;
      completed: boolean;
  };
}

interface AuthorizeEVResident
  {
  RequestBody: {
    accid: string;
    authPassword: string;
    authToken: string;
  };
  ResponseData: {
      token: string;
      message: string;
      errcode: number;
      completed: boolean;
      expired: string;
      metadata?: {
        name?: string;
      };
  };
}

interface GetAccountEVResident
  {
    ResponseData: {
      token: string;
      message: string;
      errcode: number;
      completed: boolean;
      expired: string;
      metadata?: {
        name?: string;
      };
  };
}

class TCCClientService {
  public httpClient: AxiosInstance;
  public config = {
    baseUrl: process.env['TCC_API_URL'] ?? 'https://ec2-18-142-55-130.ap-southeast-1.compute.amazonaws.com',
    clientId: process.env['TCC_CLIENT_ID'] ?? 'qAVBaRmQdzK2PMptwXKJlGOKlbYGeMV2',
    clientSecret: process.env['TCC_CLIENT_SECRET'] ?? 'AKiMukKt9kDMXG6XBk1ST68M6L5lmmyd',
  };

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      validateStatus: () => true,
    });
    this.httpClient.defaults.headers.common['Accept'] = 'application/json';
    this.httpClient.defaults.headers.common['Content-Type'] = 'application/json';

    this.httpClient.interceptors.request.use(
      async (config) => {
        const cachedToken = (await cache.get('TCC_ACCESS_TOKEN')) as string | null;
        if (cachedToken) {
          this.setToken(cachedToken);
        }
        config.headers['Authorization'] = 'Bearer ' + cachedToken;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.httpClient.interceptors.response.use(
      async (response) => {
        const { status } = response;
        if (status === 401) {
          const tokenResponse = await this.getOauth2Token();
          await cache.set('TCC_ACCESS_TOKEN', tokenResponse.data.access_token, 3540);
          this.setToken(tokenResponse.data.access_token);
          response.config.headers['Authorization'] = 'Bearer' + tokenResponse.data.access_token; // add this

          return this.httpClient.request(response.config);
        }
        return response;
      },
      async (error) => {
        return Promise.reject(error);
      },
    );
  }

  public async setToken(token: string): Promise<void> {
    this.httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }

  public async getOauth2Token(): Promise<AxiosResponse<getOauth2Response>> {
    const response = await this.httpClient.post('/obk/api/oauth2/token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
    });

    return response;
  }

  public async createUser(body: CreateUser['RequestBody']): Promise<AxiosResponse<CreateUser['ResponseData']>> {
    return await this.httpClient.post('/obk/api/v1/customer/kc/user', body);
  }

  public async login(body: Login['RequestBody']): Promise<AxiosResponse<Login['ResponseData']>> {
    return await this.httpClient.post('/obk/api/v1/customer/kc/login', body);
  }

  public async createAuthAlias(
    body: CreateAuthAlias['RequestBody'],
  ): Promise<AxiosResponse<CreateAuthAlias['ResponseData']>> {
    return await this.httpClient.post('obk/api/v1/customer/kc/authalias', body);
  }

  public async removeAuthAlias(
    body: RemoveAuthAlias['RequestBody'],
  ): Promise<AxiosResponse<RemoveAuthAlias['ResponseData']>> {
    return await this.httpClient.delete('obk/api/v1/customer/kc/authalias', { data: body });
  }

  public async checkAndBindingAccountResident(
    body: CheckAndBindingAccountResident['RequestBody'],
  ): Promise<AxiosResponse<CheckAndBindingAccountResident['ResponseData']>> {
    return await this.httpClient.post('obk/api/v1/resident/register-new-tenant', body);
  }

  public async createAccountRegisterEVResident(
    body: CreateAccountRegisterEVResident['RequestBody'],
  ): Promise<AxiosResponse<CreateAccountRegisterEVResident['ResponseData']>> {
    return await this.httpClient.post('obk/api/v1/EV/account/register', body);
  }

  public async authorizeEVResident(
    body: AuthorizeEVResident['RequestBody'],
  ): Promise<AxiosResponse<AuthorizeEVResident['ResponseData']>> {
    return await this.httpClient.post('obk/api/v1/EV/account/authorize', body);
  }

   public async getAccountEVResident(
    token: string,
  ): Promise<AxiosResponse<GetAccountEVResident['ResponseData']>> {
    return await this.httpClient.get('obk/api/v1/EV/account/me', { headers: { token: token }});
  }
}

const TCCClient = new TCCClientService();
export default TCCClient;
