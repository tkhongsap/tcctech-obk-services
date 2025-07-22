import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckIcon, HamburgerIcon } from '@chakra-ui/icons'
import { CategoryBadge } from '@components/statusBadge'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { classNames } from 'primereact/utils'
import { useRouter } from 'next/router'
import { IContentManagement } from '@components/sustainability/content-management/content-management-interface'
import { useDebounce } from 'primereact/hooks'
import { Table } from '@components/table/Table'
import { ContentManagementFilter } from '@components/sustainability/content-management/content-management-filter'
import { Button } from 'primereact/button'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { ColumnProps } from 'primereact/column'
import { useNavigation, useResource } from '@refinedev/core'
import { FormControllerRef } from '@components/forms/components/form-controller'
import { happeningService } from '@src/services/marcom/what-happening/service'
import moment from 'moment'

const IconCell = ({
  value,
  IconComponent,
  color,
  onClick = () => {},
  className = '',
}: {
  value: any
  IconComponent: React.ElementType
  color: string
  onClick?: any
  className?: string
}) =>
  value ? (
    <IconComponent style={{ color }} onClick={onClick} className={className} />
  ) : null

const Happening = () => {
  const router = useRouter()

  const nav = useNavigation() as any
  const resources = useResource()

  const [totalRecords, setTotalRecords] = useState(0)
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableState, setTableState] = useState<any>()

  const formRef = useRef<FormControllerRef<IContentManagement>>(null)

  const [filterHappening, debouncedFilterHappening, setFilterHappening] =
    useDebounce<IContentManagement>({}, 400)

  const updateDateToDateText = (rowData: any) => {
    return <div>{moment(rowData.lastUpdate).format('DD/MM/yyyy HH:mm')}</div>
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'categoryName',
        accessorKey: 'categoryName',
        header: 'Category Name',
        style: { minWidth: '200px' },
        sortable: false,
      },
      {
        field: 'en',
        accessorKey: 'isHasEN',
        header: 'EN',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={data.isHasEN}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'th',
        accessorKey: 'isHasTH',
        header: 'TH',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={data.isHasTH}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'cn',
        accessorKey: 'isHasCN',
        header: 'CN',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={data.isHasCN}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'isSub',
        accessorKey: 'id',
        header: 'Content',
        sortable: false,
        style: { minWidth: '80px' },
        body: (data: any) => (
          <IconCell
            value={true}
            IconComponent={HamburgerIcon}
            color='#2B3674'
            onClick={() => {
              nav?.['show'](resources?.identifier, data.id)
            }}
            className='cursor-pointer'
          />
        ),
      },
      {
        id: 'lastUpdate',
        accessorKey: 'lastUpdate',
        header: 'Last Update',
        style: { minWidth: '170px' },
        sortable: false,
        body: updateDateToDateText,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        style: { minWidth: '80px' },
        body: (data: any) => (
          <CategoryBadge status={data.status as CATEGORY_STATUS} />
        ),
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Actions',
        style: { minWidth: '100px' },
        body: (data) => (
          <div
            className={classNames(
              'flex justify-content-start gap-2 font-xl font-bold'
            )}
          >
            <a
              className='cursor-pointer text-primary-blue'
              onClick={() => {
                nav?.['edit'](resources?.identifier, data.id)
              }}
            >
              Edit
            </a>
          </div>
        ),
      },
    ],
    []
  )

  const fetchHappening = useCallback(
    async (paginationState: any) => {
      setTableState(paginationState)
      setIsLoading(true)
      try {
        const res = await happeningService.getAll(
          filterHappening,
          paginationState
            ? {
                ...paginationState,
                page: (paginationState.page ?? 0) + 1,
              }
            : paginationState
        )

        res.data.data.forEach((obj: any) => {
          obj.configOrder = {
            ...obj.configOrder,
            id: obj.id,
          }
          obj.content = {
            ...obj.content,
            isHasContent: obj.isHasContent,
          }
        })

        setData(res.data.data ?? [])
        setTotalRecords(res.data?.pagination?.total || 1)
      } catch (error) {
        console.error('Error fetching heroes:', error)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilterHappening, tableState]
  )

  useEffect(() => {
    fetchHappening(tableState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterHappening, tableState])

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>
              Marcom
            </div>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              {"What's Happening"}
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-content-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start mr-2'>
            <Button
              className='px-5 bg-primary-blue'
              label='Manage Order Pin'
              onClick={() => {
                router.push('/marcom/happening/order')
              }}
            />
          </div>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              className='px-5 bg-primary-blue'
              label='Create new category'
              onClick={() => {
                router.push('/marcom/happening/create')
              }}
            />
          </div>
        </div>
      </div>
      <div className='card'>
        <div>
          <div className='flex justify-content-between mb-2 filter-bar'>
            <ContentManagementFilter
              onFilter={setFilterHappening}
              search
              formRef={formRef}
            />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              onTableStateChange={fetchHappening}
              rows={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Happening
Happening.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/happening',
    accessPage: PCODE.LISTHERO,
  }
)
