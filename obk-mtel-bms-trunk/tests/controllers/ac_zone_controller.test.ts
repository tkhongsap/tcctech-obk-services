import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { ACZoneRepository } from '../../src/repositories';

let dataTest: any;
beforeEach(async () => {
  await resetDB();
  dataTest = await createTestData();
  await ACZoneRepository.create({
    data: {
      floor_id: dataTest.floor.id,
      name: 'zone1',
      area_size: 400,
      rate: 1.5,
    },
  });
});

describe('ACZoneController', () => {
  describe('GET /ac_zones/{floor_id}', () => {
    it('should return 200', async () => {
      const response = await request(app).get(`/ac_zones/${dataTest.floor.id}`).send();
      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toEqual('zone1');
    });
  });
});
