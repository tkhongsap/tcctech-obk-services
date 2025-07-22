import { Prisma } from '../../../db/client';
import { ContentType, MessageTemplateData, TranslateableContentData } from './index.interface';
import { messageCategorySerializer } from './message_categories_controller.serializer';

export function messageTemplateSerializer(
  messageTemplate: Prisma.message_templateGetPayload<{ include: { message_category: true } }>,
): MessageTemplateData {
  return {
    ...messageTemplate,
    title: messageTemplate.title as object as TranslateableContentData,
    sub_title: messageTemplate.sub_title as object as TranslateableContentData,
    data: messageTemplate.data as object as ContentType[],
    created_at: messageTemplate.created_at.toISOString(),
    updated_at: messageTemplate.updated_at.toISOString(),
    message_category: messageCategorySerializer(messageTemplate.message_category),
    name: messageTemplate.name || '',
    deeplink_display_name: messageTemplate.deeplink_display_name as object as TranslateableContentData,
  };
}
