import { Prisma } from '../../db/client';
import { HistoryDocumentResult } from './history_document_controller.interfaces';

type omitExclude = 'category' | 'feedback' | 'title' | 'body' | 'history_document' | 'history_category';
export interface DocumentResult {
  id?: string;
  category_id?: string;
  title?: Prisma.JsonValue;
  body?: Prisma.JsonValue;
  image?: string | null;
  active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  published?: boolean;
  release_date?: Date | string | null;
  slug?: string;
  version?: number;
  history_document: HistoryDocumentResult[] | null;
}

export interface DocumentIndexQuery {
  active?: boolean;
  released?: boolean;
  category_id?: string;
}
export interface CreateDocumentBody extends Omit<Prisma.documentCreateInput, omitExclude> {
  category_id: string;
  title: object;
  body: object;
}
export interface UpdateDocumentBody extends Omit<Prisma.documentUpdateInput, omitExclude> {
  category_id?: string;
  title?: object;
  body?: object;
}
export interface DocumentListResult {
  id: string;
  title: string;
  category_id: string;
  body: string;
  image: string | null;
  active: boolean;
  created_at?: Date | string | null;
  updated_at: Date | string;
  published?: boolean;
  release_date?: Date | string | null;
  slug?: string;
  version?: number;
  updated_by?: string | null;
}
