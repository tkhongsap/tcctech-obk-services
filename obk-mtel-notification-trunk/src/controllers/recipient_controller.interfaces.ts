import { Prisma } from '../../db/client';
import { PushTokenData } from '../services/interfaces/recipient_interface';

export interface RecipientResult {
  id: string;
  account_id: string;
  data: Prisma.JsonValue;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
}

export interface CreateRecipientResult {
  result: boolean;
}

export interface CreateRecipientBody {
  token: string;
  /** @enum {string} */
  token_type: 'fcm';
}

export interface UpdateRecipientFCMTokenData {
  push_token: PushTokenData;
}
