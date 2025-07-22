import app from '../../src/app';
import request from 'supertest';
import { MemberRepository, ProjectRepository } from '../../src/repositories';
import { resetDB } from '../helpers/db';
import LocationRepository from '../../src/repositories/location_repository';
import PassRepository from '../../src/repositories/pass_repository';
import TenantRepository from '../../src/repositories/tenant_repository';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
import FSClient from '../../src/libs/fs_client';
import FSParkingClient from '../../src/libs/fs_parking_client';

FSParkingClient.fsParkingApiKey = 'mock';
FSClient.token = 'mock';

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
});

describe('MemberController', () => {
  describe('GET /members', () => {
    describe('find by identifier', () => {
      it('should return 200 ', async () => {
        await MemberRepository.create({
          data: {
            uid: 'test',
            metadata: {
              personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
              tenantIDs: [],
              phones: ['+669912345'],
              emails: ['test'],
            },
            account_id: 'test',
          },
        });
        jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValueOnce({
          data: {
            data: [
              {
                departmentId: 'string',
                tenantId: 'string',
              },
            ],
            message: 'success',
            status: 0,
          },
        });
        const response = await request(app).get('/members?identifier=test').send();
        expect(response.status).toBe(200);
      });
    });

    describe('find by account_id', () => {
      it('should return 200 ', async () => {
        await MemberRepository.create({
          data: {
            uid: 'test',
            metadata: {
              personID: '2ad60a87-16e3-49b1-8ef6-d272432a3555',
              tenantIDs: [],
              phones: ['+669912345'],
              emails: ['fs@email.com'],
            },
            account_id: 'awesome-id',
          },
        });

        jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValue({
          data: {
            data: [
              {
                departmentId: 'string',
                tenantId: 'string',
              },
            ],
            message: 'success',
            status: 0,
          },
        });

        const response1 = await request(app).get('/members').set('x-account-id', 'awesome-id').send();
        expect(response1.status).toBe(200);

        const response2 = await request(app).get('/members?account_id=awesome-id').send();
        expect(response2.status).toBe(200);
        expect(response2.body.data[0].account_id).toEqual('awesome-id');
      });
    });

    it('should return 400 ', async () => {
      jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValueOnce({
        data: {
          data: [
            {
              departmentId: 'string',
              tenantId: 'string',
            },
          ],
          message: 'success',
          status: 0,
        },
      });
      const response = await request(app).get('/members?identifier=+6699123456').send();
      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
    });
  });

  describe('GET /member/id', () => {
    it('should return 200', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'test',
          display_name: {},
          uid: '1',
          towers: {
            create: {
              uid: 'test',
              name: 'test',
              display_name: {},
              floors: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
              zones: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
            },
          },
        },
        include: {
          towers: {
            include: {
              floors: true,
              zones: true,
            },
          },
        },
      });

      const location = await LocationRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          tower_id: project.towers[0].id,
          floor_id: project.towers[0].floors[0].id,
          zone_id: project.towers[0].zones[0].id,
        },
      });

      const tenant = await TenantRepository.create({
        data: {
          name: 'test',
          display_name: 'test',
          email: 'test',
          phone_number: 'test',
          address: 'test',
          uid: 'test',
          metadata: {},
          authorized_location: {
            create: {
              default: true,
              accessor_type: 'tenant',
              location_id: location.id,
            },
          },
        },
      });

      const member = await MemberRepository.create({
        data: {
          uid: 'test',
          authorized_locations: {
            create: {
              default: true,
              accessor_type: 'member',
              location_id: location.id,
            },
          },
          tenant_members: {
            create: {
              tenant_id: tenant.id,
              role: 'staff',
              setting: {},
            },
          },
          visitors: {
            create: {
              name: 'string',
              company_name: 'string',
              reference: 'string',
              email: 'string',
              visitor_schedules: {
                create: {
                  from: new Date().toISOString(),
                  to: new Date().toISOString(),
                  tower_id: project.towers[0].id,
                  floor_id: location.id,
                },
              },
            },
          },
          account_id: '112233',
        },
        include: {
          visitors: {
            include: {
              visitor_schedules: true,
            },
          },
        },
      });

      await PassRepository.createMany({
        data: [
          {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'confirmed',
          },
        ],
      });

      const response = await request(app).get(`/members/${member.id}`).send();

      expect(response.status).toBe(200);
    });
  });
  it('should return 400 with throw error member not found', async () => {
    const memberid = 'test';
    const response = await request(app).get(`/members/${memberid}`).send();
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
  });

  it('should return 200 with throw error member not found when update default floor', async () => {
    const memberid = 'test';
    const response = await request(app).put(`/members/${memberid}`).send({ default_floor: '1' });
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_MEMB_003.errorCode);
  });

  describe('GET /member/id?location_id=2', () => {
    it('should return 200', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'test',
          display_name: {},
          uid: '1',
          towers: {
            create: {
              uid: 'test',
              name: 'test',
              display_name: {},
              floors: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
              zones: {
                create: {
                  uid: 'test',
                  name: 'test',
                  display_name: {},
                },
              },
            },
          },
        },
        include: {
          towers: {
            include: {
              floors: true,
              zones: true,
            },
          },
        },
      });

      const location = await LocationRepository.create({
        data: {
          uid: 'test',
          name: 'test',
          tower_id: project.towers[0].id,
          floor_id: project.towers[0].floors[0].id,
          zone_id: project.towers[0].zones[0].id,
        },
      });

      const tenant = await TenantRepository.create({
        data: {
          name: 'test',
          display_name: 'test',
          email: 'test',
          phone_number: 'test',
          address: 'test',
          uid: 'test',
          metadata: {},
          authorized_location: {
            create: {
              default: true,
              accessor_type: 'tenant',
              location_id: location.id,
            },
          },
        },
      });

      const member = await MemberRepository.create({
        data: {
          uid: 'test',
          authorized_locations: {
            create: {
              default: true,
              accessor_type: 'member',
              location_id: location.id,
            },
          },
          tenant_members: {
            create: {
              tenant_id: tenant.id,
              role: 'staff',
              setting: {},
            },
          },
          visitors: {
            create: {
              name: 'string',
              company_name: 'string',
              reference: 'string',
              email: 'string',
              visitor_schedules: {
                create: {
                  from: new Date().toISOString(),
                  to: new Date().toISOString(),
                  tower_id: project.towers[0].id,
                  floor_id: location.id,
                },
              },
            },
          },
          account_id: '112233',
        },
        include: {
          visitors: {
            include: {
              visitor_schedules: true,
            },
          },
        },
      });

      await PassRepository.createMany({
        data: [
          {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
        ],
      });

      jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
        data: {
          data: [
            {
              locationID: 'string',
              personID: 'string',
              dateTime: 'string',
              isExist: false,
            },
          ],
          message: 'success',
          status: 0,
        },
      });

      const response = await request(app).get(`/members/${member.id}?location_id=2`).send();

      expect(response.status).toBe(200);
    });
  });
});
