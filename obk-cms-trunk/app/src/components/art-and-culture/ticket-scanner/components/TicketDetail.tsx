import { DisplayField } from '@components/art-and-culture/booking-history/components/ViewBookingHistoryButton'
import {
  convertToTimeRageFormat,
  formatDate,
  formatDateTime,
} from '@components/art-and-culture/booking-setting/utils/helper'
import styled from '@emotion/styled'
import { IBookingTicketResponse } from '@src/services/art-and-culture/booking/model'
import { Row } from 'antd'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useMemo } from 'react'
import { ScannerMode } from './ScannerModeSection'

const TicketDetailContainer = styled.div`
  display: flex;
  padding-top: 20px;
  /* background-color: red; */
  background-color: #f4f7fe;
  padding: 20px 16px;
`

interface TicketDetailContentProps {
  title: string
  thumnail: string
  slotDate: string
  showTime: string
  bookerName: string
  ticketNo: string
  checkInAt: string | null | undefined
}

const TicketDetailContent = ({
  title,
  thumnail,
  slotDate,
  showTime,
  bookerName,
  ticketNo,
  checkInAt,
}: TicketDetailContentProps) => {
  return (
    <div className='w-full'>
      <h4 className='tw-text-[#2B3674] font-bold'>Ticket Details</h4>
      <div
        className='flex align-items-center gap-3 mb-3'
        style={{ marginTop: '28px' }}
      >
        <img src={thumnail} alt='thumbnail' />
        <div className='flex flex-column'>
          <h4 className='tw-text-[#2B3674] font-bold m-0'>{slotDate}</h4>
          <h4 className='tw-text-[#2B3674] font-bold m-0'>{showTime}</h4>
        </div>
      </div>
      <p className='tw-text-lg'>{title}</p>
      <Divider type='dashed' />
      <Row gutter={[32, 32]}>
        <DisplayField xs={24} sm={12} name='Booker name' value={bookerName} />
        <DisplayField xs={24} sm={12} name='Ticket No.' value={ticketNo} />
        <DisplayField xs={24} sm={12} name='Check-in at' value={checkInAt} />
      </Row>
    </div>
  )
}

const TogglePanel = ({
  mode,
  onCancel,
  onResetTicket,
  onCheckInTicket,
}: TicketDetailProps) => {
  const { titleClassName, title, description } = useMemo(() => {
    if (mode === 'check-in')
      return {
        titleClassName: 'text-success',
        title: 'Check-in Mode',
        description: 'Scan ticket to check-in.',
      }

    return {
      titleClassName: 'text-danger',
      title: 'Reset ticket Mode',
      description: 'Scan ticket to reset status to unused.',
    }
  }, [mode])

  return (
    <div className='toggle-panel'>
      <div className='content-text'>
        <h2 className={titleClassName}>{title}</h2>
        <p className='tw-text-lg text-primary-blue text-center'>
          {description}
        </p>
      </div>

      <div className='button-container '>
        {mode === 'check-in' ? (
          <Button
            className='bg-primary-blue justify-content-center'
            onClick={onCheckInTicket}
          >
            Check-in
          </Button>
        ) : (
          <Button
            severity='danger'
            className='justify-content-center'
            style={{ backgroundColor: '#CD1A1A' }}
            onClick={onResetTicket}
          >
            Reset Ticket
          </Button>
        )}
        <Button
          className='text-primary-blue justify-content-center'
          onClick={onCancel}
          outlined
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

const ActionButton = ({
  mode,
  onCancel,
  onResetTicket,
  onCheckInTicket,
}: TicketDetailProps) => {
  if (mode === 'reset') {
    return (
      <div className='ticket-detail-action text-center'>
        <Button
          className='text-primary-blue justify-content-center'
          onClick={onCancel}
          outlined
        >
          Cancel
        </Button>
        <Button
          severity='danger'
          className='justify-content-center'
          style={{ backgroundColor: '#CD1A1A' }}
          onClick={onResetTicket}
        >
          Reset Ticket
        </Button>
      </div>
    )
  }

  return (
    <div className='ticket-detail-action text-center'>
      <Button
        className='text-primary-blue justify-content-center'
        onClick={onCancel}
        outlined
      >
        Cancel
      </Button>
      <Button
        type='button'
        className='bg-primary-blue justify-content-center'
        onClick={onCheckInTicket}
      >
        Check-in
      </Button>
    </div>
  )
}

interface TicketDetailProps {
  mode: ScannerMode
  detail: IBookingTicketResponse
  onCancel: () => void
  onResetTicket: () => void
  onCheckInTicket: () => void
}

export const TicketDetail = (props: TicketDetailProps) => {
  const { detail } = props

  return (
    <div id='ticket-detail'>
      <TicketDetailContainer className='detail-content'>
        <TicketDetailContent
          thumnail={detail.program.thumbnail}
          slotDate={formatDate(detail.bookingTransaction.slotDate)}
          showTime={`${convertToTimeRageFormat(
            detail.bookingTransaction.beginSlotTime,
            detail.bookingTransaction.endSlotTime
          )}`}
          title={detail.program.title}
          bookerName={detail.bookingTransaction.bookerName}
          ticketNo={detail.ticketNo.toString()}
          checkInAt={detail.checkedInAt && formatDateTime(detail.checkedInAt)}
        />
      </TicketDetailContainer>
      <ActionButton {...props} />

      <TogglePanel {...props} />
    </div>
  )
}
