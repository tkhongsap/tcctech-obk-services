import { Pagination } from './base_controller';

// NOTE: WrappedResponse is causing an issue making SDK unalbe to generate the correct type for the response, please use response data instead
export interface WrappedResponse<T> {
  data: T | T[] | null;
  pagination?: Pagination;
}

export interface ResponseData<T> {
  data: T;
  pagination?: Pagination;
}

export interface BaseIndexQuery {
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
  filter_by?: string;
  filter_key?: string;
}
