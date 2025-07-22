import { JsonValue, Decimal } from '@prisma/client/runtime/library';
import { FloorData, TowerData } from './locations_controller.interface';
import { BaseIndexQuery } from './base_controller.interfaces';
import { TenantData } from './tenants_controller.interfaces';
export interface ACRequestBody {
  floor_id: string;
  ac_zone_id: string[];
  tower_id: string;
  requester_id: string;
  date: Date;
  duration: number;
}

export type ACRequestUpdateBody = {
  status?: ACRequestStatus.approved | ACRequestStatus.rejected;
  reason?: string;
  internal_remark?: string;
};

export interface ACRequestQuery extends BaseIndexQuery {
  'to.gte'?: string;
  'to.lte'?: string;
  status?: ACRequestStatus;
  requester_id?: string;
}

enum ACRequestStatus {
  submitted = 'submitted',
  rejected = 'rejected',
  approved = 'approved',
}

export interface ACZoneData {
  id: string;
  name: string;
  area_size: number;
  floor_id: string;
  created_at: string;
  updated_at: string;
}

export type RequesterData = {
  id: string;
  uid: string;
  account_id: string | undefined | null;
  metadata?: JsonValue;
  created_at: string;
  updated_at: string;
  tenant_members?: { tenant: TenantData }[];
};
export interface ACRequestResponse {
  id: string;
  tower_id: string;
  floor_id: string;
  estimated_cost: Decimal;
  from: string;
  to: string;
  duration_hour: number;
  total_area_size: number;
  status: string;
  created_at: string;
  updated_at: string;
  requester_id: string;
  ac_zone: ACRequestZone[];
  floor: FloorData;
  tower: TowerData;
  requester: RequesterData;
  references: string;
  reason: string | null;
  internal_remark: string | null;
}

export interface ACRequestZone {
  id: string;
  name: string;
  ac_zone: ACZoneData;
  ac_request_id: string;
  rate: Decimal;
  area_size: number;
  created_at: string;
  updated_at: string;
}

export type CreateACRequestResponse = {
  references: string;
};
