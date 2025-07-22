import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
import { ParkingReservationRepository } from '../../src/repositories';
import { ParkingReservationStatus } from '../../src/controllers/parking_reservations_controller.interfaces';

let dataTest: any;
beforeEach(async () => {
  await resetDB();
  dataTest = await createTestData();
  app.use(newErrorHandler);
});

describe('ParkingReservationsController', () => {
  describe('POST /parking_reservations', () => {
    it('should return 200', async () => {
      const body = {
        parking_space_id: 'testID1',
        start_time: '2023-10-05T12:00:00.000Z',
        fee: 30,
      };

      const response = await request(app)
        .post('/parking_reservations')
        .set('x-account-id', dataTest.member.account_id)
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body.data.parking_space_id).toEqual('testID1');
      expect(response.body.data.member_id).toEqual(dataTest.member.id);
    });

    it('should return 400 with error code no token', async () => {
      const body = {
        parking_space_id: 'testID1',
        start_time: '2023-10-05T12:00:00.000Z',
        fee: 30,
      };

      const response = await request(app).post('/parking_reservations').send(body);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_VAL_001.errorCode);
    });

    it('should return 400 with error code no member', async () => {
      const body = {
        parking_space_id: 'testID1',
        start_time: '2023-10-05T12:00:00.000Z',
        fee: 30,
      };

      const response = await request(app)
        .post('/parking_reservations')
        .set('x-account-id', 'noexistmembertoken')
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
    });
  });

  describe('GET /parking_reservations', () => {
    it('should return 200 with exist confirmed status', async () => {
      const response = await request(app)
        .get('/parking_reservations')
        .set('x-account-id', dataTest.member.account_id)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return 200 with exists data', async () => {
      await ParkingReservationRepository.create({
        data: {
          id: 'parkingReservationID1',
          parking_space_id: 'testID2',
          fee: 30,
          start_time: '2023-10-10T12:12:00.000Z',
          member_id: dataTest.member.id,
          status: ParkingReservationStatus.CONFIRMED,
          reservation_number: '202310101635',
        },
      });

      const response = await request(app)
        .get('/parking_reservations')
        .set('x-account-id', dataTest.member.account_id)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data[0].parking_space_id).toEqual('testID2');
    });

    it('should return 400 with error code no token', async () => {
      const response = await request(app).get('/parking_reservations').send();

      expect(response.status).toBe(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_VAL_001.errorCode);
    });

    it('should return 400 with error code no member', async () => {
      const response = await request(app).get('/parking_reservations').set('x-account-id', 'testIdNotFound').send();

      expect(response.status).toBe(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
    });
  });

  describe('GET /parking_reservations/{id}', () => {
    it('should return 400 with empty data', async () => {
      const response = await request(app).get('/parking_reservations/parkingReservationDetailID1').send();

      expect(response.status).toBe(400);
      expect(response.body.error.code).toEqual(OBError.BMS_PKR_002.errorCode);
    });

    it('should return 200 with exist data', async () => {
      await ParkingReservationRepository.create({
        data: {
          id: 'parkingReservationID2',
          parking_space_id: 'testID3',
          fee: 30,
          start_time: '2023-10-10T12:12:00.000Z',
          member_id: dataTest.member.id,
          status: ParkingReservationStatus.CONFIRMED,
          reservation_number: '202310101635',
        },
      });

      const response = await request(app).get('/parking_reservations/parkingReservationID2').send();

      expect(response.status).toBe(200);
      expect(response.body.data.id).toEqual('parkingReservationID2');
      expect(response.body.data.parking_space_id).toEqual('testID3');
      expect(response.body.data.status).toEqual('confirmed');
    });
  });
});
