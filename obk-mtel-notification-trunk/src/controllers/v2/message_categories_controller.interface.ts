import { message_category } from '../../../db/client/';
import { TranslateableContentData } from './message_templates_controller.interface';
import { BaseIndexQuery } from '../base_controller.interfaces';
import { Controller } from 'tsoa';

export interface MessageCategoryData extends Omit<message_category, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}

export type MessageCategoriesIndexResponseData = MessageCategoryData[];

export type MessageCategoriesCreateRequestBody = {
  name: string;
  sequence: number;
  visible: boolean;
  remark?: string;
  icon_id?: string;
  display_name?: TranslateableContentData;
};

export interface MessageCategoryIndexQuery extends BaseIndexQuery {
  order_by?: string | 'message_template._count';
}

export abstract class QueriesController extends Controller {
  public DEFAULT_PAGE_SIZE = 25;
  public DEFAULT_PAGE_NUMBER = 1;

  public buildQuery<T>(query: Record<string, string | number>): T {
    const where: Record<string, string | number> = {};
    const excludedKeys = ['order_by', 'order_direction', 'page_number', 'page_size', 'type'];
    const customKeys = ['count'];

    for (const key in query) {
      if (query.hasOwnProperty(key) && !excludedKeys.includes(key)) {
        where[key] = query[key];
      }
    }

    const pageSize = query.page_size ? parseInt(query.page_size as string) : this.DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number ? parseInt(query.page_number as string) : this.DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;

    const customQuery = { message_template: { _count: query.order_direction || 'asc' } };
    const orderByQuery = customKeys.includes(query.order_by as string)
      ? customQuery
      : { [query.order_by || 'updated_at']: query.order_direction || 'asc' };

    return {
      orderBy: orderByQuery,
      take: pageSize,
      skip: offset,
      where,
    } as T;
  }

  public paginationBuilder<T>(total: number, page_size: number, page_number: number): T {
    return {
      total,
      page_size,
      page_number,
      total_page: Math.ceil(total / page_size),
    } as T;
  }
}
