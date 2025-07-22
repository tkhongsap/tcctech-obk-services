import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { newErrorHandler } from '../../src/midlewares/error';
import { OBError } from '../../src/utils/error_spec';

const headers: { [key: string]: string } = {};

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);

  headers['x-permissions'] =
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiZnMiLCAiYWN0aW9ucyI6IFsiKiJdIH0gfV19';
});

describe('TokenController', () => {
  describe('GET /integration/tokens/:token_id/account', () => {
    describe('without existing token', () => {
      it('return 404', async () => {
        headers['x-account-id'] = 'xxxx';
        const response = await request(app).get(`/integration/tokens/xxx/account`).set(headers).send();

        expect(response.status).toEqual(404);
        expect(response.body.error.code).toStrictEqual(OBError.IAM_AUTH_001.errorCode);
      });
    });
  });
});
