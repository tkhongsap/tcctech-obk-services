import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import TenantRepository from '../../src/repositories/tenant_repository';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});
afterEach(async () => {
  jest.resetAllMocks();
});
describe('TenantsController', () => {
  describe('GET /tenants', () => {
    it('should return 200', async () => {
      await TenantRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          display_name: {
            en: 'test',
          },
          email: '',
          phone_number: '',
          address: '',
          metadata: {},
        },
      });
      const response = await request(app).get('/tenants');
      expect(response.status).toBe(200);
    });
  });
});
