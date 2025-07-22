import { RecipientResult } from './recipient_controller.interfaces';
import { Prisma } from '../../db/client';

function recipientsSerializer(recipient: Prisma.recipientGetPayload<true>[]): RecipientResult[] {
  return recipient.map((item) => {
    return {
      id: item.id,
      account_id: item.account_id,
      data: item.data,
      created_at: item.created_at,
      updated_at: item.updated_at,
      deleted_at: item.deleted_at,
    };
  });
}
function recipientSerializer(recipient: Prisma.recipientGetPayload<true>): RecipientResult {
  return {
    id: recipient.id,
    account_id: recipient.account_id,
    data: recipient.data,
    created_at: recipient.created_at,
    updated_at: recipient.updated_at,
    deleted_at: recipient.deleted_at,
  };
}
export { recipientSerializer, recipientsSerializer };
