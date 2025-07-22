import { $Enums, Prisma } from '../../db/client';

export const actions = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
  '*': '*',
  empty: '',
};

export type PermissionActionsType = keyof typeof actions;
export interface PermissionValue {
  name: string;
  service: string;
  actions?: Array<PermissionActionsType>;
  resource_type: string;
  resource?: Record<string, string>;
}

export interface AttachedPermission {
  id: string;
  permittee_type: string;
  value: PermissionValue;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  account_id?: string;
  account_group_id?: string;
}

export interface PermissionRegistry extends Omit<PermissionValue, 'resource'> {}
export interface IndexPermissionResponse {
  permissions: PermissionRegistry[];
}

export const availablePermission = {
  acRequest: 'ac-request',
  serviceRequest: 'service-request',
};

export interface updatePermissionRequestBody {
  action: string;
  account_id: string;
}

export interface PermissionResponse {
  id: string;
  permittee_type: $Enums.PermitteeType;
  value: Prisma.JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  account_id: string | null;
  account_group_id: string | null;
  role_id: string | null;
}
