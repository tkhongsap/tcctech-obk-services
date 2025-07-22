import React from 'react'
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import clsx from 'clsx'
import styled, { css } from 'styled-components'

import GenericFilterPane from '@components/filter-pane/generic'
import ListPagination from '@components/list/pagination'
import SvgTriangle from '@assets/svg/triangle.svg'
import Skeleton from '@components/skeleton'
import { KeyValue } from '@src/types/key-value'

interface ITable {
  columns: ColumnDef<any>[]
  data: any[]
  className?: string
  onFilter?: any
  paginationProps?: any
  sortingProps?: any
  title?: string
  searchable?: boolean
  customFilter?: {
    field: string
    options: { label: string; value: string }[]
    placeholder: string
  }[]
  isLoading?: boolean
  bg?: string
  setFilterParkingAccess?: any
  onParkingFilter?: boolean
  gate?: KeyValue[]
  type?: KeyValue[]
  customComponentFilter?: any
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

const Table = ({
  columns,
  data,
  onFilter,
  paginationProps,
  className,
  sortingProps,
  title = 'List',
  searchable,
  customFilter,
  isLoading,
  bg = 'white',
  customComponentFilter,
}: ITable) => {
  const { sorting, setSorting } = sortingProps || {}

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // manualSorting: true,
    state: {
      sorting: sorting || {},
    },
    onSortingChange: setSorting || {},
    enableMultiSort: false,
  })

  return (
    <>
      <div
        className={clsx(className, 'tw-rounded-[10px] tw-w-full')}
        style={{ backgroundColor: bg }}
      >
        <div
          className={clsx(
            'tw-flex tw-items-center tw-justify-between tw-gap-2 tw-p-[15px] tw-mb-7 !tw-pb-0 xl:tw-p-7'
          )}
        >
          <div className='tw-text-2xl tw-text-[#1B2559] tw-font-bold tw-whitespace-nowrap'>
            {title}
          </div>
          {customComponentFilter && customComponentFilter()}
          {onFilter && (
            <GenericFilterPane
              onFilter={onFilter}
              searchable={searchable}
              customFilter={customFilter}
            />
          )}
        </div>
        <div className='tw-overflow-auto tw-max-w-full tw-max-h-[50vh] md:tw-max-h-[80vh]'>
          <div className='tw-overflow-x-auto tw-overflow-y-hidden'>
            {isLoading ? (
              <>
                <Skeleton.ListSkeleton className='tw-mb-5' />
              </>
            ) : (
              <table className='tw-w-full tw-rounded-b-[10px]'>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className='tw-sticky tw-top-0 tw-shadow-[rgba(0,0,0,0.02)_0px_4px_12px]'
                    >
                      {headerGroup.headers.map((header: any) => {
                        const className = header?.column?.columnDef?.className
                        const sortable = !!header?.column?.columnDef?.sortable

                        const toggleSorting = () => {
                          if (sortable) {
                            return header.column.getToggleSortingHandler()
                          }
                        }
                        const sortOrder = header.column.getIsSorted()

                        return (
                          <th
                            key={header.id}
                            className={clsx(
                              className,
                              'tw-text-[#676B9B] tw-text-sm tw-font-medium tw-py-3 tw-px-4 first:tw-pl-6 last:tw-pr-6'
                            )}
                          >
                            <div className='tw-flex tw-items-center'>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {sortable && (
                                <div
                                  className='tw-pl-1'
                                  onClick={toggleSorting()}
                                >
                                  <div>
                                    <SortIconBase
                                      active={sortOrder === 'asc' ? 'y' : 'n'}
                                    />
                                  </div>
                                  <div>
                                    <SortIconDesc
                                      active={sortOrder === 'desc' ? 'y' : 'n'}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={table.getAllLeafColumns().length}
                        className='text-center py-3'
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className='tw-bg-[#FCFCFC] tw-ease-in-out tw-duration-200 hover:tw-bg-[#F4F7FE] last:tw-rounded-[10px]'
                      >
                        {row.getVisibleCells().map((cell: any) => {
                          const className =
                            cell?.column?.columnDef?.className || ''
                          return (
                            <td
                              key={cell.id}
                              className={clsx(
                                'tw-py-3 tw-px-4 first:tw-pl-6 last:tw-pr-6 tw-text-sm tw-text-[#676B9B] first-of-type:tw-rounded-bl-[10px] last-of-type:tw-rounded-br-[10px]',
                                className
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {paginationProps && (
        <div className='tw-mt-9 tw-w-full tw-flex tw-justify-center lg:tw-justify-end'>
          <ListPagination {...paginationProps} />
        </div>
      )}
    </>
  )
}

export default Table
