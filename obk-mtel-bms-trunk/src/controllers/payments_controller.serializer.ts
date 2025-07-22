import { Prisma } from '../../db/client';
import { PaymentData } from './payments_controller.interfaces';

type PaymentSerializerInput = Prisma.PaymentGetPayload<{
  include: {
    parking_reservation: true;
  };
}> | null;

export const paymentSerializer = (payment: PaymentSerializerInput): PaymentData | null => {
  return payment
    ? {
        id: payment.id,
        reference_number: payment.reference_number,
        invoice_number: payment.invoice_number,
        description: payment.description,
        amount: payment.amount,
        sub_total: 0, // Fix amount for now
        discount_amount: 0, // Fix amount for now
        vat_amount: payment.vat_amount,
        total_amount: payment.total_amount,
        payment_url: payment.payment_url,
        status: payment.status,
        meta: payment.meta,
        user_id: '', // Fix user_id for now
        parking_reservation: {
          id: payment.parking_reservation.id,
          reservation_number: payment.parking_reservation.reservation_number,
          // car_plate_number: payment.parking_reservation.car_plate_number,
          car_plate_number: '',
        },
        paid_at: payment.paid_at?.toISOString() || null,
        expired_at: payment.expired_at.toISOString(),
        created_at: payment.created_at.toISOString(),
        updated_at: payment.updated_at.toISOString(),
      }
    : null;
};
