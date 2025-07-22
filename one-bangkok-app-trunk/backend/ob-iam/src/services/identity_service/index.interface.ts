export type SsoType = 'google' | 'apple' | 'microsoft' | 'fs';

export interface IdentityResponse {
  id: string;
  identifier: string;
  provider: 'email' | 'phone' | 'sso';
  default: boolean;
  type?: SsoType[];
}
