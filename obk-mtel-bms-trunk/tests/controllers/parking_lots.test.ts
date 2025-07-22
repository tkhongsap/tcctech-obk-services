import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createParkingLot } from '../fixtures/parking_lot';

let parkingLot: any;

beforeEach(async () => {
  await resetDB();
  parkingLot = await createParkingLot('test1', '1', '1', '1');
});

describe('ParkingLotsController', () => {
  describe('GET /parking_lots', () => {
    it('should return 200', async () => {
      const response = await request(app).get('/parking_lots').send();

      expect(response.status).toBe(200);
      expect(response.body.data[0].id).toEqual(parkingLot.id);
    });
  });
});
