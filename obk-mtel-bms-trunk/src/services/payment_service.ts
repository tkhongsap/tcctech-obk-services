import { ParkingReservationRepository, ParkingSpaceRepository, PaymentRepository } from '../repositories';
import { formatReference } from '../utils/references_code';
import { PaymentStatus } from '../../db/client/';
import Big from '../libs/bigjs';
import { dayjs } from '../libs/dayjs';
import { set } from 'lodash';

const PAYMENT_VAT_RATE = 0.07;
const PAYMENT_PREFIX = 'PA';
const PAYMENT_REF_LENGTH = 5;

enum PaymentType {
  reservation = 'Reserve Parking',
}

export default class PaymentService {
  async findByIdOrReferenceNumber(id: string): Promise<typeof payment | null> {
    const payment = await PaymentRepository.findFirst({
      where: {
        OR: [{ id: id }, { reference_number: id }],
      },
      include: {
        parking_reservation: true,
      },
    });

    return payment;
  }

  async create(input: { parkingReservationId: string; totalAmount: number }): Promise<typeof payment> {
    const { amount, vatAmount, totalAmount } = this.calculateAmount(input.totalAmount);
    const refNumber = await this.buildReferenceNumber();
    const expiredAt = this.getExpiredAt();
    const paymentUrl = this.buildPaymentUrl({
      referenceNumber: refNumber,
      amount: totalAmount,
      type: PaymentType.reservation,
    });

    const payment = await PaymentRepository.create({
      data: {
        reference_number: refNumber,
        parking_reservation_id: input.parkingReservationId,
        description: 'Reservation payment',
        amount: amount,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        expired_at: expiredAt,
        payment_url: paymentUrl,
      },
    });

    return payment;
  }

  async confirm(id: string, meta?: Record<string, any>): Promise<typeof payment> {
    const payment = await PaymentRepository.findFirst({ where: { id } });
    if (!payment) {
      throw new Error('Payment not found');
    }

    const valueFromMeta = {};
    if (meta) {
      if (meta.transactionNo) {
        set(valueFromMeta, 'invoice_number', meta.transactionNo);
      }
      if (meta.transactionDate) {
        const isoDate = dayjs(meta.transactionDate).toISOString();
        set(valueFromMeta, 'paid_at', isoDate);
      }
      set(valueFromMeta, 'meta', meta);
    }

    const updatedPayment = await PaymentRepository.update({
      data: {
        status: PaymentStatus.confirmed,
        ...valueFromMeta,
      },
      where: { id },
    });

    const reservation = await ParkingReservationRepository.findFirst({
      where: { id: payment.parking_reservation_id },
    });

    await ParkingReservationRepository.update({
      data: { status: 'confirmed' },
      where: { id: reservation!.id },
    });

    return updatedPayment;
  }

  async cancel(id: string): Promise<typeof payment> {
    const payment = await PaymentRepository.findFirst({ where: { id } });
    if (!payment) {
      throw new Error('Payment not found');
    }

    const updatedPayment = await PaymentRepository.update({
      data: {
        status: PaymentStatus.cancelled,
      },
      where: { id },
    });

    return updatedPayment;
  }

  async cancelExpiredPayments(): Promise<void> {
    const now = dayjs().toISOString();
    const payments = await PaymentRepository.findMany({
      where: { expired_at: { lte: now }, status: PaymentStatus.pending },
      include: {
        parking_reservation: true,
      },
    });

    await PaymentRepository.updateMany({
      data: { status: PaymentStatus.cancelled },
      where: { id: { in: payments.map((p) => p.id) } },
    });

    // This is the bad example where we mixing other domain logic in the service
    // Ideally, we should parking availability logic somwhere else

    await ParkingReservationRepository.updateMany({
      data: { status: 'cancelled' },
      where: { id: { in: payments.map((p) => p.parking_reservation_id) } },
    });

    await ParkingSpaceRepository.updateMany({
      data: { available: true },
      where: { id: { in: payments.map((p) => p.parking_reservation.parking_space_id) } },
    });
  }

  private getExpiredAt(): string {
    return dayjs().add(5, 'minutes').toISOString();
  }

  private calculateAmount(totalAmount: number): { amount: number; vatAmount: number; totalAmount: number } {
    const amount = new Big(totalAmount).div(1 + PAYMENT_VAT_RATE).toNumber();
    const vatAmount = new Big(totalAmount).minus(amount).toNumber();

    return { amount, vatAmount, totalAmount };
  }

  private async buildReferenceNumber(): Promise<string> {
    const lastPayment = await PaymentRepository.findFirst({ orderBy: { created_at: 'desc' } });
    const lastCounter = lastPayment ? parseInt(lastPayment.reference_number.slice(-PAYMENT_REF_LENGTH)) : 0;
    const nextCounter = lastCounter + 1;

    return formatReference(new Date().toISOString(), `${nextCounter}`, PAYMENT_REF_LENGTH, PAYMENT_PREFIX);
  }

  private buildPaymentUrl(input: { referenceNumber: string; amount: number; type: string }): string {
    const url = new URL(process.env['TCC_PAYMENT_GATEWAY_URL']!);

    url.searchParams.append('amount', input.amount.toString());
    url.searchParams.append('type', input.type);

    return url.toString().replace(':reference_number', input.referenceNumber);
  }
}
