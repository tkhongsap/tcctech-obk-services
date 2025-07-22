import { Controller, Get, OperationId, Route, Path, Post, Body, Queries, Query, Header } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import {
  ParkingResidentialTicketsIndexQuery,
  ParkingTicketData,
  ParkingTicketsIndexQuery,
  ParkingTicketsRedeemBody,
  ParkingSpaceDetailAndSpaceDetailData,
  ParkingTicketsRedeemBodyResident,
  ParkingTicketsRedeemBodyResidentV2,
  ImportPhysicalParkingTicketResponse,
  ImportPhysicalParkingTicketBody,
} from './parking_tickets_controller.interfaces';
import { MemberRepository, PassRepository } from '../repositories';
import {
  parkingAllDetailSerializer,
  parkingTicketSerializer,
  parkingTicketsSerializer,
} from './parking_tickets_controller.serializer';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import FSParkingClient from '../libs/fs_parking_client';
import { filter, find, get, isEmpty, parseInt } from 'lodash';
import logging from '../utils/logging';
import ActivityLog from '../utils/activity_log';
import TCCClient, {
  GetTermsAndConditionsResidenceParkingInput,
  GetTermsAndConditionsResidenceParkingResponse,
  UpdateTransactionCarParkBody,
  UpdateTransactionCarParkResponse,
} from '../libs/tcc_client';
import cache from '../libs/cache';
import { PassService } from '../services';
import { syncRoleLogRepository } from '../repositories/sync_role_log';
import { SyncRoleStatus } from '../../db/client/';

@Route('parking_tickets')
export class ParkingTicketsController extends Controller {
  @Get('')
  @OperationId('parking_tickets.index')
  @ActivityLog('parking_tickets.index')
  public async show(
    @Queries() query: ParkingTicketsIndexQuery,
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedResponse<ParkingTicketData[]>> {
    let response;

    try {
      if (query.type === 'member_id') {
        let personId = query.id;
        if (!isEmpty(query.id)) {
          const member = await MemberRepository.findFirst({ where: { id: query.id } });
          if (member) {
            personId = member.uid;
          }
        } else {
          if (process.env.ENABLE_SHOPPER === 'true' && xAccountId) {
            personId = xAccountId;
          }
        }

        logging.info(`getParkingDetailByPersonID body request ${personId}`);
        // moving to use TCCClient
        // response = await FSParkingClient.getParkingDetailByPersonID(personId);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getParkingDetailByPersonID(personId);
        logging.info('getParkingDetailByPersonID data', response?.data);
      }

      if (query.type === 'invite_id') {
        logging.info(`getParkingDetailByPersonID body request ${query.id}`);
        // moving to use TCCClient
        // response = await FSParkingClient.getParkingDetailByPersonID(query.id);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getParkingDetailByPersonID(query.id);
        logging.info('getParkingDetailByPersonID data', response?.data);
      }

      if (query.type === 'log_id') {
        logging.info(`getParkingDetailByQRCode body request ${query.id}`);
        response = await FSParkingClient.getParkingDetailByQRCode(query.id);
        logging.info('getParkingDetailByQRCode data', response?.data);
      }

      // Filter only active parking tickets
      const parkingTickets = filter(response!.data.data, { exitStatus: 0 });

      logging.info('active parking tickets', parkingTickets);
      if (!parkingTickets) throw new CustomError(OBError.BMS_PKT_001);

      this.setStatus(200);
      return { data: parkingTicketsSerializer(parkingTickets) };
    } catch (error) {
      return { data: [] };
    }
  }

  @Get('/residential')
  @OperationId('parking_residential_tickets.index')
  @ActivityLog('parking_residential_tickets.index')
  public async showResidential(
    @Queries() query: ParkingResidentialTicketsIndexQuery,
  ): Promise<WrappedResponse<ParkingTicketData[]>> {
    let response;
    let project_id = undefined;
    let sub_code = undefined;
    try {
      if (query.type === 'member_id') {
        const member = await MemberRepository.findFirst({ where: { id: query.id } });
        if (!member) throw new CustomError(OBError.BMS_MEMB_003);

        const personId = member.uid;
        logging.info('getResidentialParkingDetailByPersonID body request', personId);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getResidentialParkingDetailByPersonID(personId);
        logging.info('getResidentialParkingDetailByPersonID data', response);
      }

      if (query.type === 'invite_id') {
        logging.info('getResidentialParkingDetailByPersonID body request', query.id);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getResidentialParkingDetailByPersonID(query.id);
        logging.info('getResidentialParkingDetailByPersonID data', response);

        const visitor_data = await PassRepository.findFirst({ where: { uid: query.id } });
        if (visitor_data) {
          project_id = JSON.parse(visitor_data.metadata_resident as string).project_id;
          if (project_id == process.env['ONE89_PROJECTID']) {
            sub_code = `${process.env['PREFIX_ONE89']}${process.env['RESIDENT_CARPARKCODE']}`;
          } else if (project_id == process.env['EI8HTEENSEVEN_PROJECTID']) {
            sub_code = `${process.env['PREFIX_EI8HTEENSEVEN']}${process.env['RESIDENT_CARPARKCODE']}`;
          }
        }
      }

      if (query.type === 'ticket_number' || query.type === 'plate_no') {
        logging.info('getResidentialParkingDetail body request', query.id);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getResidentialParkingDetail(query.id);
        logging.info('getResidentialParkingDetail data', response);
      }

      if (query.type === 'log_id') {
        logging.info('getResidentialParkingDetailByQRCode body request', query.id);
        await cache.getSet('TCC_ACCESS_TOKEN', async () => {
          const response = await TCCClient.getOauth2Token();
          return response.data.access_token;
        });
        response = await TCCClient.getResidentialParkingDetailByQRCode(query.id);
        logging.info('getResidentialParkingDetailByQRCode data', response);
      }

      const parkingTickets = filter(response!, { exitStatus: 0 });
      if (!parkingTickets) throw new CustomError(OBError.BMS_PKT_001);

      this.setStatus(200);
      return { data: parkingTicketsSerializer(parkingTickets, sub_code) };
    } catch (error) {
      return { data: [] };
    }
  }

  @Post('{log_id}/redeem-residential')
  @OperationId('parking_residential_tickets.redeem')
  @ActivityLog('parking_residential_tickets.redeem')
  public async redeemResidential(
    @Path('log_id') logId: string,
    @Body() body: ParkingTicketsRedeemBodyResident,
  ): Promise<WrappedResponse<ParkingTicketData>> {
    // const redeemer = await MemberRepository.findFirst({ where: { id: body.redeemer_id } });
    // if (!redeemer) throw new CustomError(OBError.BMS_MEMB_003);
    const remark = get(body, 'remark');

    logging.info('getResidentialParkingDetailByQRCode body request', logId);
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const response = await TCCClient.getResidentialParkingDetailByQRCode(logId);
    logging.info('getResidentialParkingDetailByQRCode data', response);

    const parkingTicket = find(response, { logId });

    const redemptionData = {
      logCarparkID: logId,
      terminalID: parkingTicket!.terminalInId,
      datetimeIn: parkingTicket!.entryDateTime,
      runningNumber: parkingTicket!.ticketNo,
      plateNumber: parkingTicket!.plateNo,
      memberType: parkingTicket!.memberTypeId,
      carType: parkingTicket!.vehicleTypeId,
      tenantID: parseInt(parkingTicket.tenantId),
      spendingValue: '0',
      posValue: '0',
      couponValue: '0',
      rateCode: body.rate_code,
      userID: parkingTicket.userId,
      remark: remark || '-',
    };
    logging.info('redeemParking body request', redemptionData);

    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const redemptionResponse = await TCCClient.redeemParkingResidential(redemptionData);
    logging.info('redeemParking data', redemptionResponse.data);

    if (redemptionResponse.status === 200) {
      this.setStatus(200);
      return { data: parkingTicketSerializer(redemptionResponse.data) };
    } else {
      this.setStatus(422);
      return { data: null };
    }
  }

  @Post('{log_id}/redeem-residential/v2')
  @OperationId('parking_residential_tickets.redeemv2')
  @ActivityLog('parking_residential_tickets.redeemv2')
  public async redeemResidentialV2(
    @Path('log_id') logId: string,
    @Body() body: ParkingTicketsRedeemBodyResidentV2,
  ): Promise<WrappedResponse<ParkingTicketData>> {
    const remark = get(body, 'remark');

    logging.info('getResidentialParkingDetailByQRCode body request', logId);
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const response = await TCCClient.getResidentialParkingDetailByQRCode(logId);
    logging.info('getResidentialParkingDetailByQRCode data', response);

    const parkingTicket = find(response, { logId });

    const redemptionData = {
      logCarparkID: logId,
      terminalID: parkingTicket!.terminalInId,
      datetimeIn: parkingTicket!.entryDateTime,
      runningNumber: parkingTicket!.ticketNo,
      plateNumber: parkingTicket!.plateNo,
      memberType: parkingTicket!.memberTypeId,
      carType: parkingTicket!.vehicleTypeId,
      tenantID: body.residence_id,
      spendingValue: '0',
      posValue: '0',
      couponValue: '0',
      rateCode: body.rate_code,
      userID: body.user_id,
      remark: remark || '-',
    };
    logging.info('redeemParking v2 body request', redemptionData);

    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const redemptionResponse = await TCCClient.redeemParkingResidential(redemptionData);
    logging.info('redeemParking v2 data', redemptionResponse.data);

    if (redemptionResponse.status === 200) {
      this.setStatus(200);
      return { data: parkingTicketSerializer(redemptionResponse.data) };
    } else {
      this.setStatus(422);
      return { data: null };
    }
  }

  @Post('{log_id}/redeem')
  @OperationId('parking_tickets.redeem')
  @ActivityLog('parking_tickets.redeem')
  public async redeem(
    @Path('log_id') logId: string,
    @Body() body: ParkingTicketsRedeemBody,
  ): Promise<WrappedResponse<ParkingTicketData>> {
    const redeemer = await MemberRepository.findFirst({ where: { id: body.redeemer_id } });
    if (!redeemer) throw new CustomError(OBError.BMS_MEMB_003);
    const remark = get(body, 'remark');

    const redeemerFSEmails = get(redeemer, 'metadata.emails', []);
    logging.info('checkRedemptionStatusByEmail body request', redeemerFSEmails);
    const redeemerFSProfile = await FSParkingClient.checkRedemptionStatusByEmail(redeemerFSEmails);
    logging.info('checkRedemptionStatusByEmail data', redeemerFSProfile?.data);

    const { userID, tenantId } = redeemerFSProfile.data.data;
    logging.info('getParkingDetailByQRCode body request', logId);
    const response = await FSParkingClient.getParkingDetailByQRCode(logId);
    logging.info('getParkingDetailByQRCode data', response?.data);

    const parkingTicket = find(response.data.data, { logId });

    const redemptionData = {
      logCarparkID: logId,
      terminalID: parkingTicket!.terminalInId,
      datetimeIn: parkingTicket!.entryDateTime,
      runningNumber: parkingTicket!.ticketNo,
      plateNumber: parkingTicket!.plateNo,
      memberType: parkingTicket!.memberTypeId,
      carType: parkingTicket!.vehicleTypeId,
      tenantID: parseInt(tenantId),
      spendingValue: '0',
      posValue: '0',
      couponValue: '0',
      rateCode: body.rate_code,
      userID: userID,
      remark: remark || '-',
    };
    logging.info('redeemParking body request', redemptionData);

    const redemptionResponse = await FSParkingClient.redeemParking(redemptionData);
    logging.info('redeemParking data', redemptionResponse.data);

    if (redemptionResponse.data.status === 0) {
      const redeemedTicket = get(redemptionResponse, 'data.data[0]');
      this.setStatus(200);
      return { data: parkingTicketSerializer(redeemedTicket) };
    } else {
      this.setStatus(422);
      return { data: null };
    }
  }

  @Get('all_details/{id}')
  @OperationId('parking_tickets.all_details')
  @ActivityLog('parking_tickets.all_details')
  public async allDetails(@Path() id: string): Promise<WrappedResponse<ParkingSpaceDetailAndSpaceDetailData>> {
    try {
      const member = await MemberRepository.findFirst({ where: { id } });
      if (!member) throw new CustomError(OBError.BMS_MEMB_003);

      const personId = member.uid;

      logging.info('getParkingDetailByPersonID body request', personId);

      await cache.getSet('TCC_ACCESS_TOKEN', async () => {
        const response = await TCCClient.getOauth2Token();
        return response.data.access_token;
      });

      const parkingDetailResponse = await TCCClient.getParkingDetailByPersonID(personId).catch((error) => {
        logging.error('getParkingDetailByPersonID error', error);
        throw new CustomError(OBError.BMS_PKT_001);
      });
      logging.info('getParkingDetailByPersonID data', parkingDetailResponse?.data);

      const parkingSpaceBody = { plateNo: parkingDetailResponse.data?.data[0]?.plateNo };
      if (parkingSpaceBody.plateNo) {
        const spaceDetailBody = { plateNo: parkingSpaceBody.plateNo };
        const spaceDetail = await TCCClient.getSpaceDetailBySpaceNumber(spaceDetailBody).catch((error) => {
          logging.error('getSpaceDetailBySpaceNumber error', error);
          throw new CustomError(OBError.BMS_PKT_003);
        });
        logging.info('getSpaceDetailBySpaceNumber data', spaceDetail?.data);
        if (!isEmpty(spaceDetail.data)) {
          this.setStatus(200);
          return {
            data: parkingAllDetailSerializer({
              ...parkingDetailResponse.data?.data[0],
              ...spaceDetail.data[0],
            }),
          };
        }
      }
      return { data: parkingAllDetailSerializer({ ...parkingDetailResponse.data?.data[0] }) };
    } catch (error) {
      logging.error('parking_tickets.all_details error', error);
      return { data: null } as WrappedResponse<ParkingSpaceDetailAndSpaceDetailData>;
    }
  }

  @Get('/residential/car_park/terms')
  @OperationId('parking_residential_tickets.terms')
  @ActivityLog('parking_residential_tickets.terms')
  public async getCarParkTermsAndConditions(
    @Query() tenant_id: string,
    @Query() project_id: number,
    @Header('lang') lang?: string,
  ): Promise<WrappedResponse<GetTermsAndConditionsResidenceParkingResponse>> {
    const request: GetTermsAndConditionsResidenceParkingInput = {
      tenantId: tenant_id,
      projectId: project_id,
      lang: lang,
    };

    const passes = await new PassService().getTermsAndConditionsResidenceParking(request);

    this.setStatus(200);
    return { data: passes.data };
  }

  @Post('import')
  @OperationId('parking_tickets.import')
  @ActivityLog('parking_tickets.import')
  public async importPhysicalParkingTicket(
    @Body() body: ImportPhysicalParkingTicketBody,
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedResponse<ImportPhysicalParkingTicketResponse>> {
    if (process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET !== 'true') {
      logging.error('enable_import_physical_parking_ticket switch is disabled');
      throw new CustomError(OBError.OB_004);
    }
    if (!xAccountId) {
      logging.error('accountId not found');
      throw new CustomError(OBError.BMS_VAL_001);
    }
    const loggingContext = logging.getLogContext();
    const member = await MemberRepository.findFirst({ where: { account_id: xAccountId } });
    const uid = member?.uid ? member.uid : xAccountId;
    const updateVisitorToAppBody: UpdateTransactionCarParkBody = {
      logId: body.logId,
      uid: uid,
      accountId: xAccountId,
      algType: 'VisitorToApp',
    };
    logging.info('updateTransactionCarpark body request:', updateVisitorToAppBody);

    const existedTicket = await syncRoleLogRepository.findMany({
      where: {
        payload: {
          path: ['logId'],
          equals: body.logId,
        },
        status: {
          in: [SyncRoleStatus.success, SyncRoleStatus.pending],
        },
      },
    });
    logging.info('existedTicket:', existedTicket);

    if (!isEmpty(existedTicket)) {
      logging.error(`Parking ticket logId ${body.logId} already imported`);
      throw new CustomError(OBError.BMS_FSP_004);
    }

    const syncRoleResult = await syncRoleLogRepository.create({
      data: {
        trace_id: loggingContext.traceId!,
        action: 'VisitorToApp',
        status: 'pending',
        account_id: xAccountId,
        payload: JSON.parse(JSON.stringify(updateVisitorToAppBody)),
      },
    });

    let updateVisitorToAppResponse: UpdateTransactionCarParkResponse;
    try {
      const res = await TCCClient.updateTransactionCarpark(updateVisitorToAppBody);
      updateVisitorToAppResponse = res.data;
    } catch (error) {
      logging.error('updateTransactionCarpark error', error);
      await syncRoleLogRepository.update({
        where: {
          id: syncRoleResult.id,
        },
        data: {
          status: SyncRoleStatus.failed,
        },
      });
      throw new CustomError(OBError.BMS_FSP_003);
    }
    logging.info(`updateTransactionCarpark response:`, updateVisitorToAppResponse);

    await syncRoleLogRepository
      .update({
        where: {
          id: syncRoleResult.id,
        },
        data: {
          status: updateVisitorToAppResponse.status === 0 ? SyncRoleStatus.success : SyncRoleStatus.failed,
        },
      })
      .catch((error) => {
        logging.error(OBError.BMS_FSP_003, error);
        throw new CustomError(OBError.BMS_FSP_003);
      });
    this.setStatus(200);

    return { data: { ...updateVisitorToAppResponse } };
  }
}
