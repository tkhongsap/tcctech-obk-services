import app from '../../src/app';
import request from 'supertest';

import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';

beforeEach(async () => {
  await resetDB();
  await createTestData();
});

describe('LocationsController', () => {
  describe('GET /locations', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/locations');
      expect(response.status).toBe(200);
    });
  });
});
