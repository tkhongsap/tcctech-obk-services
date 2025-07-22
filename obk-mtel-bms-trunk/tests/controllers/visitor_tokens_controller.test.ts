import request from 'supertest';
import app from '../../src/app';
import { resetDB } from '../helpers/db';
import { LocationRepository, MemberRepository, PassRepository, ProjectRepository } from '../../src/repositories';

describe('VisitorTokensController', () => {
  beforeEach(async () => {
    await resetDB();
  });

  describe('GET /visitor_tokens', () => {
    it('return 200', async () => {
      const response = await request(app).get('/visitor_tokens').send();

      expect(response.status).toEqual(200);
    });

    it('return 200', async () => {
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
                  tokens: {
                    create: {
                      token_id: 'awesome',
                    },
                  },
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
            uid: 'kok',
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
          {
            id: passId2,
            uid: 'kok',
            from: new Date().toISOString(),
            to: new Date().toISOString(),
            visitor_id: member.visitors[0].id,
            issuer_id: member.id,
            visit_schedule_id: member.visitors[0].visitor_schedules[0].id,
            status: 'pending',
          },
        ],
      });

      const response = await request(app).get('/visitor_tokens').query({ token_id: 'awesome' }).send();

      expect(response.status).toEqual(200);
      expect(response.body.data[0].uid).toEqual('kok');
    });
  });
});
