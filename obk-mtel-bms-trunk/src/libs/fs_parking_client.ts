import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import logging from '../utils/logging';

interface Type {
  name: string;
  totalSpot: number;
  availableSpot: number;
  unavailableSpot: number;
  reserveSpot: number;
}

interface Zone {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  floorId: number;
  totalSpot: number;
  availableSpot: number;
  unavailableSpot: number;
  reserveSpot: number;
  types: Type[];
}

interface Floor {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  buildingId: number;
  zones: Zone[];
  totalSpot: number;
  availableSpot: number;
  unavailableSpot: number;
  reserveSpot: number;
}

interface FetchParkingAvailabilityResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  floors: Floor[];
  totalSpot: number;
  availableSpot: number;
  unavailableSpot: number;
  reserveSpot: number;
}

interface CheckRedemptionStatusByEmailDataResponse {
  userID: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  userLevel: string;
  tenantId: string;
  redempType: string;
  departmentId: string;
  isUse: number;
}

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

interface GetDataRateCodeRequest {
  tenantID: number;
  memberType: number;
  vehicleType: number;
  departmentID: number;
}

interface GetDataRateCodeResponse {
  rateCode: number;
  rateDetail: string;
  rateDetailEng: string;
}

interface RedeemParkingRequest {
  logCarparkID: string;
  terminalID: number;
  datetimeIn: string;
  runningNumber: string;
  plateNumber: string;
  memberType: number;
  carType: number;
  tenantID: number;
  spendingValue: string;
  posValue: string;
  couponValue: string;
  rateCode: string;
  userID: string;
  remark: string;
}

interface RedeemParkingDataResponse {
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

class FSParkingClientService {
  public httpClient: AxiosInstance;
  public fsParkingApiKey?: string;

  constructor() {
    this.httpClient = axios.create({
      baseURL: process.env['FS_PARKING_API_URL'] || 'https://mt-services.fs-omc.io',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      timeout: 5000,
    });
    this.fsParkingApiKey = process.env['FS_PARKING_API_KEY'] ?? '8f9fe2b5ec7db5e288ea9706cd0d9be6';
    this.httpClient.defaults.headers.common['Accept'] = 'application/json';
    this.httpClient.defaults.headers.common['Content-Type'] = 'application/json';
    this.httpClient.defaults.headers.common['X-API-KEY'] = this.fsParkingApiKey;
  }
  public async getParkingAvailabilityData(): Promise<AxiosResponse<FetchParkingAvailabilityResponse[]>> {
    return this.httpClient.get('api/buildings');
  }

  public async checkRedemptionStatusByEmail(
    email: string[],
  ): Promise<AxiosResponse<BaseFSParkingResponse<CheckRedemptionStatusByEmailDataResponse>>> {
    return this.httpClient.post('api/login/CheckRedemptionStatusByEmail', { email });
  }

  public async getParkingDetailByPersonID(
    personID: string,
  ): Promise<AxiosResponse<BaseFSParkingResponse<GetParkingDetailByPersonIDDataResponse[]>>> {
    try {
      return this.httpClient.post('api/Redemption/GetParkingDetailByPersonID', { personID, lostCard: false });
    } catch (error) {
      logging.error('getParkingDetailByPersonID error', error);
      throw error;
    }
  }

  public async getParkingDetailByQRCode(
    logCarparkID: string,
  ): Promise<AxiosResponse<BaseFSParkingResponse<GetParkingDetailByPersonIDDataResponse[]>>> {
    try {
      return this.httpClient.post('api/Redemption/GetParkingDetailByQRCode', { logCarparkID, lostCard: false });
    } catch (error) {
      throw error;
    }
  }

  public async getDataRateCode(
    data: GetDataRateCodeRequest,
  ): Promise<AxiosResponse<BaseFSParkingResponse<GetDataRateCodeResponse[]>>> {
    return this.httpClient.post('api/Redemption/GetDataRateCode', data);
  }

  public async redeemParking(
    data: RedeemParkingRequest,
  ): Promise<AxiosResponse<BaseFSParkingResponse<RedeemParkingDataResponse[]>>> {
    return this.httpClient.post('api/Redemption/RedeemParking', data);
  }
}

const FSParkingClient = new FSParkingClientService();

export default FSParkingClient;
