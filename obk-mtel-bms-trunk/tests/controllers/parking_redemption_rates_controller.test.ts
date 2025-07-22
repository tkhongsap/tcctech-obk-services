import app from '../../src/app';
import request from 'supertest';
import { resetDB } from '../helpers/db';
import { MemberRepository } from '../../src/repositories';
import FSParkingClient from '../../src/libs/fs_parking_client';
import { checkRedemptionStatusByEmailResponse, getDataRateCodeResponse } from '../libs/fs_parking_client.test';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});

describe('ParkingRedemptionRatesController', () => {
  describe('GET /members/:member_id/parking_redemption_rates', () => {
    it('should return 200', async () => {
      const member = await MemberRepository.create({
        data: {
          uid: 'test',
          metadata: {
            emails: ['test@test.com'],
          },
        },
      });

      jest
        .spyOn(FSParkingClient.httpClient, 'post')
        .mockResolvedValue({
          data: checkRedemptionStatusByEmailResponse,
        })
        .mockResolvedValue({
          data: getDataRateCodeResponse,
        });

      const response = await request(app).get(
        `/members/${member.id}/parking_redemption_rates?member_type_id=0&vehicle_type_id=0`,
      );

      expect(response.status).toBe(200);
    });
  });
});
