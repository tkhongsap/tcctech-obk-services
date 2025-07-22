import withGenericServer from '@hocs/server/generic'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnProps } from 'primereact/column'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Table } from '@components/table/Table'
import clsx from 'clsx'
import { Dialog } from 'primereact/dialog'
import { Icon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  GetParkingDetailResponse,
  Receipt,
  ReceiptStatus,
} from 'ob-parking-sdk/dist/api'
import { ReceiptCamera } from '@components/car-park/self-redemption/receipt-camera'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'
import { DataTableStateEvent } from 'primereact/datatable'
import { ReceiptForm } from '@components/car-park/self-redemption/receipt-form'
import { TEN_MB } from '@src/data/constants/fileSize'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import { capitalize } from 'lodash'
import { getReceiptFetchingTime } from '@src/utils/receipt-fetching-time'
import { OverlayPanel } from 'primereact/overlaypanel'
import Image from 'next/image'
import { useTranslate } from '@refinedev/core'
import { useRouter } from 'next/router'

type Props = {
  id: string
  personalInfo: IPersonalInfo
  defaultParkingDetail: GetParkingDetailResponse
}

export type RedemptionDetailModal =
  | 'redeem'
  | 'success'
  | 'detail'
  | 'redeem-failed'
  | undefined
  | 'add-receipt'
  | 'scanned'
  | 'update-receipt-form'
  | 'invalid'
  | 'update-receipt-failed'

const ContentPopover = (key: string, plainHtml: string) => (
  <div>
    <p className='font-bold tw-text-[#CD1A1A]'>{key}</p>
    <div
      dangerouslySetInnerHTML={{
        __html: plainHtml || '',
      }}
    />
  </div>
)

export default function SelfRedemptionDetail({
  id,
  personalInfo,
  defaultParkingDetail,
}: Props) {
  const { setMenuAction, setMenuName } = useLayoutContext()
  const router = useRouter()
  const regexFormatCurrency = /\B(?=(\d{3})+(?!\d))/g
  const [isShowModal, setIsShowModal] =
    useState<RedemptionDetailModal>(undefined)
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [parkingDetail, setParkingDetail] =
    useState<GetParkingDetailResponse>(defaultParkingDetail)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>()
  const [imageFile, setImageFile] = useState<File>()
  const [isLoading, setIsLoading] = useState(false)
  const { sortField = 'created_at', sortOrder, page, rows } = tableState ?? {}
  const overlayRefs = useRef<Record<string, React.RefObject<OverlayPanel>>>({})
  const translate = useTranslate()
  const totalAmount = parkingDetail.total_amount?.toString() ?? '0'

  const setRefForId = (id: string) => {
    if (!overlayRefs.current[id]) {
      overlayRefs.current[id] = createRef<OverlayPanel>()
    }
    return overlayRefs.current[id]
  }

  useEffect(() => {
    setMenuName('Record Details')
    const menuAction = (
      <div className='flex tw-gap-6'>
        <div className='flex gap-3'>
          <Button
            className='bg-primary-blue'
            label='Redeem parking ticket'
            onClick={() => setIsShowModal('redeem')}
          />
        </div>
      </div>
    )

    setMenuAction(menuAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'receipt_no',
        header: 'Receipt no.',
        style: { width: '300px' },
        sortable: true,

        body: ({ receipt_no }) => {
          return <span>{receipt_no ? receipt_no : '-'}</span>
        },
      },
      {
        field: 'total',
        header: 'Subtotal',
        style: { minWidth: '75px' },
        sortable: true,
        align: 'center',
        body: ({ total }) => {
          const regexFormatCurrency = /\B(?=(\d{3})+(?!\d))/g
          return (
            <div>
              <span>
                {total === '0'
                  ? '0'
                  : Number(total) > 0
                  ? total.replace(regexFormatCurrency, ',')
                  : '-'}{' '}
                THB
              </span>
            </div>
          )
        },
      },
      {
        field: 'status',
        header: 'Status',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ status }: { status: ReceiptStatus }) => {
          return (
            <div>
              <span
                style={{
                  color: status === ReceiptStatus.Redeemed ? '#4318FF' : '',
                  backgroundColor:
                    status === ReceiptStatus.Redeemed ? '#E8E7FF' : '',
                }}
                className={clsx({
                  'p-2 tw-rounded-lg': true,
                  'text-success bg-success': status === ReceiptStatus.Success,
                  'text-danger bg-danger': status === ReceiptStatus.Declined,
                  'text-warning bg-warning':
                    status === ReceiptStatus.Dispute ||
                    status === ReceiptStatus.Duplicated,
                  'text-pending bg-pending':
                    status === ReceiptStatus.Pending ||
                    status === ReceiptStatus.Processing,
                })}
              >
                {status === ReceiptStatus.Processing
                  ? 'Pending'
                  : capitalize(status)}
              </span>
            </div>
          )
        },
      },
      {
        field: 'message',
        header: 'Reason',
        align: 'center',
        style: { minWidth: '75px' },
        sortable: true,
        body: (data: Receipt) => {
          const opRef = setRefForId(data.id)
          // TODO : Change to remote config for dynamic key error message
          const plainHtml = translate(`errorMessage.${data.message}`)
          return (
            <div className='flex gap-2 items-center tw-justify-center w-auto'>
              <span
                className={clsx({
                  'text-danger': data.status === ReceiptStatus.Declined,
                })}
              >
                {data?.message ?? '-'}
              </span>
              {data.status === ReceiptStatus.Declined && data.message && (
                <>
                  {' '}
                  <span
                    className='flex items-center tw-justify-center hover:tw-bg-[#E7E7E7] tw-rounded-full'
                    onClick={(e) => opRef.current?.toggle(e)}
                  >
                    <Image
                      src='/images/icons/info.svg'
                      alt='info'
                      width={20}
                      height={20}
                      className='tw-size-5'
                    />
                  </span>
                  <OverlayPanel ref={opRef} className='tw-max-w-[400px]'>
                    {ContentPopover(data.message, plainHtml)}
                  </OverlayPanel>{' '}
                </>
              )}
            </div>
          )
        },
      },
      {
        header: 'Image',
        style: { minWidth: '75px' },
        align: 'center',
        body: (receipt: Receipt) => {
          const isDisabled =
            receipt.status === ReceiptStatus.Pending ||
            receipt.status === ReceiptStatus.Processing ||
            receipt.status === ReceiptStatus.Redeemed
          return (
            <Button
              disabled={isDisabled}
              text
              label='Edit receipt'
              onClick={() => {
                setSelectedReceipt(receipt)
                setIsShowModal('update-receipt-form')
              }}
            />
          )
        },
      },
    ],
    []
  )

  useEffect(() => {
    let isMounted = true
    let fetchReceiptInterval: NodeJS.Timeout | null = null
    const orderDirection =
      sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : undefined

    if (isShowModal !== 'scanned') {
      const fetchingTimeAndStartInterval = async () => {
        const fetchingTime = await getReceiptFetchingTime()
        const defaultSorting = orderDirection ? sortField : 'created_at'
        const getParkingById = async () => {
          if (!isMounted) return
          const res =
            await OB_PARKING_SDK.client.parkingDetailsGetParkingDetail(
              id,
              defaultSorting,
              orderDirection ?? 'desc',
              (page ?? 0) + 1,
              rows
            )
          if (!isMounted) return

          setTotalRecords(res.data.pagination?.total || 0)
          setParkingDetail({ ...res.data.data })
        }
        await getParkingById()

        fetchReceiptInterval = setInterval(() => {
          getParkingById()
        }, fetchingTime)
      }
      fetchingTimeAndStartInterval()
    }

    return () => {
      isMounted = false
      if (fetchReceiptInterval) clearInterval(fetchReceiptInterval)
    }
  }, [
    id,
    isShowModal,
    sortField,
    sortOrder,
    page,
    rows,
    router.query.direction,
  ])

  const handleUploadImage = (file: File) => {
    if (file.size > TEN_MB) {
      setIsShowModal('invalid')
    } else {
      setImageFile(file)
      setIsShowModal('scanned')
    }
  }

  const handleRedeem = async () => {
    setIsLoading(true)
    try {
      const res = await OB_PARKING_SDK.client.parkingDetailsRedeem(
        parkingDetail.parking_ticket,
        {
          parking_detail_id: parkingDetail.id,
          type: 'REDEEM',
        }
      )
      if (res.data) {
        setIsShowModal('success')
      }
    } catch (e) {
      setIsShowModal('redeem-failed')
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  const redeemFailed = isShowModal === 'redeem-failed'
  const updateReceiptFailed = isShowModal === 'update-receipt-failed'

  return (
    <div>
      <div className='card tw-flex tw-flex-col tw-gap-6'>
        <span className='flex text-xl font-bold text-astronaut'>
          Transaction & User Details
        </span>
        <div className='grid m-0'>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>Record ID</span>
            <InputText disabled defaultValue={parkingDetail.record_id} />
          </div>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>Parking Ticket ID</span>
            <InputText
              disabled
              defaultValue={parkingDetail?.parking_ticket || '-'}
            />
          </div>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>License Plate</span>
            <InputText
              disabled
              defaultValue={parkingDetail?.license_plate || '-'}
            />
          </div>
        </div>
        <div className='grid m-0'>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>User ID</span>
            <InputText
              disabled
              defaultValue={parkingDetail?.account_detail?.id || '-'}
            />
          </div>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>Username</span>
            <InputText
              disabled
              defaultValue={parkingDetail?.account_detail?.username || '-'}
            />
          </div>
          <div className='flex tw-flex-col tw-gap-2 col-12 md:col-4'>
            <span className='text-info'>Total Amount Spent (THB)</span>
            <InputText
              disabled
              value={totalAmount.replace(regexFormatCurrency, ',')}
            />
          </div>
        </div>
        <div className='grid m-0 px-2'>
          <div
            style={{ borderTop: '1px solid #A3AED0' }}
            className='col-12 md:col-12'
          />
          <div className='flex gap-3'>
            <span style={{ color: '#1B1B1B' }} className='text-info'>
              Rate details
            </span>
            <span style={{ color: '#676B9B' }} className=''>
              {parkingDetail?.rate_detail?.en || '-'}
            </span>
          </div>
        </div>
      </div>

      <div className='card tw-flex tw-flex-col tw-gap-8'>
        <div className='flex tw-gap-8 tw-items-center'>
          <span className='flex text-xl font-bold text-astronaut'>
            Receipt details
          </span>
          <Button
            outlined
            label='Add more receipts'
            style={{ color: '#4318FF' }}
            onClick={() => setIsShowModal('add-receipt')}
          />
        </div>
        <Table
          scrollable
          scrollHeight='490px'
          columns={columns}
          data={parkingDetail?.receipts ?? []}
          totalRecords={totalRecords}
          onTableStateChange={setTableState}
        />
      </div>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'redeem'}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-xl tw-text-[#1B2559]'>
              Are you sure you want to redeem?
            </span>
            <div style={{ gap: '1.25rem' }} className='flex'>
              <Button
                loading={isLoading}
                className='bg-primary-blue'
                onClick={() => {
                  handleRedeem()
                }}
                label='Confirm'
              />
              <Button
                loading={isLoading}
                outlined
                style={{ color: '#4318FF' }}
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'success'}
        style={{ minWidth: '35vw', maxWidth: '640px' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <Icon width={40} height={40} color={'#59B413'}>
              <CheckCircleIcon />
            </Icon>
            <span className='font-bold tw-text-xl tw-text-[#1B2559]'>
              Parking ticket redeemed successfully
            </span>
            <p className='text-info m-0'>
              This parking ticket has been successfully redeemed. The
              notification has been sent to the user on their One Bangkok app.
            </p>
            <div style={{ gap: '1.25rem' }} className='flex'>
              <Button
                className='bg-primary-blue'
                onClick={(e) => {
                  setIsShowModal(undefined)
                  hide(e)
                }}
                label='Done'
              />
            </div>
          </div>
        )}
      ></Dialog>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'add-receipt'}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white tw-p-10 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl tw-text-[#1B2559]'>
              Add a receipt
            </span>
            <div className='flex tw-gap-6 tw-items-center'>
              <div
                style={{
                  backgroundColor: '#EDF1FF',
                  border: '1px solid #A3AED0',
                  height: 208,
                  width: 440,
                }}
                className='px-5 tw-pt-11 tw-gap-6 tw-rounded-lg flex tw-flex-col tw-justify-center'
              >
                <div className='tw-flex tw-flex-col gap-2'>
                  <p className='m-0 text-center text-info tw-font-medium'>
                    Scan receipt
                  </p>
                  <span className='text-center'>
                    You can scan the receipt by camera
                  </span>
                </div>
                <div className='flex tw-justify-center'>
                  <Button
                    onClick={() => {
                      setIsShowModal('scanned')
                    }}
                    outlined
                    style={{ color: '#4318FF', fontWeight: 500 }}
                  >
                    Scan Receipt
                  </Button>
                </div>
              </div>
              <span className='text-info'>Or</span>
              <div
                style={{
                  backgroundColor: '#EDF1FF',
                  border: '1px solid #A3AED0',
                  height: 208,
                  width: 440,
                }}
                className='px-5 tw-rounded-lg py-5 tw-gap-6 flex tw-flex-col tw-items-center tw-justify-center'
              >
                <div className='tw-flex tw-flex-col gap-2'>
                  <p className='m-0 text-center text-info tw-font-medium'>
                    Upload receipt
                  </p>
                  <span className='text-center'>
                    Acceptable file formats: JPG, PNG, PDF{' '}
                  </span>
                </div>
                <div className='flex tw-justify-center'>
                  <label
                    className='tw-font-medium px-6 tw-py-3 tw-rounded-lg tw-cursor-pointer'
                    style={{ color: '#4318FF', border: '1px solid #4318FF' }}
                    htmlFor='upload-receipt-img'
                  >
                    Click to upload a receipt
                  </label>
                  <InputText
                    onChange={(e) => {
                      if (e.target.files) {
                        handleUploadImage(e.target.files[0])
                      }
                    }}
                    style={{ display: 'none' }}
                    id='upload-receipt-img'
                    type='file'
                    className='tw-hidden'
                  />
                </div>
              </div>
            </div>
            <div className='flex gap-5'>
              <Button
                disabled
                className='bg-primary-blue'
                type='button'
                label='Validate receipt'
              />
              <Button
                text
                style={{ color: '#4318FF' }}
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
      {isShowModal === 'scanned' && (
        <ReceiptCamera
          visible={isShowModal === 'scanned'}
          imageFile={imageFile}
          setImageFile={setImageFile}
          email={personalInfo.email}
          parkingDetailId={id}
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        />
      )}
      {selectedReceipt && (
        <ReceiptForm
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
          receipt={selectedReceipt}
        />
      )}
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'invalid'}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl text-danger'>
              Image file is too large
            </span>
            <p>
              The image file is larger than 10 MB. Please choose another image
              and try again.
            </p>
            <div className='flex tw-gap-2'>
              <Button
                className='bg-primary-blue'
                onClick={() => {
                  setIsShowModal('add-receipt')
                }}
                label='Try again'
              />
              <Button
                text
                style={{ color: '#4318FF' }}
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={redeemFailed || updateReceiptFailed}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl text-danger'>
              {redeemFailed ? 'Redemption failed' : 'Update receipt failed'}
            </span>
            <p>Something went wrong. Please try again.</p>
            <div className='flex tw-gap-2'>
              <Button
                className='bg-primary-blue'
                onClick={() => {
                  redeemFailed
                    ? setIsShowModal('redeem')
                    : setIsShowModal(undefined)
                }}
                label='Try again'
              />
              <Button
                text
                style={{ color: '#4318FF' }}
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
    </div>
  )
}

SelfRedemptionDetail.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id, direction, current, sorting } = ctx.props.query
    const getParkingDetail =
      await OB_PARKING_SDK.client.parkingDetailsGetParkingDetail(
        id,
        sorting ?? 'created_at',
        direction ?? 'desc',
        current ?? 0,
        25
      )
    const parkingDetail = getParkingDetail.data.data

    try {
      const res = await memberService.getByKeycloakId(ctx.props.userId)
      const personalInfo = res.data
      ctx.props = {
        ...ctx.props,
        id,
        personalInfo,
        defaultParkingDetail: parkingDetail,
      }
      return ctx
    } catch (error) {
      return {
        redirect: {
          destination: '/car-park/self-redemption-record',
          permanent: false,
        },
      }
    }
  },
  {
    redirectPath: '/car-park/self-redemption-record',
  }
)
