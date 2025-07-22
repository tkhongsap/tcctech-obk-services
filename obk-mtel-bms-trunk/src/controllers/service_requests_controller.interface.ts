import { RequesterData } from './ac_requests_controller.interfaces';
import { IssueTypeData } from './issue_types_controller.interface';
import { FloorData, TowerData } from './locations_controller.interface';
import { TenantData } from './tenants_controller.interfaces';

export type ServiceRequestBody = {
  image_url: string[];
  tower_id: string;
  floor_id: string;
  issue_type_id: string;
  requester_id: string;
  title: string;
  description: string;
};

export type ServiceRequestsUpdateRequestBody = {
  status?: ServiceRequestStatus.in_progress | ServiceRequestStatus.done;
  internal_remark?: string;
};

export type ServiceRequestData = {
  id: string;
  image_url: string[];
  tower: TowerData;
  floor: FloorData;
  issue_type: IssueTypeData;
  requester_id: string;
  title: string;
  status: string;
  description: string;
  references: string;
  created_at: string;
  updated_at: string;
  internal_remark: string | null;
  requester: RequesterData;
  tenant_members?: { tenant: TenantData }[];
};

export type CreateServiceRequestResponse = {
  references: string;
};

export interface ServiceRequestQuery {
  requester_id?: string;
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
  status?: ServiceRequestStatus;
}

enum ServiceRequestStatus {
  submitted = 'submitted',
  in_progress = 'in_progress',
  done = 'done',
}
