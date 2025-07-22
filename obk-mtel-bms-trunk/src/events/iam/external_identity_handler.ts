import TCCClient, { UpdateTransactionCarParkBody } from '../../libs/tcc_client';
import { CustomError } from '../../middlewares/error';
import { MemberRepository } from '../../repositories';
import { syncRoleLogRepository } from '../../repositories/sync_role_log';
import { OBError } from '../../utils/error_spec';
import logging from '../../utils/logging';
import BaseHandler from '../base_handler';
// import ExternalIdentityService from '../../services/external_identity_service';

export default class externalIdentityHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async created(event: { name: string; payload: any }): Promise<void> {
    if (event.payload.external_identity.type == 'fs') {
      logging.info('Start consume external identity created');
      const loggingContext = logging.getLogContext();

      const eventPayload = event.payload;
      const updateShopperToTenantPayload: UpdateTransactionCarParkBody = {
        logId: '',
        uid: eventPayload.external_identity.uid,
        accountId: eventPayload.external_identity.account_id,
        algType: 'ShopperToTenant',
      };

      await MemberRepository.update({
        where: {
          uid: event.payload.external_identity.uid,
        },
        data: {
          account_id: event.payload.external_identity.account_id,
        },
      });
      if (process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET === 'true') {
        logging.info('start update shopper to tenant');
        const syncRoleResult = await syncRoleLogRepository.create({
          data: {
            trace_id: loggingContext.traceId!,
            action: 'ShopperToTenant',
            status: 'pending',
            account_id: eventPayload.external_identity.account_id,
            payload: JSON.stringify(updateShopperToTenantPayload),
          },
        });

        logging.info('updateTransactionCarpark request body', updateShopperToTenantPayload);
        const updateRoleResult = await TCCClient.updateTransactionCarpark(updateShopperToTenantPayload);
        logging.info('updateTransactionCarpark response', updateRoleResult);

        await syncRoleLogRepository
          .update({
            where: {
              id: syncRoleResult.id,
            },
            data: {
              status: updateRoleResult.data.status === 1 ? 'success' : 'failed',
            },
          })
          .catch((error) => {
            logging.error(OBError.BMS_FSP_002, error);
            throw new CustomError(OBError.BMS_FSP_002);
          });
      }
    }
  }
}
