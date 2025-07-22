import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import cache from '../libs/cache';
import logging from '../utils/logging';
import { GetParkingDetailByPersonIDDataResponse } from './fs_parking_client';
import { WrappedResponse, InvitePreRegisterResponse } from './fs_client';

export type SensorType = 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'aqi' | 'tvoc';

export type AlgType = 'ShopperToTenant' | 'TenantToShopper' | 'VisitorToApp';

export interface UpdateTransactionCarParkBody {
  logId: string;
  uid: string;
  accountId: string;
  algType: AlgType;
}
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

export interface OutdoorZoneResponse {
  name: string;
  code: string;
  display: {
    en: string;
    th: string;
    zh: string;
  };
}

export type getAirQualityFeedResponse = AirQualityFeedData[];

export interface DepreciatedAirQualityFeedData {
  siteid: string;
  deviceName: string;
  channelDescription: string;
  offset: number;
  cal: number;
  labelName: string;
  labelColor: string;
  netid: string;
  chid: number;
  tag: string;
  unit: string;
  sensorType: string;
  id: string;
  minVal: null;
  maxVal: null;
  data: [
    {
      timestamp: string;
      value: number;
    },
  ];
  limitData: boolean;
  limitOutput: boolean;
  timezone: 'UTC';
}

interface InviteSchedule {
  endDate: string;
  startDate: string;
}

interface InvitePreRegisterRequestBody {
  guestInviteName: string;
  residenceID: string;
  locationID: number;
  personID: string;
  inviteSchedule: InviteSchedule[];
}

export interface AirQualityFeedData {
  sensor: string;
  channel: string;
  tag: string;
  type: string;
  status: string | null;
  netid: string;
  chid: number;
  timezone: string;
  site: string;
  zone: string;
  tower: string;
  component: string;
  floor: string;
  space: string;
  subspace: string | null;
  locationCode: string;
  buildingName: string;
  buildingCode: string;
  floorName: string;
  floorCode: string;
  addressCCDD: string;
  addressCode: string | null;
  mainSystemName: string;
  mainSystemCode: string;
  subSystemName: string;
  subSystemCode: string;
  equipmentName: string;
  equipmentCode: string;
  sequenceNo: string;
  equipmentFullName: string;
  equipmentFullCode: string;
  data: [
    {
      timestamp: string;
      value: number;
    },
  ];
}

interface ParkingSpaceDetailRequest {
  queryType?: number;
  plateNo?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface ParkingSpaceDetailResponseList {
  recordSyscode?: string;
  spaceSyscode?: string;
  spaceNo?: string;
  spacePicUri?: string;
  parkingTime?: string;
  parkSyscode?: string;
  parkName?: string;
  floorSyscode?: string;
  floorName?: string;
  plateNoPicUri?: string;
  aswSyscode?: string;
  spacePicUrl?: string;
  plateNoPicUrl?: string;
  spacePicBinary?: string;
  ibeaconIpcUuid?: string;
  ibeaconIpcMajor?: string;
  ibeaconIpcMinor?: string;
}

interface ParkingSpaceDetailResponse {
  total: number;
  pageNo: number;
  pageSize: number;
  totalPage: number;
  list: ParkingSpaceDetailResponseList[];
}

interface SpaceDetailRequest {
  pageNo?: number;
  PageSize?: number;
  spaceNo?: string;
  plateNo?: string;
}

interface ValetDetailRequest {
  pageNo?: number;
  PageSize?: number;
  uid?: string;
}

interface CarblockerDevice {
  _id: string;
  device_id: string;
  status: number;
  rssi: number;
  time: string;
  createdAt: string;
  updatedAt: string;
}

interface ParkingExtension {
  _id: string;
  spaceSyscode: string;
  spaceNo: string;
  poleId: string;
  poleName: string;
  poleRow: string;
  poleColumn: string;
  poleColorName: string;
  poleColorCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceDetailResponseList {
  _id?: string;
  spaceSyscode?: string;
  __v?: number;
  alarmPlateNos?: string;
  aswSyscode?: string;
  floorName?: string;
  floorSyscode?: string;
  getTime?: number;
  ibeaconIpcMajor?: string;
  ibeaconIpcMinor?: string;
  ibeaconIpcUuid?: string;
  latitude?: string;
  longitude?: string;
  parkName?: string;
  parkSyscode?: string;
  parkingTime?: string;
  parkingTimeUTC?: number;
  plateNoPicUri?: string;
  plateNoPicUrl?: string;
  plateNos?: string;
  spaceNo?: string;
  spacePicUri?: string;
  spacePicUrl?: string;
  spaceType?: string;
  spaceTypeKey?: string;
  state?: number;
  zoneId?: string;
  zoneName?: string;
  carblockerDevice?: CarblockerDevice;
  parkingExtension?: ParkingExtension;
}

interface Staff {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  userName: string;
  pin: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  role: string;
}

interface DropOffStation {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  description: string;
  location: string;
  active: boolean;
  isUsed: boolean;
}

interface Image {
  createdAt: string;
  url: string;
  valetParkingId: number;
}

export interface ValetParkingDetail {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  code: string;
  status: string;
  name: string;
  phoneNumber: string;
  incomingTime: string;
  outgoingTime: string;
  licensePlate: string;
  licensePlateProvince: string;
  keyCabinetId: string;
  staffParkedId: string;
  staffDeliverId: string;
  userId: string;
  parkingSpotId: string;
  pickUpStationId: string;
  dropOffStationId: number;
  verifiedAt: string;
  staffVerifyId: string;
  confirmParkedAt: string;
  staffConfirmParkedId: number;
  confirmDeliverAt: string;
  staffConfirmDeliverId: string;
  signatureURL: string;
  referenceCode: string;
  isMyQr: boolean;
  spot: string;
  staffDeliver: string;
  staffParked: string;
  staffConfirmDeliver: string;
  staffConfirmParked: Staff;
  staffVerify: string;
  pickUpStation: string;
  dropOffStation: DropOffStation;
  images: Image[];
  keyCabinet: string;
}

export interface ValetStation {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  location: string;
  active: boolean;
}

interface PaginationResponse {
  total: number;
  page: number;
  page_size: number;
  page_count: number;
}

interface EntriesParkingResponse<T> {
  pagination: PaginationResponse;
  entities: T;
}

export interface GetResidentialParkingDetailByQRCodeResponse {
  logId: string;
  ticketNo: string;
  ticketUid: string;
  plateNo: string;
  exitStatus: number;
  terminalInId: number;
  terminalInName: string;
  memberTypeId: number;
  memberTypeName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  entryDateTime: string;
  logDateTime: string;
  isCardLost: boolean;
  parkHH: number;
  parkMM: number;
  rateHH: number;
  freeHH: number;
  rateCode: string;
  rateDetailTH: string;
  rateDetailEN: string;
  tenantId: string;
  tenantName: string;
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
  lastDateTimePaymentAtKiosk: string;
  payAtKioskAll: number;
  timeUsedInMinute: number;
  durationInMinute: number;
  remainInMinute: number;
  userId: number;
}

export interface GetResidentialParkingDetailResponse {
  logId: string;
  ticketNo: string;
  ticketUid: string;
  plateNo: string;
  exitStatus: number;
  terminalInId: number;
  terminalInName: string;
  memberTypeId: number;
  memberTypeName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  entryDateTime: Date;
  logDateTime: Date;
  isCardLost: boolean;
  parkHH: number;
  parkMM: number;
  rateHH: number;
  freeHH: number;
  rateCode: string;
  rateDetailTH: string;
  rateDetailEN: string;
  tenantId: string;
  tenantName: string;
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
  timeUsedInMinute: number;
  durationInMinute: number;
  remainInMinute: number;
  userId: number;
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
  userID: number;
  remark: string;
}

export interface RedeemParkingDataResponse {
  status: string;
  message: string;
  exeption: string | null;
  logId: string;
  ticketNo: string;
  ticketUid: string;
  plateNo: string;
  exitStatus: number;
  terminalInId: number;
  terminalInName: string;
  memberTypeId: number;
  memberTypeName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  entryDateTime: string;
  logDateTime: string;
  isCardLost: boolean;
  parkHH: number;
  parkMM: number;
  rateHH: number;
  freeHH: number;
  rateCode: string;
  rateDetailTH: string;
  rateDetailEN: string;
  tenantId: string;
  tenantName: string;
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
  lastDateTimePaymentAtKiosk: string;
  payAtKioskAll: number;
  timeUsedInMinute: number;
  durationInMinute: number;
  remainInMinute: number;
}

export interface getResidentialParkingDetailByPersonIDDataResponse {
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

interface UpdateDefaultFloorRequestBody {
  floorID: number;
  zoneID: number;
  personID: string;
}

export interface GetTermsAndConditionsResidenceParkingInput {
  lang?: string;
  tenantId: string;
  projectId: number;
}

export interface GetTermsAndConditionsResidenceParkingResponse {
  data: {
    id: string;
    project: {
      projectId: number;
      projectCode: string;
      projectsName: string;
    };
    title: string;
    content: string;
  };
}

export interface DeactivateVisitorPassResponse {
  apiRes: {
    message: string;
    status: number;
    data: object;
  };
  visitorPassId: string;
}

export interface DeactivateVisitorPassRequest {
  inviterId: string;
}

export interface UpdateDefaultFloorResponse {}

export interface UpdateTransactionCarParkResponse {
  message: string;
  status: number;
  data: {
    logId: string;
    uid: string;
    appId: string;
    algType: AlgType;
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
      (response) => response,
      async (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
          const response = await this.getOauth2Token();
          await cache.set('TCC_ACCESS_TOKEN', response.data.access_token, 3540);

          return this.httpClient.request(error.config);
        }

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

  public async getOutdoorZone(): Promise<AxiosResponse<OutdoorZoneResponse[]>> {
    return this.httpClient.get<OutdoorZoneResponse[]>(`/obk/api/v1/airquality/outdoorzone`);
  }

  public async getAirQualityFeed(
    sensorType: SensorType,
    buildingId: string,
  ): Promise<AxiosResponse<getAirQualityFeedResponse>> {
    return this.httpClient.get(`/obk/api/v1/airquality/feed/${sensorType}`, { params: { building: buildingId } });
  }

  public async getAllAirQualityFeed(buildingId: string): Promise<AxiosResponse<getAirQualityFeedResponse>> {
    return this.httpClient.get('/obk/api/v1/airquality/feed', { params: { building: buildingId } });
  }

  public async getParkingDetailByPersonID(
    personID: string,
  ): Promise<AxiosResponse<BaseParkingResponse<GetParkingDetailByPersonIDDataResponse[]>>> {
    try {
      return this.httpClient.post('/obk/api/v1/mt/parking/getParkingDetailByPersonId', {
        personID: personID,
        lostCard: false,
      });
    } catch (error) {
      logging.error('getParkingDetailByPersonID error', error);
      throw error;
    }
  }

  public async getResidentialParkingDetailByPersonID(
    personID: string,
  ): Promise<AxiosResponse<getResidentialParkingDetailByPersonIDDataResponse[]>> {
    try {
      return this.httpClient.post('/obk/api/v1/fineday/carpark/getParkingDetailByPersonId', {
        personID: personID,
        lostCard: false,
      });
    } catch (error) {
      logging.error('getResidentialParkingDetailByPersonID error', error);
      throw error;
    }
  }

  public async getResidentialParkingDetailByQRCode(
    logCarparkID: string,
  ): Promise<AxiosResponse<GetResidentialParkingDetailByQRCodeResponse>> {
    try {
      return this.httpClient.post('/obk/api/v1/fineday/carpark/GetParkingDetailByQRCode', {
        logCarparkID,
        lostCard: false,
      });
    } catch (error) {
      throw error;
    }
  }

  public async invitePreRegisterResidential(
    data: InvitePreRegisterRequestBody,
  ): Promise<AxiosResponse<WrappedResponse<InvitePreRegisterResponse>>> {
    return this.httpClient.post('/obk/api/v1/fineday/preregister/InviteResidenceVisitor', data);
  }

  public async getParkingSpaceDetail(
    data: ParkingSpaceDetailRequest,
  ): Promise<AxiosResponse<BaseParkingResponse<ParkingSpaceDetailResponse>>> {
    const { queryType, pageNo, pageSize } = data;
    const normalizedData = {
      ...data,
      queryType: queryType ?? 1,
      pageNo: pageNo ?? 1,
      pageSize: pageSize ?? 10,
    };
    return this.httpClient.post('/obk/api/v1/mt/parking/query', normalizedData);
  }

  public async getSpaceDetailBySpaceNumber(
    data: SpaceDetailRequest,
  ): Promise<AxiosResponse<SpaceDetailResponseList[]>> {
    const { pageNo, PageSize } = data;
    const normalizedData = {
      ...data,
      pageNo: pageNo ?? 1,
      PageSize: PageSize ?? 10,
    };
    return this.httpClient.post('/obk/api/v1/mt/parking/spaceNo', normalizedData);
  }

  public async getValetParkingFromUID(
    data: ValetDetailRequest,
  ): Promise<AxiosResponse<EntriesParkingResponse<ValetParkingDetail[]>>> {
    const { pageNo, PageSize, uid } = data;
    const normalizedData = {
      page: pageNo ?? 1,
      limit: PageSize ?? 10,
      sort: 'createdAt',
      reverse: true,
    };
    return this.httpClient.get(`/obk/api/v1/mt/parking/valetParking/${uid}`, { params: normalizedData });
  }

  public async getValetStations(): Promise<BaseParkingResponse<ValetStation[]>> {
    return this.httpClient.get(`/obk/api/v1/mt/parking/valetParkingStations/`);
  }

  public async callValetCar(body: {
    valetCarId: number;
    dropOffStationId: number;
    status: string;
  }): Promise<BaseParkingResponse<[]>> {
    return this.httpClient.patch(`/obk/api/v1/mt/parking/callValetCar/`, body);
  }

  public async getTrafficRecords(body: { pageNo: number; pageSize: number }): Promise<AxiosResponse<any>> {
    return this.httpClient.post('/obk//api/v1/mt/parking/trafficStatusRecord', body);
  }

  public async getResidentialParkingDetail(
    search: string,
  ): Promise<AxiosResponse<GetResidentialParkingDetailResponse>> {
    try {
      return this.httpClient.post('/obk/api/v1/fineday/carpark/GetParkingDetail', {
        search,
        lostCard: false,
      });
    } catch (error) {
      throw error;
    }
  }

  public async getDataRateCode(data: GetDataRateCodeRequest): Promise<AxiosResponse<GetDataRateCodeResponse[]>> {
    return this.httpClient.post('/obk/api/v1/fineday/redemtion/GetRateCodeListByTenantID', data);
  }

  public async redeemParkingResidential(data: RedeemParkingRequest): Promise<AxiosResponse<RedeemParkingDataResponse>> {
    return this.httpClient.post('/obk/api/v1/fineday/redemtion/RedeemParking', data);
  }

  public async updateDefaultFloor(
    data: UpdateDefaultFloorRequestBody,
  ): Promise<AxiosResponse<UpdateDefaultFloorResponse>> {
    return this.httpClient.post('/obk/api/v1/fineday/authorizefloor/ChangeDefaultFloor', data);
  }

  public async getTermsAndConditionsResidenceParking(
    data: GetTermsAndConditionsResidenceParkingInput,
  ): Promise<AxiosResponse<GetTermsAndConditionsResidenceParkingResponse>> {
    return this.httpClient.get(
      `/obk/api/v1/resident/terms-and-conditions/tenant/${data.tenantId}/car-parking/${data.projectId}`,
      { headers: { lang: data?.lang ?? 'en' } },
    );
  }

  public async deactivateVisitorPass(
    data: DeactivateVisitorPassRequest,
  ): Promise<AxiosResponse<DeactivateVisitorPassResponse>> {
    return this.httpClient.post(`/obk/api/v1/resident/deactivate-visitor-pass`, data);
  }

  public async updateTransactionCarpark(
    data: UpdateTransactionCarParkBody,
  ): Promise<AxiosResponse<UpdateTransactionCarParkResponse>> {
    return this.httpClient.post('/obk/api/v1/mt/parking/carpark/updateTransaction', data);
  }
}

const TCCClient = new TCCClientService();

export default TCCClient;
