export interface WrappedResponse<T> {
  data: T | T[] | null;
}

export interface WrappedOneResponse<T> {
  data: T;
}

export interface WrappedArrayResponse<T> {
  data: T[];
}

export interface BaseIndexQuery {
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
}
