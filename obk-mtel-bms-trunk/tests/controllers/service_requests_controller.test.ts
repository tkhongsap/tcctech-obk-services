import app from '../../src/app';
import request from 'supertest';

import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { IssueTypeRepository, ServiceRequestRepository } from '../../src/repositories';
import { newErrorHandler } from '../../src/middlewares/error';
import * as EventProducer from '../../src/utils/kafka/event_producer';
import { ServiceRequestBody } from '../../src/controllers/service_requests_controller.interface';

jest.mock('../../src/utils/kafka/event_producer');

let testData: any;
let issueTypeData: any;
beforeEach(async () => {
  app.use(newErrorHandler);
  await resetDB();
  testData = await createTestData();
  issueTypeData = await IssueTypeRepository.create({
    data: {
      id: 'test_issue_type',
      name: 'test',
      display_name: {},
    },
  });
});

describe('ServiceRequestController', () => {
  describe('GET /service_requests', () => {
    it('should return 200 OK reponse []', async () => {
      const response = await request(app).get('/service_requests');
      expect(response.body.data).toEqual([]);
      expect(response.status).toBe(200);
    });
    it('should return 200 OK', async () => {
      await ServiceRequestRepository.createMany({
        data: [
          {
            image_url: [],
            issue_type_id: issueTypeData.id,
            tower_id: testData.tower.id,
            floor_id: testData.floor.id,
            title: 'test',
            description: 'description',
            requester_id: testData.member.id,
            status: 'submitted',
            created_at: new Date('2024-01-13T20:15:41.425Z').toISOString(),
          },
          {
            image_url: [],
            issue_type_id: issueTypeData.id,
            tower_id: testData.tower.id,
            floor_id: testData.floor.id,
            title: 'test',
            description: 'description',
            requester_id: testData.member.id,
            status: 'submitted',
            internal_remark: 'internal_remark',
          },
          {
            image_url: [],
            issue_type_id: issueTypeData.id,
            tower_id: testData.tower.id,
            floor_id: testData.floor.id,
            title: 'test',
            description: 'description',
            requester_id: testData.member.id,
            status: 'submitted',
          },
        ],
      });
      const response = await request(app).get('/service_requests?page_size=2');
      expect(response.body.data.length).toEqual(2);
      expect(response.body.data[0].title).toEqual('test');
      expect(response.body.data[0].internal_remark).toBeNull();
      expect(response.body.data[1].internal_remark).toEqual('internal_remark');
      expect(response.status).toBe(200);
    });
    it('should return [] status in_progress', async () => {
      await ServiceRequestRepository.create({
        data: {
          image_url: [],
          issue_type_id: issueTypeData.id,
          tower_id: testData.tower.id,
          floor_id: testData.floor.id,
          title: 'test',
          description: 'description',
          requester_id: testData.member.id,
          status: 'submitted',
        },
      });
      const response = await request(app).get('/service_requests?status=in_progress');
      expect(response.body.data).toEqual([]);
      expect(response.status).toBe(200);
    });
    it('should return [] page_number 1', async () => {
      await ServiceRequestRepository.create({
        data: {
          image_url: [],
          issue_type_id: issueTypeData.id,
          tower_id: testData.tower.id,
          floor_id: testData.floor.id,
          title: 'test',
          description: 'description',
          requester_id: testData.member.id,
          status: 'submitted',
        },
      });
      const response = await request(app).get('/service_requests?page_number=1');
      expect(response.body.data.length).toEqual(1);
      expect(response.status).toBe(200);
    });
  });
  describe('POST /service_requests', () => {
    it('should return 200 OK', async () => {
      const serviceRequestBody: ServiceRequestBody = {
        image_url: [],
        issue_type_id: issueTypeData.id,
        tower_id: testData.tower.id,
        floor_id: testData.floor.id,
        title: 'test',
        description: 'description',
        requester_id: testData.member.id,
      };
      const response = await request(app).post('/service_requests').send(serviceRequestBody);
      expect(response.body.data.references).not.toBeNull();
      expect(response.status).toBe(200);
    });
    it('should return 500', async () => {
      const response = await request(app).post('/service_requests').send({});
      expect(response.status).toBe(500);
    });
  });
  describe('GET /service_requests/:id', () => {
    it('should return 200 OK', async () => {
      const serviceRequest = await ServiceRequestRepository.create({
        data: {
          image_url: [],
          issue_type_id: issueTypeData.id,
          tower_id: testData.tower.id,
          floor_id: testData.floor.id,
          title: 'test',
          description: 'description',
          requester_id: testData.member.id,
          status: 'submitted',
        },
      });
      const response = await request(app).get('/service_requests/' + serviceRequest.id);
      expect(response.body.data.id).toEqual(serviceRequest.id);
      expect(response.status).toBe(200);
    });
    it('should return 404', async () => {
      const response = await request(app).get('/service_requests/' + 'test');
      expect(response.status).toBe(404);
    });
  });
  describe('PUT /service_requests/:id', () => {
    it('should return 200 OK', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const serviceRequest = await ServiceRequestRepository.create({
        data: {
          image_url: [],
          issue_type_id: issueTypeData.id,
          tower_id: testData.tower.id,
          floor_id: testData.floor.id,
          title: 'test',
          description: 'description',
          requester_id: testData.member.id,
          status: 'submitted',
        },
      });
      const response = await request(app)
        .put('/service_requests/' + serviceRequest.id)
        .send({ status: 'in_progress' });
      expect(response.body.data.id).toEqual(serviceRequest.id);
      expect(response.body.data.status).toEqual('in_progress');
      expect(response.status).toBe(200);
    });
    it('should return 200 OK update internal remark', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();

      const serviceRequest = await ServiceRequestRepository.create({
        data: {
          image_url: [],
          issue_type_id: issueTypeData.id,
          tower_id: testData.tower.id,
          floor_id: testData.floor.id,
          title: 'test',
          description: 'description',
          requester_id: testData.member.id,
          status: 'submitted',
        },
      });
      const response = await request(app)
        .put('/service_requests/' + serviceRequest.id)
        .send({ internal_remark: 'internal_remark' });
      expect(response.body.data.id).toEqual(serviceRequest.id);
      expect(response.body.data.internal_remark).toEqual('internal_remark');
      expect(response.status).toBe(200);
    });
  });
});
