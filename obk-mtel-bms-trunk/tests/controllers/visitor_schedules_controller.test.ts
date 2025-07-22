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

describe('VisitorSchedulesController', () => {
  describe('Put /visitor_schedules', () => {
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
            uid: '1234',
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'confirmed',
          },
        ],
      });

      jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
        message: 'Successfully!',
        status: 0,
        data: null,
      });

      const response = await request(app)
        .put(`/visitor_schedules/${member.visitors[0].visitor_schedules[0].id}`)
        .set('x-account-id', 'test')
        .send({ deleted_at: new Date().toISOString() });

      expect(response.status).toBe(200);
    });
    it('should return 400 with throw error account id not found', async () => {
      const response = await request(app).put('/visitor_schedules/1').send({ deleted_at: new Date().toISOString() });
      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_VAL_001.errorCode);
    });
    it('should return 404 with throw error Cannot found pass', async () => {
      const response = await request(app)
        .put('/visitor_schedules/1')
        .set('x-account-id', 'test')
        .send({ deleted_at: new Date().toISOString() });
      expect(response.status).toStrictEqual(404);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_PASS_002.errorCode);
    });
  });
});
