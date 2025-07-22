import { Provider } from './index.interface';

export interface accountPayload {
  id: string;
  password: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface LoginBody {
  identity: {
    provider: Provider;
    identifier: string;
    country_code: string | undefined;
    type: 'google' | 'apple' | 'microsoft' | 'fs' | undefined;
  };
  password: string;
  device?: {
    device_id: string;
    os: string;
  };
  otp?: {
    id: string;
    reference: string;
  };
}

export interface Profile {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  dob: string;
  /** @enum {string|null} */
  title?: 'mr' | 'mrs' | 'ms' | 'dr' | null;
  /** @enum {string|null} */
  gender?: 'male' | 'female' | 'nonbinary' | 'prefernottosay' | null;
}

export interface RegisterAuthRequestBody {
  profile: Profile;
  identities: {
    provider: Provider;
    identifier: string;
    country_code?: string;
    uid?: string;
    /** @enum {string} */
    provider_type?: 'google' | 'microsoft' | 'apple' | 'fs';
    meta?: object;
  };
  password?: string;
  device?: {
    device_id: string;
    os: string;
  };
  push_token: {
    value: string;
    type: string;
  };
}

export interface TokenResponseData {
  token: {
    value: string;
  };
}

export interface ReactivateAuthRequestBody {
  identity: {
    provider: Provider;
    identifier: string;
    country_code?: string;
  };
  password?: string;
  device?: {
    device_id: string;
    os: string;
  };
  otp?: {
    id: string;
    reference: string;
  };
}

export interface RenewAuthRequestBody {
  refresh_token?: string;
  is_resident?: boolean;
}

export interface ReactivateAuthResponseData {
  identity?: {
    identifier: string;
    provider: Provider;
    country_code?: string;
    type?: ('google' | 'apple' | 'microsoft' | 'fs')[] | null;
    default?: boolean;
  };
  token?: {
    value: string;
  };
}

export interface RenewAuthResponseData {
  token?: {
    value: string;
  };
}
