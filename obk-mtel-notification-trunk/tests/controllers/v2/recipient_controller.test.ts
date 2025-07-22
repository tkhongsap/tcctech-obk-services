import request from 'supertest';
import app from '../../../src/app';
import { resetDB } from '../../helpers/db';
import RecipientRepository from '../../../src/repositories/recipient_repository';

let data: any;
beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
  data = await RecipientRepository.create({
    data: {
      account_id: 'test-account-id',
      data: {
        account_id: 'test-account-id',
        profile: {
          first_name: 'Mock',
          middle_name: '-',
          last_name: 'Mock',
          gender: 'male',
          dob: '2000-07-05T00:00:00.000Z',
        },
        identities: [
          {
            provider: 'email',
            identifier: 'Mock',
            default: true,
          },
        ],
        push_token: {
          value: 'Mock FCM',
          type: 'FCM',
        },
        device: {
          device_id: 'Mock',
          device_os: 'ios',
          device_unique_id: 'Mock',
        },
        setting: {
          current_language: 'en',
        },
      },
    },
  });
});

describe('RecipientController', () => {
  describe('POST /me/recipient', () => {
    it('should create a recipient and return 200', async () => {
      const requestBody = {
        token: 'test-token',
        token_type: 'fcm',
      };

      const response = await request(app)
        .post('/me/recipient')
        .set('x-account-id', 'test-account-id')
        .set('X-Access-Token', 'test-access-token')
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: { result: true } });
    });
  });

  describe('PUT /me/recipient', () => {
    it('should update a fcm token and return 200', async () => {
      const requestBody = {
        push_token: {
          value: 'test update FCM',
          type: 'FCM',
        },
      };

      const response = await request(app)
        .put('/me/recipient')
        .set('x-account-id', 'test-account-id')
        .set('X-Access-Token', 'test-access-token')
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: { result: true } });
    });
  });
});
