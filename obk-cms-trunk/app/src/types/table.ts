import { Pagination } from 'ob-document-sdk/dist/api'
import { Dispatch, SetStateAction } from 'react'

export interface TableProps {
  tableTools?: {
    setFilters?: any
    sorting?: any
    setSorting?: any
    currentPage?: any
    setCurrentPage?: any
  }
  isLoading?: boolean
  pagination?: Pagination
  setPagination?: Dispatch<SetStateAction<Pagination>>
}
