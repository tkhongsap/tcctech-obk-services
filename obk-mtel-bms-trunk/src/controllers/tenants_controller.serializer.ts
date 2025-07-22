import { Prisma } from '../../db/client';
import { TenantData } from './tenants_controller.interfaces';

export const tenantSerializer = (tenant: Prisma.TenantGetPayload<null>): TenantData => {
  return {
    id: tenant.id,
    uid: tenant.uid,
    name: tenant.name,
    display_name: tenant.display_name,
    email: tenant.email,
    phone_number: tenant.phone_number,
    address: tenant.address,
    created_at: new Date(tenant.created_at).toISOString(),
    updated_at: new Date(tenant.updated_at).toISOString(),
  };
};

export const tenantsSerializer = (tenants: Prisma.TenantGetPayload<null>[]): TenantData[] => {
  return tenants.map((tenant) => tenantSerializer(tenant));
};
