export interface QrTokenResult {
  token: {
    id: string;
    expired_date: string;
  };
}

export interface CacheQrToken {
  id: string;
  expired_date: string;
  value: string;
  type: string;
  account_id: string;
}

export interface EncryptedDataResult {
  encrypted_data: string;
}
