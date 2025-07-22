import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import RoleService from '../../src/services/role_service';
import { PermitteeType } from '../../db/client/index';
import RoleRepository from '../../src/repositories/role_repository';

describe('Roles controller', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    await resetDB();
  });
  it('should call create controller and response role result', async () => {
    const bodyReq = {
      name: 'testrole01',
      permissions: [
        {
          permittee_type: 'account',
          value: {
            name: 'ob-bms:fs',
            service: 'ob-bms',
            actions: ['*'],
            resource_type: 'fs',
            resource: {
              id: 'self',
            },
          },
        },
      ],
    };
    const result = await request(app).post('/roles').send(bodyReq);

    expect(result.status).toStrictEqual(200);
    expect(result.body.data.name).toStrictEqual(bodyReq.name);
    expect(result.body.data.updated_at).not.toBeNull();
    expect(result.body.data.permissions.length).toStrictEqual(bodyReq.permissions.length);
    expect(result.body.data.permissions[0].value).toStrictEqual(bodyReq.permissions[0].value);
  });
  it('should call index controller and response all roles result', async () => {
    const mockRole = [
      {
        name: 'testrole01',
        permissions: [
          {
            permittee_type: 'account' as PermitteeType,
            value: {
              name: 'ob-bms:fs',
              service: 'ob-bms',
              actions: ['*'],
              resource_type: 'fs',
              resource: {
                id: 'self',
              },
            },
          },
        ],
      },
      {
        name: 'testrole02',
        permissions: [
          {
            permittee_type: 'account' as PermitteeType,
            value: {
              name: 'ob-notification:xx',
              service: 'ob-notification',
              actions: ['*'],
              resource_type: 'xx',
              resource: {
                id: 'self',
              },
            },
          },
        ],
      },
    ];
    const roleService = new RoleService();
    await roleService.create(mockRole[0]);
    await roleService.create(mockRole[1]);

    const result = await request(app).get('/roles').send();
    expect(result.status).toStrictEqual(200);
    expect(result.body.data.length).toStrictEqual(mockRole.length);
  });
  it('should call show controller and response role result by id', async () => {
    const mockRole = [
      {
        name: 'testrole01',
        permissions: [
          {
            permittee_type: 'account' as PermitteeType,
            value: {
              name: 'ob-bms:fs',
              service: 'ob-bms',
              actions: ['*'],
              resource_type: 'fs',
              resource: {
                id: 'self',
              },
            },
          },
        ],
      },
      {
        name: 'testrole02',
        permissions: [
          {
            permittee_type: 'account' as PermitteeType,
            value: {
              name: 'ob-notification:xx',
              service: 'ob-notification',
              actions: ['*'],
              resource_type: 'xx',
              resource: {
                id: 'self',
              },
            },
          },
        ],
      },
    ];
    const roleService = new RoleService();
    const expectedResult = await roleService.create(mockRole[0]);
    await roleService.create(mockRole[1]);

    const result = await request(app).get(`/roles/${expectedResult.id}`).send();

    expect(result.status).toStrictEqual(200);
    expect(result.body.data.id).toStrictEqual(expectedResult.id);
    expect(result.body.data.name).toStrictEqual(expectedResult.name);
    expect(result.body.data.permissions[0].id).toStrictEqual(expectedResult.permissions[0].id);
  });
  it('should call update controller and response updated role result', async () => {
    const mockRole = {
      name: 'testrole01',
      permissions: [
        {
          permittee_type: 'account' as PermitteeType,
          value: {
            name: 'ob-bms:fs',
            service: 'ob-bms',
            actions: ['*'],
            resource_type: 'fs',
            resource: {
              id: 'self',
            },
          },
        },
      ],
    };
    const mockUpdatedRole = {
      name: 'testrole01',
      permissions: [
        {
          permittee_type: mockRole.permissions[0].permittee_type,
          value: {
            name: mockRole.permissions[0].value.name,
            service: mockRole.permissions[0].value.service,
            actions: ['read'],
            resource_type: mockRole.permissions[0].value.resource_type,
            resource: mockRole.permissions[0].value.resource,
          },
        },
      ],
    };
    const roleService = new RoleService();
    const _role = await roleService.create(mockRole);

    const result = await request(app).put(`/roles/${_role.id}`).send(mockUpdatedRole);
    expect(result.status).toStrictEqual(200);
    expect(result.body.data.id).toStrictEqual(_role.id);
    expect(result.body.data.name).toStrictEqual(_role.name);
    expect(result.body.data.permissions[0].id).toStrictEqual(_role.permissions[0].id);
    expect(result.body.data.permissions[0].value.actions).toStrictEqual(mockUpdatedRole.permissions[0].value.actions);
  });
  it('should call destroy controller and response true', async () => {
    const mockRole = {
      name: 'testrole01',
      permissions: [
        {
          permittee_type: 'account' as PermitteeType,
          value: {
            name: 'ob-bms:fs',
            service: 'ob-bms',
            actions: ['*'],
            resource_type: 'fs',
            resource: {
              id: 'self',
            },
          },
        },
      ],
    };
    const roleService = new RoleService();
    const _role = await roleService.create(mockRole);

    const result = await request(app).delete(`/roles/${_role.id}`).send();
    expect(result.status).toStrictEqual(200);
    expect(result.body.data).toStrictEqual(true);
    expect(await RoleRepository.findFirst({ where: { id: _role.id } })).toBeNull();
  });
});
