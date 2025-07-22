import { Prisma } from '../../db/client';

export type TenantData = {
  id: string;
  uid: string;
  name: string;
  display_name: Prisma.JsonValue | null;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type TenantIndexResponse = TenantData[];
