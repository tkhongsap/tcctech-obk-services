import { isMatch } from 'lodash';
import { CustomError } from '../midlewares/error';
import { OBError } from './error_spec';

export const actions = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
  '*': '*',
};

export type permissionActionsType = keyof typeof actions;

export interface permission {
  name: string;
  service: string;
  actions: Array<permissionActionsType>;
  resource_type: string;
  resource: Record<string, string>;
}
export interface attachedPermission {
  id: string;
  permittee_type: string;
  value: permission;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  account_id?: string;
  account_group_id?: string;
}

export interface JWTPayload {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface JWTAccessTokenPayload extends JWTPayload {
  permission: object;
}

export interface JWTQRTokenPayload extends JWTPayload {
  external_identities: object;
}

export function authorizePermission(
  permissions: attachedPermission[],
  action: permissionActionsType,
  resourceType: string,
  resource?: object,
): boolean {
  const hasPermission = permissions.some((permission) => {
    return (
      validateResourceType(permission, resourceType) &&
      validateAction(permission, action) &&
      validateResource(permission, resource)
    );
  });
  if (!hasPermission) {
    throw new CustomError(OBError.OB_008);
  }

  return true;
}

function validateResourceType(permission: attachedPermission, resourceType: string): boolean {
  return permission.value.resource_type === resourceType;
}

function validateAction(permission: attachedPermission, action: permissionActionsType): boolean {
  return permission.value.actions.includes(action) || permission.value.actions.includes('*');
}

function validateResource(permission: attachedPermission, resource?: object): boolean {
  return resource ? isMatch(resource, permission.value.resource) : true;
}
