import { resetDB } from '../helpers/db';
import { PaymentService } from '../../src/services';
import dayjs from 'dayjs';
import { createTestData } from '../fixtures';
import { PaymentRepository } from '../../src/repositories';

const paymentService = new PaymentService();
let testData: any;

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
  testData = await createTestData();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('PaymentService', () => {
  describe('create', () => {
    it('should create a payment', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      const date = dayjs().format('YYMMDD');
      const expectedReferenceNumber = `PA-${date}-00001`;

      expect(payment.reference_number).toEqual(expectedReferenceNumber);
      expect(payment.amount).toEqual(93.46);
      expect(payment.vat_amount).toEqual(6.54);
      expect(payment.total_amount).toEqual(100);
    });
  });

  describe('confirm', () => {
    it('should confirm a payment', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });
      const fsPaymentMeta = {
        transactionNo: 'ARG24100801732604',
        invoiceNo: '16022024163745007',
        transactionDate: '2024-10-08 16:19:57',
        merchantId: '00870194-565e-4242-ac80-bc4180a58440',
        merchantName: 'Parking One Bangkok',
        paymentChannel: 'promptpay',
        amount: 7040.0,
        paidAmount: 7040.0,
        fee: 0.0,
        feeVat: 0.0,
        balance: 7040.0,
        transactionStatusId: 2,
        description: '',
        deviceProfileId: null,
      };

      const confirmedPayment = await paymentService.confirm(payment.id, fsPaymentMeta);

      expect(confirmedPayment!.status).toEqual('confirmed');
      expect(confirmedPayment!.meta).toEqual(fsPaymentMeta);

      const confirmedReservation = await PaymentRepository.findFirst({
        where: { id: payment.id },
      });

      expect(confirmedReservation!.status).toEqual('confirmed');
    });
  });

  describe('cancel', () => {
    it('should cancel a payment', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      const cancelledPayment = await paymentService.cancel(payment.id);

      expect(cancelledPayment!.status).toEqual('cancelled');
    });
  });

  describe('cancelExpiredPayments', () => {
    it('should cancel expired payments', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-02-12T21:00:00.000Z'));

      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      jest.useFakeTimers().setSystemTime(new Date('2024-02-13T21:00:00.000Z'));

      await paymentService.cancelExpiredPayments();

      const cancelledPayment = await PaymentRepository.findFirst({
        where: { id: payment.id },
        include: {
          parking_reservation: {
            include: { parking_space: true },
          },
        },
      });

      expect(cancelledPayment!.status).toEqual('cancelled');
      expect(cancelledPayment!.parking_reservation.status).toEqual('cancelled');
      expect(cancelledPayment!.parking_reservation.parking_space.available).toEqual(true);
    });

    it('should not cancel payments that are not expired', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      await paymentService.cancelExpiredPayments();

      const pendingPayment = await PaymentRepository.findFirst({
        where: { id: payment.id },
        include: {
          parking_reservation: {
            include: { parking_space: true },
          },
        },
      });

      expect(pendingPayment!.status).toEqual('pending');
    });

    it('should not cancel payments that are already confirmed', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      await paymentService.confirm(payment.id);

      jest.useFakeTimers().setSystemTime(new Date('2024-02-13T21:00:00.000Z'));

      await paymentService.cancelExpiredPayments();

      const confirmedPayment = await PaymentRepository.findFirst({ where: { id: payment.id } });

      expect(confirmedPayment!.status).toEqual('confirmed');
    });
  });
});
