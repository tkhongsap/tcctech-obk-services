import { Prisma } from '../../db/client';

export interface ConfigStoreWhitelistQuery {
  id?: string;
  tax_id?: string;
  store_name?: string;
  company_name?: string;
  property_name?: string;
  property_id?: string;
  unit_no?: string;
  address?: string;
  building?: string;
  has_tax_id?: boolean;
  receipt_address_in_obk?: boolean;
  updated_at?: Date;
  created_at?: string;
  sort_key?: string;
  sort_direction?: string;
}

export type UpdateConfigStoreWhitelist = {
  tax_id?: string;
  store_name?: string;
  company_name?: string;
  property_id?: string;
  unit_no?: string;
  address?: string;
  building?: string;
  has_tax_id?: boolean;
  receipt_address_in_obk?: boolean;
  updated_by?: string;
};

export type StoreWhitelistResult = Prisma.StoreWhitelistGetPayload<{
  include: {
    property: {
      select: {
        id: true;
        name: true;
        keywords: true;
        addresses: true;
      };
    };
  };
}>;

export type StoreWhitelistResponse = {
  id: string;
  updated_at: Date;
  created_at: Date;
  tax_id: string | null;
  store_name: string;
  company_name: string;
  unit_no: string | null;
  address: string | null;
  building: string | null;
  has_tax_id: boolean;
  receipt_address_in_obk: boolean;
  property: {
    id: string;
    name: string;
    keywords: string[];
    addresses: string[];
  };
};

export interface AddConfigStoreWhitelist {
  tax_id?: string;
  store_name: string;
  company_name: string;
  property_id: string;
  unit_no?: string;
  address?: string;
  building?: string;
  has_tax_id: boolean;
  receipt_address_in_obk: boolean;
  updated_by?: string;
}

export type propertiesResult = Prisma.PropertyGetPayload<{}>;

export interface PropertyQuery {
  id?: string;
  name?: string;
}

export type propertiesResponse = {
  id: string;
  name: string;
  keywords: string[];
  addresses: string[];
};

export type PropertyBody = {
  name: string;
  keywords: string[];
  addresses: string[];
};

export type ConfigDocsTypeResponse = {
  id: string;
  keyword: string;
  type: string;
};

export type ConfigDocsTypeBody = {
  keyword: string;
  type: string;
};
