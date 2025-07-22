import { Prisma } from '../../db/client';
import {
  MessageGetResult,
  MessageGetIndexResult,
  messageDataSerializerResponse,
} from './message_controller.interfaces';
import { languageSelector } from '../libs/language';
import { flatten, get, isNull } from 'lodash';
import { MessageResult } from './message_controller.interfaces';

function getProcessedTitle(messageData: object[]): string | null {
  return get(messageData[0], 'title', null) as string | null;
}

async function MessageLanguageSerializer(data: object, language: string): Promise<MessageGetResult> {
  const processedTitle = getProcessedTitle((data as { data: object[] }).data);
  const title = languageSelector(processedTitle ?? get(data, ['message_template', 'title'], ''), language);
  const subTitle = languageSelector(get(data, ['message_template', 'sub_title'], ''), language);

  return {
    id: get(data, 'id', ''),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    title: title as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sub_title: subTitle as any,
    read: get(data, 'read', false),
    deeplink: get(data, 'message_template.deeplink', ''),
    thumbnail: get(data, 'message_template.thumbnail', ''),
    created_at: get(data, 'created_at', '') as string,
    category: get(data, ['message_template', 'message_category', 'name']) as string,
    icon_url: get(data, ['message_template', 'message_category', 'icon', 'url']) as string,
  };
}
async function messageListSerializer(
  message: Prisma.messageGetPayload<{
    include: {
      message_template: true;
    };
  }>[],
  language: string,
): Promise<MessageGetResult[]> {
  const response: MessageGetResult[] = [];
  await Promise.all(
    message.map(async (row) => {
      const res = await MessageLanguageSerializer(row, language);

      response.push({
        ...res,
      });
    }),
  );

  return response;
}

function messageDetailSerializer(message: Prisma.messageGetPayload<true>): MessageResult {
  return {
    id: message.id,
    data: message.data,
    message_template_id: message.message_template_id,
    read: message.read,
    recipient_id: message.recipient_id,
    sender_id: message.sender_id,
    sender_type: message.sender_type,
    created_at: message.created_at,
    updated_at: message.updated_at,
    deleted_at: message.deleted_at,
  };
}
async function messageDetailLanguageSerealizer(message: object, language: string): Promise<MessageGetIndexResult> {
  const messageData: messageDataSerializerResponse[] = [];
  const datas = get(message, 'data', []) as Array<[]>;

  if (datas !== null) {
    await Promise.all(
      datas.map(async (data) => {
        const res = await messageDataSerializer(data, language);

        messageData.push({
          ...res,
        });
      }),
    );
  }
  const processedTitle = getProcessedTitle(datas);
  const title = languageSelector(processedTitle ?? get(message, ['message_template', 'title'], ''), language);
  const subTitle = languageSelector(
    get(message, ['message_template', 'sub_title'], '') as Record<string, never>,
    language,
  );
  const deepLink = !isNull(get(message, ['message_template', 'deeplink_display_name']))
    ? get(message, ['message_template', 'deeplink_display_name'])
    : {};
  const deepLinkDisplayName = languageSelector(deepLink, language);

  const campaignData = get(message, 'message_template.campaign', []);
  const tags = flatten(campaignData.map((campaign) => get(campaign, 'tag_on_campaigns', [])));
  const tagNames = tags.map((tag) => get(tag, 'tag.name', ''));

  return {
    id: get(message, 'id', ''),
    title: title as any,
    sub_title: subTitle as any,
    read: get(message, 'read', false),
    deeplink: get(message, 'message_template.deeplink', null),
    deeplink_display_name: deepLinkDisplayName as any,
    thumbnail: get(message, 'message_template.thumbnail', null),
    created_at: get(message, 'created_at', ''),
    category: get(message, ['message_template', 'message_category', 'name']),
    data: messageData,
    tag: tagNames,
  };
}
async function messageDataSerializer(data: object, language: string): Promise<messageDataSerializerResponse> {
  const id = get(data, 'message_template_id', '') as string;
  const template = get(data, 'data', {}) as Record<string, never>;
  const title = get(data, 'title', {}) as Record<string, never>;
  return { id: id, data: languageSelector(template, language), title: languageSelector(title, language) };
}

export { messageListSerializer, messageDetailSerializer, messageDetailLanguageSerealizer, MessageLanguageSerializer };
