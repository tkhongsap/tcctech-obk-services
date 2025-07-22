import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { PaymentService } from '../../src/services';

const paymentService = new PaymentService();
let testData: any;
const headers = {
  'Content-Type': 'application/json',
  'x-permissions':
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAicGF5bWVudCIsICJhY3Rpb25zIjogWyJyZWFkIl0gfSB9XX0=',
};

beforeEach(async () => {
  await resetDB();
  testData = await createTestData();
});

describe('PaymentsController', () => {
  describe('GET /payments/:id', () => {
    it('should return 200 with a valid payment', async () => {
      const payment = await paymentService.create({
        parkingReservationId: testData.parkingReservation.id,
        totalAmount: 100,
      });

      const response = await request(app)
        .get('/payments/' + payment.id)
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(payment.id);
    });

    describe('get a payment by reference number', () => {
      it('should return 200 with a valid payment', async () => {
        const payment = await paymentService.create({
          parkingReservationId: testData.parkingReservation.id,
          totalAmount: 100,
        });

        const response = await request(app)
          .get('/payments/' + payment.reference_number)
          .set(headers);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(payment.id);
      });
    });
  });
});
