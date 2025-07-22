import { Decimal } from '../../db/client/runtime/library';
import app from '../../src/app';
import { ReceiptStatus } from '../../src/controllers/receipts_controller_interface';
import { newErrorHandler } from '../../src/middlewares/error';
import ParkingDetailsRepository from '../../src/repositories/parking_details_repository';
import ReceiptRepository from '../../src/repositories/receipts_repository';
import { OBError } from '../../src/utils/error_spec';
import { resetDB } from '../helpers/db';
import request from 'supertest';

const mockReceipts = [
  {
    id: '1',
    image_url: 'https://mockimg1.com',
    status: 'SUCCESS' as ReceiptStatus,
    created_by: 'a@gmail.com',
    updated_by: 'a@gmail.com',
    parking_detail_id: '123',
    merchant_name: 'Test Merchant 1',
    transaction_date: '2025-05-15',
    transaction_time: '20:22',
    total: new Decimal(100),
    tax_id: 'TAX-123',
    receipt_no: 'RCPT-1',
    address: 'Bangkok',
    unit_no: 'Unit-1',
    mall_name: 'Mock Mall A',
    message: 'valid',
    uid: 'mock-uid-1',
    content: {
      merchant_name: 'Test Merchant 1',
      total: '100.00',
    },
  },
  {
    id: '2',
    image_url: 'https://mockimg2.com',
    status: 'SUCCESS' as ReceiptStatus,
    created_by: 'b@gmail.com',
    updated_by: 'b@gmail.com',
    parking_detail_id: '123',
    merchant_name: 'Test Merchant 2',
    transaction_date: '2025-05-16',
    transaction_time: '21:15',
    total: new Decimal(150),
    tax_id: 'TAX-456',
    receipt_no: 'RCPT-2',
    address: 'Chiang Mai',
    unit_no: 'Unit-2',
    mall_name: 'Mock Mall B',
    message: 'valid',
    uid: 'mock-uid-2',
    content: {
      merchant_name: 'Test Merchant 2',
      total: '150.00',
    },
  },
];

beforeEach(async () => {
  await resetDB();

  await ParkingDetailsRepository.create({
    data: {
      id: '123',
      status: 'ACTIVE',
      uid: '1234',
      account_id: '1',
      plate_no: '1234',
    },
  });

  app.use(newErrorHandler);
});

afterEach(async () => {
  await resetDB();
});

describe('ReceiptsController', () => {
  describe('POST /create-receipt', () => {
    it('should return 400 an account-id is not found', async () => {
      const res = await request(app).post('/receipt/create-receipt').send({
        parkingDetailId: '123',
        imageUrl: 'https://mockimg',
        email: 'a@gmail.com',
      });

      expect(res.body.error.code).toStrictEqual(OBError.PK_ACC_001.errorCode);
      expect(res.status).toBe(400);
    });
    it('should return 200 ok', async () => {
      const res = await request(app)
        .post('/receipt/create-receipt')
        .send({
          parkingDetailId: '123',
          imageUrl: 'https://mockimg',
          email: 'a@gmail.com',
        })
        .set('x-account-id', '1234');

      expect(res.body).toBe(true);
      expect(res.status).toBe(200);
    });

    it('should return 200 ok', async () => {
      const res = await request(app)
        .post('/receipt/create-receipt')
        .send({
          parkingDetailId: '123',
          imageUrl: 'https://mockimg',
        })
        .set('x-account-id', '1234');

      expect(res.body).toBe(true);
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /update-receipt', () => {
    it('should return 200 ok', async () => {
      await ReceiptRepository.create({
        data: {
          id: '12345',
          image_url: 'https://mockimg',
          status: 'SUCCESS',
          created_by: 'a@gmail.com',
          updated_by: 'a@gmail.com',
          parking_detail: {
            connect: {
              id: '123',
            },
          },
        },
      });

      const res = await request(app)
        .patch('/receipt/update-receipt')
        .send({
          id: '12345',
          merchant_name: 'test1',
          transaction_date: '2025-05-15',
          transaction_time: '20:22',
          items: [
            {
              total_price: new Decimal(100),
              description: 'ice cream',
              quantity: 1,
            },
          ],
          total: new Decimal(100),
          tax_id: '123',
          receipt_no: '1234',
          address: 'bangkok',
          unit_no: '1234',
          mall_name: 'test',
          hashed_receipt: 'jdaoiwj123',
          status: 'SUCCESS',
          message: 'valid',
        });

      const receipt = await ReceiptRepository.findUnique({
        where: {
          id: '12345',
        },
        include: {
          items: true,
        },
      });

      const parkingDetail = await ParkingDetailsRepository.findUnique({
        where: {
          id: '123',
        },
      });

      expect(res.body).toEqual(true);
      expect(res.status).toBe(200);
      expect(receipt?.items).toHaveLength(1);
      expect(parkingDetail?.total_amount).toEqual(new Decimal(100));
    });

    it('should return 400 cannot find receipt', async () => {
      await ReceiptRepository.create({
        data: {
          id: '12345',
          image_url: 'https://mockimg',
          status: 'SUCCESS',
          created_by: 'a@gmail.com',
          updated_by: 'a@gmail.com',
          parking_detail: {
            connect: {
              id: '123',
            },
          },
        },
      });
      const res = await request(app)
        .patch('/receipt/update-receipt')
        .send({
          id: '2222',
          merchant_name: 'test1',
          transaction_date: '2025-05-15', // Format: YYYY-MM-DD
          transaction_time: '20:22', // Format: HH:mm (local time GMT+7)
          items: [],
          total: new Decimal(0), // Total price as string
          tax_id: '123',
          receipt_no: '1234',
          address: 'bangkok',
          unit_no: '1234',
          mall_name: 'test',
          hashed_receipt: 'jdaoiwj123',
          status: 'SUCCESS',
          message: 'valid',
        });

      expect(res.body.error.code).toStrictEqual(OBError.PK_RX_001.errorCode);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /all', () => {
    it('should return 200 ok with data', async () => {
      await ReceiptRepository.createMany({
        data: mockReceipts,
      });

      const res = await request(app).get('/receipt/all?id=2&user_id=1');

      expect(res.body[0].id).toBe(mockReceipts[1].id);
      expect(res.status).toBe(200);
    });

    it('should return 200 ok with empty data', async () => {
      await ReceiptRepository.createMany({
        data: mockReceipts,
      });

      const res = await request(app).get('/receipt/all?id=1234');
      expect(res.body).toEqual([]);
      expect(res.status).toBe(200);
    });

    it('should return 200 ok with data', async () => {
      await ReceiptRepository.createMany({
        data: mockReceipts,
      });

      const res = await request(app).get(
        '/receipt/all?id=1&content=merchant_name:Test Merchant 1|total:100.00'
      );
      expect(res.body[0].id).toBe(mockReceipts[0].id);
      expect(res.body[0].content).toHaveProperty(
        'merchant_name',
        'Test Merchant 1'
      );
      expect(res.body[0].content).toHaveProperty('total', '100.00');
      expect(res.status).toBe(200);
    });
  });
});
