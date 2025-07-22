import { JsonValue } from '@prisma/client/runtime/library';
import { VisitorToken } from '../../db/client/';

export interface consentRequestBody {
  consent: boolean;
}

export interface WrappedResponse<T> {
  data: T | T[] | null;
}

export type MetaDataPasses = {
  invite_name: string;
  invite_house_number: string;
  invite_zone: string;
  tenant_id: string;
  project_id: number;
};

export type Passes = {
  id: string;
  uid: string | null;
  from: string;
  to: string;
  visitor_id: string;
  issuer_id: string;
  status: 'pending' | 'confirmed';
  created_at: string;
  updated_at: string;
  visit_schedule_id: string;
  consent?: boolean | null;
  visitor_schedule: VisitorSchedule_Passes;
  visitor: Visitor_Passes;
  issuer: Members_Passes;
  location: Location_Passes;
  metadata_resident?: MetaDataPasses;
  repeatInvite?: string;
};

export type VisitorSchedulePassesRepeat = {
  type?: string;
  values?: number[];
  value?: number;
  until?: string;
};

export interface ShowPassResponse extends Passes {}

export interface PassConsentResponse extends Omit<Passes, 'visitor_schedule' | 'visitor' | 'issuer' | 'location'> {}

interface VisitorSchedule_Tokens extends Partial<VisitorToken> {}
interface VisitorSchedule_Passes {
  tower_id: string;
  floor_id: string;
  from: string;
  to: string;
  repetition?: object;
  created_at: string;
  updated_at: string;
  tokens: VisitorSchedule_Tokens[];
}

interface Visitor_Passes {
  name: string;
  profile_image_url: string | null;
  email: string;
  company_name: string;
  reference?: string | null;
  inviter_id: string;
  created_at: string;
  updated_at: string;
}

export interface Members_Passes {
  uid: string;
  metadata: JsonValue;
  account_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location_Passes {
  id: string;
  uid: string;
  name: string;
  tower_id: string;
  floor_id: string;
  zone_id: string;
  tower: TowerData_Passes;
  floor: FloorData_Passes;
  created_at: string;
  updated_at: string;
}

export interface FloorData_Passes {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  tower_id: string;
  created_at: string;
  updated_at: string;
}

export interface TowerData_Passes {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  project_id: string;
  created_at: string;
  updated_at: string;
}
