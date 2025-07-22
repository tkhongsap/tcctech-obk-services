import { Provider } from './index.interface';

export interface ValidateRequestBody {
  identifier: string;
  provider: Provider;
  country_code?: string;
}

export interface CreateIdentityRequestBody {
  identity: {
    identifier: string;
    provider: Provider;
    country_code?: string;
    type?: ('google' | 'apple' | 'microsoft' | 'fs')[] | null;
    default?: boolean;
  };
  otp: {
    id: string;
  };
}

export interface IdentityAllResult {
  identifier: string;
  provider: Provider;
  country_code: string;
  type: string[];
  default: boolean;
}
