import { PassService } from '../../src/services/pass_service';
import { LocationRepository, MemberRepository, PassRepository, ProjectRepository } from '../../src/repositories';
import { resetDB } from '../helpers/db';

const passService = new PassService();

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('PassService', () => {
  describe('findDatesInPeriod', () => {
    describe('condition is EVERYDAY', () => {
      it('return 10 days', () => {
        const dates = passService.findDatesInPeriod(
          new Date('2024-01-01T17:00:00.000Z'),
          new Date('2024-01-11T16:59:00.000Z'),
          {
            type: 'EVERYDAY',
          },
        );

        expect(dates.length).toEqual(10);
      });
      it('return 3 days', () => {
        const dates = passService.findDatesInPeriod(
          new Date('2024-02-13T17:00:00.000Z'),
          new Date('2024-02-16T16:59:00.000Z'),
          {
            type: 'EVERYDAY',
          },
        );

        expect(dates.length).toEqual(3);
      });
    });

    describe('condition is WEEKDAY', () => {
      it('return 10 days', () => {
        const dates = passService.findDatesInPeriod(new Date('2000-1-01'), new Date('2000-1-10'), {
          type: 'WEEKDAY',
          value: 6,
        });

        expect(dates.length).toEqual(2);
      });
    });

    describe('condition is WEEKDAY', () => {
      it('return 10 days', () => {
        const dates = passService.findDatesInPeriod(new Date('2000-1-01'), new Date('2000-2-10'), {
          type: 'DAY_IN_MONTH',
          value: 1,
        });

        expect(dates.length).toEqual(2);
      });
    });

    describe('buildDataFS', () => {
      let memberVisitorsId = '';
      afterEach(() => {
        jest.useRealTimers();
      });
      beforeEach(async () => {
        await resetDB();
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

        memberVisitorsId = member.visitors[0].visitor_schedules[0].id;

        await PassRepository.createMany({
          data: [
            {
              id: memberVisitorsId,
              from: new Date('2024-02-13T20:00:00.000Z'),
              to: new Date('2024-02-13T23:00:00.000Z'),
              visitor_id: member.visitors[0].id,
              issuer_id: member.id,
              visit_schedule_id: memberVisitorsId,
              status: 'pending',
            },
            {
              id: '11111',
              from: new Date('2024-02-14T20:00:00.000Z'),
              to: new Date('2024-02-14T23:00:00.000Z'),
              visitor_id: member.visitors[0].id,
              issuer_id: member.id,
              visit_schedule_id: memberVisitorsId,
              status: 'pending',
            },
          ],
        });
      });

      it('return data inviteSchedulePass length = 2 when current date after start date', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-02-13T21:00:00.000Z'));
        const pass = await PassRepository.findMany({
          where: {
            visit_schedule_id: memberVisitorsId,
          },
        });

        const inviteSchedulePass = passService.buildDataFS(pass);

        expect(inviteSchedulePass.length).toEqual(2);
        expect(inviteSchedulePass[0].startDate).toEqual('2024-02-14T04:02:00.000Z');
        expect(inviteSchedulePass[0].endDate).toEqual('2024-02-14T06:00:00.000Z');
        expect(inviteSchedulePass[1].startDate).toEqual('2024-02-15T03:00:00.000Z');
        expect(inviteSchedulePass[1].endDate).toEqual('2024-02-15T06:00:00.000Z');
      });

      it('return data inviteSchedulePass length = 2 when current date before start date', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-02-13T17:00:00.000Z'));
        const pass = await PassRepository.findMany({
          where: {
            visit_schedule_id: memberVisitorsId,
          },
        });

        const inviteSchedulePass = passService.buildDataFS(pass);

        expect(inviteSchedulePass.length).toEqual(2);
        expect(inviteSchedulePass[0].startDate).toEqual('2024-02-14T03:00:00.000Z');
        expect(inviteSchedulePass[0].endDate).toEqual('2024-02-14T06:00:00.000Z');
        expect(inviteSchedulePass[1].startDate).toEqual('2024-02-15T03:00:00.000Z');
        expect(inviteSchedulePass[1].endDate).toEqual('2024-02-15T06:00:00.000Z');
      });

      it('return data inviteSchedulePass length = 1 when current date after end date', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-02-13T23:30:00.000Z'));
        const pass = await PassRepository.findMany({
          where: {
            visit_schedule_id: memberVisitorsId,
          },
        });

        const inviteSchedulePass = passService.buildDataFS(pass);

        expect(inviteSchedulePass.length).toEqual(1);
        expect(inviteSchedulePass[0].startDate).toEqual('2024-02-15T03:00:00.000Z');
        expect(inviteSchedulePass[0].endDate).toEqual('2024-02-15T06:00:00.000Z');
      });
    });
  });

  describe('buildMultiplePassesData', () => {
    describe('every Thrusday from 15 to 29 feb', () => {
      it('build 3 pass data with correct period', () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-02-15T02:00:00.000Z'));
        // {"name":"test","email":"test@test.com","company_name":"test","reference":"test","inviter_id":"f406bc0c-3f5a-4570-a39c-e7bec3ff9f66","visitor_schedule":{"from":"2024-02-14T17:00:00.000Z","to":"2024-02-15T16:59:00.000Z","tower_id":"f1140a6a-2923-4527-a126-27c8323bf5ee","floor_id":"d22450ee-b6f5-4a90-8236-bfd28e1e9348","repetition":{"type":"WEEKDAY","value":4,"until":"2024-02-29T16:59:00.000Z"}},"profile_image_url":null}
        // "visitor_schedule":{"from":"2024-02-14T17:00:00.000Z","to":"2024-02-15T16:59:00.000Z","tower_id":"f1140a6a-2923-4527-a126-27c8323bf5ee","floor_id":"d22450ee-b6f5-4a90-8236-bfd28e1e9348","repetition":{"type":"WEEKDAY","value":4,"until":"2024-02-29T16:59:00.000Z"}}
        const input = {
          visitor: {
            id: 'string',
            inviter_id: 'string',
          },
          schedule: {
            id: 'string',
            repetition: { type: 'WEEKDAY', value: 4, until: '2024-02-29T16:59:00.000Z' },
            from: new Date('2024-02-14T17:00:00.000Z'),
            to: new Date('2024-02-29T16:59:00.000Z'),
          },
          durationInMinutes: 1439, // 23 hours 59 minutes
        };

        const expectedResult = [
          {
            from: new Date('2024-02-14T17:00:00.000Z'),
            to: new Date('2024-02-15T16:59:00.000Z'),
            visitor_id: 'string',
            visit_schedule_id: 'string',
            issuer_id: 'string',
            status: 'pending',
          },
          {
            from: new Date('2024-02-21T17:00:00.000Z'),
            to: new Date('2024-02-22T16:59:00.000Z'),
            visitor_id: 'string',
            visit_schedule_id: 'string',
            issuer_id: 'string',
            status: 'pending',
          },
          {
            from: new Date('2024-02-28T17:00:00.000Z'),
            to: new Date('2024-02-29T16:59:00.000Z'),
            visitor_id: 'string',
            visit_schedule_id: 'string',
            issuer_id: 'string',
            status: 'pending',
          },
        ];

        const service = new PassService();
        const result = service.buildMultiplePassesData(input);

        console.log({ result });
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
