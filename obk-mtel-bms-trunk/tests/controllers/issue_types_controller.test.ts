import app from '../../src/app';
import request from 'supertest';

import { resetDB } from '../helpers/db';
import { IssueTypeRepository } from '../../src/repositories';
import { newErrorHandler } from '../../src/middlewares/error';
import { OBError } from '../../src/utils/error_spec';

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
});

describe('IssueTypesController', () => {
  describe('GET /issue_types', () => {
    it('should return 200 OK', async () => {
      await IssueTypeRepository.create({
        data: {
          name: 'test',
          display_name: {},
        },
      });
      const response = await request(app).get('/issue_types');
      expect(response.body.data[0].name).toEqual('test');
      expect(response.status).toBe(200);
    });
    it('should return 200 OK', async () => {
      await IssueTypeRepository.create({
        data: {
          name: 'test',
          display_name: {},
          deleted_at: new Date().toISOString(),
        },
      });
      const response = await request(app).get('/issue_types');
      expect(response.body.data).toEqual([]);
      expect(response.status).toBe(200);
    });
  });
  describe('Post /issue_types', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).post('/issue_types').send({ name: 'test', display_name: {} });
      expect(response.body.data.name).toEqual('test');
      expect(response.status).toBe(200);
    });
  });
  describe('Put /issue_types', () => {
    it('should return 200 OK', async () => {
      await IssueTypeRepository.create({
        data: {
          id: 'test',
          name: 'test',
          display_name: {},
        },
      });
      const response = await request(app).put('/issue_types/test').send({ name: 'test2' });
      expect(response.body.data.name).toEqual('test2');
      expect(response.status).toBe(200);
    });
  });
  describe('GET /issue_types/{id}', () => {
    it('should return 200 OK', async () => {
      await IssueTypeRepository.create({
        data: {
          id: 'test',
          name: 'test',
          display_name: {},
        },
      });
      const response = await request(app).get('/issue_types/' + 'test');
      expect(response.body.data.name).toEqual('test');
      expect(response.status).toBe(200);
    });

    it('should return 404 throw error', async () => {
      await IssueTypeRepository.create({
        data: {
          id: 'test',
          name: 'test',
          display_name: {},
        },
      });
      const response = await request(app).get('/issue_types/' + 'wringId');
      expect(response.status).toStrictEqual(404);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_IST_001.errorCode);
    });
  });
});
