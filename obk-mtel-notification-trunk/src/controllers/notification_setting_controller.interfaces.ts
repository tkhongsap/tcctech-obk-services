import { Prisma } from '../../db/client';
import { NotificationGroupResult } from './notification_group_controller.interfaces';

export interface NotificationSettingResult {
  id: string;
  recipient_id: string;
  notification_group_id: string;
  sms_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
  notification_group: NotificationGroupResult;
  created_at?: Date | null | string;
  updated_at?: Date | null | string;
  deleted_at?: Date | null | string;
}
interface NotificationSettingUpdateDeactivatedResult {
  count: number;
}
export interface NotificationSettingUpdateResult {
  result?: boolean;
}

export interface NotificationSettingUpdateDeactivatedResponse {
  result?: NotificationSettingUpdateDeactivatedResult;
}

export type NotificationSetting = Prisma.settingGetPayload<{
  include: { notification_group: true };
}>;

export interface NotificationSettingUpdateActivateOrDeactivate {
  isEnable: boolean;
}
