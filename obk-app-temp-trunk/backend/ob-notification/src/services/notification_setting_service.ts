import { get } from 'lodash';
import { setting } from '../../db/client';
import { CustomError } from '../middlewares/error_middleware';
import { RecipientRepository } from '../repositories/recipient_repository';
import { NotificationSettingRepository } from '../repositories/notification_setting_repository';
import { NotificationSettingData } from './interfaces/notification_setting_interface';

export class NotificationSettingService {
  private readonly notificationSettingRepository: NotificationSettingRepository;
  private readonly recipientRepository: RecipientRepository;

  constructor(
    notificationSettingRepository?: NotificationSettingRepository,
    recipientRepository?: RecipientRepository,
  ) {
    this.notificationSettingRepository =
      notificationSettingRepository || new NotificationSettingRepository();

    this.recipientRepository = recipientRepository || new RecipientRepository();
  }
  // function find all
  // --------receive param and account id

  public async findAll(
    notification_group_id: string,
    accountId: string,
  ): Promise<setting[]> {
    try {
      const recipient = await this.recipientRepository.find({
        account_id: accountId,
      });
      if (!recipient) {
        throw new CustomError(404, 'Cannot find recipient');
      }
      const recipientId = get(recipient, 'id');

      const result = await this.notificationSettingRepository.findAll({
        recipient_id: recipientId,
        notification_group_id: notification_group_id,
      });
      return result;
    } catch (error) {
      throw new CustomError(500, 'cannot find settings');
    }
  }

  // function update
  public async update(data: NotificationSettingData, accountId: string) {
    try {
      const recipient = await this.recipientRepository.find({
        account_id: accountId,
      });

      if (!recipient) {
        throw new CustomError(404, 'Cannot find recipient');
      }

      const recipientId = get(recipient, 'id');

      const accountMatched = await this.notificationSettingRepository.findBy({
        id: data.id,
        recipient_id: recipientId,
      });

      if (accountMatched) {
        const where = {
          id: data.id,
        };
        const updated = await this.notificationSettingRepository.update(where, {
          sms_enabled: data.sms_enable,
          email_enabled: data.email_enabled,
          in_app_enabled: data.in_app_enabled,
          push_enabled: data.push_enabled,
        });
        return updated !== null;
      }
    } catch (error) {
      throw new CustomError(500, 'cannot update settings');
    }
  }

  public async deactivate(accountId: string) {
    const recipient = await this.recipientRepository.find({
      account_id: accountId,
    });

    if (!recipient) {
      throw new CustomError(404, 'Cannot find recipient');
    }
    const recipientId = get(recipient, 'id');

    const where = {
      recipient_id: recipientId,
    };

    const deactivateAllNotiSetting =
      await this.notificationSettingRepository.updateAll(where, {
        sms_enabled: false,
        email_enabled: false,
        in_app_enabled: false,
        push_enabled: false,
      });

    return deactivateAllNotiSetting;
  }
}
