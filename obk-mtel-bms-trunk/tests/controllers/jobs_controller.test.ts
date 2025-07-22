import app from '../../src/app';
import request from 'supertest';

import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';

beforeEach(async () => {
  await resetDB();
  await createTestData();
});

// 'curl -X POST https://bms.glorymtel.xyz/jobs/cancel_expired_payments/execute -H "accept: application/json" -H "x-permissions: eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiam9iOmV4ZWN1dGlvbiIsICJhY3Rpb25zIjogWyJjcmVhdGUiXSB9IH1dfQ=="'

const headers = {
  accept: 'application/json',
  'x-permissions':
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiam9iOmV4ZWN1dGlvbiIsICJhY3Rpb25zIjogWyJjcmVhdGUiXSB9IH1dfQ==',
};

describe('JobExcecutionsController', () => {
  describe('POST /:name/execute', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).post('/jobs/cancel_expired_payments/execute').set(headers);
      expect(response.status).toBe(200);
    });

    describe('when job name is not found', () => {
      it('should return 500 Internal Server Error', async () => {
        const response = await request(app).post('/jobs/unknown_job/execute').set(headers);
        expect(response.status).toBe(500);
      });
    });

    describe('when permissions are not valid', () => {
      it('should return 401 Unauthorized', async () => {
        const response = await request(app).post('/jobs/cancel_expired_payments/execute').set({
          accept: 'application/json',
          'x-permissions': 'eyJwZXJtaXNzaW9uIjogWyBdfQ==',
        });
        expect(response.status).toBe(401);
      });
    });
  });
});
