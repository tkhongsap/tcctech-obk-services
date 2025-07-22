import { get } from 'lodash';
import { CustomError } from '../middlewares/error_middleware';
import NotificationGroupRepository from '../repositories/notification_group_repository';
import RecipientRepository from '../repositories/recipient_repository';
import { Prisma } from '../../db/client';
import { NotificationGroupGetResult } from '../controllers/notification_group_controller.interfaces';

export class NotificationGroupService {
  public async findAll(accountId: string): Promise<NotificationGroupGetResult[]> {
    const recipient = await RecipientRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });

    if (!recipient) {
      throw new CustomError(404, 'Cannot find recipient');
    }
    const recipientId = get(recipient, 'id');

    const include: Prisma.notification_groupInclude = {
      setting: {
        where: {
          recipient_id: recipientId,
        },
      },
    };

    const notificationGroups = await NotificationGroupRepository.findMany({ include });

    const results = [];

    for (const group of notificationGroups) {
      const setting = get(group, ['setting', '0']);

      if (setting) {
        const settingsValue = {
          sms_enabled: setting.sms_enabled,
          email_enabled: setting.email_enabled,
          in_app_enabled: setting.in_app_enabled,
          push_enabled: setting.push_enabled,
        };

        results.push({
          groupId: group.id,
          groupName: group.name,
          settings: settingsValue,
        });
      }
    }

    return results;
  }
}
