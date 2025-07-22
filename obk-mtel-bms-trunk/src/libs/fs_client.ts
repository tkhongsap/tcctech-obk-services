import axios, { AxiosInstance, AxiosResponse } from 'axios';
import cache from './cache';
import https from 'https';
import { get } from 'lodash';
export interface WrappedResponse<T> {
  message: string;
  status: number;
  data: T;
}

interface LiftCallRequestBody {
  personID: string;
  locationID: string;
  destinationFloorID: string;
}

interface LiftCallResponse {
  personID: string;
  liftName: string;
  floorID: number;
  floorName: string;
}

interface LoginRequestResponse {
  user_ID?: number;
  user_Name?: string;
  firstName?: string;
  lastName?: string;
  department?: string | null;
  position?: string | null;
  note?: string | null;
  active?: boolean;
  isLogIn?: boolean;
  token?: string;
  role_ID?: number;
}

interface InviteSchedule {
  endDate: string;
  startDate: string;
}

interface InvitePreRegisterRequestBody {
  guestInviteDocNo: string;
  guestInviteName: string;
  tenantID: string;
  locationID: string;
  personID: string;
  inviteSchedule: InviteSchedule[];
}

export interface InvitePreRegisterResponse {
  inviteID: string;
}

interface UpdateDefaultFloorRequestBody {
  floorID: number;
  zoneID: number;
  towerID: number;
  projectID: number;
  personID: string;
}

interface CancelPreRegisterRequestBody {
  inviteID: string;
  personID: string;
}

interface CancelPreRegisterRequestResponse {
  message: string;
  status: number;
  data: null;
}

interface GetMemberExitsTowerRequestBody {
  personID: string;
  locationID: number;
}
interface GetMemberExitsTowerResponse {
  locationID: string;
  personID: string;
  dateTime: string;
  isExist: boolean | null;
}

class FSClientService {
  public BYPASS_INTECEPTORS = ['Login', 'ForceStatusLogin'];
  public httpClient: AxiosInstance;
  public token?: string;
  private fsUsername?: string;
  private fsPassword?: string;

  constructor() {
    const timeout = process.env['FS_TIMEOUT'] ?? '5000';
    this.httpClient = axios.create({
      baseURL: process.env['FS_API_URL'] || 'https://onebangkok-api.dreamy-germain.119-59-118-127.plesk.page',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      timeout: parseInt(timeout),
    });
    this.httpClient.defaults.headers.common['Accept'] = 'application/json';
    this.httpClient.defaults.headers.common['Content-Type'] = 'application/json';

    this.fsUsername = process.env['FS_API_USERNAME'] ?? 'mtel';
    this.fsPassword = process.env['FS_API_PASSWORD'] ?? 'fscp_1';

    this.httpClient.interceptors.request.use(
      async (config) => {
        if (this.byPassInterceptors(config.url as string)) {
          return config;
        }
        const token = (await cache.get('fsToken')) ?? (await this.fetchToken());
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (this.byPassInterceptors(error.config.url)) {
          return Promise.reject(error);
        }
        const status = error.response ? error.response.status : null;
        if (status === 401) {
          const token = await this.fetchToken();
          error.config.headers['Authorization'] = `Bearer ${token}`;
          return this.httpClient.request(error.config);
        }

        return Promise.reject(error);
      },
    );
  }

  private byPassInterceptors(url: string): boolean {
    return this.BYPASS_INTECEPTORS.includes(url.split('/').pop() as string);
  }

  public async fetchToken(): Promise<string> {
    await this.forceStatusLogin();
    const response = await this.login();
    const token = get(response, 'data.data.token');

    if (token) {
      this.token = token;
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await cache.set('fsToken', token, 3540);
    } else {
      throw new Error('FS_AUTHENTICATION_FAILED');
    }

    return token;
  }

  private async login(): Promise<AxiosResponse<WrappedResponse<LoginRequestResponse>>> {
    if (!this.fsUsername || !this.fsPassword) {
      throw new Error('FS_CREDENTIALS_MISSING');
    }
    const loginData = {
      username: this.fsUsername,
      password: this.fsPassword,
    };
    return this.httpClient.post('api/Login/Login', loginData);
  }

  private async forceStatusLogin(): Promise<AxiosResponse<WrappedResponse<null>>> {
    if (!this.fsUsername || !this.fsPassword) {
      throw new Error('FS_CREDENTIALS_MISSING');
    }
    const loginData = {
      username: this.fsUsername,
      password: this.fsPassword,
    };
    return this.httpClient.post('api/Login/ForceStatusLogin', loginData, { validateStatus: () => true });
  }

  public async liftCall(data: LiftCallRequestBody): Promise<AxiosResponse<WrappedResponse<LiftCallResponse>>> {
    return this.httpClient.post('api/AuthorizeFloor/getCallLift', data);
  }

  public async invitePreRegister(
    data: InvitePreRegisterRequestBody,
  ): Promise<AxiosResponse<WrappedResponse<InvitePreRegisterResponse>>> {
    return this.httpClient.post('api/PreRegister/invitePreRegister', data);
  }

  public async updateDefaultFloor(
    data: UpdateDefaultFloorRequestBody,
  ): Promise<AxiosResponse<WrappedResponse<InvitePreRegisterResponse>>> {
    return this.httpClient.post('api/Member/changeDefaultFloor', data);
  }

  public async cancelPreRegister(
    data: CancelPreRegisterRequestBody,
  ): Promise<AxiosResponse<WrappedResponse<CancelPreRegisterRequestResponse>>> {
    return this.httpClient.post('api/PreRegister/cancelPreRegister', data);
  }

  public async getMemberExitsTower(
    data: GetMemberExitsTowerRequestBody,
  ): Promise<AxiosResponse<WrappedResponse<GetMemberExitsTowerResponse[]>>> {
    return this.httpClient.post('api/AuthorizeFloor/getMemberExitsTower', data);
  }
}

const FSClient = new FSClientService();

export default FSClient;
