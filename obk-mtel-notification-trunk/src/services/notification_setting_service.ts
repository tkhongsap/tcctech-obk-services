import { get } from 'lodash';
import { CustomError } from '../middlewares/error_middleware';
import RecipientRepository from '../repositories/recipient_repository';
import NotificationSettingRepository from '../repositories/notification_setting_repository';
import { NotificationSettingData } from './interfaces/notification_setting_interface';
import { NotificationSetting } from '../controllers/notification_setting_controller.interfaces';
import { Prisma } from '../../db/client';
export class NotificationSettingService {
  // function find all
  // --------receive param and account id

  public async findAll(accountId: string, notification_group_id?: string): Promise<NotificationSetting[]> {
    try {
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: accountId,
        },
      });
      if (!recipient) {
        throw new CustomError(404, 'Cannot find recipient');
      }
      const recipientId = get(recipient, 'id');
      const where: Prisma.settingWhereInput = {
        recipient_id: recipientId,
      };
      if (notification_group_id) {
        where.notification_group_id = notification_group_id;
      }

      const result = await NotificationSettingRepository.findMany({
        where,
        include: { notification_group: true },
      });

      return result;
    } catch (error) {
      throw new CustomError(500, 'cannot find settings');
    }
  }

  public async update(data: NotificationSettingData, accountId: string): Promise<boolean> {
    try {
      const recipient = await RecipientRepository.findFirst({
        where: {
          account_id: accountId,
        },
      });

      if (!recipient) {
        throw new CustomError(404, 'Cannot find recipient');
      }

      const recipientId = get(recipient, 'id');

      const accountMatched = await NotificationSettingRepository.findFirst({
        where: {
          id: data.id,
          recipient_id: recipientId,
        },
      });

      if (!accountMatched) return false;

      const where = {
        id: data.id,
      };
      const updated = await NotificationSettingRepository.update({
        where: where,
        data: {
          sms_enabled: data.sms_enabled,
          email_enabled: data.email_enabled,
          in_app_enabled: data.in_app_enabled,
          push_enabled: data.push_enabled,
        },
      });
      return updated !== null;
    } catch (error) {
      throw new CustomError(500, 'cannot update settings');
    }
  }

  public async activateOrDeactivate(
    accountId: string,
    isEnable: boolean,
  ): Promise<typeof activateOrDeactivateAllNotiSetting> {
    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });

    if (!recipient) {
      throw new CustomError(404, 'Cannot find recipient');
    }
    const recipientId = get(recipient, 'id');

    const where = {
      recipient_id: recipientId,
    };

    const activateOrDeactivateAllNotiSetting = await NotificationSettingRepository.updateMany({
      where: where,
      data: {
        sms_enabled: isEnable,
        email_enabled: isEnable,
        in_app_enabled: isEnable,
        push_enabled: isEnable,
      },
    });

    return activateOrDeactivateAllNotiSetting;
  }
}
