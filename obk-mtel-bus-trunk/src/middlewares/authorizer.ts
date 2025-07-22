import { Request, Response, NextFunction } from 'express';
import { attempt, isError, includes, some, flow, get } from 'lodash';
import logging from '../utils/logging';

interface RequirePermission {
  resourceType: string;
  action: string;
}

export function Authorizer(requiredPermission: RequirePermission) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const permissions = attempt((perms) => sanitizePermission(perms), req.headers['x-permissions']);

    if (!isError(permissions) && some(permissions, (perm) => validatePermission(perm, requiredPermission))) {
      return next();
    }

    res.sendStatus(401).send();
  };
}

function validatePermission(permission: any, requiredPermission: RequirePermission): boolean {
  return (
    permission.value.resource_type === requiredPermission.resourceType &&
    includes(permission.value.actions, requiredPermission.action)
  );
}

function sanitizePermission(encodedBase64: string): any {
  return flow(atob, JSON.parse, (obj) => get(obj, 'permission'))(encodedBase64);
}
