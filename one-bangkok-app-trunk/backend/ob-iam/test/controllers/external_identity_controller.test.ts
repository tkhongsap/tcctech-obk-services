import ExternalIdentityService from '../../src/services/external_identity_service';
import request from 'supertest';
import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';

jest.mock('../../src/services/external_identity_service');

describe('External identity controller', () => {
  let app: Express;
  beforeAll(async () => {
    app = await createServer();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /external_identity/link - link', () => {
    it('should call link controller and response result', async () => {
      const externalIdentityLinkMock = jest
        .spyOn(ExternalIdentityService.prototype, 'link')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const result = await request(app)
        .post('/external_identity/link')
        .send({
          identifier: 'mock',
          uid: 'mock',
          provider_type: 'google',
          meta: {
            value: 'mock',
          },
        });

      expect(externalIdentityLinkMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({
        result: true,
      });
    });
  });
});
