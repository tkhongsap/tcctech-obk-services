import app from '../../../src/app';
import request from 'supertest';
import { resetDB } from '../../helpers/db';
import { OBError } from '../../../src/utils/error_spec';
import { newErrorHandler } from '../../../src/middlewares/error';
import { createTestData } from '../../fixtures';

let dataTest: any;
beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  dataTest = await createTestData();
});

describe('V2MemberController', () => {
  describe('GET v2/members', () => {
    describe('find by floor id', () => {
      it('should return 200 ', async () => {
        const response = await request(app).get(`/v2/members?floor_id=${dataTest.floor.id}`).send();

        expect(response.status).toBe(200);
        expect(response.body.data[0].account_id).toEqual(dataTest.member.account_id);
      });

      it('should return 400 with throw error', async () => {
        const response = await request(app).get(`/v2/members`).send();

        expect(response.status).toStrictEqual(400);
        expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
      });
    });

    describe('find by tanant id', () => {
      it('should return 200 ', async () => {
        const response = await request(app).get(`/v2/members?tenant_id=${dataTest.tenant.id}`).send();

        expect(response.status).toBe(200);
        expect(response.body.data[0].account_id).toEqual(dataTest.member.account_id);
      });
    });
  });

  describe('POST v2/members', () => {
    describe('find by floor ids', () => {
      it('should return 200 ', async () => {
        const body = {
          floor_ids: [dataTest.floor.id],
        };
        const response = await request(app).post('/v2/members').send(body);

        expect(response.status).toBe(200);
        expect(response.body.data[0].account_id).toEqual(dataTest.member.account_id);
      });
    });

    describe('find by tanant ids', () => {
      it('should return 200 ', async () => {
        const body = {
          tenant_ids: [dataTest.tenant.id],
        };
        const response = await request(app).post('/v2/members').send(body);

        expect(response.status).toBe(200);
        expect(response.body.data[0].account_id).toEqual(dataTest.member.account_id);
      });
    });

    describe('find by tanant ids and floor ids', () => {
      it('should return 200 ', async () => {
        const body = {
          tenant_ids: [dataTest.tenant.id],
          floor_ids: [dataTest.floor.id],
        };
        const response = await request(app).post('/v2/members').send(body);

        expect(response.status).toBe(200);
        expect(response.body.data[0].account_id).toEqual(dataTest.member.account_id);
      });
    });
  });
});
