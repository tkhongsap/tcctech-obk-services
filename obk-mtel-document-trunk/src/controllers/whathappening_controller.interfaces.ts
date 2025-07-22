import { Prisma } from '../../db/client';
import { HistoryDocumentResult } from './history_document_controller.interfaces';

type omitExclude = 'category' | 'feedback' | 'title' | 'body' | 'history_document' | 'history_category';
export interface WhatheppeningResult {
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
  updated_by?: string | null;
}

export interface WhathappeningShowQuery {
  limit?: number;
  page?: number;
  order?: 'asc' | 'desc';
  sort?: string;
  active?: boolean;
  released?: boolean;
  releaseDate?: string;
  published?: boolean;
  isCurrentDisplay?: boolean;
  filter?: string;
  location?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  showStartDateFrom?: string;
  showStartDateTo?: string;
  showEndDateFrom?: string;
  showEndDateTo?: string;
}
export interface SetOrderCurrentDisplayBody {
  seq: number;
}
export interface CreateWhatheppeningBody extends Omit<Prisma.documentCreateInput, omitExclude> {
  category_id: string;
  title: object;
  body: object;
}
export interface UpdateWhatheppeningBody extends Omit<Prisma.documentUpdateInput, omitExclude> {
  category_id?: string;
  title?: object;
  body?: object;
}
export interface WhatheppeningListResult {
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
export interface BulkUpdateBody {
  data: UpdateWhatheppeningBody[];
}
