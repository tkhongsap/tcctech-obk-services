import { Prisma } from '../../db/client';
import { CreateTokenResponse, ShowTokenResponse } from './tokens_controller.interfaces';

export function TokenSerializer(token: Prisma.tokenGetPayload<true>): CreateTokenResponse {
  return {
    token: {
      id: token.id,
      expired_date: token.expired_date?.toISOString() as string,
    },
  };
}

export function TokenSerializerWithAccountId(token: Prisma.tokenGetPayload<true>): ShowTokenResponse {
  return {
    token: {
      id: token.id,
      expired_date: token.expired_date?.toISOString() as string,
      account_id: token.account_id,
      type: token.type,
    },
  };
}
