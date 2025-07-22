import { DateTime } from 'luxon';
import { account } from '../../db/client';
import request from 'supertest';
import * as permission from '../../src/utils/authorization';
import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';
import TokenService from '../../src/services/token_service';
import { AuthService } from '../../src/services';

jest.mock('../../src/services/account_service');
jest.mock('../../src/repositories');
jest.mock('../../src/utils/authorization');

describe('QR Token controller', () => {
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
  beforeAll(async () => {
    app = await createServer();
  });

  describe('GET /me/qr_token - show', () => {
    it('should call show controller and response token', async () => {
      const tokenFindMock = jest
        .spyOn(TokenService.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve({ ...mockToken, account: mockAccount });
        });

      const authPermissionMock = jest
        .spyOn(permission, 'authorizePermission')
        .mockImplementationOnce(() => {
          return true;
        });
      const response = await request(app)
        .get('/me/qr_token')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send();
      expect(tokenFindMock).toHaveBeenCalled();
      expect(authPermissionMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual({
        token: {
          id: mockToken.id,
          expired_date: mockToken.expired_date.toISOString(),
        },
      });
    });
  });
  describe('POST /me/qr_token - create', () => {
    it('should call create controller and response token', async () => {
      const authGenerateQRTokenMock = jest
        .spyOn(AuthService.prototype, 'generateQRToken')
        .mockImplementationOnce(() => {
          return Promise.resolve({ ...mockToken, account: mockAccount });
        });

      const authPermissionMock = jest
        .spyOn(permission, 'authorizePermission')
        .mockImplementationOnce(() => {
          return true;
        });
      const response = await request(app)
        .post('/me/qr_token')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send();
      expect(authGenerateQRTokenMock).toHaveBeenCalled();
      expect(authPermissionMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual({
        token: {
          id: mockToken.id,
          expired_date: mockToken.expired_date.toISOString(),
        },
      });
    });
  });
  describe('GET /integration/tokens/{id} - getEncryptedData', () => {
    it('should call getEncryptedData controller and response encrypted_data', async () => {
      const encryptedDataMock = 'encrypted_mock';
      const authGetEncryptedDataMock = jest
        .spyOn(AuthService.prototype, 'getEncryptedData')
        .mockImplementationOnce(() => {
          return Promise.resolve(encryptedDataMock);
        });

      const authPermissionMock = jest
        .spyOn(permission, 'authorizePermission')
        .mockImplementationOnce(() => {
          return true;
        });
      const response = await request(app)
        .get('/integration/tokens/01')
        .set('X-Access-Token', 'mockToken')
        .send();
      expect(authGetEncryptedDataMock).toHaveBeenCalled();
      expect(authPermissionMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toStrictEqual({
        encrypted_data: encryptedDataMock,
      });
    });
  });
});
