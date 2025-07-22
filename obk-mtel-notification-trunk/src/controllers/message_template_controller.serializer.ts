import { Prisma } from '../../db/client';
import { MessageTemplateResult } from './message_template_controller.interfaces';
function messageTemplatesSerializer(
  message_template: Prisma.message_templateGetPayload<true>[],
): MessageTemplateResult[] {
  return message_template.map((item) => {
    return {
      id: item.id,
      name: item.name,
      title: item.title,
      sub_title: item.sub_title,
      personalized: item.personalized,
      data: item.data,
      message_category_id: item.message_category_id,
      notification_group_id: item.notification_group_id,
      thumbnail: item.thumbnail,
      deeplink: item.deeplink,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });
}

function messageTemplateSerializer(message_template: Prisma.message_templateGetPayload<true>): MessageTemplateResult {
  return {
    id: message_template.id,
    name: message_template.name,
    title: message_template.title,
    sub_title: message_template.sub_title,
    personalized: message_template.personalized,
    data: message_template.data,
    message_category_id: message_template.message_category_id,
    notification_group_id: message_template.notification_group_id,
    thumbnail: message_template.thumbnail,
    deeplink: message_template.deeplink,
    created_at: message_template.created_at,
    updated_at: message_template.updated_at,
  };
}
export { messageTemplatesSerializer, messageTemplateSerializer };
