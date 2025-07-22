import { Get, Header, OperationId, Route } from 'tsoa';
import { BaseController } from '../base_controller';
import ActivityLog from '../../utils/activity_log';
import { WrappedResponse } from '../base_controller.interfaces';
import { ParkingSpaceDetailAndSpaceDetailData } from '../parking_tickets_controller.interfaces';
import { MemberRepository } from '../../repositories';
import logging from '../../utils/logging';
import cache from '../../libs/cache';
import TCCClient from '../../libs/tcc_client';
import { parkingAllDetailSerializer } from '../parking_tickets_controller.serializer';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../utils/error_spec';
import { isEmpty } from 'lodash';

@Route('v2/parking_tickets')
export class V2ParkingTicketsController extends BaseController {
  @Get('/all_details')
  @OperationId('parking_tickets_v2.all_details')
  @ActivityLog('parking_tickets_v2.all_details')
  public async allDetails(
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedResponse<ParkingSpaceDetailAndSpaceDetailData>> {
    if (!xAccountId) throw new CustomError(OBError.BMS_VAL_001);
    try {
      const member = await MemberRepository.findFirst({ where: { account_id: xAccountId } });
      const personId = member?.uid ? member.uid : xAccountId;

      logging.info(`getParkingDetailByPersonID body request ${personId}`);

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
      logging.error('parking_ticketsV2.all_details error', error);
      return { data: null } as WrappedResponse<ParkingSpaceDetailAndSpaceDetailData>;
    }
  }
}
