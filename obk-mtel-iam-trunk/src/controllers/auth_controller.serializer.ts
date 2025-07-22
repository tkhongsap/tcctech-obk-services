import { Prisma } from '../../db/client';
import { CreateRoleResponse, Permission, IndexRolesResponse } from './roles_controller.interfaces';

export function roleListSerializer(
  roles: Prisma.roleGetPayload<{
    include: {
      permissions: true;
    };
  }>[],
): IndexRolesResponse {
  const result = roles.map((role) => {
    return roleSerializer(role);
  });
  return result;
}

export function roleSerializer(
  role: Prisma.roleGetPayload<{
    include: {
      permissions: true;
    };
  }>,
): CreateRoleResponse {
  return {
    id: role.id,
    name: role.name,
    permissions: permissionsSerializer(role.permissions),
    created_at: role.created_at.toISOString(),
    updated_at: role.updated_at.toISOString(),
  };
}

export function permissionsSerializer(permissions: Prisma.attached_permissionGetPayload<null>[]): Permission[] {
  const result = permissions.map((permission) => {
    return {
      id: permission.id,
      permittee_type: permission.permittee_type,
      value: permission.value,
      created_at: permission.created_at.toISOString(),
      updated_at: permission.updated_at.toISOString(),
      deleted_at: permission.deleted_at?.toISOString(),
      account_id: permission.account_id,
      account_group_id: permission.account_group_id,
      role_id: permission.role_id,
    } as Permission;
  });
  return result;
}
