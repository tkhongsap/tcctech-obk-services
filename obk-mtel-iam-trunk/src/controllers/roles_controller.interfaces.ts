export interface Permission {
  id?: string;
  permittee_type: 'account' | 'account_group';
  value: object;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  account_id: string | null;
  account_group_id: string | null;
  role_id: string | null;
}

interface CreatePermissionData
  extends Omit<
    Permission,
    'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'account_id' | 'account_group_id' | 'role_id'
  > {}

export interface CreateRoleBody {
  name: string;
  permissions: CreatePermissionData[];
}

interface Role {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CreatePermissionResponse extends Permission {}

export interface CreateRoleResponse extends Role {
  permissions: CreatePermissionResponse[];
}

export interface ShowRolesResponse extends CreateRoleResponse {}
export type IndexRolesResponse = ShowRolesResponse[];
interface UpdatePermissionData
  extends Omit<
    Permission,
    'created_at' | 'updated_at' | 'deleted_at' | 'account_id' | 'account_group_id' | 'role_id'
  > {}

export interface UpdateRoleBody extends Omit<Role, 'id' | 'created_at' | 'updated_at'> {
  permissions: UpdatePermissionData[];
}
