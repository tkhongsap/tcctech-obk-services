import app from '../../src/app';
import request from 'supertest';
import { PERMISSION_REGISTRY } from '../../src/constants/permission_registry';
import { resetDB } from '../helpers/db';
import { IdentityProvider } from '../../db/client';
import AccountRepository from '../../src/repositories/account_repository';

describe('Permissions controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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
        attached_permission: {
          create: {
            value: {
              name: 'ob-bms:ac-request',
              service: 'ob-bms',
              actions: ['create'],
              resource_type: 'ac-request',
              resource: { account_id: 'self' },
            },
            permittee_type: 'account',
          },
        },
      },
      include: {
        device: true,
        profile: true,
        identities: true,
        attached_permission: true,
      },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should call index controller and response list of permission registry result', async () => {
    const result = await request(app).get('/permissions').send();

    expect(result.status).toStrictEqual(200);
    expect(result.body.data.permissions).toStrictEqual(PERMISSION_REGISTRY);
  });

  it('should update permission success empty permission', async () => {
    const result = await request(app)
      .put(`/permissions/${account2.attached_permission[0].id}`)
      .send({ account_id: account2.id, action: '' });
    expect(result.status).toStrictEqual(200);
  });

  it('should update permission success create permission', async () => {
    const result = await request(app)
      .put(`/permissions/${account2.attached_permission[0].id}`)
      .send({ account_id: account2.id, action: 'create' });
    expect(result.status).toStrictEqual(200);
  });

  it('should update permission unsuccess read permission', async () => {
    const result = await request(app)
      .put(`/permissions/${account2.attached_permission[0].id}`)
      .send({ account_id: account2.id, action: 'read' });
    expect(result.status).toStrictEqual(500);
  });

  it('should update permission unsuccess wrong account', async () => {
    const result = await request(app)
      .put(`/permissions/${account2.attached_permission[0].id}`)
      .send({ account_id: 'account2.id', action: '' });
    expect(result.status).toStrictEqual(500);
  });

  it('should update permission unsuccess wrong permission', async () => {
    const result = await request(app).put(`/permissions/123`).send({ account_id: account2.id, action: '' });
    expect(result.status).toStrictEqual(500);
  });
});
