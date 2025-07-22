import { message_category } from '../../../db/client/';
import { MessageCategoryData } from './index.interface';

export function messageCategorySerializer(messageCategory: message_category): MessageCategoryData {
  return {
    ...messageCategory,
    created_at: messageCategory.created_at.toISOString(),
    updated_at: messageCategory.updated_at.toISOString(),
  };
}
