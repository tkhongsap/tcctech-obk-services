import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ChangeOrder from '@components/sustainability/content-management/change-order'
import { CheckIcon } from '@chakra-ui/icons'
import { CategoryBadge } from '@components/statusBadge'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { classNames } from 'primereact/utils'
import { useRouter } from 'next/router'
import {
  IContentManagement,
  ContentManagement,
} from '@components/sustainability/content-management/content-management-interface'
import { useDebounce } from 'primereact/hooks'
import { Table } from '@components/table/Table'
import { ContentManagementFilter } from '@components/sustainability/content-management/content-management-filter'
import { Button } from 'primereact/button'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { ColumnProps } from 'primereact/column'
import { useNavigation, useResource } from '@refinedev/core'
import { FormControllerRef } from '@components/forms/components/form-controller'
import { heroService } from '@src/services/marcom/hero-banner/service'
import moment from 'moment'

const IconCell = ({
  value,
  IconComponent,
  color,
}: {
  value: any
  IconComponent: React.ElementType
  color: string
}) => (value ? <IconComponent style={{ color }} /> : null)

const HeroBanner = () => {
  const router = useRouter()

  const nav = useNavigation() as any
  const resources = useResource()

  const [totalRecords, setTotalRecords] = useState(0)
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableState, setTableState] = useState<any>()

  const formRef = useRef<FormControllerRef<IContentManagement>>(null)

  const [filterHero, debouncedFilterHero, setFilterHero] =
    useDebounce<IContentManagement>({}, 400)

  const onChangeOrder = (o: any, n: any, i: any) => {
    const params = {
      id: i,
      type: 1,
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
                setFilterHero(value)
                fetchHero(tableState)
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
        field: 'bannerName',
        accessorKey: 'bannerName',
        header: 'Banner Name',
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
        field: 'content',
        accessorKey: 'content',
        header: 'Content',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={data.content.isHasContent}
            IconComponent={CheckIcon}
            color='#2a36b1'
          />
        ),
      },
      {
        field: 'link',
        accessorKey: 'isHasLink',
        header: 'Link to',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: any) => (
          <IconCell
            value={data.isHasLink}
            IconComponent={CheckIcon}
            color='#2a36b1'
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

  const fetchHero = useCallback(
    async (paginationState: any) => {
      setTableState(paginationState)
      setIsLoading(true)
      try {
        const res = await heroService.getAll(
          filterHero,
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
        formRef.current?.setValue('time', res.data.time ?? '')
      } catch (error) {
        console.error('Error fetching heroes:', error)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilterHero, tableState]
  )

  useEffect(() => {
    fetchHero(tableState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterHero, tableState])

  function isNumeric(str: string) {
    return /^[0-9]+$/.test(str)
  }

  const onSave = (data: any) => {
    if (!isNumeric(data.time)) {
      toast.warning('Please enter time only number.')
      return false
    }
    const result = {
      type: 1,
      time: parseInt(data.time),
    }
    confirmDialog({
      message: 'Are you sure you want to save time to slide ?',
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
              try {
                await toast.promise(heroService.saveconfig(result), {
                  pending: 'Loading...',
                  success: 'time save successfully!',
                  error: {
                    render(err: any) {
                      const message =
                        err.data?.response?.data?.messages?.[0] ??
                        'Something went wrong.'
                      return `Error: ${message}`
                    },
                  },
                })
              } catch (_error) {}
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
  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>
              Marcom
            </div>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Hero Banner
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-content-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              className='px-5 bg-primary-blue'
              label='Create new hero banner'
              onClick={() => {
                router.push('/marcom/hero/create')
              }}
            />
          </div>
        </div>
      </div>
      <div className='card'>
        <div>
          <div className='flex justify-content-between mb-2 filter-bar'>
            <ContentManagementFilter
              onFilter={setFilterHero}
              search
              formRef={formRef}
              time
              config
              save
              onSave={onSave}
            />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              onTableStateChange={fetchHero}
              rows={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
HeroBanner.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/hero',
    accessPage: PCODE.LISTHERO,
  }
)
