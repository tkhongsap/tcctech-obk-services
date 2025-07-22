import { Prisma } from '../../db/client';
import { BaseIndexQuery } from './base_controller.interfaces';
import { AccessorType, TenantMemberResult } from './building_access_log_controller.interface';

export interface ParkingLogQuery extends BaseIndexQuery {
  accessorType?: AccessorType;
  gate?: string;
  id?: string;
  filter?: string;
  startDate?: string;
  endDate?: string;
}
export enum PositionStatus {
  onsite = 'onsite',
  leave = 'leave',
}
export interface MemberResult {
  id: string;
  uid: string;
  metadata: Prisma.JsonValue;
  account_id?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  default_floor: string | null;
  tenant_members: TenantMemberResult[] | null;
}

export interface ParkingLogResult {
  id: string;
  uid: string;
  identifier: string;
  type: AccessorType;
  status: PositionStatus;
  terminal_id: string;
  transaction_date: string;
  plate_number: string;
  data: Prisma.JsonValue;
  name: string;
  display_status: string | null;
  display_termianl: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  member: MemberResult;
  durationTime?: string;
  accessGate?: string;
}

export interface ParkingLogPaginationResult {
  parkingLogs: ParkingLogResult[];
  totalData: number;
}
