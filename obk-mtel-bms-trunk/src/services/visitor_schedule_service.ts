import { ResultResponseData } from 'ob-iam-sdk/dist/api';
import { MemberRepository, PassRepository, VisitorScheduleRepository } from '../repositories';
import { OBError } from '../utils/error_spec';
import { CustomError } from '../middlewares/error';
import FSClient from '../libs/fs_client';
import logging from '../utils/logging';
import cache from '../libs/cache';

export default class VisitorScheduleService {
  public async deleteVisitorPass(id: string, deleted_at: Date | string): Promise<ResultResponseData> {
    try {
      const visitorPass = await PassRepository.findFirst({
        where: {
          visit_schedule_id: id,
        },
      });
      if (!visitorPass?.uid) {
        throw new CustomError(OBError.BMS_PASS_002);
      }

      const member = await MemberRepository.findFirst({
        where: {
          id: visitorPass.issuer_id,
        },
      });
      if (!member?.uid) {
        throw new CustomError(OBError.BMS_MEMB_003);
      }

      await VisitorScheduleRepository.update({ where: { id }, data: { deleted_at } });
      await cache.delete(`member_data_${visitorPass.issuer_id}_undefined`);

      try {
        await FSClient.cancelPreRegister({ personID: member.uid, inviteID: visitorPass.uid });
      } catch (error) {
        logging.error('Failed to cancel pre-registration: ', error);
        throw new CustomError(OBError.BMS_FS_005);
      }

      return {
        result: true,
      };
    } catch (error) {
      logging.error('Visitor schedule update failed:', error);

      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError(OBError.BMS_VS_001);
    }
  }
}
