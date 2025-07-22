export interface Pagination {
  total: number;
  total_page: number;
  page_number: number;
  page_size: number;
}

export interface WrappedArrayResponse<T> {
  data: T[];
  pagination?: Pagination;
}
