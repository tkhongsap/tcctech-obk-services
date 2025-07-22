import { Prisma } from '../../db/client';
import { BaseIndexQuery } from './base_controller.interfaces';
import { Receipt } from './receipts_controller_interface';

export type AddParkingTicketType = 'CMS' | 'APP';
export type AddParkingTicketIdType = 'log_id' | 'invite_id' | 'member_id';
export type RedeemType = 'COUPON' | 'REDEEM';
export interface AddParkingTicketQuery {
  id: string;
  platform: AddParkingTicketType;
  id_type: AddParkingTicketIdType;
}

export interface AddParkingTicketResponse {
  parkingDetailId: string;
}

type ParkingDetailStatus = 'ACTIVE' | 'DISPUTE';
export interface ParkingAccountDetail {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export interface GetParkingDetailResponse {
  id: string;
  record_id: string;
  parking_ticket: string;
  license_plate: string;
  account_detail: ParkingAccountDetail;
  total_amount: string;
  receipts: Receipt[];
  redeemed_at: string;
  rate_detail: {
    en: string;
    th: string;
  };
}

export interface GetParkingDetailsIndexResponse {
  id: string;
  record_id: string;
  parking_ticket_id: string;
  plate_no: string;
  account_detail: ParkingAccountDetail;
  total_amount: string;
  redeemed_at: string;
  status: ParkingDetailStatus;
}
export interface GetParkingDetailIndexQuery extends BaseIndexQuery {
  startDate?: string;
  endDate?: string;
  status?: ParkingDetailStatus;
}

type RateDetail = {
  en: string;
  th: string;
};

export type RedeemParkingDetailResponse = {
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

export interface ParkingDetailRedeemBody {
  parking_detail_id: string;
  type: RedeemType;
}

export interface GetParkingDetaiQuery extends BaseIndexQuery {}

export type ParkingDetailByUidResponse = Prisma.ParkingDetailGetPayload<{}>;