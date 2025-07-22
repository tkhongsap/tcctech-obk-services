import { Provider } from './index.interface';
import { Prisma } from '../../db/client';
import { JsonValue } from '@prisma/client/runtime/library';
export enum ExternalIdentityType {
  google = 'google',
  apple = 'apple',
  microsoft = 'microsoft',
  fs = 'fs',
  tcc = 'tcc',
  resident = 'resident',
  ev_resident = 'ev_resident',
}

export enum PlatformType {
  cms = 'cms',
  app = 'app',
}

interface Identitys {
  id: string;
  identifier: string;
  meta: Prisma.JsonValue | null;
  provider: Provider;
  verified_at: Date | string | null;
  linked_at: Date | string | null;
  unlinked_at: string | null;
  account_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  default: boolean;
}

interface ActivityLog {
  id: string;
  trace_id: string;
  account_id: string;
  action: string;
  status: string;
  platform: PlatformType;
  created_at: Date | string;
  updated_at: Date | string;
}

interface ExternalIdentity {
  id: string;
  uid: string;
  type: ExternalIdentityType;
  identifier: string;
  account_id: string;
  meta: JsonValue;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface SigninIdentityLogResultData {
  id: string;
  account_id: string;
  identity_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  identity: Identitys;
  activityLog: ActivityLog | null;
  externalIdentities: ExternalIdentity[] | null;
}
