import app from '../../../../src/app';
import request from 'supertest';
import MemberRepository from '../../../../src/repositories/member_repository';
import { resetDB } from '../../../helpers/db';
jest.mock('../../../../src/utils/kafka/event_producer');

const PERSON_JSON = {
  count: 2,
  data: [
    {
      personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca7',
      tenantIDs: [24],
      phones: ['+66999999999'],
      emails: ['t.shin@pjoe.com'],
      locations: [
        {
          locationID: 1,
          locationName: 'T4-L1 Zone1',
          isDefault: false,
        },
      ],
      updateTime: '2023-08-25T10:56:18.283',
      active: false,
      status: 'I',
      canPreRegister: true,
    },
    {
      personID: 'a50c364f-52ef-4d8c-96f4-67c854ef8ca8',
      tenantIDs: [24],
      phones: ['+66999999999'],
      emails: ['t.shin@pjoe.com'],
      locations: [
        {
          locationID: 1,
          locationName: 'T4-L1 Zone1',
          isDefault: false,
        },
      ],
      updateTime: '2023-08-25T10:56:18.283',
      active: false,
      status: 'I',
      canPreRegister: true,
    },
  ],
};

const headers: { [key: string]: string } = {};

beforeEach(async () => {
  await resetDB();

  // set request headers
  // {"permission": [  { "value": {"resource_type": "fs", "actions": ["*"] } }]}
  headers['x-permissions'] =
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiZnMiLCAiYWN0aW9ucyI6IFsiKiJdIH0gfV19';
});

describe('POST /intefrations/fs/members', () => {
  describe('without valid permissions', () => {
    it('should return 401', async () => {
      const response = await request(app).post('/integrations/fs/members').send(PERSON_JSON);

      expect(response.status).toBe(401);
    });
  });

  describe('create new members', () => {
    it('should return 200', async () => {
      const response = await request(app).post('/integrations/fs/members').set(headers).send(PERSON_JSON);
      const members = await MemberRepository.findMany();

      expect(members.length).toEqual(2);
      expect(response.status).toBe(200);
    });
  });

  describe('update existing members intead of creating', () => {
    it('should return 200', async () => {
      let response, members;

      response = await request(app).post('/integrations/fs/members').set(headers).send(PERSON_JSON);
      members = await MemberRepository.findMany();

      expect(members.length).toEqual(2);

      response = await request(app).post('/integrations/fs/members').set(headers).send(PERSON_JSON);
      members = await MemberRepository.findMany();

      expect(members.length).toEqual(2);
      expect(response.status).toBe(200);
    });
  });
});

describe('DELETE /intefrations/fs/members', () => {
  it('should return 200', async () => {
    const member_1 = await MemberRepository.create({
      data: {
        uid: '111',
      },
    });

    const member_2 = await MemberRepository.create({
      data: {
        uid: '222',
      },
    });

    const response = await request(app)
      .delete('/integrations/fs/members')
      .set(headers)
      .send({
        member_ids: [member_1.uid, member_2.uid],
      });
    const members = await MemberRepository.findMany();

    expect(members.length).toEqual(0);
    expect(response.status).toBe(200);
  });
  it('should return 200 not produce event', async () => {
    const member_1 = await MemberRepository.create({
      data: {
        uid: '111',
      },
    });

    const member_2 = await MemberRepository.create({
      data: {
        uid: '222',
      },
    });

    const response = await request(app)
      .delete('/integrations/fs/members')
      .set(headers)
      .send({
        member_ids: [member_1.uid, member_2.uid],
      });
    const members = await MemberRepository.findMany();

    expect(members.length).toEqual(0);
    expect(response.status).toBe(200);
  });
});
