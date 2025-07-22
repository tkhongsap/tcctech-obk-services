import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
});

describe('error middlewares', () => {
  it('should return 400 not found', async () => {
    const response = await request(app).get(`/members/parking_tickets`).query({ id: 'xxx', type: 'member_id' });
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
  });
  it('should return 400 with throw error cannot update pass', async () => {
    const acceptConsentRequestBody = { consent: true };
    const response = await request(app).put(`/passes/consent/test`).send(acceptConsentRequestBody);
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_PASS_001.errorCode);
  });
});
