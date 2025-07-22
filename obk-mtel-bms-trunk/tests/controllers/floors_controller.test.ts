import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { FloorRepository, ProjectRepository, TowerRepository } from '../../src/repositories';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});
afterEach(async () => {
  jest.resetAllMocks();
});
describe('TowerController', () => {
  describe('GET /floors', () => {
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
      const tower = await TowerRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          display_name: {
            en: 'test',
          },
          project_id: project.id,
        },
      });

      await FloorRepository.create({ data: { uid: 'test', name: 'test', display_name: {}, tower_id: tower.id } });
      const response = await request(app).get('/floors');
      expect(response.status).toBe(200);
    });
  });
});
