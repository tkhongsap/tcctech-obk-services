import { SelfRedemptionFilter } from '@components/car-park/self-redemption/self-redemption-filter'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import { PCODE } from '@src/data/constants/privilege'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { ColumnProps } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ParkingTicketData } from 'ob-bms-sdk/dist/api'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import QRReader from '@components/car-park/self-redemption/self-redemptin-qr-reader'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { IFilterSelfRedemption } from '@components/car-park/self-redemption/self-redemption-interface'
import {
  AddParkingTicketIdType,
  AddParkingTicketType,
  GetParkingDetailsIndexResponse,
  ParkingDetailStatus,
  ReceiptStatus,
} from 'ob-parking-sdk/dist/api'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import selfRedemptionService from '@src/services/carpark/self-redemption'
export type Receipt = {
  id: string
  subTotal: number
  status: ReceiptStatus
  reason: string
  image: string
}

export type SelfRedemption = {
  id: string
  parking_ticket: ParkingTicketData
  userId: string
  username: string
  total_spend: number
  timestamp: string
  notice: ParkingDetailStatus
  receipt: Receipt[]
}

type Modal = 'add-record' | 'invalid' | 'scanned' | undefined
export default function SelfRedemptionRecords() {
  const translate = useTranslate()
  const router = useRouter()
  const pathName = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const [isShowModal, setIsShowModal] = useState<Modal>(undefined)
  const [parkingTicketId, setParkingTicketId] = useState('')
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [parkingDetails, setParkingDetails] = useState<
    GetParkingDetailsIndexResponse[]
  >([])

  const [
    filterParkingDetails,
    debouncedFilterParkingDetails,
    setFilterParkingDetails,
  ] = useDebounce<IFilterSelfRedemption>({}, 400)

  const addParkingTicket = async (id: string, type: AddParkingTicketIdType) => {
    try {
      let redemptionId = id
      let qrType = type
      if (type === AddParkingTicketIdType.MemberId) {
        const tokenDetail = await selfRedemptionService.getTokenDetail(id)
        let accountId = tokenDetail!.account_id
        if (tokenDetail!.type === 'visitor_pass') {
          const inviteDetail = await selfRedemptionService.getInviteDetail(
            tokenDetail?.id!
          )
          redemptionId = inviteDetail?.uid!
          qrType = AddParkingTicketIdType.InviteId
        } else if (tokenDetail!.type === 'qr') {
          const personId = await selfRedemptionService.getPersonId(accountId)
          redemptionId = personId ? personId : accountId
        }
      }

      setIsLoading(true)
      const parkingDetail = await OB_PARKING_SDK.client.parkingAddParkingTicket(
        redemptionId,
        AddParkingTicketType.Cms,
        qrType
      )

      if (parkingDetail.data.parkingDetailId) {
        router.push(`${pathName}/show/${parkingDetail.data.parkingDetailId}`)
      } else {
        setIsLoading(false)
        setIsShowModal('invalid')
      }
    } catch (error) {
      setIsLoading(false)
      setIsShowModal('invalid')
    }
  }

  const getParkingDetails = useCallback(async () => {
    setIsLoading(true)

    let filterDate: string[] | undefined

    if (!isEmpty(filterParkingDetails.date)) {
      filterDate = filterParkingDetails.date?.map((date) => {
        return new Date(date).toISOString()
      })
    }
    const sortOrder = tableState?.sortOrder
    const orderDirection =
      sortOrder === -1 ? 'desc' : sortOrder === 1 ? 'asc' : undefined
    const isDefaultSort = Boolean(tableState?.sortField && orderDirection)
    const sortingField = orderDirection ? tableState?.sortField : 'created_at'
    const sortOrderDefault = isDefaultSort ? orderDirection : 'desc'

    const response = await OB_PARKING_SDK.client.parkingDetailsIndex(
      sortingField,
      sortOrderDefault,
      (tableState?.page ?? 0) + 1,
      tableState?.rows,
      filterParkingDetails?.filter ?? undefined,
      undefined,
      filterDate && filterDate[0],
      filterDate && filterDate[1],
      filterParkingDetails?.status === ''
        ? undefined
        : (filterParkingDetails.status as ParkingDetailStatus)
    )
    setTotalRecords(response.data.pagination?.total ?? 0)

    const parkingDetails = response.data.data?.map((parkingDetail) => {
      return {
        ...parkingDetail,
        redeemed_at: parkingDetail.redeemed_at
          ? new Date(parkingDetail.redeemed_at)
              .toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
              .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$3-$1-$2 $4:$5')
          : '',
      }
    })
    setParkingDetails(parkingDetails)
    setIsLoading(false)
  }, [debouncedFilterParkingDetails, tableState])

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          outlined
          label='Export'
          style={{ color: '#4318FF' }}
          onClick={() => {}}
        />
        <Button
          className='bg-primary-blue'
          label='Add Record'
          onClick={() => setIsShowModal('add-record')}
        />
      </div>
    )

    setMenuAction(menuAction)
  }, [setMenuAction])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'record_id',
        header: 'Record ID',
        style: { minWidth: '75px' },
        sortable: true,
      },
      {
        field: 'uid',
        header: 'Parking ticket ID',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ parking_ticket_id }) => {
          return (
            <div>
              <p>{parking_ticket_id}</p>
            </div>
          )
        },
      },
      {
        field: 'plate_no',
        header: 'License plate',
        style: { minWidth: '90px' },
        sortable: true,
      },
      {
        field: 'account_id',
        header: 'User ID',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ account_detail }) => {
          return <p>{account_detail?.id || '-'}</p>
        },
      },
      {
        field: 'username',
        header: 'Username',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ account_detail }) => {
          return <p>{`${account_detail?.username || '-'}`}</p>
        },
      },
      {
        field: 'total_amount',
        header: 'Total amount spend ',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ total_amount }) => {
          const regexFormatCurrency = /\B(?=(\d{3})+(?!\d))/g
          return (
            <div>
              <span>{total_amount?.replace(regexFormatCurrency, ',')} THB</span>
            </div>
          )
        },
      },
      {
        field: 'redeemed_at',
        header: 'Redeemable timestamp',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ redeemed_at }) => {
          return (
            <div>
              <p>{redeemed_at || '-'}</p>
            </div>
          )
        },
      },
      {
        field: 'status',
        header: 'status',
        style: { minWidth: '75px' },
        sortable: true,
        body: ({ status }) => {
          return (
            <div>
              {status === 'ACTIVE' && (
                <span className='tw-bg-[#F6F6F6] p-2 tw-rounded-lg'>
                  Active
                </span>
              )}
              {status === 'DISPUTE' && (
                <span className='p-2 bg-warning tw-rounded-lg text-warning'>
                  Dispute
                </span>
              )}
            </div>
          )
        },
      },
      {
        id: 'actions',
        align: 'center',
        header: translate('table.actions'),
        style: { minWidth: '75px' },
        sortable: false,
        body: (parkingDetail: SelfRedemption) => {
          return (
            <Link
              className='tw-font-bold text-primary-blue'
              href={`${pathName}/show/${parkingDetail.id}?current=1&direction=desc&first=0&sorting=created_at`}
            >
              View
            </Link>
          )
        },
      },
    ],
    [translate]
  )

  useEffect(() => {
    getParkingDetails()
  }, [debouncedFilterParkingDetails, tableState])

  return (
    <>
      <div className='card'>
        <SelfRedemptionFilter
          status={[
            { name: 'All', value: '' },
            { name: 'Active', value: ParkingDetailStatus.Active },
            { name: 'Dispute', value: ParkingDetailStatus.Dispute },
          ]}
          onFilter={(val) => setFilterParkingDetails(val)}
        />
        <Table
          columns={columns}
          loading={isLoading}
          data={parkingDetails}
          totalRecords={totalRecords}
          onTableStateChange={setTableState}
        />
      </div>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'add-record'}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl tw-text-[#1B2559]'>
              Add a parking ticket
            </span>
            <div className='flex tw-gap-6 tw-items-center'>
              <div
                style={{
                  backgroundColor: '#EDF1FF',
                  border: '1px solid #A3AED0',
                  height: 276,
                  width: 440,
                }}
                className='px-5 tw-pt-11 tw-gap-6 tw-rounded-lg flex tw-flex-col tw-justify-center'
              >
                <p className='m-0 text-center text-info'>Enter parking ID</p>
                <div className='tw-flex tw-flex-col gap-2'>
                  <span className='text-info'>Parking ID</span>
                  <InputText
                    disabled={isLoading}
                    onChange={(e) => {
                      setParkingTicketId(e.target.value)
                    }}
                    placeholder='Please enter parking ID'
                  />
                </div>
                <div className='flex tw-justify-center'>
                  <Button
                    loading={isLoading}
                    disabled={!parkingTicketId}
                    onClick={() => {
                      if (parkingTicketId)
                        addParkingTicket(parkingTicketId, 'log_id')
                    }}
                    style={{ border: 'none' }}
                    label='Validate'
                    className='bg-primary-blue'
                  />
                </div>
              </div>
              <span className='text-info'>Or</span>
              <div
                style={{
                  backgroundColor: '#EDF1FF',
                  border: '1px solid #A3AED0',
                  height: 276,
                  width: 440,
                }}
                className='px-5 tw-rounded-lg py-5 tw-gap-6 flex tw-flex-col tw-items-center tw-justify-center'
              >
                <div className='text-center tw-space-y-2'>
                  <p className='text-info m-0'>Scan a parking ticket</p>
                  <p>You can scan the parking ticket by camera</p>
                </div>
                <Button
                  onClick={() => {
                    setIsShowModal('scanned')
                  }}
                  loading={isLoading}
                  label='Scan Parking Ticket'
                  className='bg-primary-blue'
                />
              </div>
            </div>
            <div>
              <Button
                loading={isLoading}
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
        visible={isShowModal === 'invalid'}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl text-danger'>
              Parking ID is invalid
            </span>
            <p>
              The Parking ID you have entered is invalid. Please check and try
              again.
            </p>
            <div className='flex tw-gap-2'>
              <Button
                className='bg-primary-blue'
                onClick={() => {
                  setIsShowModal('add-record')
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
        visible={isShowModal === 'scanned'}
        style={{ width: 640 }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={() => (
          <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
            <span className='font-bold tw-text-2xl tw-text-[#1B2559]'>
              Scanned Ticket
            </span>
            <div style={{ width: '100%', height: 'auto' }}>
              <QRReader addParkingTicket={addParkingTicket} />
            </div>
            <div>
              <Button
                loading={isLoading}
                text
                style={{ color: '#4318FF' }}
                type='button'
                onClick={() => {
                  setIsShowModal('add-record')
                }}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}

SelfRedemptionRecords.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    // TODO: change PCODE to the actual of the page
    redirectPath: '/car-park',
    accessPage: PCODE.SELFREDEMPTIONRECORD,
  }
)
