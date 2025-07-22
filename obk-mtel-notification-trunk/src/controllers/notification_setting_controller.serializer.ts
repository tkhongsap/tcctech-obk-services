import { NotificationSettingData } from '../services/interfaces/notification_setting_interface';
import { Prisma } from '../../db/client';
import { NotificationSettingResult } from './notification_setting_controller.interfaces';
function notification_settingsSerealizer(
  settings: Prisma.settingGetPayload<{
    include: { notification_group: true };
  }>[],
): NotificationSettingResult[] {
  return settings.map((item) => {
    return {
      id: item.id,
      sms_enabled: item.sms_enabled,
      recipient_id: item.recipient_id,
      email_enabled: item.email_enabled,
      in_app_enabled: item.in_app_enabled,
      push_enabled: item.push_enabled,
      notification_group: item.notification_group,
      notification_group_id: item.notification_group_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      deleted_at: item.deleted_at,
    };
  });
}
function notification_settingSerealizer(notification_setting: Prisma.settingGetPayload<true>): NotificationSettingData {
  return {
    id: notification_setting.id,
    sms_enabled: notification_setting.sms_enabled,
    email_enabled: notification_setting.email_enabled,
    in_app_enabled: notification_setting.in_app_enabled,
    push_enabled: notification_setting.push_enabled,
  };
}
export { notification_settingsSerealizer, notification_settingSerealizer };
