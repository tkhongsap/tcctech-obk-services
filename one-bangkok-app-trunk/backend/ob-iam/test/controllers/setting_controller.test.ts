import { DateTime } from 'luxon';
import { SettingService, AccountService } from '../../src/services';
import { account } from '../../db/client';

import request from 'supertest';

import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';

jest.mock('../../src/services');

describe('Setting controller', () => {
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

  const mockSetting = {
    id: '01',
    account_id: 'acc001',
    two_factor_authentication_enabled: false,
    created_at: jsDate,
    updated_at: jsDate,
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
        .spyOn(SettingService.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockSetting);
        });
      const accountFindMock = jest
        .spyOn(AccountService.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockAccount);
        });

      const result = await request(app)
        .get('/me/setting')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send();

      expect(settingFindMock).toHaveBeenCalled();
      expect(accountFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
    });
  });
  describe('PUT /me/setting - update', () => {
    it('should call update controller and response setting', async () => {
      const settingFindMock = jest
        .spyOn(SettingService.prototype, 'update')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockSetting);
        });
      const accountFindMock = jest
        .spyOn(AccountService.prototype, 'find')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockAccount);
        });

      const result = await request(app)
        .put('/me/setting')
        .set('X-Access-Token', 'mockToken')
        .set('X-Account-Id', 'mockId')
        .send({
          two_factor_authentication_enabled: true,
        });

      expect(settingFindMock).toHaveBeenCalled();
      expect(accountFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
    });
  });
});
