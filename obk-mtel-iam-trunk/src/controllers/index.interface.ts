export interface WrappedResponse<T> {
  data: T | T[] | null;
  pagination?: Pagination;
}

export interface ResultResponseData {
  result: boolean;
}

export interface Pagination {
  total: number;
  total_page: number;
  page_number: number;
  page_size: number;
}

export type Provider = 'phone' | 'email' | 'sso' | 'keycloak';
export type ProviderType = 'google' | 'microsoft' | 'apple' | 'fs' | 'resident' | 'ev_resident';
