import { JsonValue } from '@prisma/client/runtime/library';

type PaymentStatus = 'pending' | 'confirmed' | 'cancelled';

type ParkingReservationData = {
  id: string;
  reservation_number: string;
  car_plate_number: string;
};

export type PaymentData = {
  id: string;
  reference_number: string;
  invoice_number: string | null;
  description: string;
  sub_total: number;
  amount: number;
  discount_amount: number;
  vat_amount: number;
  total_amount: number;
  payment_url: string | null;
  status: PaymentStatus;
  meta: JsonValue;
  user_id: string;
  parking_reservation: ParkingReservationData;
  paid_at: string | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
};

export type paymentResponse = {
  id?: string;
  payment_url?: string | null;
  description?: string;
  reference_number?: string;
  invoice_number?: string | null;
  amount?: number;
  vat_amount?: number;
  total_amount?: number;
  status?: PaymentStatus;
  paid_at?: Date | null;
  expired_at?: Date;
  meta?: JsonValue;
  parking_reservation_id?: string;
  created_at?: Date;
  updated_at?: Date;
};
export type PaymentShowResponseData = PaymentData;
