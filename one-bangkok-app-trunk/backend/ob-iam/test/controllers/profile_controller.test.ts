import { DateTime } from 'luxon';
import AccountService from '../../src/services/account_service';

import { ProfileGender, account, profile } from '../../db/client';

import request from 'supertest';
import * as permission from '../../src/utils/authorization';
import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';
import { TokenRepository, ProfileRepository } from '../../src/repositories';
jest.mock('../../src/services/account_service');
jest.mock('../../src/repositories');
jest.mock('../../src/utils/authorization');

describe('Profile controller', () => {
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

  const mockProfile: profile = {
    id: 'mock',
    account_id: 'mock',
    gender: ProfileGender.female,
    title: 'ms',
    first_name: 'mock',
    middle_name: '',
    last_name: 'mock',
    dob: jsDate,
    created_at: jsDate,
    updated_at: jsDate,
  };
  describe('GET /me/profile - find', () => {
    it('should call find controller and response account', async () => {
      const tokenFindByMock = jest
        .spyOn(TokenRepository.prototype, 'findBy')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const profileFindMock = jest
        .spyOn(ProfileRepository.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockProfile);
        });
      const authPermissionMock = jest
        .spyOn(permission, 'authorizePermission')
        .mockImplementationOnce(() => {
          return true;
        });
      const response = await request(app)
        .get('/me/profile')
        .set('X-Access-Token', 'test')
        .send();
      expect(tokenFindByMock).toHaveBeenCalled();
      expect(authPermissionMock).toHaveBeenCalled();
      expect(profileFindMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
    });
    it('should call find controller and response with http 404 when token not found', async () => {
      const tokenFindByMock = jest
        .spyOn(TokenRepository.prototype, 'findBy')
        .mockImplementationOnce(() => {
          return Promise.resolve(null);
        });
      const response = await request(app)
        .get('/me/profile')
        .set('X-Access-Token', 'test')
        .send();
      expect(tokenFindByMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(404);
    });
    it('should call find controller and response with http 404 when profile not found', async () => {
      const tokenFindByMock = jest
        .spyOn(TokenRepository.prototype, 'findBy')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const profileFindMock = jest
        .spyOn(ProfileRepository.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve(null);
        });

      const response = await request(app)
        .get('/me/profile')
        .set('X-Access-Token', 'test')
        .send();
      expect(tokenFindByMock).toHaveBeenCalled();
      expect(profileFindMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(404);
    });
  });
  describe('PUT /me/profile - update', () => {
    it('should call update controller and response profile', async () => {
      const tokenFindByMock = jest
        .spyOn(TokenRepository.prototype, 'findBy')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockToken);
        });
      const accountUpdateProfileMock = jest
        .spyOn(AccountService.prototype, 'updateProfile')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockProfile);
        });

      const response = await request(app)
        .put('/me/profile')
        .set('X-Access-Token', 'test')
        .send(mockProfile);
      expect(tokenFindByMock).toHaveBeenCalled();
      expect(accountUpdateProfileMock).toHaveBeenCalled();
      expect(response.status).toStrictEqual(200);
    });
  });
});
