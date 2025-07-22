import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { CheckIcon, Icon, SearchIcon } from '@chakra-ui/icons'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { CategoryBadge } from '@components/statusBadge'
import { Table } from '@components/table/Table'
import { useDebounce } from 'primereact/hooks'
import { ContentManagementFilter } from '@components/sustainability/content-management/content-management-filter'
import ChangeOrder from '@components/sustainability/content-management/change-order'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { classNames } from 'primereact/utils'
import { confirmDialog } from 'primereact/confirmdialog'
import { Button } from 'primereact/button'
import { defaultToastMessage } from '@src/utils/default-toast'
import { toast } from 'react-toastify'
import { Dialog } from 'primereact/dialog'
import { ColumnProps } from 'primereact/column'
import { FormControllerRef } from '@components/forms/components/form-controller'
import { happeningService } from '@src/services/marcom/what-happening/service'
import { heroService } from '@src/services/marcom/hero-banner/service'
import {
  ContentManagement,
  IContentManagement,
} from '@components/sustainability/content-management/content-management-interface'
import { useRouter } from 'next/router'
import PreviewContentTable from '@components/marcom/happening/preview-table'
import moment from 'moment'

function PinIcon(props: any) {
  return (
    <Icon viewBox='0 0 24 24' {...props}>
      <path
        fill='currentColor'
        d='M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z'
      />
    </Icon>
  )
}

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

const OrderList = () => {
  const router = useRouter()

  const formRef = useRef<FormControllerRef<IContentManagement>>(null)

  const [totalRecords, setTotalRecords] = useState(0)
  const [tableState, setTableState] = useState<any>()
  const [content, setContent] = useState({})
  const [visible, setVisible] = useState<boolean>(false)
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  const [filterContent, debouncedFilterContent, setFilterContent] =
    useDebounce<IContentManagement>({}, 400)

  const onChangeOrder = (o: any, n: any, i: any) => {
    const params = {
      id: i,
      type: 6,
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
              const promise = heroService.changeOrder(params).then(() => {
                formRef.current?.setValue('filter', '')
                const value =
                  formRef.current?.getValues() ??
                  new ContentManagement(undefined)
                setFilterContent(value)
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
        field: 'isPin',
        accessorKey: 'isPin',
        header: 'Pin',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={true}
            IconComponent={PinIcon}
            color={data.isPin ? '#ff0000' : '#e0e0e0'}
          />
        ),
      },
      {
        field: 'title',
        accessorKey: 'title',
        header: 'Title name',
        style: { minWidth: '200px' },
        sortable: false,
      },
      {
        field: 'category',
        accessorKey: 'category',
        header: 'Category',
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
        id: 'content',
        accessorKey: 'content',
        header: 'Content',
        sortable: false,
        style: { minWidth: '80px' },
        body: (data: any) => (
          <IconCell
            value={true}
            IconComponent={SearchIcon}
            color='#2B3674'
            className='cursor-pointer'
            onClick={() => {
              setVisible(true)
              setContent(data.content)
            }}
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
                // nav?.['edit'](resources?.identifier, data.id)
                router.push(`/marcom/happening/edit/${data.id}`)
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

  const fetchContent = useCallback(
    async (paginationState: any) => {
      setTableState(paginationState)
      setIsLoading(true)
      await happeningService
        .getAllContent(
          {
            ...filterContent,
            parentID: null,
            isPin: true,
          },
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
          setIsLoading(false)
          setTotalRecords(res.data?.pagination?.total || 1)
        })
    },
    [debouncedFilterContent, tableState]
  )

  useEffect(() => {
    fetchContent(tableState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterContent, tableState])

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <Dialog
        header=''
        visible={visible}
        style={{ width: '400px', height: '800px', marginRight: '3rem' }}
        position='bottom-right'
        onHide={() => {
          if (!visible) return
          setVisible(false)
        }}
        contentStyle={{ padding: 0 }}
        contentClassName='dialog-preview'
      >
        <PreviewContentTable content={content} />
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <a
            className='text-sm font-medium cursor-pointer'
            style={{ color: '#707EAE' }}
            onClick={() => router.push(`/marcom/happening`)}
          >
            &#60; Back
          </a>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              {"What's Happening"}
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-content-end'></div>
      </div>
      <div className='card'>
        <div>
          <div className='flex justify-content-between mb-2 filter-bar'>
            <ContentManagementFilter
              onFilter={setFilterContent}
              search
              formRef={formRef}
              title='Pin List'
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

export default OrderList

OrderList.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/happening',
    accessPage: PCODE.SHOWHAPPENNING,
  }
)
