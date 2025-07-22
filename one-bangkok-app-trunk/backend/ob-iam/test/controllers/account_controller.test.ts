import { DateTime } from 'luxon';
import AccountService from '../../src/services/account_service';

import { account } from '../../db/client';

import request from 'supertest';

import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';
import { loginResult } from '../../src/services/auth_service/index.interface';

jest.mock('../../src/services/account_service');

describe('Account controller', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  let app: Express;
  const mockAccount: account = {
    id: '01',
    password: 'password',
    created_at: jsDate,
    updated_at: jsDate,
    deleted_at: null,
  };
  beforeAll(async () => {
    app = await createServer();
  });

  describe('GET /me/account - find', () => {
    it('should call find controller and response account', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'findAccount')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockAccount);
        });
      const result = await request(app)
        .get('/me/account')
        .set('X-Access-Token', 'test')
        .send();
      const expectedResult = {
        account: {
          id: mockAccount.id,
        },
      };
      expect(accountServiceMock).toHaveBeenCalled();
      expect(result.body.data).toStrictEqual(expectedResult);
    });
    it('should call find controller and response with http status  400 when findAccount return null', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'findAccount')
        .mockImplementationOnce(() => {
          return Promise.resolve(null);
        });
      const response = await request(app)
        .get('/me/account')
        .set('X-Access-Token', 'test')
        .send();
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(400);
    });
  });
  describe('DELETE /me/account - delete', () => {
    it('should call delete controller and response true', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'update')
        .mockImplementationOnce(() => {
          return Promise.resolve();
        });
      const response = await request(app)
        .delete('/me/account')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send();
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data.result).toStrictEqual(true);
    });
    it('should call delete controller and response with http status 400 when account id is empty', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'update')
        .mockImplementationOnce(() => {
          return Promise.resolve();
        });
      const response = await request(app)
        .delete('/me/account')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', '')
        .send();
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(400);
    });
  });
  describe('POST  /me/account/verify_password - verify_password', () => {
    it('should call verify_password controller and response true', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'verifyPassword')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const response = await request(app)
        .post('/me/account/verify_password')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          password: 'test',
        });
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual({ result: true });
    });
    it('should call verify_password controller and response with http status 400 when account id is empty', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'verifyPassword')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const response = await request(app)
        .post('/me/account/verify_password')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', '')
        .send({
          password: 'test',
        });
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(400);
    });
  });
  describe('PUT  /me/account/password - updatePassword', () => {
    it('should call updatePassword controller and response true', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'updatePassword')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const response = await request(app)
        .put('/me/account/password')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          password: 'newTest',
        });
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual({ result: true });
    });
    it('should call updatePassword controller and response with http status 400 when account id is empty', async () => {
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'updatePassword')
        .mockImplementationOnce(() => {
          return Promise.resolve(true);
        });
      const response = await request(app)
        .put('/me/account/password')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', '')
        .send({
          password: 'test',
        });
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(400);
    });
  });
  describe('PUT  /me/account/reset_password - reset_password', () => {
    it('should call reset_password controller and response login result', async () => {
      const mockToken: loginResult = { token: { value: 'token' } };
      const mockBodyReq = {
        identity: {
          identifier: 'mock',
          provider: 'phone',
          otp: 'mock',
          reference: 'mock',
          country_code: 'mock',
        },
        otp: {
          id: 'mock',
          reference: 'mock',
        },
        hashedPassword: 'mock',
      };
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'resetPassword')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const response = await request(app)
        .put('/me/account/reset_password')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send(mockBodyReq);
      expect(accountServiceMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual(mockToken);
    });
  });
});
