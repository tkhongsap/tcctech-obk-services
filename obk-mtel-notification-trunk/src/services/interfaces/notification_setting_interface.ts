import { Prisma } from '../../../db/client';
export type SettingWhereData = Prisma.settingWhereInput;
export type SettingIncludeData = Prisma.settingInclude;
export type SettingUpdateDataInput = Prisma.settingUpdateInput;
export type SettingWhereUniqueInput = Prisma.settingWhereUniqueInput;
export interface NotificationSettingData {
  id: string;
  sms_enabled?: boolean;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  push_enabled?: boolean;
}
