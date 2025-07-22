export interface StoreWhitelistType {
  id: string
  taxId?: string
  storeName: string
  companyName: string
  property: { id: string; name: string }
  unitNo?: string
  address?: string
  building?: string
  hasTaxId: boolean
  receiptAddressInObk: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export type StoreWhitelistPayload = Omit<
  StoreWhitelistType,
  'id' | 'createdAt' | 'updatedAt' | 'property'
> & { propertyId: string; updatedBy?: string }

export type CarparkWhitelistSchema = Omit<
  StoreWhitelistType,
  'id' | 'createdAt' | 'lastUpdate' | 'updateBy' | 'updatedAt' | 'property'
> & { propertyId: string }

export type StoreWhitelistQuery = {
  id?: string
  tax_id?: string
  store_name?: string
  company_name?: string
  property_name?: string
  property_id?: string
  unit_no?: string
  address?: string
  building?: string
  has_tax_id?: boolean
  receipt_address_in_obk?: boolean
  updated_at?: string
  created_at?: string
  sort_key?: string
  sort_direction?: string
}
