import app from '../../src/app';
import request from 'supertest';
import { MemberRepository, ProjectRepository } from '../../src/repositories';
import { resetDB } from '../helpers/db';
import LocationRepository from '../../src/repositories/location_repository';
import PassRepository from '../../src/repositories/pass_repository';
import { OBError } from '../../src/utils/error_spec';
import { newErrorHandler } from '../../src/middlewares/error';
import OBSDK from '../../src/libs/ob_sdk';
import dayjs from 'dayjs';

jest.mock('ob-iam-sdk');

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PassesController', () => {
  describe('GET /passes', () => {
    it('should return 200', async () => {
      jest.spyOn(OBSDK.IAM.client, 'tokensCreate').mockImplementationOnce(
        jest.fn((): any => {
          return {
            data: {
              data: {
                token: {
                  id: 'test',
                  expired_date: dayjs().add(10, 'minutes').toISOString(),
                },
              },
            },
          };
        }),
      );

      const project = await ProjectRepository.create({
        data: {
          name: 'test',
          display_name: {},
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
        },
        include: {
          visitors: {
            include: {
              visitor_schedules: true,
            },
          },
        },
      });

      const passId = member.visitors[0].visitor_schedules[0].id;

      await PassRepository.createMany({
        data: [
          {
            id: passId,
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
        ],
      });

      const response = await request(app).get(`/passes/${passId}`).send();
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.id).toBe(passId);
      expect(response.body.data.visitor_schedule.tokens[0].token_id).toBe('test');
    });
    it('should return 400 with error pass not found', async () => {
      const wrongId = 123456;
      const response = await request(app).get(`/passes/${wrongId}`).send();
      expect(response.status).toStrictEqual(404);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_PASS_002.errorCode);
    });
  });
  describe('PUT /passes', () => {
    const acceptConsentRequestBody = { consent: true };

    it('should return 400 with throw error status', async () => {
      const wrongId = 123456;
      const response = await request(app).put(`/passes/consent/${wrongId}`).send(acceptConsentRequestBody);
      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_PASS_001.errorCode);
    });
    it('should return 200 with update pass reponse body', async () => {
      const project = await ProjectRepository.create({
        data: {
          name: 'test',
          display_name: {},
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
        },
        include: {
          visitors: {
            include: {
              visitor_schedules: true,
            },
          },
        },
      });

      const passId1 = '86ecb396-dac3-40b7-9bde-dc95b7b7ee8d';
      const passId2 = 'e7ecb456-uto1-40b0-5bty-pc95b7b7ep1d';
      await PassRepository.createMany({
        data: [
          {
            id: passId1,
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
          {
            id: passId2,
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
        ],
      });

      const acceptedConsentResponse = await request(app)
        .put(`/passes/consent/${member.visitors[0].visitor_schedules[0].id}`)
        .send(acceptConsentRequestBody);
      expect(acceptedConsentResponse.status).toBe(200);
      expect(acceptedConsentResponse.body.data.id).toBe(passId1);
      expect(acceptedConsentResponse.body.data.consent).toBe(true);
    });
  });
});
