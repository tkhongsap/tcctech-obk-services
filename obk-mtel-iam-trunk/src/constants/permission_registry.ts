import { PermissionRegistry } from '../controllers/permissions_controller.interfaces';

// TODO: have to confirm and update this from PO
export const PERMISSION_REGISTRY: PermissionRegistry[] = [
  {
    name: 'ob-iam:account',
    service: 'ob-iam',
    resource_type: 'account',
  },
  {
    name: 'ob-iam:profile',
    service: 'ob-iam',
    actions: ['read', 'update'],
    resource_type: 'profile',
  },
];
