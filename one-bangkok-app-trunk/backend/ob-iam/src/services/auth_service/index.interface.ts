export interface loginResult {
  token?: {
    value: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: { [key: string]: any }
  identity?: {
    identifier: string;
    provider: 'email' | 'phone' | 'sso';
  };
}
export type reactivateResult = loginResult;
