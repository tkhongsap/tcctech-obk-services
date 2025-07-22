import app from '../../../src/app';
import request from 'supertest';
import { MemberRepository, CommandRepository } from '../../../src/repositories';
import { resetDB } from '../../helpers/db';
import { createTestData } from '../../fixtures';

import dayjs from 'dayjs';
import FSClient from '../../../src/libs/fs_client';

let testData: any;
let spy: any;

afterEach(() => {
  spy && spy.mockRestore();
});

beforeEach(async () => {
  await resetDB();
  testData = await createTestData();
});

describe('CommandsController', () => {
  describe('GET /members/:member_id/commands', () => {
    it('should return 200', async () => {
      const date = dayjs();
      const member = await MemberRepository.create({
        data: {
          uid: 'test',
          commands: {
            createMany: {
              data: [
                {
                  name: 'lift.call',
                  data: {},
                  created_at: date.toISOString(),
                  status: 'complete',
                  result: {},
                },
                {
                  name: 'lift.call',
                  data: {},
                  created_at: date.add(1, 'day').toISOString(),
                  status: 'complete',
                  result: {},
                },
              ],
            },
          },
        },
        include: {
          commands: true,
        },
      });

      const response = await request(app)
        .get(`/members/${member.id}/commands`)
        .query({
          order_direction: 'desc',
        })
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      expect(response.body.data[0].id).toEqual(member.commands[1].id);
    });
  });

  describe('POST /members/:member_id/commands', () => {
    it('should return 200', async () => {
      FSClient.token = 'mock';
      spy = jest
        .spyOn(FSClient.httpClient, 'post')
        .mockResolvedValueOnce({ data: { data: { token: test } } })
        .mockResolvedValueOnce({
          data: {
            data: {
              personID: 'test',
              liftName: 'AAA',
              floorID: 1,
              floorName: 'test',
            },
            message: 'success',
            status: 0,
          },
        });

      const response = await request(app)
        .post(`/members/${testData.member.id}/commands`)
        .send({
          name: 'lift.call',
          data: {
            location_id: testData.location.id,
            destination_floor_id: testData.floor.id,
          },
        });

      const command = await CommandRepository.findFirst();

      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(command?.name).toEqual('lift.call');
    });
  });
});
