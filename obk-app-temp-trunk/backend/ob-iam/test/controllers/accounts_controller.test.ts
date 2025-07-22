import AccountService from '../../src/services/account_service';
import request from 'supertest';

import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';
jest.mock('../../src/services/account_service');

describe('Accounts controller', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createServer();
  });

  describe('GET /account/{id} - find', () => {
    it('should call find controller and response account detail', async () => {
      const mockAccountDetail = {
        account: {
          device: {
            id: '01mock',
          },
        },
      };
      const accountServiceMock = jest
        .spyOn(AccountService.prototype, 'getAccountDetail')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockAccountDetail);
        });
      const result = await request(app)
        .get('/account/01')
        .set('X-Access-Token', 'test')
        .send();

      expect(accountServiceMock).toHaveBeenCalled();
      expect(result.body.data).toStrictEqual(mockAccountDetail);
    });
  });
});
