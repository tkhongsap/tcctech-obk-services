import { GetParkingDetailByPersonIDDataResponse } from '../libs/fs_parking_client';
import { ParkingSpaceDetailResponseList, SpaceDetailResponseList } from '../libs/tcc_client';

type RateDetail = {
  en: string;
  th: string;
};

export type ParkingTicketData = {
  id: string;
  plate_number: string;
  ticket_number: string;
  vehicle_type: string;
  total_fee: number;
  parked_at: string;
  rate_detail: RateDetail;
  member_type_id: number;
  vehicle_type_id: number;
  sub_code?: string;
};

export type ParkingTicketsIndexResponseData = ParkingTicketData[];

export interface ParkingTicketsIndexQuery {
  type: 'log_id' | 'invite_id' | 'member_id';
  id: string;
}

export interface ParkingResidentialTicketsIndexQuery {
  type: 'log_id' | 'ticket_number' | 'plate_no' | 'invite_id' | 'member_id';
  id: string;
}

export type ParkingTicketsRedeemBody = {
  redeemer_id: string;
  rate_code: string;
  remark: string;
};

export type ParkingTicketsRedeemBodyResident = {
  rate_code: string;
  remark?: string;
};

export type ParkingTicketsRedeemBodyResidentV2 = {
  rate_code: string;
  remark?: string;
  residence_id: number;
  user_id: number;
};

export type ParkingSpaceDetailBody = {
  plate_number: string;
};

export interface ParkingSpaceDetailAndSpaceDetailResponse
  extends ParkingSpaceDetailResponseList,
    SpaceDetailResponseList,
    GetParkingDetailByPersonIDDataResponse {}

export interface ParkingSpaceDetailAndSpaceDetailData {
  id: string;
  plate_number: string;
  ticket_number: string;
  vehicle_type: string;
  total_fee: number;
  parked_at: string;
  rate_detail: RateDetail;
  member_type_id: number;
  vehicle_type_id: number;
  zone_name?: string;
  pole_id?: string;
  pole_name?: string;
  pole_row?: string;
  pole_column?: string;
  pole_color_name?: string;
  pole_color_code?: string;
  record_syscode?: string;
  space_syscode?: string;
  space_no?: string;
  space_pic_uri?: string;
  parking_time?: string;
  park_syscode?: string;
  park_name?: string;
  floor_syscode?: string;
  floor_name?: string;
  plate_no_pic_uri?: string;
  asw_syscode?: string;
  plate_no?: string;
  space_pic_url?: string;
  plate_no_pic_url?: string;
  space_pic_binary?: string;
  ibeacon_ipc_uuid?: string;
  ibeacon_ipc_major?: string;
  ibeacon_ipc_minor?: string;
}

type AlgType = 'ShopperToTenant' | 'TenantToShopper' | 'VisitorToApp';
export interface ImportPhysicalParkingTicketResponse {
  message: string;
  status: number;
  data: {
    logId: string;
    uid: string;
    appId: string;
    algType: AlgType;
  };
}

export interface ImportPhysicalParkingTicketBody {
  logId: string;
}
