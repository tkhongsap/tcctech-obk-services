import { JsonValue } from '@prisma/client/runtime/library';
import { BaseIndexQuery } from './base_controller.interfaces';
import { FindMemberResult, VisitorData } from './members_controller.interfaces';
import { Prisma } from '../../db/client';
import { TenantData } from './tenants_controller.interfaces';

export enum AccessorType {
  pass = 'pass',
  member = 'member',
  tenant = 'tenant',
}
export enum TenantMemberRole {
  manager = 'manager',
  staff = 'staff',
}
export interface VisitorResult extends VisitorData {
  inviter: FindMemberResult;
}
export interface BuildingAccessgLogQuery extends BaseIndexQuery {
  accessorType: AccessorType;
  display_tower?: string;
  filter?: string;
  id?: string;
  building?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
  name?: string;
}

export interface BuildingAccessLogResult {
  id: string;
  uid: string;
  fs_account_id: string;
  type: string;
  status: number;
  transaction_date: string;
  turnstile_id: string;
  data: JsonValue;
  name?: string | null;
  display_status?: string | null;
  display_tower?: string | null;
  display_turnstile?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  member?: MemberDataResult | null;
  visitor?: VisitorResult | null;
}
export interface BuildingAccessLogPaginationResult {
  buildingLogs: BuildingAccessLogMemberBody[] | BuildingAccessLogVisitorBody[];
  totalData: number;
}
export interface BuildingAccessLogMemberBody {
  id: string;
  uid: string;
  fs_account_id: string;
  type: AccessorType;
  status: number;
  transaction_date: string;
  turnstile_id: string;
  data: JsonValue;
  name?: string | null;
  display_status?: string | null;
  display_tower?: string | null;
  display_turnstile?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  member?: MemberDataResult | null;
}
export interface BuildingAccessLogVisitorBody {
  id: string;
  uid: string;
  fs_account_id: string;
  type: AccessorType;
  status: number;
  transaction_date: string;
  turnstile_id: string;
  data: JsonValue;
  name?: string | null;
  display_status?: string | null;
  display_tower?: string | null;
  display_turnstile?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  visitor?: VisitorResult | null;
}

export interface TenantMemberResult {
  id: string;
  tenant_id: string;
  member_id: string;
  role: TenantMemberRole;
  setting: Prisma.JsonValue;
  created_at: Date | string;
  updated_at: Date | string;
  tenant: TenantData[] | null;
}

export interface MemberDataResult {
  id: string;
  uid: string;
  account_id: string | undefined | null;
  metadata?: JsonValue;
  created_at: string;
  updated_at: string;
  tenant_members: TenantMemberResult[];
}

export interface BuildingAccessLogShowQuery {
  accessorType: AccessorType;
}

export interface queryMember {
  where: {
    email?: string;
  };
}
