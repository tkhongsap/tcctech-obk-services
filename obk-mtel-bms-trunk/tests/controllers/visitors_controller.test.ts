import app from '../../src/app';
import request from 'supertest';
import { LocationRepository, MemberRepository, ProjectRepository } from '../../src/repositories';
import { Member } from '../../db/client/';
import VisitorRepository from '../../src/repositories/visitors_repository';
import { CreateVisitorBody } from '../../src/controllers/visitors_controller.interfaces';
import dayjs from 'dayjs';
import { resetDB } from '../helpers/db';
import PassRepository from '../../src/repositories/pass_repository';
import FSClient from '../../src/libs/fs_client';
import { newErrorHandler } from '../../src/middlewares/error';
import { OBError } from '../../src/utils/error_spec';
import * as EventProducer from '../../src/utils/kafka/event_producer';

FSClient.token = 'test';

let member: Member;
let spy: any;
let location: any;
let project: any;

const MOCK_INVITE_PRE_REGISTER_RESPONSE = {
  data: {
    message: 'Successfully!',
    status: 0,
    data: {
      inviteID: '27a449a8-7ea2-4934-26ae-08dba4b3d0e9',
    },
  },
};

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);

  project = await ProjectRepository.create({
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

  location = await LocationRepository.create({
    data: {
      uid: 'test',
      name: 'test',
      tower_id: project.towers[0].id,
      floor_id: project.towers[0].floors[0].id,
      zone_id: project.towers[0].zones[0].id,
    },
  });

  member = await MemberRepository.create({
    data: {
      uid: 'test',
      tenant_members: {
        create: {
          role: 'staff',
          setting: {},
          tenant: {
            create: {
              name: 'test',
              display_name: {},
              uid: crypto.randomUUID(),
              email: 'test',
              phone_number: 'test',
              address: 'test',
              metadata: {},
            },
          },
        },
      },
    },
  });
});

afterEach(async () => {
  spy && spy.mockRestore();
  jest.resetAllMocks();
});

describe('POST /visitors', () => {
  it('should return 200', async () => {
    spy = jest
      .spyOn(FSClient.httpClient, 'post')
      .mockResolvedValueOnce({ data: { data: { token: test } } })
      .mockResolvedValueOnce(MOCK_INVITE_PRE_REGISTER_RESPONSE);

    const data: CreateVisitorBody = {
      name: 'test',
      profile_image_url: 'test',
      email: 'test',
      company_name: 'test',
      reference: 'test',
      inviter_id: member.id,
      visitor_schedule: {
        from: dayjs().toISOString(),
        to: dayjs().toISOString(),
        tower_id: project.towers[0].id,
        floor_id: location.id,
      },
    };
    jest.spyOn(EventProducer, 'send').mockReturnValue();
    const response = await request(app).post('/visitors').send(data);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toEqual('test');
  });

  describe('with repitition EVERYDAY', () => {
    it('create correct passes', async () => {
      [...Array(11)].forEach(() => {
        jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
          data: {
            message: 'Successfully!',
            status: 0,
            data: {
              inviteID: crypto.randomUUID(),
            },
          },
        });
      });

      const data: CreateVisitorBody = {
        name: 'test',
        profile_image_url: 'test',
        email: 'test',
        company_name: 'test',
        reference: 'test',
        inviter_id: member.id,
        visitor_schedule: {
          from: dayjs().toISOString(),
          to: dayjs().toISOString(),
          tower_id: project.towers[0].id,
          floor_id: location.id,
          repetition: {
            type: 'EVERYDAY',
            until: dayjs().add(11, 'day').subtract(1, 'minutes').toISOString(),
          },
        },
      };

      const response = await request(app).post('/visitors').send(data);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual('test');

      const passes = await PassRepository.findMany();

      expect(passes.length).toEqual(11);
    });
  });

  describe('with repitition EVERYDAY', () => {
    it('create correct passes', async () => {
      jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
        data: {
          message: 'Successfully!',
          status: 0,
          data: {
            inviteID: crypto.randomUUID(),
          },
        },
      });

      const data: CreateVisitorBody = {
        name: 'test',
        profile_image_url: 'test',
        email: 'test',
        company_name: 'test',
        reference: 'test',
        inviter_id: member.id,
        visitor_schedule: {
          from: '2024-02-14T17:00:00.000Z',
          to: '2024-02-15T16:59:00.000Z',
          tower_id: project.towers[0].id,
          floor_id: location.id,
          repetition: {
            type: 'EVERYDAY',
            until: '2024-02-18T16:59:00.000Z',
          },
        },
      };

      const response = await request(app).post('/visitors').send(data);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual('test');

      const passes = await PassRepository.findMany();

      expect(passes.length).toEqual(4);
    });
  });
});

describe('GET /visitors/:id', () => {
  it('should return 200', async () => {
    spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce(MOCK_INVITE_PRE_REGISTER_RESPONSE);

    let response;
    const data: CreateVisitorBody = {
      name: 'test',
      profile_image_url: 'test',
      email: 'test',
      company_name: 'test',
      reference: 'test',
      inviter_id: member.id,
      visitor_schedule: {
        from: dayjs().toISOString(),
        to: dayjs().toISOString(),
        tower_id: project.towers[0].id,
        floor_id: location.id,
      },
    };

    response = await request(app).post('/visitors').send(data);
    response = await request(app).get(`/visitors/${response.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toEqual('test');
  });
  it('should return 400 when visitors not found', async () => {
    const response = await request(app).get(`/visitors/test`).send();
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_VIST_001.errorCode);
  });
});

describe('DELETE /visitors/:id', () => {
  it('should return 200', async () => {
    const visitor = await VisitorRepository.create({
      data: {
        name: 'test',
        company_name: 'test',
        email: 'test',
        profile_image_url: 'test',
        reference: 'test',
        inviter: {
          connect: {
            id: member.id,
          },
        },
      },
    });

    const response = await request(app).delete(`/visitors/${visitor.id}`);
    const result = VisitorRepository.findFirst({
      where: {
        id: visitor.id,
      },
    });

    expect(result).toBeNull;
    expect(response.status).toBe(200);
    expect(response.body.data).toBeNull;
  });
  it('should return 400 with throw error status 400', async () => {
    const response = await request(app).delete(`/visitors/test`).send();
    expect(response.status).toStrictEqual(400);
    expect(response.body.error.code).toStrictEqual(OBError.BMS_VIST_003.errorCode);
  });
});
