export interface TokenRawValue {
  name: string;
  data: Record<string, any>;
}

export interface CreateTokenRequestBody {
  type: string;
  value: TokenRawValue[];
  expired_at: string;
}

export interface ShowTokenResponse {
  token: Token;
}

interface Token {
  id: string;
  expired_date: string;
  account_id: string;
  type: string;
}

export interface CreateTokenResponse {
  token: Omit<Token, 'account_id' | 'type'>;
}

export interface ValidateTokenRequestBody {
  value: string;
}
