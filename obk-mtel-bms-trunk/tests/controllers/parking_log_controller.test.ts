import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
import { createTestData } from '../fixtures';

let data: any;

beforeEach(async () => {
  await resetDB();
  data = await createTestData();
  app.use(newErrorHandler);
});

describe('ParkingAccessLogController', () => {
  describe('GET /parking_access', () => {
    it('should return 200 with query', async () => {
      const query = {
        page_number: 1,
        page_size: 2,
        accessorType: 'member',
      };
      const response = await request(app).get(`/parking_access`).query(query);

      expect(response.status).toBe(200);
      expect(response.body.data[0].identifier).toEqual(data.member.account_id);
    });

    it('should return 200', async () => {
      const query = {
        accessorType: 'member',
      };
      const response = await request(app).get(`/parking_access`).query(query);
      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toEqual('MOCK NAME');
    });
  });

  describe('GET /parking_access/{id}', () => {
    it('should return 200', async () => {
      const response = await request(app).get(`/parking_access/MOCKPlateNumber1`).send();

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual('MOCK NAME');
      expect(response.body.data.identifier).toEqual(data.member.account_id);
    });

    it('should return 200 with wrong id ', async () => {
      const wrongPlateNumber1 = 123456;
      const response = await request(app).get(`/parking_access/${wrongPlateNumber1}`).send();

      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_BAL_002.errorCode);
    });
  });
});
