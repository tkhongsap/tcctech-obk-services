import { get } from 'lodash';
import { CustomError } from '../middlewares/error_middleware';
import { NotificationGroupRepository } from '../repositories/notification_group_repository';
import { RecipientRepository } from '../repositories/recipient_repository';
import { Prisma } from '../../db/client';

export class NotificationGroupService {
  private readonly notificationGroupRepository: NotificationGroupRepository;
  private readonly recipientRepository: RecipientRepository;

  constructor(
    notificationGroupRepository?: NotificationGroupRepository,
    recipientRepository?: RecipientRepository,
  ) {
    this.notificationGroupRepository =
      notificationGroupRepository || new NotificationGroupRepository();
    this.recipientRepository = recipientRepository || new RecipientRepository();
  }

  public async findAll(accountId: string) {
    const recipient = await this.recipientRepository.find({
      account_id: accountId,
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
    const notificationGroups = await this.notificationGroupRepository.findAll(
      include,
    );

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
