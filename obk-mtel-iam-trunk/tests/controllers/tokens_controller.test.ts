import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import AccountRepository from '../../src/repositories/account_repository';
import { CreateTokenRequestBody } from '../../src/controllers/tokens_controller.interfaces';
import { exportKey, generateKeyPair } from '../../src/utils/encrypt';
import TokenRepository from '../../src/repositories/token_repository';
import dayjs from 'dayjs';

beforeEach(async () => {
  await resetDB();
});

describe('TokensController', () => {
  describe('POST /tokens', () => {
    it('should return 200', async () => {
      const keyPair = await generateKeyPair();
      const privateKey = await exportKey(keyPair.privateKey);
      const publicKey = await exportKey(keyPair.publicKey);

      const account = await AccountRepository.create({
        data: {
          api_key: {
            create: {
              secret: '123',
              key_pairs: {
                create: {
                  name: 'vip',
                  private: privateKey,
                  public: publicKey,
                },
              },
            },
          },
        },
      });

      const data: CreateTokenRequestBody = {
        type: 'awesome',
        value: [{ name: 'vip', data: { id: 123 } }],
        expired_at: new Date().toString(),
      };

      const response = await request(app).post('/tokens').send(data).set('x-account-id', account.id);

      expect(response.status).toBe(200);

      const token = await TokenRepository.findFirst({});

      expect(token?.account_id).toBe(account.id);
      expect(token?.type).toBe('awesome');
    });
  });

  describe('GET /tokens/:token_id', () => {
    describe('with existing token', () => {
      it('return 200', async () => {
        const token = await TokenRepository.create({
          data: {
            value: '',
            expired_date: dayjs().toISOString(),
            type: 'awesome',
            account: {
              create: {},
            },
          },
          include: {
            account: true,
          },
        });
        const response = await request(app).get(`/tokens/${token.id}`).send();

        expect(response.status).toEqual(200);
        expect(response.body.data.token.id).toEqual(token.id);
        expect(response.body.data.token.account_id).toEqual(token.account_id);
        expect(response.body.data.token.type).toEqual(token.type);
      });
    });

    describe('without existing token', () => {
      it('return 404', async () => {
        const response = await request(app).get(`/tokens/xxx`).send();

        expect(response.status).toEqual(500);
      });
    });
  });
});
