import { Controller } from 'tsoa';
import { message_template } from '../../../db/client/';
import { MessageCategoryData, TargetGroupData } from './index.interface';

export interface TranslateableContentData {
  en: string;
  th?: string;
  zh?: string;
}

interface ContentTypeText {
  type: 'text';
  data: TranslateableContentData;
}

interface ContentTypeHyperlink {
  type: 'hyperlink';
  data: {
    url: string;
    message: TranslateableContentData;
  };
}

export interface ContentTypeImage {
  type: 'image';
  data: string[];
}

interface ContentTypeGeneric {
  data: TranslateableContentData;
}

export type ContentType = ContentTypeGeneric | ContentTypeText | ContentTypeHyperlink | ContentTypeImage;

export interface MessageTemplateData
  extends Omit<
    message_template,
    'created_at' | 'updated_at' | 'data' | 'title' | 'sub_title' | 'deeplink_display_name'
  > {
  title: TranslateableContentData;
  sub_title?: TranslateableContentData;
  data?: ContentType[] | null;
  created_at?: string;
  updated_at?: string;
  message_category?: MessageCategoryData | null;
  campaign_target_groups?: TargetGroupData[] | null;
  deeplink_display_name?: TranslateableContentData;
}

export type MessageTemplatesIndexResponseData = MessageTemplateData[];

export interface MessageTemplateCreateRequestBody extends MessageTemplateData {
  name: string;
}

export abstract class QueriesTemplateController extends Controller {
  public DEFAULT_PAGE_SIZE = 25;
  public DEFAULT_PAGE_NUMBER = 1;

  public buildQuery<T>(query: Record<string, string | number>): T {
    const where: Record<string, string | number> = {};
    const excludedKeys = ['order_by', 'order_direction', 'page_number', 'page_size', 'type', 'filter_by', 'filter_key'];
    const customKeys = ['count'];

    for (const key in query) {
      if (query.hasOwnProperty(key) && !excludedKeys.includes(key)) {
        where[key] = query[key];
      }
    }

    const pageSize = query.page_size ? parseInt(query.page_size as string) : this.DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number ? parseInt(query.page_number as string) : this.DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;
    const filterBy = query.filter_by;
    const filterKey = query.filter_key;

    if (filterBy) {
      where[filterBy] = filterKey;
    }

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
