import { get } from 'lodash';
import { Prisma } from '../../db/client';
import { MessageCategoryResult } from './message_category_controller.interfaces';
function MessageCategorysSerializer(
  message_category: Prisma.message_categoryGetPayload<true>[],
  accept_language: string,
): MessageCategoryResult[] {
  return message_category.map((item) => {
    let name = item.name;
    switch (accept_language) {
      case 'en':
        name = get(item.display_name, 'en') ?? item.name;
        break;
      case 'th':
        name = get(item.display_name, 'th') ?? item.name;
        break;
      case 'zh':
        name = get(item.display_name, 'zh') ?? item.name;
        break;
    }
    return {
      id: item.id,
      name: name,
      sequence: item.sequence,
    };
  });
}
function MessageCategorySerializer(message_category: Prisma.message_categoryGetPayload<true>): MessageCategoryResult {
  return {
    id: message_category.id,
    name: message_category.name,
    sequence: message_category.sequence,
  };
}

export { MessageCategorySerializer, MessageCategorysSerializer };
