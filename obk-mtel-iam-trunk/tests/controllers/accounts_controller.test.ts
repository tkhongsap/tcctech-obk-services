import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import AccountRepository from '../../src/repositories/account_repository';
import { IdentityProvider } from '../../db/client';

describe('AccountsController', () => {
  let account1: any;
  let account2: any;

  beforeAll(async () => {
    await resetDB();

    // Create the first account
    const identities1 = [
      {
        identifier: 'test1@example.com',
        meta: {
          identifier: 'test1@example.com',
        },
        provider: IdentityProvider.email,
        verified_at: null,
        linked_at: null,
        unlinked_at: null,
        default: true,
      },
    ];

    const device1 = {
      id: 'testdevice1',
      device_id: 'device1',
      os: 'ios',
      active: true,
      created_at: '2024-02-05T07:32:35.676Z',
      updated_at: '2024-02-05T07:32:35.676Z',
    };

    account1 = await AccountRepository.create({
      data: {
        token: {
          create: {
            value: 'test1',
            type: 'test1',
          },
        },
        device: {
          create: device1,
        },
        profile: {
          create: {
            gender: 'nonbinary',
            title: null,
            first_name: 'Test1',
            middle_name: null,
            last_name: 'User1',
            dob: '1990-01-01T00:00:00.000Z',
          },
        },
        identities: {
          create: identities1,
        },
      },
      include: {
        device: true,
        profile: true,
        identities: true,
      },
    });

    const identities2 = [
      {
        identifier: 'test2@example.com',
        meta: {
          identifier: 'test2@example.com',
        },
        provider: IdentityProvider.email,
        verified_at: null,
        linked_at: null,
        unlinked_at: null,
        default: true,
      },
    ];

    const device2 = {
      id: 'testdevice2',
      device_id: 'device2',
      os: 'ios',
      active: true,
      created_at: '2024-02-05T07:32:35.676Z',
      updated_at: '2024-02-05T07:32:35.676Z',
    };

    account2 = await AccountRepository.create({
      data: {
        token: {
          create: {
            value: 'test2',
            type: 'test2',
          },
        },
        device: {
          create: device2,
        },
        profile: {
          create: {
            gender: 'nonbinary',
            title: null,
            first_name: 'Test2',
            middle_name: null,
            last_name: 'User2',
            dob: '1995-01-01T00:00:00.000Z',
          },
        },
        identities: {
          create: identities2,
        },
      },
      include: {
        device: true,
        profile: true,
        identities: true,
      },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /accounts', () => {
    it('should return 200 when accounts are found', async () => {
      const response = await request(app).get('/accounts');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /accounts/{id}', () => {
    it('should return 200 and retrieve account details', async () => {
      const accountDetailData = {
        account: {
          isDeleted: null,
          device: {
            id: 'device2',
          },
          profile: {
            id: account2.profile[0].id,
            account_id: account2.id,
            gender: 'nonbinary',
            title: null,
            first_name: 'Test2',
            middle_name: null,
            last_name: 'User2',
            dob: '1995-01-01T00:00:00.000Z',
            created_at: account2.profile[0].created_at.toISOString(),
            updated_at: account2.profile[0].updated_at.toISOString(),
          },
          identity: [
            {
              id: account2.identities[0].id,
              identifier: 'test2@example.com',
              meta: { identifier: 'test2@example.com' },
              provider: IdentityProvider.email,
              account_id: account2.id,
              verified_at: null,
              linked_at: null,
              unlinked_at: null,
              created_at: account2.identities[0].created_at.toISOString(),
              updated_at: account2.identities[0].updated_at.toISOString(),
              default: true,
            },
          ],
        },
      };

      const response = await request(app).get(`/accounts/${account2.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(accountDetailData);
    });

    it('should return 500 if account not found', async () => {
      const response = await request(app).get(`/accounts/{accountmaimee}`);
      expect(response.status).toBe(500);
    });
  });
});
