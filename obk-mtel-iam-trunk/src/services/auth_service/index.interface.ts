import { Dayjs } from 'dayjs';

export interface loginResult {
  token?: {
    value: string;
  };
  refreshToken?: {
    value: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: { [key: string]: any };
  identity?: {
    identifier: string;
    provider: 'email' | 'phone' | 'sso' | 'keycloak';
  };
}
export type reactivateResult = loginResult;

export type IdentityProvider = 'email' | 'phone' | 'sso' | 'keycloak';

export interface TokenPayload {
  name: string;
  data: Record<string, any>;
}

export interface GenerateEncryptedTokenInput {
  accountId: string;
  type: string;
  payloadArray: TokenPayload[];
  expiredAt: Dayjs;
}
