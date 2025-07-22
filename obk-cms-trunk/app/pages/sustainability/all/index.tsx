import { CheckIcon, HamburgerIcon } from '@chakra-ui/icons'
import { CategoryBadge } from '@components/statusBadge'
import ChangeOrder from '@components/sustainability/content-management/change-order'
import withGenericServer from '@hocs/server/generic'
import { useNavigation, useResource } from '@refinedev/core'
import { PCODE } from '@src/data/constants/privilege'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { contentService } from '@src/services/sustainability/content-mangement/service'
import { defaultToastMessage } from '@src/utils/default-toast'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { ColumnProps } from 'primereact/column'
import { confirmDialog } from 'primereact/confirmdialog'
import { classNames } from 'primereact/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Table } from '@components/table/Table'
import { ContentManagementFilter } from '@components/sustainability/content-management/content-management-filter'
import { useDebounce } from 'primereact/hooks'
import {
  ContentManagement,
  IContentManagement,
} from '@components/sustainability/content-management/content-management-interface'
import { FormControllerRef } from '@components/forms/components/form-controller'
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

const Sustainability = () => {
  const router = useRouter()

  const nav = useNavigation() as any
  const resources = useResource()

  const [totalRecords, setTotalRecords] = useState(0)
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableState, setTableState] = useState<any>()

  const formRef = useRef<FormControllerRef<IContentManagement>>(null)

  const [
    filterContentManagement,
    debouncedFilterContentManagement,
    setFilterContentManagement,
  ] = useDebounce<IContentManagement>({}, 400)

  const fetchContent = useCallback(
    async (paginationState: any) => {
      setTableState(paginationState)
      setIsLoading(true)
      await contentService
        .getAll(
          filterContentManagement,
          paginationState
            ? {
                ...paginationState,
                page: (paginationState.page ?? 0) + 1,
              }
            : paginationState
        )
        .then((res) => {
          res.data.data.forEach((obj: any) => {
            obj.configOrder = {
              ...obj.configOrder,
              id: obj.id,
            }
          })

          setData(res.data.data)
          setTotalRecords(res.data?.pagination?.total || 1)
          setIsLoading(false)
        })
    },
    [debouncedFilterContentManagement]
  )

  useEffect(() => {
    fetchContent(tableState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterContentManagement, tableState])

  const onChangeOrder = (o: any, n: any, i: any) => {
    const params = {
      id: i,
      type: 2,
      newOrder: n,
    }
    confirmDialog({
      message: 'Are you sure you want to change order?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              accept()
              const promise = contentService.changeOrder(params).then(() => {
                formRef.current?.setValue('filter', '')
                const value =
                  formRef.current?.getValues() ??
                  new ContentManagement(undefined)
                setFilterContentManagement(value)
                fetchContent(tableState)
              })
              toast.promise(promise, defaultToastMessage)
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const updateDateToDateText = (rowData: any) => {
    return <div>{moment(rowData.lastUpdate).format('DD/MM/yyyy HH:mm')}</div>
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'order',
        accessorKey: 'configOrder',
        header: 'Order',
        style: { minWidth: '130px' },
        sortable: false,
        body: (data: any) => {
          let arrOpt = []
          for (let i = 1; i <= (data?.configOrder?.max ?? 1); i++) {
            arrOpt.push({ name: `${i}`, value: i })
          }
          return (
            <ChangeOrder
              order={data?.configOrder?.current ?? 1}
              onChangeOrder={onChangeOrder}
              optOrder={arrOpt}
              id={data?.configOrder?.id ?? ''}
            />
          )
        },
      },
      {
        field: 'sustainability',
        accessorKey: 'sustainability',
        header: 'Sustainability',
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
        header: 'Sub menu',
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

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>
              Sustainability
            </div>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Content Management
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-content-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              className='px-5 bg-primary-blue'
              label='Create new content'
              onClick={() => {
                router.push('/sustainability/all/create')
              }}
            />
          </div>
        </div>
      </div>
      <div className='card'>
        <div>
          <div className='flex justify-content-between mb-2 filter-bar'>
            <ContentManagementFilter
              onFilter={setFilterContentManagement}
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
              onTableStateChange={fetchContent}
              rows={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sustainability

Sustainability.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/all',
    accessPage: PCODE.VIEWCONTENT,
  }
)
