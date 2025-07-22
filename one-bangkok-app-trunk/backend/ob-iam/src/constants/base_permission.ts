import { permission } from '../utils/authorization';

// todo: will improve on permission policy feature. A constant value for a base permission is enough for now.
export const BASE_PERMISSION: permission[] = [
  {
    name: 'ob-iam:account',
    service: 'ob-iam',
    actions: ['read', 'update', 'delete'],
    resource_type: 'account',
    resource: {
      id: 'self',
    },
  },

  {
    name: 'ob-iam:profile',
    service: 'ob-iam',
    actions: ['read', 'update'],
    resource_type: 'profile',
    resource: {
      account_id: 'self',
    },
  },

  {
    name: 'ob-iam:identity',
    service: 'ob-iam',
    actions: ['*'],
    resource_type: 'identity',
    resource: {
      account_id: 'self',
    },
  },

  {
    name: 'ob-iam:setting',
    service: 'ob-iam',
    actions: ['update'],
    resource_type: 'setting',
    resource: {
      account_id: 'self',
    },
  },

  {
    name: 'ob-iam:token',
    service: 'ob-iam',
    actions: ['create', 'read'],
    resource_type: 'token',
    resource: {
      account_id: 'self',
    },
  },
  {
    name: 'ob-document:category',
    service: 'ob-document',
    actions: ['read'],
    resource_type: 'category',
    resource: {
      id: 'self',
    },
  },
  {
    name: 'ob-document:documents',
    service: 'ob-document',
    actions: ['read'],
    resource_type: 'documents',
    resource: {
      id: 'self',
    },
  },
  {
    name: 'ob-document:feedback',
    service: 'ob-document',
    actions: ['read'],
    resource_type: 'feedback',
    resource: {
      id: 'self',
    },
  },
  {
    name: 'ob-document:type',
    service: 'ob-document',
    actions: ['read'],
    resource_type: 'type',
    resource: {
      id: 'self',
    },
  },
];

export const FS_PERMISSION = [
  {
    name: 'ob-bms:fs',
    service: 'ob-bms',
    actions: ['*'],
    resource_type: 'fs',
    resource: {
      id: 'self',
    },
  },
];
