import app from '../../src/app';
import request from 'supertest';
import FSParkingClient from '../../src/libs/fs_parking_client';
import { resetDB } from '../helpers/db';
import { newErrorHandler } from '../../src/middlewares/error';
import { OBError } from '../../src/utils/error_spec';
import ParkingDetailsRepository from '../../src/repositories/parking_details_repository';
import { Prisma } from '../../db/client';
import TCCClient from '../../src/libs/tcc_client';
import { AxiosHeaders } from 'axios';
import { GetParkingDetailsIndexResponse } from '../../src/controllers/parking_detail_controller.interfaces';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import ReceiptRepository from '../../src/repositories/receipts_repository';
import CampaignRepository from '../../src/repositories/campaign_repository';
import RedeemRepository from '../../src/repositories/redeem_repository';
import ReceiptRedeemRepository from '../../src/repositories/receipt_redeem_repository';
import ParkingDetailService from '../../src/services/parking_detail_service';

import BMSClient from '../../src/libs/bms_client';
import IAMClient from '../../src/libs/iam_client';
import { ReceiptStatus } from '../../src/controllers/receipts_controller_interface';
import { Decimal } from '../../db/client/runtime/library';
import { ParkingDetailStatus } from '../../db/client/index';
const mockGetParkingDetailByQRCode = {
  data: {
    message: 'success',
    status: 200,
    data: [
      {
        status: 'success',
        message: 'Parking transaction retrieved successfully.',
        exeption: null,
        logId: '22123456789',
        ticketNo: 'TCK987654321',
        ticketUid: 'UID123456789ABC',
        plateNo: 'ABC-1234',
        entryDateTime: '2025-05-13T08:15:00Z',
        logDateTime: '2025-05-13T10:45:00Z',
        exitStatus: 0,
        terminalInId: 101,
        terminalInName: 'Entrance Gate 1',
        memberTypeId: 2,
        memberTypeName: 'Regular',
        vehicleTypeId: 1,
        vehicleTypeName: 'Sedan',
        rateCode: 'R001',
        rateDetailTH: 'อัตราค่าจอดทั่วไป',
        rateDetailEN: 'Standard Parking Rate',
        tenantId: 'TENANT001',
        tenantName: 'Central Plaza',
        isCardLost: false,
        parkHH: 2,
        parkMM: 30,
        rateHH: 1,
        freeHH: 0,
        subTotal: 60.0,
        discount: 10.0,
        parkFee: 50.0,
        cardLostFine: 0.0,
        overNightFine: 0.0,
        total: 50.0,
        isInv: true,
        invRateHH: 1,
        invFee: 50.0,
        isPayAtKiosk: true,
        lastDateTimePaymentAtKiosk: '2025-05-13T10:44:00Z',
        payAtKioskAll: 50.0,
        durationInMinute: 150,
        timeUsedInMinute: 145,
        remainInMinute: 5,
      },
    ],
  },
};

const mockCampaignsData = {
  data: [
    {
      price_min: 0,
      price_max: 199.99,
      redeem_hour: 2,
      rate_code: 'new rate 1',
    },
    {
      price_min: 200,
      price_max: 399.99,
      redeem_hour: 2,
      rate_code: 'new rate 2',
    },
    {
      price_min: 400,
      price_max: 599.99,
      redeem_hour: 4,
      rate_code: 'new rate 3',
    },
    {
      price_min: 600,
      redeem_hour: 8,
      rate_code: 'new rate 4',
    },
  ],
};

const mockReceiptData = [
  {
    id: '1',
    total: new Decimal(100),
    image_url: 'https://mockimg',
    status: ReceiptStatus.SUCCESS,
    created_by: 'a@gmail.com',
    updated_by: 'a@gmail.com',
    parking_detail_id: 'test1',
    uid: '11111',
  },
  {
    id: '2',
    total: new Decimal(150),
    image_url: 'https://mockimg',
    status: ReceiptStatus.PENDING,
    created_by: 'a@gmail.com',
    updated_by: 'a@gmail.com',
    parking_detail_id: 'test1',
    uid: '22222',
  },
  {
    id: '3',
    total: new Decimal(500),
    image_url: 'https://mockimg',
    status: ReceiptStatus.SUCCESS,
    created_by: 'a@gmail.com',
    updated_by: 'a@gmail.com',
    parking_detail_id: 'test2',
    uid: '33333',
  },
];

const MOCK_PARKING_DETAIL =  {
  id: "2345",
  uid: "234523452345",
  meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data[0]),
  status: "ACTIVE" as ParkingDetailStatus,
  created_at: new Date(),
  updated_at: new Date(),
  plate_no: "2345",
};

beforeEach(async () => {
  jest.restoreAllMocks();

  await resetDB();
  app.use(newErrorHandler);
});

afterEach(async () => {
  jest.restoreAllMocks();

  await resetDB();
});

describe('ParkingDetailController', () => {
  describe('POST /add-parking-ticket', () => {
    const defaultEnableShopper = process.env.ENABLE_SHOPPER;
    const createdParkingDeatail = {
      uid: '22123456789',
      meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
      account_id: null,
      email: null,
      phone: null,
      username: null,
      total_amount: new Decimal(0),
      redeemed_at: null,
      status: 'ACTIVE',
      plate_no: 'ABC-1234',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const mockMembersShowResponse = {
      status: 1,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: {
        data: [
          {
            id: '1234',
            uid: '5555',
            account_id: '2222',
            metadata: '',
            defaultFloor: '',
            outdoor: [],
            passed_turnstile: true,
            passes: [],
            towers: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
    };

    const mockGetOauth2Token = {
      status: 1,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: {
        access_token: '',
        expires_in: 9999999,
        token_type: '',
      },
    };

    beforeEach(() => {
      process.env.ENABLE_SHOPPER = defaultEnableShopper;
    });

    afterEach(() => {
      process.env.ENABLE_SHOPPER = defaultEnableShopper;
    });

    describe('add-parking-ticket with id_type = log_id', () => {
      it('should return 200 OK without account detail', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail?.uid).toBe('22123456789');
        expect(parkingDetail).toMatchObject(createdParkingDeatail);
      });

      it('should return 200 OK with account detail phone', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        jest.spyOn(IAMClient, 'accountShow').mockResolvedValueOnce({
          data: {
            account: {
              device: {
                id: '111',
              },
              identity: [
                {
                  created_at: '2025-03-19T06:27:39.005Z',
                  default: true,
                  id: '123456789',
                  identifier: '+66955555555',

                  meta: {
                    country_code: '+66',
                    identifier: '+66955555555',
                  },
                  provider: 'phone',
                  updated_at: '2025-03-19T06:27:39.005Z',
                },
              ],
              isDeleted: null,
              profile: {
                account_id: '1234',
                created_at: '2025-03-19T06:27:39.005Z',
                dob: '1999-01-01T00:00:00.000Z',
                first_name: 'John',
                gender: 'prefernottosay',
                id: '8888',
                last_name: 'Smith',
                updated_at: '2025-03-19T06:27:39.005Z',
              },
            },
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=APP&id_type=log_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail?.uid).toBe('22123456789');
        expect(parkingDetail).toMatchObject({
          ...createdParkingDeatail,
          account_id: '1234',
          username: 'John Smith',
          phone: '+66955555555',
          email: '',
        });
      });

      it('should return 200 OK with account detail email', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        jest.spyOn(IAMClient, 'accountShow').mockResolvedValueOnce({
          data: {
            account: {
              device: {
                id: '111',
              },
              identity: [
                {
                  created_at: '2025-03-19T06:27:39.005Z',
                  default: true,
                  id: '123456789',
                  identifier: 'test@gmail.com',

                  meta: {
                    identifier: 'test@gmail.com',
                  },
                  provider: 'email',
                  updated_at: '2025-03-19T06:27:39.005Z',
                },
              ],
              isDeleted: null,
              profile: {
                account_id: '1234',
                created_at: '2025-03-19T06:27:39.005Z',
                dob: '1999-01-01T00:00:00.000Z',
                first_name: 'John',
                gender: 'prefernottosay',
                id: '8888',
                last_name: 'Smith',
                updated_at: '2025-03-19T06:27:39.005Z',
              },
            },
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=APP&id_type=log_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail?.uid).toBe('22123456789');
        expect(parkingDetail).toMatchObject({
          ...createdParkingDeatail,
          account_id: '1234',
          username: 'John Smith',
          phone: '',
          email: 'test@gmail.com',
        });
      });

      it('should return 200 OK with account detail null', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        jest.spyOn(IAMClient, 'accountShow').mockResolvedValueOnce({
          data: null,
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=APP&id_type=log_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail?.uid).toBe('22123456789');
        expect(parkingDetail).toMatchObject({
          ...createdParkingDeatail,
          account_id: null,
          username: null,
          phone: null,
          email: null,
        });
      });

      it('should return 400 with Account not found', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        jest.spyOn(IAMClient, 'accountShow').mockRejectedValueOnce({
          response: {
            status: 400,
            data: {
              error: {
                message: 'error',
              },
            },
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=APP&id_type=log_id'
          )
          .set('x-account-id', '1234');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_IAM_001.errorCode);
      });

      it('should return 400 Duplicate parking detail logId.', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);
        await ParkingDetailsRepository.create({
          data: {
            id: '1234',
            uid: '22123456789',
            meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data[0]),
            status: 'ACTIVE',
            created_at: new Date(),
            updated_at: new Date(),
            plate_no: '1234',
          },
        });

        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '1234');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_004.errorCode);
      });

      it('should return 400 an account-id is not found', async () => {
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_ACC_001.errorCode);
      });

      it('should return 400 cannot find parking ticket, no active parking ticket', async () => {
        jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValueOnce({
          data: {
            message: 'success',
            status: 200,
            data: [
              {
                logId: '22123456789',
                exitStatus: 1,
              },
            ],
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '1234');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_FS_001.errorCode);
      });

      it('should return 400 cannot find parking ticket, getParkingDetailByQRCode error', async () => {
        jest.spyOn(FSParkingClient.httpClient, 'post').mockRejectedValueOnce({
          response: {
            data: {
              error: 'error',
            },
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '1234');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_FS_001.errorCode);
      });

      it('should return 400 cannot create parking detail', async () => {
        jest
          .spyOn(FSParkingClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        jest.spyOn(ParkingDetailsRepository, 'create').mockResolvedValueOnce({
          id: '',
          record_id: '1234',
          uid: '1234',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          plate_no: '1234',
          created_at: new Date(),
          updated_at: new Date(),
          account_id: null,
          email: null,
          phone: null,
          username: null,
          total_amount: new Decimal(0),
          redeemed_at: null,
          rate_details: null,
        });

        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=log_id'
          )
          .set('x-account-id', '1234');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_001.errorCode);
      });
    });

    describe('add-parking-ticket with id_type = member_id', () => {
      it('should return 200 OK with enable shoper is true', async () => {
        process.env.ENABLE_SHOPPER = 'true';
        jest
          .spyOn(OB_BMS_SDK.client, 'membersShow')
          .mockResolvedValueOnce(mockMembersShowResponse);

        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);

        jest
          .spyOn(TCCClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail).toMatchObject(createdParkingDeatail);
      });

      it('should return 200 OK with member data is null & enable shoper is true', async () => {
        process.env.ENABLE_SHOPPER = 'true';
        jest.spyOn(OB_BMS_SDK.client, 'membersShow').mockResolvedValueOnce({
          status: 1,
          statusText: '',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {
            data: null,
          },
        });

        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);

        jest
          .spyOn(TCCClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail).toMatchObject(createdParkingDeatail);
      });

      it('should return 200 OK with enable shopper is true and member not found', async () => {
        process.env.ENABLE_SHOPPER = 'true';
        jest.spyOn(BMSClient, 'membersShow').mockRejectedValueOnce({
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: {
              error: {
                code: 'BMS_MEMB_003',
                message: 'Member not found',
              },
            },
          },
        });
        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);
        jest
          .spyOn(TCCClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=1234&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '1234');

        const parkingDetail = await ParkingDetailsRepository.findUnique({
          where: {
            uid: '22123456789',
          },
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          parkingDetailId: expect.any(String),
        });
        expect(parkingDetail).toMatchObject(createdParkingDeatail);
      });

      it('should return 400 Member not found with enable shopper is false & member data is null', async () => {
        process.env.ENABLE_SHOPPER = 'false';
        jest.spyOn(OB_BMS_SDK.client, 'membersShow').mockResolvedValueOnce({
          status: 1,
          statusText: '',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {
            data: null,
          },
        });
        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);
        jest
          .spyOn(TCCClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '9999');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_BMS_002.errorCode);
      });
      it('should return 400 with Duplicate parking detail logId', async () => {
        jest
          .spyOn(OB_BMS_SDK.client, 'membersShow')
          .mockResolvedValueOnce(mockMembersShowResponse);
        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);
        jest
          .spyOn(TCCClient.httpClient, 'post')
          .mockResolvedValueOnce(mockGetParkingDetailByQRCode);

        await ParkingDetailsRepository.create({
          data: {
            id: '1234',
            uid: '22123456789',
            meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data[0]),
            status: 'ACTIVE',
            created_at: new Date(),
            updated_at: new Date(),
            plate_no: '1234',
          },
        });
        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '9999');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_004.errorCode);
      });
      it('should return 400 with getParkingDetailByPersonID error', async () => {
        jest
          .spyOn(OB_BMS_SDK.client, 'membersShow')
          .mockResolvedValueOnce(mockMembersShowResponse);
        jest
          .spyOn(TCCClient, 'getOauth2Token')
          .mockResolvedValueOnce(mockGetOauth2Token);
        jest.spyOn(TCCClient.httpClient, 'post').mockRejectedValueOnce({
          response: {
            data: {
              error: 'error',
            },
          },
        });

        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=22123456789&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '9999');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_FS_001.errorCode);
      });

      it('should return 400 member not found with enable shopper is false', async () => {
        process.env.ENABLE_SHOPPER = 'false';
        jest.spyOn(BMSClient, 'membersShow').mockRejectedValueOnce({
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: {
              error: {
                code: 'BMS_MEMB_003',
                message: 'Member not found',
              },
            },
          },
        });

        const res = await request(app)
          .post(
            '/parking-details/add-parking-ticket?id=1234&platform=CMS&id_type=member_id'
          )
          .set('x-account-id', '9999');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toStrictEqual(OBError.PK_BMS_002.errorCode);
      });
    });
  });

  describe('GET /{id}', () => {
    it('should return 200 OK', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '22123456789',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
          username: 'John Smith',
          account_id: '1234',
          phone: '+66955555555',
          email: '',
          total_amount: new Decimal(100),
          receipts: {
            create: [
              {
                id: '1',
                image_url: 'https://mockimg',
                total: new Decimal(100),
                status: ReceiptStatus.SUCCESS,
                created_by: 'test@gmail.com',
                updated_by: 'test@gmail.com',
              },
            ],
          },
        },
      });

      const res = await request(app).get('/parking-details/1234');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1234');
      expect(res.body.data.account_detail.username).toBe('John Smith');
      expect(res.body.data.account_detail.phone).toBe('+66955555555');
      expect(res.body.pagination.total_page).toBe(1);
    });

    it('should return 200 OK without account detail', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '22123456789',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
          account_id: null,
          phone: null,
          email: null,
          username: null,
        },
      });

      const res = await request(app).get('/parking-details/1234');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1234');
      expect(res.body.data.account_detail.username).toBe('');
      expect(res.body.data.account_detail.phone).toBe('');
      expect(res.body.data.account_detail.id).toBe('');
      expect(res.body.data.account_detail.email).toBe('');
      expect(res.body.pagination.total_page).toBe(0);
    });

    it('should return 200 OK without account detail', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '22123456789',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
          account_id: null,
          phone: null,
          email: 'test@gmail.com',
          username: 'John Smith',
        },
      });

      const res = await request(app).get('/parking-details/1234');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1234');
      expect(res.body.data.account_detail.username).toBe('John Smith');
      expect(res.body.data.account_detail.phone).toBe('');
      expect(res.body.data.account_detail.id).toBe('');
      expect(res.body.data.account_detail.email).toBe('test@gmail.com');
      expect(res.body.pagination.total_page).toBe(0);
    });

    it('should return 400 Parking detail not found', async () => {
      const res = await request(app).get('/parking-details/1234');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_002.errorCode);
    });
  });

  describe('GET /', () => {
    it('should return 200 OK', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '22123456789',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
        },
      });

      const res = await request(app).get('/parking-details');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should return 200 OK with pagination', async () => {
      for (let i = 0; i < 10; i++) {
        await ParkingDetailsRepository.create({
          data: {
            uid: `22123456789-${i}`,
            meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
            status: 'ACTIVE',
            created_at: new Date(),
            updated_at: new Date(),
            plate_no: '1234',
            id: `1234-${i}`,
          },
        });
      }

      const res = await request(app)
        .get('/parking-details?page_number=1&page_size=5')
        .set('x-account-id', '1234');

      expect(res.status).toBe(200);
      expect(res.body.pagination.total).toBe(10);
      expect(res.body.pagination.page_number).toBe(1);
      expect(res.body.pagination.page_size).toBe(5);
    });

    it('should return 200 OK with filter by username', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '1234',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
          username: 'test',
        },
      });

      const res = await request(app).get('/parking-details?filter_by=test');

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(
        res.body.data.every(
          (parking: GetParkingDetailsIndexResponse) =>
            parking.account_detail.username === 'test'
        )
      ).toBe(true);
    });

    it('should return 200 OK with filter by date range', async () => {
      const insideRange = new Date('2025-05-20T00:00:00Z');
      const outsideRange = new Date('2025-04-20T00:00:00Z');
      await ParkingDetailsRepository.createMany({
        data: [
          {
            uid: '1234',
            meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
            status: 'ACTIVE',
            created_at: insideRange,
            updated_at: insideRange,
            plate_no: '1234',
            id: '1234',
            username: 'test',
          },
          {
            uid: '9999',
            meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
            status: 'ACTIVE',
            created_at: outsideRange,
            updated_at: outsideRange,
            plate_no: '5555',
            id: '9999',
            username: 'test2',
          },
        ],
      });

      const res = await request(app).get(
        '/parking-details?startDate=2025-05-20T00:00:00Z&endDate=2025-05-20T00:00:00Z'
      );

      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe('1234');
    });

    it('shoud return 200 OK with empty data', async () => {
      await ParkingDetailsRepository.create({
        data: {
          uid: '1234',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: '1234',
          id: '1234',
          username: 'test',
        },
      });
      const res = await request(app).get('/parking-details?filter_by=ABC-1234');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('Post /{log_id}/redeem', () => {
    const originalRedeemerId = process.env.REDEEMER_ID;

    beforeEach(async () => {
      process.env.REDEEMER_ID = originalRedeemerId;

      await ParkingDetailsRepository.createMany({
        data: [
          {
            id: 'test1',
            status: 'ACTIVE',
            uid: 'LOG1234',
            account_id: '1',
            plate_no: '1234',
            total_amount: new Decimal(100),
          },
          {
            id: 'test2',
            status: 'ACTIVE',
            uid: 'LOG5432',
            account_id: '2',
            plate_no: '8888',
            total_amount: new Decimal(500.0),
          },
        ],
      });

      await ReceiptRepository.createMany({
        data: [...mockReceiptData],
      });

      await CampaignRepository.createMany({
        data: mockCampaignsData.data.map((campaign, index) => ({
          id: index.toString(),
          sequence: index,
          price_min: campaign.price_min,
          price_max: campaign?.price_max,
          redeem_hour: campaign.redeem_hour,
          rate_code: campaign.rate_code,
        })),
      });
    });

    afterEach(() => {
      process.env.REDEEMER_ID = originalRedeemerId;
    });

    it('should return 200 ok', async () => {
      jest
        .spyOn(OB_BMS_SDK.client, 'parkingTicketsRedeem')
        .mockResolvedValueOnce({
          status: 1,
          statusText: '',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {
            data: {
              id: 'LOG1234',
              plate_number: 'XYZ-9876',
              ticket_number: 'TICKET-4567',
              vehicle_type: 'Sedan',
              total_fee: 150.0,
              parked_at: '2025-06-11T08:30:00Z',
              rate_detail: {
                en: 'aaa',
                th: 'daw',
              },
              member_type_id: 2,
              vehicle_type_id: 1,
              sub_code: 'SUB-001',
            },
          },
        });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      const parkingDetail = await ParkingDetailsRepository.findUnique({
        where: {
          id: 'test1',
        },
      });

      const redeemData = await RedeemRepository.findMany({
        where: {
          parking_detail_id: 'test1',
        },
        include: {
          ReceiptRedeem: true,
        },
      });

      const receipt = await ReceiptRepository.findMany({
        where: {
          id: redeemData[0].ReceiptRedeem[0].receipt_id,
        },
        select: {
          status: true,
        },
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'LOG1234');
      expect(parkingDetail?.total_amount).toEqual(new Decimal(100));
      expect(redeemData).toHaveLength(1);
      expect(redeemData[0].ReceiptRedeem).toHaveLength(1);
      expect(receipt[0].status).toStrictEqual(ReceiptStatus.REDEEMED);
    });

    it('should return 200 with duplicate receipt', async () => {
      jest
        .spyOn(OB_BMS_SDK.client, 'parkingTicketsRedeem')
        .mockResolvedValueOnce({
          status: 1,
          statusText: '',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {
            data: {
              id: 'LOG1234',
              plate_number: 'XYZ-9876',
              ticket_number: 'TICKET-4567',
              vehicle_type: 'Sedan',
              total_fee: 150.0,
              parked_at: '2025-06-11T08:30:00Z',
              rate_detail: {
                en: 'aaa',
                th: 'daw',
              },
              member_type_id: 2,
              vehicle_type_id: 1,
              sub_code: 'SUB-001',
            },
          },
        });

      await ReceiptRepository.createMany({
        data: [
          {
            total: new Decimal(100),
            image_url: 'https://mockimg',
            status: ReceiptStatus.DUPLICATED,
            created_by: 'a@gmail.com',
            updated_by: 'a@gmail.com',
            parking_detail_id: 'test1',
            uid: '11111',
          },
          {
            id: '9',
            total: new Decimal(150),
            image_url: 'https://mockimg',
            status: ReceiptStatus.SUCCESS,
            created_by: 'a@gmail.com',
            updated_by: 'a@gmail.com',
            parking_detail_id: 'test2',
            uid: '11111',
          },
        ],
      });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      const parkingDetail = await ParkingDetailsRepository.findUnique({
        where: {
          id: 'test1',
        },
      });

      const redeemData = await RedeemRepository.findMany({
        where: {
          parking_detail_id: 'test1',
        },
        include: {
          ReceiptRedeem: true,
        },
      });

      const receipt = await ReceiptRepository.findMany({
        where: {
          id: redeemData[0].ReceiptRedeem[0].receipt_id,
        },
        select: {
          status: true,
        },
      });

      const duplicateReceipt = await ReceiptRepository.findUnique({
        where: {
          id: '9',
        },
      });

      expect(duplicateReceipt?.status).toEqual(ReceiptStatus.DUPLICATED);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'LOG1234');
      expect(parkingDetail?.total_amount).toEqual(new Decimal(100.0));
      expect(redeemData).toHaveLength(1);
      expect(redeemData[0].ReceiptRedeem).toHaveLength(1);
      expect(receipt[0].status).toStrictEqual(ReceiptStatus.REDEEMED);
    });

    it('should return 400 RedeemerId not found.', async () => {
      process.env.REDEEMER_ID = '';

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_005.errorCode);
    });

    it('should return 400 Parking detail not found', async () => {
      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: '2222',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_002.errorCode);
    });

    it('should return 400 RateCode not found', async () => {
      await CampaignRepository.update({
        where: {
          id: '0',
        },
        data: {
          price_min: 105,
        },
      });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.CF_CP_003.errorCode);
    });

    it('should return 400 No redeemable receipts found.', async () => {
      await ReceiptRepository.updateMany({
        where: {
          parking_detail_id: 'test1',
        },
        data: {
          status: 'PENDING',
        },
      });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_RX_003.errorCode);
    });

    it('should return 400 Redeem parking failed, receive error', async () => {
      jest
        .spyOn(OB_BMS_SDK.client, 'parkingTicketsRedeem')
        .mockRejectedValueOnce({
          response: {
            status: 400,
            data: {
              error: 'Redeem failed',
            },
          },
        });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_BMS_001.errorCode);
    });

    it('should return 400 Redeem parking failed, data null', async () => {
      jest
        .spyOn(OB_BMS_SDK.client, 'parkingTicketsRedeem')
        .mockResolvedValueOnce({
          status: 1,
          statusText: '',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {
            data: null,
          },
        });

      const res = await request(app)
        .post('/parking-details/LOG1234/redeem')
        .send({
          parking_detail_id: 'test1',
          type: 'REDEEM',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toStrictEqual(OBError.PK_PKD_003.errorCode);
    });
  });

  describe('updateTotalAmount', () => {
    it('should return 200 OK and update total amount', async () => {
      const parkingService = new ParkingDetailService();

      await ParkingDetailsRepository.create({
        data: {
          uid: '12345',
          meta: JSON.stringify(mockGetParkingDetailByQRCode.data.data),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date(),
          plate_no: 'ABC-1234',
          id: 'test1',
          total_amount: new Decimal(0),
        },
      });

      await ReceiptRepository.createMany({
        data: [
          {
            id: '1',
            total: new Decimal(100),
            image_url: 'https://mockimg',
            status: ReceiptStatus.SUCCESS,
            created_by: 'a@gmail.com',
            updated_by: 'a@gmail.com',
            parking_detail_id: 'test1',
          },
          {
            id: '2',
            total: new Decimal(150),
            image_url: 'https://mockimg',
            status: ReceiptStatus.PENDING,
            created_by: 'a@gmail.com',
            updated_by: 'a@gmail.com',
            parking_detail_id: 'test1',
          },
        ],
      });

      await parkingService.updateTotalAmount('test1');

      const parkingDetail = await ParkingDetailsRepository.findUnique({
        where: {
          id: 'test1',
        },
        include: {
          receipts: true,
        },
      });

      expect(parkingDetail?.total_amount).toEqual(new Decimal(100));
    });
  });

  describe("GET /parking-details/uid/:uid", () => {
    beforeEach(async () => {
      await ParkingDetailsRepository.create({
        data: MOCK_PARKING_DETAIL,
      });
    });

    it("should return 200 with parking details", async () => {
      const res = await request(app).get("/parking-details/uid/234523452345");

      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(MOCK_PARKING_DETAIL.id);
      expect(res.body.uid).toEqual(MOCK_PARKING_DETAIL.uid);
    });

    it("should return 400 with error message", async () => {
      const res = await request(app).get("/parking-details/uid/no-data");

      expect(res.status).toBe(400);
      expect(res.body.error.message).toEqual(OBError.PK_PKD_002.message);
    });
  });
});
