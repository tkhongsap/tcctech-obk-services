import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import BuildingAccessLogRepository from '../../src/repositories/building_access_log_repository';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
import { createTestData } from '../fixtures';

let dataTest: any;
let data: any;

beforeEach(async () => {
  await resetDB();
  data = await createTestData();
  app.use(newErrorHandler);

  dataTest = await BuildingAccessLogRepository.createMany({
    data: [
      {
        uid: 'Mock UID',
        fs_account_id: data.visitor.id,
        type: 'pass',
        status: 1,
        transaction_date: '2024-05-13T08:00:00Z',
        turnstile_id: 'turnstile_1',
        data: {},
        name: 'mtel',
        display_status: 'onsite',
        display_tower: 'Tower A',
        display_turnstile: 'Entrance 1',
        created_at: '2024-05-13T08:01:00Z',
        updated_at: '2024-05-13T08:01:00Z',
      },
      {
        uid: 'Mock UID',
        fs_account_id: data.member.uid,
        type: 'member',
        status: 1,
        transaction_date: '2024-05-13T08:00:00Z',
        turnstile_id: 'turnstile_1',
        data: {},
        name: 'mtel',
        display_status: 'onsite',
        display_tower: 'Tower A',
        display_turnstile: 'Entrance 1',
        created_at: '2024-05-13T08:01:00Z',
        updated_at: '2024-05-13T08:01:00Z',
      },
    ],
  });
});

describe('BuildingAccessLogController', () => {
  describe('GET /building_access', () => {
    it('should return 200 with query', async () => {
      const query = {
        page_number: 1,
        page_size: 2,
        accessorType: 'member',
      };
      const response = await request(app).get(`/building_access`).query(query);

      expect(response.status).toBe(200);
      expect(response.body.data[0].fs_account_id).toEqual(data.member.uid);
    });

    it('should return 200', async () => {
      const query = {
        accessorType: 'pass',
      };
      const response = await request(app).get(`/building_access`).query(query);
      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toEqual('mtel');
    });
  });

  describe('GET /building_access/{id}', () => {
    it('should return 200', async () => {
      const response = await request(app).get(`/building_access/${data.visitor.name}?accessorType=pass`).send();
      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toEqual('mtel');
    });

    it('should return 400 throw error Unhandled Accessortype ', async () => {
      const wrongId = 123456;
      const response = await request(app).get(`/building_access/${wrongId}?accessorType=tenant`).send();

      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_BAL_002.errorCode);
    });
  });
});
