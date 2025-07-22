import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import ActivityLogRepository from '../../src/repositories/activity_log_repository';

describe('ActivityLogController', () => {
  let activityLog: any;

  beforeAll(async () => {
    await resetDB();

    activityLog = await ActivityLogRepository.create({
      data: {
        action: 'test.create',
        account_id: 'xxx',
        trace_id: 'xxx',
        status: 'failed',
        platform: 'app',
      },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /activity_logs', () => {
    it('returns a list of activity logs', async () => {
      const response = await request(app).get('/activity_log').expect(200);

      expect(response.body).toEqual({
        data: [
          {
            ...activityLog,
            created_at: activityLog.created_at.toISOString(),
            updated_at: activityLog.updated_at.toISOString(),
          },
        ],
        pagination: {
          total: 1,
          page_size: 25,
          page_number: 1,
          total_page: 1,
        },
      });
    });
  });

  describe('GET /activity_logs/account/{accountId}', () => {
    it('returns a list of activity logs for a specific account', async () => {
      await ActivityLogRepository.create({
        data: {
          action: 'test.create',
          account_id: '123',
          trace_id: 'xxx',
          status: 'failed',
          platform: 'app',
        },
      });
      const response = await request(app).get(`/activity_log/account/${activityLog.account_id}`).expect(200);

      expect(response.body).toEqual({
        data: [
          {
            ...activityLog,
            created_at: activityLog.created_at.toISOString(),
            updated_at: activityLog.updated_at.toISOString(),
          },
        ],
        pagination: {
          total: 1,
          page_size: 25,
          page_number: 1,
          total_page: 1,
        },
      });
    });
  });
});
