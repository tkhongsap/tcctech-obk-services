import { PAGE_SIZE } from '@components/table/constants'

export interface PaginationType {
  pageSize: number
  totalData: number
  currentPage: number
  totalPage: number
}

export const DEFAULT_PAGINATION = {
  pageSize: PAGE_SIZE,
  totalData: 1,
  currentPage: 1,
  totalPage: 1,
} as PaginationType
