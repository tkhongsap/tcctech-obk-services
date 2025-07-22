import { NotificationGroupResult, NotificationGroupGetResult } from './notification_group_controller.interfaces';
import { Prisma } from '../../db/client';
function notification_groupSerializer(
  notification_group: Prisma.notification_groupGetPayload<true>,
): NotificationGroupResult {
  return {
    id: notification_group.id,
    name: notification_group.name,
    setting_email_enabled: notification_group.setting_email_enabled,
    setting_in_app_enabled: notification_group.setting_in_app_enabled,
    setting_push_enabled: notification_group.setting_push_enabled,
    setting_sms_enabled: notification_group.setting_sms_enabled,
    display_name: notification_group.display_name,
    created_at: notification_group.created_at,
    updated_at: notification_group.updated_at,
    deleted_at: notification_group.deleted_at,
  };
}
function notification_groupsSerializer(notification_group: NotificationGroupGetResult[]): NotificationGroupGetResult[] {
  return notification_group.map((item) => {
    return {
      groupId: item.groupId,
      groupName: item.groupName,
      settings: {
        sms_enabled: item.settings.sms_enabled,
        email_enabled: item.settings.email_enabled,
        in_app_enabled: item.settings.in_app_enabled,
        push_enabled: item.settings.push_enabled,
      },
    };
  });
}
export { notification_groupSerializer, notification_groupsSerializer };
