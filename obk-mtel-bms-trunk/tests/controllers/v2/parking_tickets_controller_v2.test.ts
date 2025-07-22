import app from '../../../src/app';
import request from 'supertest';
import { MemberRepository } from '../../../src/repositories';
import { resetDB } from '../../helpers/db';
import FSParkingClient from '../../../src/libs/fs_parking_client';
import {
  getParkingDetailByPersonIDResponse,
  parkingQueryResponse,
  parkingSpaceNoResponse,
} from '../../libs/fs_parking_client.test';
import { OBError } from '../../../src/utils/error_spec';
import { newErrorHandler } from '../../../src/middlewares/error';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
  app.use(newErrorHandler);
});

describe('V2ParkingTicketController', () => {
  describe('GET v2/parking_tickets', () => {
    describe('find all details', () => {
      it('should return 200', async () => {
        const member = await MemberRepository.create({
          data: {
            uid: 'test',
          },
        });

        jest
          .spyOn(FSParkingClient.httpClient, 'get')
          .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
          .mockResolvedValue({ data: parkingQueryResponse })
          .mockResolvedValue({ data: parkingSpaceNoResponse });

        const response = await request(app).get(`/v2/parking_tickets/all_details`).set('x-account-id', member.uid);
        expect(response.status).toBe(200);
      });

      it('should return 400 account id not found', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'get')
          .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
          .mockResolvedValue({ data: parkingQueryResponse })
          .mockResolvedValue({ data: parkingSpaceNoResponse });

        const response = await request(app).get(`/v2/parking_tickets/all_details`);
        expect(response.status).toStrictEqual(400);
        expect(response.body.error.code).toStrictEqual(OBError.BMS_VAL_001.errorCode);
      });

      it('status 200 Member not found return data null', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'get')
          .mockResolvedValue({ data: getParkingDetailByPersonIDResponse })
          .mockResolvedValue({ data: parkingQueryResponse })
          .mockResolvedValue({ data: parkingSpaceNoResponse });

        const response = await request(app).get(`/v2/parking_tickets/all_details`).set('x-account-id', 'test');

        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual(null);
      });
    });
  });
});
