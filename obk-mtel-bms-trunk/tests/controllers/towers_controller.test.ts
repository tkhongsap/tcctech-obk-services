import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { ProjectRepository, TowerRepository } from '../../src/repositories';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});
afterEach(async () => {
  jest.resetAllMocks();
});
describe('TowerController', () => {
  describe('GET /towers', () => {
    it('should return 200', async () => {
      const project = await ProjectRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          display_name: {
            en: 'test',
          },
        },
      });
      await TowerRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          display_name: {
            en: 'test',
          },
          project_id: project.id,
        },
      });
      const response = await request(app).get('/towers');
      expect(response.status).toBe(200);
    });
  });
});
