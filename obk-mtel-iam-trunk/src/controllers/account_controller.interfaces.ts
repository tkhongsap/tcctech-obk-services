import { Provider } from './index.interface';
import { account, identity, profile } from '../../db/client/';

export interface AccountResponseData {
  account: {
    id: string;
  };
}

export interface PasswordRequestBody {
  password: string;
}

export interface ResetPasswordRequestBody {
  identity: {
    identifier: string;
    provider: Provider;
    otp: string;
    reference: string;
    country_code?: string;
  };
  otp?: {
    id: string;
    reference: string;
  };
  hashedPassword: string;
}

export interface AccountsIndexQueryParams {
  sort?: string;
  page?: number;
}

export interface ProfileData extends Partial<profile> {
  gender?: 'male' | 'female' | 'nonbinary' | 'prefernottosay' | null;
  title?: 'mr' | 'mrs' | 'ms' | 'dr' | null;
}

export interface IdentitiesData extends Partial<identity> {
  id: string;
  identifier: string;
  meta: {
    identifier: string;
    country_code?: string;
  };
  provider: Provider;
  verified_at: Date | null;
  linked_at: Date | null;
  unlinked_at: Date | null;
  account_id: string;
  created_at: Date;
  updated_at: Date;
  default: boolean;
}

export interface AccountData extends Partial<Omit<account, 'password'>> {
  profile?: ProfileData;
  identity?: IdentitiesData[];
  company_name?: string | null;
}

export type AccountsIndexResponse = AccountData[];

export interface AccountsIndexQuery {
  search?: string;
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
  filter_by?: string;
  filter_key?: string;
}

export interface AccountIdRequestResponse {
  account_id: string;
}
