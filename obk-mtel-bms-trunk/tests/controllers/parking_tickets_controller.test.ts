import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { MemberRepository } from '../../src/repositories';
import FSParkingClient from '../../src/libs/fs_parking_client';
import { checkRedemptionStatusByEmailResponse, redeemParkingResponse } from '../libs/fs_parking_client.test';
import TCCClient from '../../src/libs/tcc_client';
import {
  getParkingDetailByPersonIDResponse,
  mockOauth2Token,
  parkingQueryResponse,
  parkingSpaceNoResponse,
  updateTransactionParkingResponse,
} from '../libs/tcc_client.test';
import { OBError } from '../../src/utils/error_spec';
import { syncRoleLogRepository } from '../../src/repositories/sync_role_log';
import { SyncRoleType } from '../../db/client/';
import { newErrorHandler } from '../../src/middlewares/error';

beforeAll(() => {
  app.use(newErrorHandler);
});

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});

describe('ParkingTicketController', () => {
  describe('GET /parking_tickets', () => {
    it('should return 200', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test',
        },
      });

      const data = [
        {
          id: '2024010912303301',
          parked_at: '2024-01-05T01:57:38.000Z',
          plate_number: ' 0000000',
          ticket_number: 'E0D53E98-AED2-4F70-826C-A10661A39F86',
          total_fee: 22500,
          vehicle_type: 'MOTORCYCLE',
          rate_detail: {
            en: 'Free 30 Minute.,After 30 Baht/Hour',
            th: 'สิทธิจอดรถฟรี 30 นาทีแรก.,ส่วนเกินคิดชั่วโมงละ 30 บาท',
          },
          vehicle_type_id: 1,
          member_type_id: 0,
        },
      ];

      jest
        .spyOn(FSParkingClient.httpClient, 'post')
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse });

      jest
        .spyOn(TCCClient.httpClient, 'post')
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse });

      let response;

      response = await request(app).get(`/parking_tickets`).query({ id: member.id, type: 'member_id' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(data);

      response = await request(app).get(`/parking_tickets`).query({ id: 'log-id', type: 'log_id' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(data);

      response = await request(app).get(`/parking_tickets`).query({ id: 'invite-id', type: 'invite_id' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(data);
    });
  });

  describe('POST /parking_tickets/:log_id/redeem', () => {
    it('return 200', async () => {
      const redeemer = await MemberRepository.create({
        data: {
          uid: '345',
          metadata: {
            emails: ['c@xdcom'],
          },
          account_id: 'redeemer',
        },
      });

      jest
        .spyOn(FSParkingClient.httpClient, 'post')
        .mockResolvedValue({ data: checkRedemptionStatusByEmailResponse })
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: redeemParkingResponse });

      const response = await request(app).post(`/parking_tickets/2023120817414402/redeem`).send({
        redeemer_id: redeemer.id,
        rate_code: '123',
        remark: '-',
      });

      expect(response.status).toEqual(200);
    });
  });

  describe('GET /parking_tickets/all_details', () => {
    it('return 200', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test',
        },
      });

      jest.spyOn(TCCClient, 'getOauth2Token').mockResolvedValueOnce(mockOauth2Token);

      jest
        .spyOn(TCCClient.httpClient, 'post')
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: parkingQueryResponse })
        .mockResolvedValue({ data: parkingSpaceNoResponse });

      const response = await request(app).get(`/parking_tickets/all_details/${member.id}`);

      expect(response.status).toEqual(200);
    });

    it('status 400 Member not found return data null', async () => {
      jest
        .spyOn(FSParkingClient.httpClient, 'get')
        .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
        .mockResolvedValue({ data: parkingQueryResponse })
        .mockResolvedValue({ data: parkingSpaceNoResponse });

      const response = await request(app).get(`/parking_tickets/all_details/123`);

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual(null);
    });
  });

  describe('POST /parking_tickets/import', () => {
    const originalValue = process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET;

    afterEach(() => {
      process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET = originalValue;
    });

    it('should return 200', async () => {
      jest.spyOn(TCCClient.httpClient, 'post').mockResolvedValueOnce({ data: updateTransactionParkingResponse });

      const response = await request(app)
        .post(`/parking_tickets/import`)
        .set('x-account-id', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .send({
          logId: '2025020415190100145',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: updateTransactionParkingResponse });
    });

    it('should return 400 account id not found', async () => {
      const response = await request(app).post(`/parking_tickets/import`).send({
        logId: '2025020415190100145',
      });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error.code).toStrictEqual(OBError.BMS_VAL_001.errorCode);
    });

    it('should return 404 API not found', async () => {
      process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET = 'false';

      const response = await request(app)
        .post(`/parking_tickets/import`)
        .set('x-account-id', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .send({
          logId: '2025020415190100145',
        });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toEqual(OBError.OB_004.errorCode);
    });

    it('should return 400 Parking Ticket already imported', async () => {
      await syncRoleLogRepository.create({
        data: {
          account_id: '1234',
          action: SyncRoleType.VisitorToApp,
          status: 'success',
          trace_id: '12323',
          payload: {
            logId: '2025020415190100145',
            uid: '5555',
            appId: '1234',
            algType: 'VisitorToApp',
          },
        },
      });

      const response = await request(app)
        .post(`/parking_tickets/import`)
        .set('x-account-id', '3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .send({
          logId: '2025020415190100145',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toEqual(OBError.BMS_FSP_004.errorCode);
    });

    it('should return 400 Cannot update visitor to app', async () => {
      jest.spyOn(TCCClient.httpClient, 'post').mockRejectedValueOnce({
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: {
          request: ['The request field is required.'],
        },
      });

      const response = await request(app)
        .post(`/parking_tickets/import`)
        .set('x-account-id', '3fa85f64-5717-4562-b3fc-x')
        .send({
          logId: '2025020415190100145',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toEqual(OBError.BMS_FSP_003.errorCode);
    });

    it('should return 400 Cannot update visitor to app', async () => {
      jest.spyOn(TCCClient.httpClient, 'post').mockResolvedValueOnce({ data: updateTransactionParkingResponse });
      jest.spyOn(syncRoleLogRepository, 'update').mockRejectedValueOnce(new Error('Update failed'));

      const response = await request(app)
        .post(`/parking_tickets/import`)
        .set('x-account-id', '3fa85f64-5717-4562-b3fc-x')
        .send({
          logId: '2025020415190100145',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toEqual(OBError.BMS_FSP_003.errorCode);
    });
  });
});
