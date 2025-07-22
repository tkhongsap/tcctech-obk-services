import { Prisma } from '../../db/client';

export interface CategoryIndexQuery {
  id?: string;
  type?: string;
  released?: boolean;
}
export interface CategoryResult {
  id?: string;
  title?: Prisma.JsonValue;
  active?: boolean;
  image?: string | null;
  type_id?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  type?: string;
  version?: number;
  updated_by?: object | string | null;
  updated_by_name?: string | null;
  list?: object[];
}

export interface CreateCategoryBody
  extends Omit<Prisma.categoryCreateInput, 'list' | 'type' | 'title' | 'history_document' | 'history_category'> {
  type_id: string;
  title: object;
}
export interface UpdateCategoryBody
  extends Omit<Prisma.categoryUpdateInput, 'list' | 'type' | 'title' | 'history_document' | 'history_category'> {
  type_id?: string;
  title?: object;
}

export interface CreateCMSCategoryBody
  extends Omit<Prisma.categoryCreateInput, 'list' | 'type' | 'title' | 'history_document' | 'history_category'> {
  type_id: string;
  title: object;
  acitve?: boolean;
  document: {
    id?: string;
    title: object;
    body: object;
    slug?: string;
    published?: boolean;
  }[];
}

export interface UpdateCMSCategoryBody
  extends Omit<Prisma.categoryUpdateInput, 'list' | 'type' | 'title' | 'history_document' | 'history_category'> {
  type_id?: string;
  title: object;
  active?: boolean;
  updated_by?: string;
  document: {
    id?: string;
    title: object;
    body: object;
    slug?: string;
    published?: boolean;
  }[];
}
