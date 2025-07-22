import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';

export interface GetParkingDetailByPersonIDDataResponse {
  status: string;
  message: string;
  exeption: string | null;
  logId: string;
  ticketNo: string;
  ticketUid: string;
  plateNo: string;
  entryDateTime: string;
  logDateTime: string;
  exitStatus: number;
  terminalInId: number;
  terminalInName: string;
  memberTypeId: number;
  memberTypeName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  rateCode: string;
  rateDetailTH: string;
  rateDetailEN: string;
  tenantId: string;
  tenantName: string;
  isCardLost: boolean;
  parkHH: number;
  parkMM: number;
  rateHH: number;
  freeHH: number;
  subTotal: number;
  discount: number;
  parkFee: number;
  cardLostFine: number;
  overNightFine: number;
  total: number;
  isInv: boolean;
  invRateHH: number;
  invFee: number;
  isPayAtKiosk: boolean;
  lastDateTimePaymentAtKiosk: string | null;
  payAtKioskAll: number;
  durationInMinute: number;
  timeUsedInMinute: number;
  remainInMinute: number;
}

interface BaseFSParkingResponse<T> {
  message: string;
  status: number;
  data: T;
  count: number;
}

class FSParkingClientService {
  public httpClient: AxiosInstance;
  public fsParkingApiKey?: string;

  constructor() {
    this.httpClient = axios.create({
      baseURL:
        process.env['FS_PARKING_API_URL'] || '',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      timeout: 5000,
    });
    this.fsParkingApiKey =
      process.env['FS_PARKING_API_KEY'] ?? '';
    this.httpClient.defaults.headers.common['Accept'] = 'application/json';
    this.httpClient.defaults.headers.common['Content-Type'] =
      'application/json';
    this.httpClient.defaults.headers.common['X-API-KEY'] = this.fsParkingApiKey;
  }

  public async getParkingDetailByQRCode(
    logCarparkID: string
  ): Promise<
    AxiosResponse<
      BaseFSParkingResponse<GetParkingDetailByPersonIDDataResponse[]>
    >
  > {
    try {
      return this.httpClient.post('api/Redemption/GetParkingDetailByQRCode', {
        logCarparkID,
        lostCard: false,
      });
    } catch (error) {
      throw error;
    }
  }

  public async health(): Promise<AxiosResponse<any>> {
    return await this.httpClient.get(`/health`);
  }
}

const FSParkingClient = new FSParkingClientService();

export default FSParkingClient;
