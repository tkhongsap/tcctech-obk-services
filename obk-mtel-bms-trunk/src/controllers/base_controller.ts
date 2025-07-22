import { Controller } from 'tsoa';
import { set } from 'lodash';

export abstract class BaseController extends Controller {
  DEFAULT_PAGE_SIZE = 25;
  DEFAULT_PAGE_NUMBER = 1;
  EXCLUED_KEYS = ['order_by', 'order_direction', 'page_number', 'page_size'];
  public buildQuery<T>(query: Record<string, string | number>): T {
    const where: Record<string, string | number> = {};

    for (const key in query) {
      if (query.hasOwnProperty(key) && !this.EXCLUED_KEYS.includes(key)) {
        set(where, key, query[key]);
      }
    }

    const pageSize = query.page_size ? parseInt(query.page_size as string) : this.DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number ? parseInt(query.page_number as string) : this.DEFAULT_PAGE_NUMBER;

    const offset = (pageNumber - 1) * pageSize;

    return {
      where,
      orderBy: {
        [query.order_by || 'created_at']: query.order_direction || 'asc',
      },
      take: pageSize,
      skip: offset,
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
