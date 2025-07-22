import { Column, ColumnProps } from 'primereact/column'
import {
  DataTable,
  DataTableProps,
  DataTableStateEvent,
  DataTableValueArray,
} from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import SvgTriangle from '@assets/svg/triangle.svg'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'

type Props<T> = DataTableProps<any> & {
  columns: ColumnProps[]
  data: T[]
} & {
  onTableStateChange?: (e: DataTableStateEvent) => void
}

const SortIconBase = styled(SvgTriangle)`
  ${(props) =>
    props.active === 'y' &&
    css`
      path {
        fill: ${(props: any) => props.theme.colors.bayofMany};
      }
    `}
`
const SortIconDesc = styled(SortIconBase)`
  transform: rotate(180deg);
`

export function Table<T>(props: Props<T>) {
  const router = useRouter()
  const {
    columns,
    value = props.data as DataTableValueArray,
    onTableStateChange,
    onSort,
    onPage,
    onFilter,
    lazy = true,
    rows,
    first,
    sortField,
    sortOrder,
    filters,
    reorderableRows,
    ...rest
  } = props
  const orderBySeq: (0 | 1 | -1 | null | undefined)[] = [-1, 0, 1]

  const [tableState, setTableState] = useState<DataTableStateEvent>({
    first: router.query?.first ? Number(router.query?.first) : 0,
    rows: rows ?? 25,
    filters: router.query?.filters
      ? JSON.parse(router.query?.filters?.toString())
      : null,
    sortField: sortField ?? router.query?.sorting?.toString() ?? '',
    sortOrder: sortOrder ?? router.query?.direction === 'desc' ? -1 : 1,
    page: router.query?.current
      ? Number(router.query?.current?.toString()) - 1
      : 0,
    multiSortMeta: undefined,
  })

  const headerTemplate = (col: ColumnProps) => (
    <>
      <div className='flex align-items-center gap-1'>
        <span className='text-sm text-gray-400'>{col.header?.toString()}</span>
        {col.sortable && (
          <div>
            <SortIconBase
              active={
                tableState.sortField === col.field && tableState.sortOrder === 1
                  ? 'y'
                  : 'n'
              }
            />
            <SortIconDesc
              active={
                tableState.sortField === col.field &&
                tableState.sortOrder === -1
                  ? 'y'
                  : 'n'
              }
            />
          </div>
        )}
      </div>
    </>
  )

  useEffect(() => {
    if (onTableStateChange) {
      onTableStateChange(tableState)

      const params: any = {}

      if (tableState.page !== undefined && tableState.page !== null) {
        params.current = tableState.page + 1
      }
      if (tableState.sortField) {
        params.sorting = tableState.sortField
      }
      if (tableState.sortOrder) {
        params.direction = tableState.sortOrder === -1 ? 'desc' : 'asc'
      }
      if (filters) {
        params.filters = JSON.stringify(filters)
      }
      params.first = tableState.first

      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...params,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState, filters])

  return (
    <DataTable
      value={value}
      lazy={lazy}
      rows={rows ?? tableState.rows}
      first={first ?? tableState.first}
      sortField={sortField ?? tableState.sortField}
      sortOrder={sortOrder ?? tableState.sortOrder}
      scrollable
      scrollHeight='60vh'
      paginator
      paginatorLeft
      emptyMessage='No data.'
      sortIcon={true}
      onSort={(e) => {
        console.log(e)
        setTableState((pre) => {
          const state = { ...pre }
          if (state.sortField === e.sortField) {
            let i = orderBySeq.indexOf(pre.sortOrder) + 1
            if (i >= orderBySeq.length) {
              i = 0
            }
            state.sortOrder = orderBySeq[i]
          }
          state.sortField = e.sortField
          return state
        })
        onSort && onSort(e)
      }}
      onPage={(e) => {
        setTableState(e)
        onPage && onPage(e)
      }}
      onFilter={(e) => {
        setTableState(e)
        onFilter && onFilter(e)
      }}
      {...rest}
    >
      {reorderableRows && <Column rowReorder style={{ width: '3rem' }} />}
      {columns.map((col, i) => (
        <Column key={i} {...col} header={() => headerTemplate(col)} />
      ))}
    </DataTable>
  )
}
