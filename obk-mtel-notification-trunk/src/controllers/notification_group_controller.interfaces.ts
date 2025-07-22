import { JsonValue } from '@prisma/client/runtime/library';

export interface NotificationGroupGetResult {
  groupId: string;
  groupName: string;
  settings: settingResult;
}
export interface settingResult {
  sms_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
}

export interface NotificationGroupResult {
  id: string;
  name: string;
  display_name: JsonValue;
  setting_sms_enabled: boolean;
  setting_email_enabled: boolean;
  setting_in_app_enabled: boolean;
  setting_push_enabled: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
}
