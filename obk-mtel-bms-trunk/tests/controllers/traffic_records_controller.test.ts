import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import TCCClient from '../../src/libs/tcc_client';
import * as MockTrafficRecordResponse from '../fixtures/traffic_records';
import SensorRepository from '../../src/repositories/sensor_repository';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});

afterEach(async () => {
  jest.resetAllMocks();
});

describe('TrafficRecordsController', () => {
  describe('GET /traffic_records', () => {
    it('should return 200', async () => {
      jest
        .spyOn(TCCClient.httpClient, 'post')
        .mockResolvedValueOnce({ data: MockTrafficRecordResponse.withList })
        .mockResolvedValueOnce({ data: MockTrafficRecordResponse.withoutList });

      const sensor = await SensorRepository.create({
        data: {
          uid: '5d0a07b718c141f0ac64772f560efa8c',
          name: 'Andaz Exit',
          type: 'traffic',
          data: {
            type: 'traffic',
          },
        },
      });

      const response = await request(app).get('/traffic_records');
      const expectedResponse = {
        data: [
          {
            uid: sensor.uid,
            name: sensor.name,
            type: sensor.type,
            data: sensor.data,
            meta: {
              eventId: '1A456A61-DB27-CA48-8F8F-1C6AB50647C3',
              monitoringPointSyscode: '5d0a07b718c141f0ac64772f560efa8c',
              monitoringPointName: 'Andaz Exit',
              downwardFlow: 0,
              upwardFlow: 0,
              jamFlow: 0,
              jamLevel: 0,
              laneNo: 1,
              laneState: 1,
              queueLen: 0,
              time: '2024-09-25T14:48:53.000+07:00',
              vehicleSpeed: 36,
            },
          },
        ],
      };

      const { status, body } = response;

      expect(status).toBe(200);
      expect(body).toEqual(expectedResponse);
    });
  });
});
