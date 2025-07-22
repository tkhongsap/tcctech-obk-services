import { Prisma, recipient } from 'ob-notification/db/client';

export interface RecipientData {
  account_id: string;
  token: string;
  tokenType: string;
}

export interface IdentityData {
  identifier: string;
  provider: string;
  default: boolean;
}

export interface IdentityPayload {
  account_id: string;
  identity: IdentityData;
}
export interface PushTokenData {
  value: string;
  type: string;
}

export interface ProfileData {
  account_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  dob: string;
}
export interface DeviceData {
  account_id: string;
  device_id: string;
  device_os: string;
  device_unique_id: string;
}

export interface RecipientCratedData {
  account_id: string;
  identities: IdentityData[];
  push_token: PushTokenData;
  profile: ProfileData;
  device: DeviceData;
}

export interface RecipientProfile {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  dob: string;
}

export interface SendMessageData {
  recipient: recipient;
  notification_group_id: string;
  message: string;
  message_title?: string;
  message_id?: string;
  created_at?: Date;
}

export type RecipientWhereData = Prisma.recipientWhereInput;

export type RecipientIncludeData = Prisma.recipientInclude;

export enum UpdateDataType {
  Profile = 'profile',
  Identities = 'identities',
}
