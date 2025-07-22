import { PaymentService, WebhookService } from '../../src/services';
import MemberRepository from '../../src/repositories/member_repository';
import { WEBHOOK_TYPE } from '../../src/services/constants/webhook_type';
import { resetDB } from '../helpers/db';
import { WebhookCreateBody } from '../../src/controllers/integrations/fs/webhook_controller_interface';
import { EventProducer } from '../../src/utils/kafka';
import logging from '../../src/utils/logging';
import { createTestData } from '../fixtures';
import FSParkingClient from '../../src/libs/fs_parking_client';
import { getParkingDetailByPersonIDResponse } from '../libs/fs_parking_client.test';

jest.mock('../../src/utils/kafka/event_producer');
let webhookService: WebhookService;

let spyOne: any;
let spyTwo: any;
let Data: any;
afterEach(() => {
  spyOne && spyOne.mockRestore();
  spyTwo && spyTwo.mockRestore();
});

beforeEach(async () => {
  await resetDB();
  Data = await createTestData();
  webhookService = new WebhookService();
});

describe('WebhookService', () => {
  describe('Webhook service call lift', () => {
    it('should call to ob-webhook success', async () => {
      spyOne = jest
        .spyOn(webhookService.iamClient, 'get')
        .mockResolvedValueOnce({ data: { data: { account: { device: { id: '123' } } } } });
      spyTwo = jest.spyOn(webhookService.wsClient, 'post').mockResolvedValueOnce({});

      await MemberRepository.create({ data: { uid: '111', metadata: {}, account_id: '123' } });
      await webhookService.handle({
        action: WEBHOOK_TYPE.CALL_LIFT,
        payload: {
          personID: '111',
          liftName: 'string',
          floorName: 'string',
          towerName: 'test',
        },
      });
    });

    it('should call to ob-webhook not success member not found', async () => {
      spyOne = jest
        .spyOn(webhookService.iamClient, 'get')
        .mockResolvedValueOnce({ data: { data: { account: { device: { id: '123' } } } } });
      spyTwo = jest.spyOn(webhookService.wsClient, 'post').mockResolvedValueOnce({});

      const logSpy = jest.spyOn(logging, 'info').mockImplementation(() => {});

      await webhookService.handle({
        action: WEBHOOK_TYPE.CALL_LIFT,
        payload: {
          personID: '113',
          liftName: 'string',
          floorName: 'string',
          towerName: 'test',
        },
      });

      // Expect the first log statement
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockClear();
    });

    it('should call to ob-webhook not success account id not found', async () => {
      spyOne = jest
        .spyOn(webhookService.iamClient, 'get')
        .mockResolvedValueOnce({ data: { data: { account: { device: { id: '123' } } } } });
      spyTwo = jest.spyOn(webhookService.wsClient, 'post').mockResolvedValueOnce({});
      await MemberRepository.create({ data: { uid: '113', metadata: {} } });

      const logSpy = jest.spyOn(logging, 'info').mockImplementation(() => {});

      await webhookService.handle({
        action: WEBHOOK_TYPE.CALL_LIFT,
        payload: {
          personID: '113',
          liftName: 'string',
          floorName: 'string',
          towerName: 'test',
        },
      });

      // Expect the first log statement
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockClear();
    });

    it('should call to ob-webhook not success device id not found', async () => {
      spyOne = jest
        .spyOn(webhookService.iamClient, 'get')
        .mockResolvedValueOnce({ data: { data: { account: { device: {} } } } });
      spyTwo = jest.spyOn(webhookService.wsClient, 'post').mockResolvedValueOnce({});
      await MemberRepository.create({ data: { uid: '113', metadata: {} } });
      await MemberRepository.create({ data: { uid: '114', metadata: {}, account_id: '114' } });

      const logSpy = jest.spyOn(logging, 'info').mockImplementation(() => {});

      await webhookService.handle({
        action: WEBHOOK_TYPE.CALL_LIFT,
        payload: {
          personID: '114',
          liftName: 'string',
          floorName: 'string',
          towerName: 'test',
        },
      });
      // Expect the first log statement
      expect(logSpy).toHaveBeenCalled();

      logSpy.mockClear();
    });
  });

  describe('Webhook service access-turnstile', () => {
    const mockWebhookBody: WebhookCreateBody = {
      action: WEBHOOK_TYPE.ACCESS_TURNSTILE,
      payload: {
        inviteID: 'xxxxxxxx',
        liftName: '4',
        floorName: '3D',
        towerName: 'test',
      },
    };

    it('should call to ob-webhook method accessTurnstile success', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();
      await webhookService.handle(mockWebhookBody);
    });
  });

  describe('Webhook service error', () => {
    const mockWebhookBody: WebhookCreateBody = {
      action: 'xxxxxxxxx',
      payload: {
        personID: 'xxxx',
        liftName: '4',
        floorName: '3D',
        towerName: 'test',
      },
    };

    it('should call to ob-webhook method handle error', async () => {
      jest.fn().mockRejectedValue(new Error('type mismatch'));

      await expect(webhookService.handle(mockWebhookBody)).rejects.toThrowError();
    });
  });

  describe('Webhook service building access log', () => {
    it('should call to ob-webhook method member access log success', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();
      await webhookService.handle({
        action: WEBHOOK_TYPE.MEMBER_ACCESS,
        payload: [
          {
            transacId: 1,
            transacDatetime: 'string',
            projectID: 1,
            towerID: Data.tower.uid,
            personID: 'string',
            turnstileID: 'string',
            terminalPosition: 1,
          },
        ],
      });
    });

    it('should call to ob-webhook method visitor access log success', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();
      await webhookService.handle({
        action: WEBHOOK_TYPE.VISITOR_ACCESS,
        payload: [
          {
            transacId: 1,
            transacDatetime: 'string',
            projectID: 1,
            towerID: Data.tower.uid,
            inviteID: 'string',
            turnstileID: 'string',
            terminalPosition: 1,
          },
        ],
      });
    });
  });

  describe('Webhook service parking access log', () => {
    it('should call to ob-webhook method member access parking log success', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();
      jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValue({ data: getParkingDetailByPersonIDResponse });

      await webhookService.handle({
        action: WEBHOOK_TYPE.MEMBER_PARKING_ACCESS,
        payload: {
          transacId: 1,
          transacDatetime: 'string',
          personID: 'string',
          terminalID: 'string',
          terminalPosition: 1,
        },
      });
    });

    it('should call to ob-webhook method visitor access parking log success', async () => {
      jest.spyOn(EventProducer, 'send').mockReturnValue();
      jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValue({ data: getParkingDetailByPersonIDResponse });
      await webhookService.handle({
        action: WEBHOOK_TYPE.VISITOR_PARKING_ACCESS,
        payload: {
          transacId: 1,
          transacDatetime: 'string',
          inviteID: 'string',
          terminalID: 'string',
          terminalPosition: 1,
        },
      });
    });
  });

  describe('Webhook service payment paid', () => {
    describe('payment found', () => {
      it('should call to ob-webhook method payment paid success', async () => {
        jest.spyOn(EventProducer, 'send').mockReturnValue();
        const service = new PaymentService();
        const payment = await service.create({
          parkingReservationId: Data.parkingReservation.id,
          totalAmount: 100,
        });

        await webhookService.handle({
          action: WEBHOOK_TYPE.PAYMENT_PAID,
          payload: {
            invoiceNo: payment.reference_number,
          },
        });

        const confirmedPayment = await service.findByIdOrReferenceNumber(payment.reference_number);

        expect(confirmedPayment?.status).toBe('confirmed');
      });
    });

    describe('payment not found', () => {
      it('should call to ob-webhook method payment paid not found', async () => {
        jest.spyOn(EventProducer, 'send').mockReturnValue();
        const service = new PaymentService();
        await service.create({
          parkingReservationId: Data.parkingReservation.id,
          totalAmount: 100,
        });

        await expect(
          webhookService.handle({
            action: WEBHOOK_TYPE.PAYMENT_PAID,
            payload: {
              invoiceNo: 'xxxx',
            },
          }),
        ).rejects.toThrowError('Payment not found');
      });
    });
  });
});
