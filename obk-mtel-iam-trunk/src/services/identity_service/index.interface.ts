export type SSOType = 'google' | 'apple' | 'microsoft' | 'fs' | 'resident' | 'ev_resident';

export interface IdentityResponse {
  id: string;
  identifier: string;
  provider: 'email' | 'phone' | 'sso' | 'keycloak';
  default: boolean;
  type?: SSOType[];
}
