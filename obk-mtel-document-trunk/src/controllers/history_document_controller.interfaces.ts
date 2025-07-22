import { Prisma } from '../../db/client';

export interface HistoryDocumentIndexQuery {
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
}

export interface HistoryDocumentResult {
  id: string;
  category_id: string;
  title: Prisma.JsonValue;
  body: Prisma.JsonValue;
  image: string | null;
  active: boolean;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  published: boolean;
  release_date: Date | string | null;
  slug: string;
  version: number;
  updated_by?: object | string | null;
  history_category_id: string | null;
  updated_by_name?: string | null;
  document_id: string | null;
}
