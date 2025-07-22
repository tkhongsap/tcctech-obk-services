import { JsonValue } from '@prisma/client/runtime/library';
import { BaseIndexQuery } from './base_controller.interfaces';
import { OutdoorZone } from '../services/tower_service';

export type FindMemberResult = {
  id: string;
  uid: string;
  account_id: string | undefined | null;
  metadata?: JsonValue;
  created_at: Date | string;
  updated_at: Date | string;
};

export type VisitorData = {
  id: string;
  name: string;
  profile_image_url: string | null;
  email: string;
  company_name: string;
  reference?: string | null;
  inviter_id: string;
  created_at: string;
  updated_at: string;
};

export type PassData = {
  id: string;
  uid: string | null;
  from: string;
  to: string;
  consent: boolean | null;
  visitor_id: string;
  visit_schedule_id: string;
  issuer_id: string;
  status: 'pending' | 'confirmed';
  created_at: string;
  updated_at: string;
  visitor: VisitorData;
};

export interface FloorData {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  tower_id: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthorizedLocationData {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  tower_id: string;
  floor_id: string;
  created_at: string;
  updated_at: string;
}

export interface TowerData {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  project_id: string;
  created_at: string;
  updated_at: string;
  floors: FloorData[];
  locations: AuthorizedLocationData[];
}

export interface MembersShowResponse {
  id: string;
  uid: string;
  metadata: JsonValue;
  defaultFloor: string | null;
  account_id: string | null;
  created_at: string;
  updated_at: string;
  passes: PassData[];
  towers: TowerData[];
  outdoor: OutdoorZone[];
  passed_turnstile: boolean;
}

export interface UpdateMemberRequestBody {
  default_floor: string;
}

export interface UpdateMemberResponse {
  result: boolean | null;
}

export interface MemberIndexQuery extends BaseIndexQuery {
  floor_id?: string;
  tenant_id?: string;
  uid?: string;
}

export interface MemberIndexResponse {
  id: string;
  uid: string;
  account_id: string | undefined | null;
  metadata?: JsonValue;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface MemberListBody {
  floor_ids?: string[];
  tenant_ids?: string[];
}
