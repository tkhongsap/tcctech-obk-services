import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { CheckIcon } from '@chakra-ui/icons'
import { Button } from 'primereact/button'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { CategoryBadge } from '@components/statusBadge'
import { Table } from '@components/table/Table'
import {
  IContentManagement,
  ContentManagement,
} from '@components/sustainability/content-management/content-management-interface'
import { useDebounce } from 'primereact/hooks'
import { ContentManagementFilter } from '@components/sustainability/content-management/content-management-filter'
import { useRouter } from 'next/router'
import ChangeOrder from '@components/sustainability/content-management/change-order'
import { classNames } from 'primereact/utils'
import { libraryService } from '@src/services/sustainability/digital-library/service'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { contentService } from '@src/services/sustainability/content-mangement/service'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { ColumnProps } from 'primereact/column'
import { useNavigation, useResource } from '@refinedev/core'
import { FormControllerRef } from '@components/forms/components/form-controller'
import moment from 'moment'
import QRCode from 'qrcode'
import { Dialog } from 'primereact/dialog'
import Image from 'next/image'

const IconCell = ({
  value,
  IconComponent,
  color,
}: {
  value: any
  IconComponent: React.ElementType
  color: string
}) => (value ? <IconComponent style={{ color }} /> : null)

const DigitalLibrary = () => {
  const router = useRouter()

  const formRef = useRef<FormControllerRef<IContentManagement>>(null)

  const nav = useNavigation() as any
  const resources = useResource()

  const [totalRecords, setTotalRecords] = useState(0)
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableState, setTableState] = useState<any>()

  const [
    filterContentManagement,
    debouncedFilterContentManagement,
    setFilterContentManagement,
  ] = useDebounce<IContentManagement>({}, 400)

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
        field: 'topic',
        accessorKey: 'topic',
        header: 'Topic',
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

  const fetchContent = useCallback(
    async (paginationState: any) => {
      setTableState(paginationState)
      setIsLoading(true)
      await libraryService
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
    [debouncedFilterContentManagement, tableState]
  )

  useEffect(() => {
    fetchContent(tableState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterContentManagement, tableState])

  const [visibleQrCode, setVisibleQrCode] = useState(false)
  const [qrCodeImage, setQRCodeImage] = useState<string | null>(null)
  const createQRCode = () => {
    QRCode.toDataURL(`${process.env.SUSTAIN_UNIVERSAL_LINK}/digitallibrary`)
      .then((url: string) => {
        setQRCodeImage(url)
      })
      .catch((err: any) => {
        console.warn(err)
      })
  }

  useEffect(() => {
    createQRCode()
  }, [])
  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <Dialog
        header='QR Code'
        visible={visibleQrCode}
        style={{ width: '300px' }}
        blockScroll={true}
        closeOnEscape={false}
        onHide={() => {
          if (!visibleQrCode) return
          setVisibleQrCode(false)
        }}
      >
        {qrCodeImage && (
          <div className='border-1 border-gray-200'>
            <Image
              src={qrCodeImage}
              className='w-full h-auto'
              width={320}
              height={320}
              alt='Picture of the author'
            />
          </div>
        )}
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>
              Sustainability
            </div>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Digital Library
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-content-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              className='px-5 bg-primary-blue'
              label='View QR'
              onClick={() => {
                setVisibleQrCode(true)
              }}
            />
            <Button
              className='px-5 bg-primary-blue'
              label='Create new library'
              onClick={() => {
                router.push('/sustainability/library/create')
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

export default DigitalLibrary

DigitalLibrary.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/library',
    accessPage: PCODE.VIEWLIBRARY,
  }
)
