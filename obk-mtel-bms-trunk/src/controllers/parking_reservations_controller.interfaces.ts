import { ParkingFloorsData, ParkingSpacesData } from './parking_spaces_controller.interfaces';
import { ParkingLot, Blocker } from '../../db/client/';
import { paymentResponse } from './payments_controller.interfaces';
export interface ParkingReservationBody {
  parking_space_id: string;
  start_time: Date | string;
  fee: number;
}

export enum ParkingReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface ParkingReservationResponse {
  id: string;
  parking_space_id: string;
  member_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  start_time: Date | string;
  fee: number;
  status: string;
  parking_space: ParkingSpacesData;
  parking_lot: ParkingLotData;
  parking_floor: ParkingFloorsData;
  reservation_number: string;
  blocker: BlockerData;
}

export interface ParkingReservationDetailResponse {
  id: string;
  parking_space_id: string;
  member_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  start_time: Date | string;
  fee: number;
  status: string;
  parking_space: ParkingSpacesData;
  parking_lot: ParkingLotData;
  parking_floor: ParkingFloorsData;
  reservation_number: string;
  blocker: BlockerData;
  payment: paymentResponse;
}

export interface ParkingReservationReservedListResponse {
  id: string;
  parking_space_id: string;
  member_id: string;
  start_time: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  reservation_number: string;
  fee: number;
  status: string;
  parking_space: ParkingSpacesData;
}

export interface ParkingLotData extends Partial<ParkingLot> {}
export interface BlockerData extends Partial<Blocker> {}
