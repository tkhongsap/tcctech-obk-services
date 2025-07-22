export interface WrappedResponse<T> {
  data: T | T[] | null;
}

interface Visitor {
  id: string;
  name: string;
  profile_image_url: string | null;
  email: string;
  company_name: string;
  reference: string | null;
  inviter_id: string;
  created_at: Date;
  updated_at: Date;
  invite_id?: string | null;
}

export interface ShowVisitorResponse extends Visitor {}

export interface VisitorSchedule {
  tower_id: string;
  floor_id: string;
  from: Date | string;
  to: Date | string;
  repetition?: object;
}
export interface CreateVisitorBody {
  name: string;
  profile_image_url: string | null;
  email: string;
  company_name: string;
  reference?: string;
  inviter_id: string;
  visitor_schedule: VisitorSchedule;
}

export interface CreateVisitorResidentBody {
  name: string;
  profile_image_url: string | null;
  email: string;
  company_name: string;
  reference?: string;
  inviter_id: string;
  visitor_schedule: VisitorSchedule;
  residence_id: string;
  location_id: number;
  invite_name: string;
  invite_house_number: string;
  invite_zone: string;
  tenant_id: string;
  project_id: number;
}

export interface DeactiveVisitorResidentBody {
  invite_id: string;
}

export interface CreateVisitorResponse extends Visitor {}
