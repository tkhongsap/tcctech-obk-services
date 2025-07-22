import axios, { AxiosInstance } from 'axios';
import {
  WebhookCreateBody,
  WebhookPaymentPaidPayload,
  liftCalledPayload,
  memberAccessLog,
  parkingMemberAccessLog,
  parkingVisitorAccessLog,
  valetStatusPayload,
  visitorAccessLog,
  visitorPassedPayload,
} from '../controllers/integrations/fs/webhook_controller_interface';
import { MemberRepository, TowerRepository } from '../repositories';
import { get } from 'lodash';
import { WEBHOOK_TYPE } from './constants/webhook_type';
import { EventProducer } from '../utils/kafka';
import PassRepository from '../repositories/pass_repository';
import logging from '../utils/logging';
import BuildingAccessLogRepository from '../repositories/building_access_log_repository';
import { AccessorType, PositionStatus } from '../../db/client/';
import ParkingLogRepository from '../repositories/parking_log_repository';
import FSParkingClient from '../libs/fs_parking_client';
import PaymentService from './payment_service';

export default class WebhookService {
  public iamClient: AxiosInstance;
  public wsClient: AxiosInstance;

  constructor() {
    this.iamClient = axios.create({
      baseURL: process.env.OB_IAM_URL || '',
    });
    this.wsClient = axios.create({
      baseURL: process.env.OB_WEB_SOCKET_URL || '',
    });
  }

  public async handle(body: WebhookCreateBody): Promise<void> {
    logging.info('Received Webhook Body: ', body);
    switch (body.action) {
      case WEBHOOK_TYPE.CALL_LIFT:
        await this.callLift(body);
        break;
      case WEBHOOK_TYPE.ACCESS_TURNSTILE:
        // this.accessTurnstile(body);
        break;
      case WEBHOOK_TYPE.MEMBER_ACCESS:
        // this.logBuildingAccess(body, AccessorType.member);
        console.dir(body, { depth: null });
        break;
      case WEBHOOK_TYPE.VISITOR_ACCESS:
        // this.logBuildingAccess(body, AccessorType.pass);
        console.dir(body, { depth: null });
        break;
      case WEBHOOK_TYPE.MEMBER_PARKING_ACCESS:
        // this.logParkingAccess(body, AccessorType.member);
        console.dir(body, { depth: null });
        break;
      case WEBHOOK_TYPE.VISITOR_PARKING_ACCESS:
        // this.logParkingAccess(body, AccessorType.pass);
        console.dir(body, { depth: null });
        break;
      case WEBHOOK_TYPE.VALET_STATUS_UPDATED:
        this.valetStatusUpdate(body);
        console.dir(body, { depth: null });
        break;
      case WEBHOOK_TYPE.PAYMENT_PAID:
        await this.confirmPayment(body);
        console.dir(body, { depth: null });
        break;
      default:
        throw new Error('type mismatch');
        break;
    }
  }

  private async valetStatusUpdate(body: WebhookCreateBody): Promise<void> {
    try {
      logging.info('start sending message to web socket updated');
      const payload: valetStatusPayload = body.payload as valetStatusPayload;
      const memberResult = await MemberRepository.findFirst({ where: { uid: payload.uid } });
      if (!memberResult) {
        throw new Error('Member not found');
      }
      const accountId = memberResult.account_id;
      if (!accountId) {
        throw new Error('Account id not found');
      }
      const userDevice = await this.iamClient.get(`accounts/${accountId}`);
      const deviceId = get(userDevice, ['data', 'data', 'account', 'device', 'id']);
      if (!deviceId) {
        throw new Error('Device id not found');
      }
      const response = await this.wsClient.post('broadcast', {
        data: {
          type: body.action,
          device_id: deviceId,
          detail: {
            ...payload.detail,
          },
        },
      });
      logging.info(response.data);
    } catch (error) {
      logging.error('failed to send message to webhook : ', error);
    }
  }

  private async confirmPayment(body: WebhookCreateBody): Promise<void> {
    const { invoiceNo: referenceNumber } = body.payload as WebhookPaymentPaidPayload;
    const service = new PaymentService();
    const payment = await service.findByIdOrReferenceNumber(referenceNumber);

    if (!payment) {
      throw new Error('Payment not found');
    }

    logging.info(`Payment found ${referenceNumber}`);
    await service.confirm(payment.id, body.payload);
  }

  private async callLift(body: WebhookCreateBody): Promise<void> {
    try {
      logging.info('start sending message to web socket updated');
      const payload: liftCalledPayload = body.payload as liftCalledPayload;
      const memberResult = await MemberRepository.findFirst({ where: { uid: payload.personID } });

      if (!memberResult) {
        throw new Error('Member not found');
      }
      const accountId = memberResult.account_id;
      if (!accountId) {
        throw new Error('Account id not found');
      }
      const userDevice = await this.iamClient.get(`accounts/${accountId}`);
      const deviceId = get(userDevice, ['data', 'data', 'account', 'device', 'id']);
      if (!deviceId) {
        throw new Error('Device id not found');
      }
      const response = await this.wsClient.post('broadcast', {
        data: {
          type: body.action,
          device_id: deviceId,
          floor_name: payload.floorName,
          lift_name: payload.liftName,
        },
      });
      logging.info(response.data);
    } catch (error) {
      logging.error('failed to send message to webhook : ', error);
    }
  }

  private async accessTurnstile(body: WebhookCreateBody): Promise<void> {
    try {
      const payload: visitorPassedPayload = body.payload as visitorPassedPayload;

      const pass = await PassRepository.findMany({
        where: {
          uid: payload.inviteID,
        },
        include: {
          visitor_schedule: {
            include: {
              visitor: true,
            },
          },
          issuer: true,
        },
      });
      EventProducer.send({
        name: 'ob-bms.visitor.visited',
        payload: {
          pass: pass,
        },
      });
    } catch (error) {
      logging.error('fail producer message : ', error);
    }
  }

  private async logBuildingAccess(body: WebhookCreateBody, type: AccessorType): Promise<void> {
    let payload: memberAccessLog | visitorAccessLog; // Declare payload variable
    let fsAccountId = '';

    const dataArray = Array.isArray(body.payload) ? body.payload : [body.payload];

    for (const data of dataArray) {
      if (type === AccessorType.member) {
        payload = data as memberAccessLog; // Assign value
        fsAccountId = payload.personID;
      } else {
        payload = data as visitorAccessLog; // Assign value
        fsAccountId = payload.inviteID;
      }

      const towerData = await TowerRepository.findFirst({ where: { uid: payload.towerID.toString() } });

      await BuildingAccessLogRepository.create({
        data: {
          uid: data.transacId.toString(),
          fs_account_id: fsAccountId,
          type: type,
          status: data.terminalPosition,
          transaction_date: data.transacDatetime,
          turnstile_id: data.turnstileID,
          data: JSON.parse(JSON.stringify(data)),
          display_tower: towerData?.name,
          display_status: data.terminalPosition === 0 ? 'onsite' : 'leave',
        },
      });
    }
  }

  private async logParkingAccess(body: WebhookCreateBody, type: AccessorType): Promise<void> {
    let payload: parkingMemberAccessLog | parkingVisitorAccessLog; // Declare payload variable
    let identifier = '';
    let plateNumber: string | null = null;
    const dataArray = Array.isArray(body.payload) ? body.payload : [body.payload];
    for (const data of dataArray) {
      if (type === AccessorType.member) {
        payload = data as parkingMemberAccessLog; // Assign value
        identifier = payload.personID;
      } else {
        payload = data as parkingVisitorAccessLog; // Assign value
        identifier = payload.inviteID;
      }
      try {
        logging.info('Initiating Webhook to get parking details for person ID:', identifier);
        const response = await FSParkingClient.getParkingDetailByPersonID(identifier);
        logging.info('Webhook response for FS parking details:', response?.data);
        if (response.data) {
          plateNumber = response.data.data[0].plateNo;
        }
      } catch (error) {
        logging.error('Error retrieving parking details via getParkingDetailByPersonID API:', error);
      }

      await ParkingLogRepository.create({
        data: {
          uid: data.transacId.toString(),
          identifier: identifier,
          type: type,
          status: data.terminalPosition === 0 ? PositionStatus.onsite : PositionStatus.leave,
          transaction_date: data.transacDatetime || '',
          terminal_id: data.terminalID.toString(),
          data: JSON.parse(JSON.stringify(data)),
          plate_number: plateNumber,
        },
      });
    }
  }
}
