import { Prisma } from '../../db/client';

export interface MessageCreateResult {
  id: string;
  data: Prisma.JsonValue;
  message_template_id: string;
  read: boolean;
  recipient_id: string;
  sender_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
}

export interface MessageQuery {
  limit?: number;
  page?: number;
  order?: 'asc' | 'desc';
  sort?: string;
  count?: boolean;
  category?: string;
}

export interface DataofMessageGet {
  id: string;
  data: object;
}

export interface MessageGetResult {
  id: string;
  read: boolean;
  created_at: string;
  title: string;
  sub_title: string;
  deeplink: string;
  thumbnail: string;
  category: string;
  icon_url: string;
}
interface MetaResponse {
  limit?: number;
  page?: number;
  total?: number;
  total_pages?: number;
}
export interface MessageGetResponse {
  data: MessageGetResult[];
  meta: MetaResponse;
}
export interface PaginationQuery {
  limit: number;
  page: number;
  order: 'asc' | 'desc';
  sort: string;
  count: boolean;
}

export interface MessageBodyPut {
  read: boolean;
}
export interface MessageResult {
  id: string;
  data: Prisma.JsonValue | null;
  message_template_id: string;
  read: boolean;
  recipient_id: string;
  sender_id: string;
  sender_type: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
}
export interface MessageBodyDelete {
  exclude?: string[];
  include?: string[];
}
export interface MessageBooleanResponse {
  result: boolean;
}

export interface MessageGetIndexResult {
  id: string;
  read: boolean;
  created_at: Date | string;
  title: string;
  sub_title: string;
  category: string;
  data: object[];
  deeplink: string | null;
  thumbnail: string | null;
  deeplink_display_name: string | null;
  tag?: string[];
}
export interface messageDataSerializerResponse {
  id: string;
  data: object;
  title?: object;
}
