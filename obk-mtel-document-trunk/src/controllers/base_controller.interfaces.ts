import { Controller } from 'tsoa';

export interface WrappedResponse<T> {
  data: T | T[] | null;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  total_page: number;
  page_number: number;
  page_size: number;
}

export abstract class QueriesController extends Controller {
  public buildQuery<T>(query: Record<string, string | number>): T {
    const DEFAULT_PAGE_SIZE = 25;
    const DEFAULT_PAGE_NUMBER = 1;
    const where: Record<string, string | number> = {};
    const excludedKeys = ['order_by', 'order_direction', 'page_number', 'page_size'];

    for (const key in query) {
      if (query.hasOwnProperty(key) && !excludedKeys.includes(key)) {
        where[key] = query[key];
      }
    }

    const pageSize = query.page_size ? parseInt(query.page_size as string, DEFAULT_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number
      ? parseInt(query.page_number as string, DEFAULT_PAGE_SIZE)
      : DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;

    return {
      where,
      orderBy: {
        [query.order_by || 'updated_at']: query.order_direction || 'asc',
      },
      take: pageSize,
      skip: offset,
    } as T;
  }
}
