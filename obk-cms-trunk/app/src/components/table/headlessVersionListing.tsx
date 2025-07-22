import React from 'react'
import Table from '.'

interface IHeadlessVersionListing {
  currentVersionList: any
  olderVersionList?: any
  tableTools: any
  isLoading?: boolean
  currentVersionTitle?: string
  olderVersionTitle?: string
  onFilter?: (value: any) => void
  isSearchFilter?: boolean
  customFilter?: {
    field: string
    options: { label: string; value: string }[]
    placeholder: string
  }[]
}

const HeadlessVersionListing = ({
  currentVersionList,
  olderVersionList,
  tableTools,
  isLoading,
  currentVersionTitle,
  olderVersionTitle,
  onFilter,
  isSearchFilter,
  customFilter,
}: IHeadlessVersionListing) => {
  const { currentPage, setCurrentPage, pagination } = tableTools
  return (
    <div>
      <div className='tw-flex tw-flex-col tw-items-center tw-gap-[32px]'>
        <>
          <Table
            columns={currentVersionList.columns}
            data={currentVersionList.data}
            sortingProps={{
              sorting: tableTools.sorting,
              setSorting: tableTools.setSorting,
            }}
            title={currentVersionTitle || 'Current Version'}
            isLoading={isLoading}
          />
          {olderVersionList && (
            <Table
              columns={olderVersionList.columns}
              data={olderVersionList.data}
              sortingProps={{
                sorting: tableTools.sorting,
                setSorting: tableTools.setSorting,
              }}
              paginationProps={{
                currentPage: currentPage,
                pageOnChange: setCurrentPage,
                totalPage: pagination.totalPage,
              }}
              title={olderVersionTitle || 'Past Versions'}
              onFilter={onFilter}
              searchable={isSearchFilter}
              customFilter={customFilter}
              isLoading={isLoading}
            />
          )}
        </>
        {/* )} */}
      </div>
    </div>
  )
}

export default HeadlessVersionListing
