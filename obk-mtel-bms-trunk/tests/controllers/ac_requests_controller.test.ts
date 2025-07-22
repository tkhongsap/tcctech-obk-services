import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { ACRequestRepository, ACRequestZoneRepository, ACZoneRepository } from '../../src/repositories';
import { newErrorHandler } from '../../src/middlewares/error';
import { OBError } from '../../src/utils/error_spec';
import * as EventProducer from '../../src/utils/kafka/event_producer';

jest.mock('../../src/utils/kafka/event_producer');

let dataTest: any;
let dataACZone: any;
let dataACRequest: any;

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  dataTest = await createTestData();
  dataACZone = await ACZoneRepository.create({
    data: {
      floor_id: dataTest.floor.id,
      name: 'zone1',
      area_size: 400,
      rate: 1.5,
    },
  });

  await ACRequestRepository.createMany({
    data: [
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-14T08:00:00Z',
        to: '2024-02-14T18:00:00Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
        requester_id: dataTest.member.id,
      },
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-22T10:00:00.000Z',
        to: '2024-02-22T10:00:00.000Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        requester_id: dataTest.member.id,
        reason: 'reason',
        internal_remark: 'internal_remark',
      },
      {
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        estimated_cost: 100,
        from: '2024-02-22T10:00:00.000Z',
        to: '2024-02-22T10:00:00.000Z',
        duration_hour: 10,
        status: 'submitted',
        total_area_size: 50,
        requester_id: dataTest.member.id,
        reason: 'reason',
        internal_remark: 'internal_remark',
      },
    ],
  });
  dataACRequest = await ACRequestRepository.findMany();
  await ACRequestZoneRepository.createMany({
    data: [
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[0].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[0].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[1].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
      {
        ac_zone_id: dataACZone.id,
        ac_request_id: dataACRequest[1].id,
        rate: dataACZone.rate,
        area_size: dataACZone.area_size,
      },
    ],
  });
});

describe('ACRequestController', () => {
  describe('POST /ac_request', () => {
    it('should return 200', async () => {
      const response = await request(app).post('/ac_request').send({
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        ac_zone_id: dataACZone.id,
        date: '2024-02-21T17:22:32.281Z',
        duration: 3,
        requester_id: dataTest.member.id,
      });
      expect(response.status).toBe(200);

      expect(response.body.data.references).not.toBeNull();
    });

    it('should return 400 throw error', async () => {
      const response = await request(app)
        .post('/ac_request')
        .send({
          tower_id: dataTest.tower.id,
          floor_id: dataTest.floor.id,
          ac_zone_id: ['test'],
          date: '2024-02-21T17:22:32.281Z',
          duration: 3,
          requester_id: dataTest.member.id,
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_ACR_002.errorCode);
    });

    it('should return 200 minimum cost', async () => {
      const response = await request(app).post('/ac_request').send({
        tower_id: dataTest.tower.id,
        floor_id: dataTest.floor.id,
        ac_zone_id: dataACZone.id,
        date: '2024-02-21T17:22:32.281Z',
        duration: 1,
        requester_id: dataTest.member.id,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.references).not.toBeNull();
    });
  });

  describe('GET /ac_request', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get(`/ac_request?requester_id=${dataACRequest[0].requester_id}`).send();

      expect(response.body.data[0].id).toEqual(dataACRequest[0].id);
      expect(response.body.data[1].reason).toEqual(dataACRequest[1].reason);
      expect(response.body.data[1].internal_remark).toEqual(dataACRequest[1].internal_remark);
      expect(response.status).toBe(200);
    });

    it('should return 200 OK with query', async () => {
      const query = {
        requester_id: dataACRequest[0].requester_id,
        page_number: 1,
        page_size: 2,
      };
      const response = await request(app).get(`/ac_request`).query(query).send();

      expect(response.body.data[0].id).toEqual(dataACRequest[0].id);
      expect(response.status).toBe(200);
    });

    it('should return 200 OK with query gte', async () => {
      const query = {
        'to.gte': '2024-02-22T10:00:00.000Z',
      };
      const response = await request(app).get(`/ac_request`).query(query).send();

      expect(response.body.data[0].id).toEqual(dataACRequest[1].id);
      expect(response.status).toBe(200);
    });
    it('should return 200 OK with query lte', async () => {
      const query = {
        'to.lte': '2024-02-22T10:00:00.000Z',
      };
      const response = await request(app).get(`/ac_request`).query(query).send();

      expect(response.body.data[0].id).toEqual(dataACRequest[0].id);
      expect(response.status).toBe(200);
    });

    it('should return 200 OK without requester_id', async () => {
      const response = await request(app).get(`/ac_request`).send();

      expect(response.body.data[0].id).toEqual(dataACRequest[0].id);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /ac_request/:id', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get(`/ac_request/${dataACRequest[0].id}`).send();

      expect(response.body.data.id).toEqual(dataACRequest[0].id);
      expect(response.status).toBe(200);
    });

    it('should return 400', async () => {
      const wrongId = 'test';
      const response = await request(app).get(`/ac_request/${wrongId}`).send();

      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_ACR_001.errorCode);
    });
  });

  describe('PUT /ac_request/:id', () => {
    it('should return 200 OK with status rejected', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const response = await request(app).put(`/ac_request/${dataACRequest[0].id}`).send({ status: 'rejected' });

      expect(response.body.data.status).toEqual('rejected');
      expect(response.status).toBe(200);
    });

    it('should return 200 OK with status approved', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const response = await request(app).put(`/ac_request/${dataACRequest[0].id}`).send({ status: 'approved' });

      expect(response.body.data.status).toEqual('approved');
      expect(response.status).toBe(200);
    });
    it('should return 200 OK with reason', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const response = await request(app).put(`/ac_request/${dataACRequest[0].id}`).send({ reason: 'reason' });

      expect(response.body.data.reason).toEqual('reason');
      expect(response.status).toBe(200);
    });
    it('should return 200 OK with internal remark', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const response = await request(app)
        .put(`/ac_request/${dataACRequest[0].id}`)
        .send({ internal_remark: 'internal_remark' });

      expect(response.body.data.internal_remark).toEqual('internal_remark');
      expect(response.status).toBe(200);
    });
  });
});
