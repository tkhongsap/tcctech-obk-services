import { DateTime } from 'luxon';
import { AuthService, AccountService } from '../../src/services';
import { IdentityProvider, ProfileGender, account } from '../../db/client';

import request from 'supertest';

import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';

jest.mock('../../src/services');

describe('Auth controller', () => {
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
  const mockToken = {
    id: '45789',
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYjA5ZDJjNC1lYTQ4LTQwMjEtOWQ4ZC1mMGRhODg5OWY1OTQiLCJpYXQiOjE2OTkzNzIxMDMsImV4cCI6MTcwMTk2NDEwMywicGVybWlzc2lvbiI6W3siaWQiOiIzYmY5ZjUzYy1hY2Y3LTQ0NjUtODg5ZS1lYWRiNGEyMGU1ZGUiLCJwZXJtaXR0ZWVfdHlwZSI6ImFjY291bnQiLCJ2YWx1ZSI6eyJuYW1lIjoib2ItYm1zOmZzIiwic2VydmljZSI6Im9iLWJtcyIsImFjdGlvbnMiOlsiKiJdLCJyZXNvdXJjZV90eXBlIjoiZnMiLCJyZXNvdXJjZSI6eyJpZCI6InNlbGYifX0sImNyZWF0ZWRfYXQiOiIyMDIzLTExLTA2VDE4OjM5OjAwLjg4NVoiLCJ1cGRhdGVkX2F0IjoiMjAyMy0xMS0wNlQxODozOTowMC44ODVaIiwiZGVsZXRlZF9hdCI6bnVsbCwiYWNjb3VudF9pZCI6ImJiMDlkMmM0LWVhNDgtNDAyMS05ZDhkLWYwZGE4ODk5ZjU5NCIsImFjY291bnRfZ3JvdXBfaWQiOm51bGx9XX0.UluiPuR9Dah4KB6vmLGB84DeL2_mqZFaDBUDFzBgIn0',
    account_id: mockAccount.id,
    expired_date: jsDate,
    type: 'long live',
    active: true,
    created_at: jsDate,
    updated_at: jsDate,
    account: mockAccount,
  };
  const mockAuth = {
    profile: {
      first_name: 'test',
      middle_name: '',
      last_name: 'test',
      dob: '1994/11/09',
      gender: ProfileGender.male,
    },
    identities: {
      identifier: 'testk@mtel.co.th',
      provider: IdentityProvider.sso,
    },
    password: 'password',
    device: {
      device_id: '1123',
      os: 'ios',
    },
    push_token: {
      value: 'xx',
      type: 'FCM',
    },
  };
  const mockLoginResult = {
    token: {
      value: 'test',
    },
    identity: mockAuth.identities,
  };
  beforeAll(async () => {
    app = await createServer();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /me/setting - find', () => {
    it('should call find controller and response setting', async () => {
      const settingFindMock = jest
        .spyOn(AccountService.prototype, 'register')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const result = await request(app).post('/auth/register').send(mockAuth);

      expect(settingFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
    });
  });
  describe('POST /auth/login - login', () => {
    it('should call login controller and response login result', async () => {
      const settingFindMock = jest
        .spyOn(AuthService.prototype, 'login')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockLoginResult);
        });
      const result = await request(app)
        .post('/auth/login')
        .set('X-Access-Token', 'test')
        .send({
          identity: {
            identifier: 'testk@mtel.co.th',
            provider: IdentityProvider.sso,
          },
          password: 'password',
          otp: {
            id: '01',
            reference: 'mock',
          },
        });

      expect(settingFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual(mockLoginResult);
    });
  });
  describe('DELETE /auth/login - logout', () => {
    it('should call logout controller and response result', async () => {
      const settingFindMock = jest
        .spyOn(AuthService.prototype, 'logout')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const result = await request(app)
        .delete('/auth/logout')
        .set('X-Access-Token', 'test')
        .send();

      expect(settingFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual({ result: true });
    });
  });
  describe('PUT /auth/reactivate - reactivate', () => {
    it('should call reactivate controller and response result', async () => {
      const settingFindMock = jest
        .spyOn(AuthService.prototype, 'reactivate')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockLoginResult);
        });
      const result = await request(app)
        .put('/auth/reactivate')
        .set('X-Access-Token', 'test')
        .send({
          identity: mockAuth.identities,
          password: mockAuth.password,
          device: mockAuth.device,
          otp: {
            id: '01',
            reference: 'mock',
          },
        });

      expect(settingFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual(mockLoginResult);
    });
  });
});
