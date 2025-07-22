import { Prisma } from 'ob-notification/db/client';

export type SettingWhereData = Prisma.settingWhereInput;
export type SettingIncludeData = Prisma.settingInclude;
export type SettingUpdateDataInput = Prisma.settingUpdateInput;
export type SettingWhereUniqueInput = Prisma.settingWhereUniqueInput;

export interface NotificationSettingData {
  id: string;
  sms_enable: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
}
