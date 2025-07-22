import { AccountService, IdentityService } from '../../src/services';
import request from 'supertest';
import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';
import { IdentityProvider } from '../../db/client';
import { DateTime } from 'luxon';

jest.mock('../../src/services');

describe('Identity controller', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  let app: Express;
  const identityMock = {
    identifier: '+992261234',
    id: '1',
    meta: {},
    provider: IdentityProvider.phone,
    created_at: jsDate,
    updated_at: jsDate,
    verified_at: jsDate,
    linked_at: jsDate,
    unlinked_at: jsDate,
    account: {
      id: '1',
      password: null,
      created_at: jsDate,
      updated_at: jsDate,
      deleted_at: null,
    },
    account_id: '1',
    default: true,
  };
  beforeAll(async () => {
    app = await createServer();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /identity/validate - validate', () => {
    it('should call link controller and response result', async () => {
      const idetityValidateMock = jest
        .spyOn(IdentityService.prototype, 'validate')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const result = await request(app)
        .get('/identity/validate')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .query({
          identifier: '0123456',
          provider: 'phone',
        })
        .send();

      expect(idetityValidateMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({
        result: true,
      });
    });
  });
  describe('POST /identity - create', () => {
    it('should call create controller and response result', async () => {
      const idetityValidateMock = jest
        .spyOn(IdentityService.prototype, 'validate')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const accountCreateIndentityMock = jest
        .spyOn(AccountService.prototype, 'createIdentity')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const result = await request(app)
        .post('/identity')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          identity: { identifier: 'test', provider: 'email' },
          otp: { id: 'otpId' },
        });

      expect(idetityValidateMock).toHaveBeenCalled();
      expect(accountCreateIndentityMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({
        result: true,
      });
    });
    it('should call create controller and response with http status 500 when Identity already exists', async () => {
      const identityCreateMock = jest
        .spyOn(IdentityService.prototype, 'validate')
        .mockImplementationOnce(() => {
          return Promise.resolve(false);
        });

      const result = await request(app)
        .post('/identity')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          identity: { identifier: 'test', provider: 'email' },
          otp: { id: 'otpId' },
        });

      expect(identityCreateMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(500);
    });
  });
  describe('PUT /identity/{id}/default - default', () => {
    it('should call create controller and response result', async () => {
      const identityUpdateDefaultMock = jest
        .spyOn(IdentityService.prototype, 'updateDefault')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });

      const result = await request(app)
        .put('/identity/01/default')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          identity: {
            identifier: 'mock',
            provider: 'email',
            type: 'google',
            default: true,
          },
          otp: { id: '01' },
        });

      expect(identityUpdateDefaultMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({
        result: true,
      });
    });
  });
  describe('GET /identity/{id}/default - findAll', () => {
    it('should call findAll controller and response identity result', async () => {
      const identityFindAllMock = jest
        .spyOn(IdentityService.prototype, 'findAll')
        .mockImplementationOnce(() => {
          return Promise.resolve([identityMock]);
        });

      const result = await request(app)
        .get('/identity')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .query({ provider: 'email' })
        .send();

      expect(identityFindAllMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
    });
  });
  describe('DELETE /identity/{id} - delete', () => {
    it('should call delete controller and response delete result', async () => {
      const identityDeleteMock = jest
        .spyOn(IdentityService.prototype, 'delete')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });

      const result = await request(app)
        .delete('/identity/01')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send();

      expect(identityDeleteMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({ result: true });
    });
  });
});
