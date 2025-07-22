import { Prisma } from '../../db/client';

export interface MessageTemplateData {
  name: string;
  title: object;
  subTitle?: object;
  personalized?: string;
  messageTypeId: string;
  thumbnail?: string;
  deeplink?: string;
  data: JSON[];
}

interface MessageTemplateDataBody {
  name: string;
  title: object;
  sub_title?: object;
  message_category_id: string;
  thumbnail?: string;
  deeplink?: string;
  data: DataOject[];
}

interface DataOject {
  message_data_template_id: string;
  data: object;
}

export interface TemplatDataBody {
  template: MessageTemplateDataBody;
}
export interface CreateMessageTemplatResult {
  result: boolean;
}
export interface MessageTemplateResult {
  id: string;
  name: string;
  title?: Prisma.JsonValue | null;
  sub_title: Prisma.JsonValue | null;
  personalized: boolean | null;
  data: Prisma.JsonValue | null;
  message_category_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  notification_group_id: string | null;
  thumbnail: string | null;
  deeplink: string | null;
}
export interface MessageTemplateQuery {
  notification_group_id?: string;
  message_category_id?: string;
}

export interface MessageTemplateUpdateDataBody {
  name?: string;
  title?: object;
  sub_title?: object;
  message_category_id?: string;
  thumbnail?: string;
  deeplink?: string;
  data?: object;
  personalized?: boolean;
}
