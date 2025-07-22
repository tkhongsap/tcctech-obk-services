import app from '../../src/app';
import request from 'supertest';

describe('HealthController', () => {
  describe('GET /health', () => {
    it('should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toEqual(200);
    });
  });
});
