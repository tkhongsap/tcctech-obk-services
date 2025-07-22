import { $Enums, Prisma } from '../../db/client';
import { Provider, ProviderType } from './index.interface';

export interface LinkExternalIdentityRequestBody {
  identifier: string;
  uid: string;
  /** @enum {string} */
  provider_type: ProviderType;
  meta: object;
  provider?: Provider;
  country_code?: string;
}

export interface ValidateExternalIdentityRequestBody {
  identifier: string;
  provider: Provider;
  provider_type: ProviderType;
  country_code?: string;
}

export interface ExternalIdentityIndexQuery {
  uid?: string;
  type?: string;
  identifier?: string;
  account_id?: string;
  page_number?: number;
  page_size?: number;
}

export interface ExternalIdentityIndexResponse {
  id: string;
  uid: string;
  type: $Enums.ExternalIdentityType;
  identifier: string;
  account_id: string;
  meta: Prisma.JsonValue;
  created_at: Date;
  updated_at: Date;
}

export interface ExternalIdentityEvBody {
  type: $Enums.ExternalIdentityType;
  account_id: string;
  identifier: string;
  country_code?: string;
  provider: Provider;
}
