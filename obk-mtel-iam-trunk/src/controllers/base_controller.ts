import { Controller } from 'tsoa';

export abstract class BaseController extends Controller {
  public DEFAULT_PAGE_SIZE = 25;
  public DEFAULT_PAGE_NUMBER = 1;
  public buildQuery<T>(query: Record<string, string | number>): T {
    const DEFAULT_PAGE_SIZE = 25;
    const DEFAULT_PAGE_NUMBER = 1;
    const where: Record<string, any> = {};
    const excludedKeys = [
      'order_by',
      'order_direction',
      'page_number',
      'page_size',
      'search',
      'filter_by',
      'filter_key',
    ];

    for (const key in query) {
      if (query.hasOwnProperty(key) && !excludedKeys.includes(key)) {
        where[key] = query[key];
      }
    }

    const pageSize = query.page_size ? parseInt(query.page_size as string) : DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number ? parseInt(query.page_number as string) : DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;

    const filterBylist = query.filter_by?.toString().split(',');
    const filterKeyList = query.filter_key?.toString().split(',');

    if (filterBylist && filterKeyList) {
      filterBylist.forEach((filter, index) => {
        if (filter === 'status') {
          where['deleted_at'] = (filterKeyList[index] === 'active' ? null : { not: null }) as any;
        } else if (filter === 'company') {
          where['external_identity'] = {
            some: {
              type: 'fs',
              meta: {
                path: ['tenantIDs'],
                array_contains: +filterKeyList[index],
              },
            },
          };
        } else {
          where[filter] = filterKeyList[index];
        }
      });
    }

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
