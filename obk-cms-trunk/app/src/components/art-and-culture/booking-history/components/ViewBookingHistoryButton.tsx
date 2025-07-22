import { Col, ColProps, Row } from 'antd'
import { Button } from 'primereact/button'

import {
  convertToTimeRageFormat,
  formatDate,
} from '@components/art-and-culture/booking-setting/utils/helper'
import { bookingTransactionService } from '@src/services/art-and-culture/booking/booking-transaction-service'
import {
  IBookingTicketDetail,
  IBookingTransactionDetail,
} from '@src/services/art-and-culture/booking/model'
import Image from 'next/image'
import { Carousel } from 'primereact/carousel'
import QRCode from 'qrcode'
import { useCallback, useMemo, useState } from 'react'
import { convertToCurrency } from 'utils/number'
import { Dialog } from 'primereact/dialog'

type DisplayFieldProps = ColProps & { name: string; value?: string | null }

export const DisplayField = ({
  name,
  value = '',
  ...colProps
}: DisplayFieldProps) => {
  if (value)
    return (
      <Col {...colProps}>
        <p
          className='tw-text-[16px] font-bold tw-text-[#273281]'
          style={{ marginBottom: 8 }}
        >
          {name}
        </p>
        <p className='tw-text-[16px] tw-text-base' style={{ color: '#1B1B1B' }}>
          {value}
        </p>
      </Col>
    )

  return <></>
}

const itemTemplate = (item: IBookingTicketDetail) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
      }}
    >
      {item.qrCodeUrl && (
        <div>
          <p className='tw-text text-bold'>Ticket No. : {item.ticketNo}</p>
          <Image
            src={item.qrCodeUrl}
            className='w-full h-auto'
            width={145}
            height={145}
            alt='Ticket QRCode'
          />
        </div>
      )}
    </div>
  )
}

interface ViewBookingHistoryButton {
  id: number
  dataTestId: string
}

export const ViewBookingHistoryButton = (props: ViewBookingHistoryButton) => {
  const [open, setOpen] = useState(false)
  const [bookingHistory, setBookingHistory] = useState<
    Partial<IBookingTransactionDetail>
  >({})

  const handleCloseModal = useCallback(() => {
    setOpen(false)
  }, [])

  const [ticketDetailWithQrCode, setTicketDetailWithQrCode] = useState<
    IBookingTicketDetail[]
  >([])

  const fetchBookingHistoryDetail = useCallback(async (id: number) => {
    try {
      const response = await bookingTransactionService.get(id.toString())
      setBookingHistory(response.data.data)
      const data = response.data.data
      if (data.bookingTickets && data.bookingTickets.length > 0) {
        const qrList: IBookingTicketDetail[] = []
        for (const item of data.bookingTickets) {
          const qrCodeUrl = await QRCode.toDataURL(item.id)
          qrList.push({ ...item, qrCodeUrl })
        }
        setTicketDetailWithQrCode(qrList)
      }
    } catch (error) {
      console.error('Error fetching booking history:', error)
      setBookingHistory({})
    }
    setOpen(true)
  }, [])

  const handleClickViewHistoryDetail = useCallback(async () => {
    await fetchBookingHistoryDetail(props.id)
  }, [fetchBookingHistoryDetail, props.id])

  const footerContent = (
    <Button
      data-testid={ViewBookingHistoryButtonDataTestId.CloseButton}
      className='bg-primary-blue'
      type='button'
      onClick={handleCloseModal}
      style={{ height: 48, width: 120, justifyContent: 'center' }}
    >
      Close
    </Button>
  )

  const timeRange = useMemo(() => {
    if (bookingHistory?.beginSlotTime && bookingHistory.endSlotTime)
      return convertToTimeRageFormat(
        bookingHistory?.beginSlotTime,
        bookingHistory.endSlotTime
      )
    return ''
  }, [bookingHistory?.beginSlotTime, bookingHistory.endSlotTime])

  return (
    <>
      <Dialog
        header={
          <h3 className='tw-text-[#1B2559] tw-text-2xl font-bold mb-0'>
            Booking detail
          </h3>
        }
        draggable={false}
        closable={false}
        visible={open}
        style={{
          margin: '12px',
          minWidth: '332px',
          maxWidth: '640px',
          height: '829px',
        }}
        onHide={handleCloseModal}
        footer={footerContent}
      >
        <Carousel
          value={ticketDetailWithQrCode}
          numVisible={1}
          itemTemplate={itemTemplate}
        />
        <Row gutter={[32, 32]}>
          <DisplayField
            xs={24}
            name='Program name'
            value={bookingHistory?.program?.title}
          />
          <DisplayField
            xs={24}
            name='Location'
            value={bookingHistory?.program?.locations.join(',')}
          />
          <DisplayField
            xs={24}
            sm={12}
            name='Booker name'
            value={bookingHistory?.bookerName}
          />
          <DisplayField
            xs={24}
            sm={12}
            name='email'
            value={bookingHistory?.bookerEmail}
          />
          <DisplayField
            xs={24}
            sm={12}
            name='Date'
            value={
              bookingHistory.slotDate
                ? formatDate(new Date(bookingHistory.slotDate))
                : ''
            }
          />
          <DisplayField xs={24} sm={12} name='Time' value={timeRange} />
          <DisplayField
            xs={24}
            sm={12}
            name='Number of ticket(s)'
            value={bookingHistory?.ticketsCount?.toString()}
          />
          <DisplayField
            xs={24}
            sm={12}
            name='Price'
            value={
              bookingHistory?.price === 0
                ? 'Free'
                : convertToCurrency(bookingHistory.price)
            }
          />
        </Row>
      </Dialog>
      <Button
        data-testid={props.dataTestId}
        className='text-primary-blue'
        type='button'
        text
        onClick={handleClickViewHistoryDetail}
      >
        View
      </Button>
    </>
  )
}

export const ViewBookingHistoryButtonDataTestId = {
  CloseButton: 'ViewBookingHistoryButton-CloseButton',
}
