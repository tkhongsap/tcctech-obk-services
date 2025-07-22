import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';

beforeEach(async () => {
  await resetDB();
  await createTestData();
});

describe('ParkingSpacesController', () => {
  describe('GET /parking_spaces', () => {
    it('should return 200', async () => {
      const response = await request(app).get('/parking_spaces').send();
      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toEqual('One Bangkok Park');
      expect(response.body.data[0].parking_spaces[0].name).toEqual('A1');
    });
  });
});
