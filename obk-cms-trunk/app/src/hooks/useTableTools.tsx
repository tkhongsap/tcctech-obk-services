import { useEffect, useState } from 'react'
import { SortingState } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { DEFAULT_PAGINATION, PaginationType } from '@src/data/constants/table'

const useTableTools = () => {
  const router = useRouter()

  const [filters, setFilters] = useState(
    Object.keys(router.query)
      .filter((key) => key !== 'current' && key !== 'sorting')
      .map((key) => ({ id: key, value: router.query[key] }))
  ) as any
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: router.query?.sorting as string,
      desc: router.query?.direction === 'desc' ? true : false,
    },
  ])
  const [pagination, setPagination] =
    useState<PaginationType>(DEFAULT_PAGINATION)

  const setCurrentPage = (currentPage: number) => {
    if (!setPagination) return
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPage,
      totalData: prevPagination?.totalData || 0,
      totalPage: prevPagination?.totalPage || 0,
    }))
  }

  const pageOnChange = (page: any) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const filterItems = filters.reduce((result: any, filterValue: any) => {
      if (filterValue.field)
        result[filterValue.field] = filterValue?.value || ''
      return result
    }, {})
    console.log('List function toggled!', {
      pagination: pagination,
      sorting: sorting[0]?.id,
      direction: sorting[0]?.desc ? 'desc' : 'asc',
      ...filterItems,
    })
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        current: pagination.currentPage,
        sorting: sorting[0]?.id,
        direction: sorting[0]?.desc ? 'desc' : 'asc',
        ...filterItems,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting, filters])

  return {
    filters,
    setFilters,
    sorting,
    setSorting,
    currentPage: pagination.currentPage,
    setCurrentPage,
    pageOnChange,
    setPagination,
    pagination,
  }
}

export default useTableTools
