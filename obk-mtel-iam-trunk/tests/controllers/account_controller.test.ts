import { account } from '../../db/client';
import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import AccountRepository from '../../src/repositories/account_repository';
import { EventProducer } from '../../src/utils/kafka';

jest.mock('../../src/utils/kafka');

let account: any;

beforeEach(async () => {
  await resetDB();

  account = await AccountRepository.create({
    data: {
      token: {
        create: {
          value: 'test',
          type: 'test',
        },
      },
    },
    include: {
      token: true,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AccountController', () => {
  describe('GET /me/account', () => {
    describe('when account is not found', () => {
      it('should return 500', async () => {
        const response = await request(app).get('/me/account').send();

        expect(response.status).toBe(500);
      });
    });

    describe('when account is found', () => {
      it('should return 200', async () => {
        const response = await request(app).get('/me/account').set('x-access-token', account.token[0].value).send();

        expect(response.status).toBe(200);
      });
    });
  });

  describe('DELETE /me/account', () => {
    describe('when account is not found', () => {
      it('should return 500', async () => {
        const response = await request(app).delete('/me/account').send();

        expect(response.status).toBe(500);
      });
    });

    describe('when account is found', () => {
      it('should return 200', async () => {
        jest.spyOn(EventProducer, 'send').mockResolvedValueOnce({} as never);

        const response = await request(app).delete('/me/account').set('x-account-id', account.id).send();

        expect(response.status).toBe(200);
      });
    });
  });
});
