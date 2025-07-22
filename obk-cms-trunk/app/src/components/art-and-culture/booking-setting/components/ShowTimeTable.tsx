import { UndefinableDayJs } from '@components/forms/components/date-time-range-picker-field'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Column, ColumnSortEvent } from 'primereact/column'
import { TreeNode } from 'primereact/treenode'
import { TreeTable } from 'primereact/treetable'
import { useCallback } from 'react'
import { EnumBookingTimeStatus } from '../utils/constants'
import { BookingSlotDate, BookingSlotTimes } from '../utils/helper'
import {
  DuplicateShowTimeButton,
  UpdateItemProps,
} from './DuplicateShowTimeButton'
import { EditShowTimeButton } from './EditShowTimeButton'

interface ShowTimeTableProps {
  data: TreeNode[]
  onDeleteBookingSlotTimes: (value: BookingSlotTimes) => void
  onEditShowtime: (id: string, value: BookingSlotTimes[]) => void
  onDuplicateShowtime: (
    insert: BookingSlotDate[],
    updateItems: UpdateItemProps[]
  ) => void
  currentBookingSlotDates?: BookingSlotDate[]
  maxDate: UndefinableDayJs
  minDate: UndefinableDayJs
}

type IBadgeStatus = 'success' | 'info' | 'warning' | 'danger' | null | undefined

const badgeStatus: { [key in EnumBookingTimeStatus]: IBadgeStatus } = {
  [EnumBookingTimeStatus.waiting]: 'warning',
  [EnumBookingTimeStatus.completed]: null,
  [EnumBookingTimeStatus.on_going]: 'info',
  [EnumBookingTimeStatus.sold_out]: 'danger',
}

const statusDisplay = {
  [EnumBookingTimeStatus.waiting]: 'Waiting',
  [EnumBookingTimeStatus.completed]: 'Past',
  [EnumBookingTimeStatus.on_going]: 'On going',
  [EnumBookingTimeStatus.sold_out]: 'Sold out',
}

export function ShowTimeTable({
  data,
  onDeleteBookingSlotTimes,
  onEditShowtime,
  onDuplicateShowtime,
  currentBookingSlotDates,
  minDate,
  maxDate,
}: ShowTimeTableProps) {
  const router = useRouter()
  const { checkAccess } = usePermission()

  const handleClickBookingHistory = useCallback(
    (props: any) => {
      const { programId } = router.query
      router.push(
        `/art-and-culture/booking/show-booking-history?programId=${programId}&bookingSlotTimeId=${props.id}`
      )
    },
    [router]
  )

  const dateSortFunction = (e: ColumnSortEvent) => {
    const order = e.order === null || e.order === undefined ? 1 : e.order

    const result = e.data.sort((node1: any, node2: any) => {
      const date1 = new Date(node1.data[e.field as keyof typeof node1.data])
      const date2 = new Date(node2.data[e.field as keyof typeof node2.data])
      return order * (date1.getTime() - date2.getTime())
    })
    return result
  }

  const isBookingHistoryButtonDisabled = useCallback(
    (isEmptyBooked: boolean) => {
      const canAccess = checkAccess(PCODE.VIEWBOOKINGHISTORY)
      if (!canAccess) return true

      return isEmptyBooked
    },
    [checkAccess]
  )

  return (
    <TreeTable
      id='booking-showtime'
      value={data}
      resizableColumns
      showGridlines
      rowClassName={(node: TreeNode) => {
        return { ['highlight-row']: node.key?.toString().includes('-') }
      }}
      sortOrder={-1}
      sortIcon={(props) => {
        if (props.sorted) {
          switch (props?.sortOrder) {
            case 1:
              return <i className='pi pi-sort-up' />
            case -1:
              return <i className='pi pi-sort-down' />
            default:
              return <i className='pi pi-sort' />
          }
        } else {
          return <i className='pi pi-sort' />
        }
      }}
      emptyMessage={
        <p className='tw-text' style={{ color: '#B0B0B0' }}>
          Please create a new booking
        </p>
      }
      scrollable
      scrollHeight='300px'
    >
      <Column
        field='date'
        header='Date '
        expander
        sortable
        sortFunction={dateSortFunction}
        headerStyle={{ border: 'none', width: '365px', background: 'none' }}
        bodyStyle={{
          border: 'none',
          width: '365px',
          color: '#273281',
          fontWeight: 700,
        }}
      ></Column>
      <Column
        field='showtimes'
        header='Showtimes '
        sortable
        headerStyle={{ border: 'none', width: '365px', background: 'none' }}
        bodyStyle={{
          border: 'none',
          width: '365px',
          color: '#273281',
          fontWeight: 700,
        }}
      ></Column>
      <Column
        field='booked'
        header='Booked '
        sortable
        headerStyle={{ border: 'none', width: '160px', background: 'none' }}
        bodyStyle={{ border: 'none', width: '160px' }}
        bodyClassName={(data) => {
          if (isEmpty(data.date)) return 'faded-text'
          return 'bold-text'
        }}
      ></Column>
      <Column
        field='maxTickets'
        header='Max tickets '
        sortable
        headerStyle={{ border: 'none', width: '160px', background: 'none' }}
        bodyStyle={{ border: 'none', width: '160px' }}
        bodyClassName={(data) => {
          if (isEmpty(data.date)) return 'faded-text'
          return 'bold-text'
        }}
      ></Column>
      <Column
        header='Status '
        sortable
        headerStyle={{ border: 'none', width: '160px', background: 'none' }}
        bodyStyle={{ border: 'none', width: '160px' }}
        body={({ data }) => {
          if (data.status)
            return (
              <Badge
                id='booking-badge'
                value={statusDisplay[data.status as keyof typeof statusDisplay]}
                severity={badgeStatus[data.status as keyof typeof badgeStatus]}
                className={
                  badgeStatus[data.status as keyof typeof badgeStatus] === null
                    ? 'p-badge-secondary'
                    : ''
                }
              />
            )
        }}
      ></Column>
      <Column
        header='Action'
        body={({ children, data }) => {
          if (children?.length > 0)
            return (
              <div
                key={data.raw.id}
                className='flex'
                style={{ alignItems: 'center', minWidth: '350px' }}
              >
                <EditShowTimeButton
                  selectedDate={data.raw}
                  onUpdate={onEditShowtime}
                />
                <DuplicateShowTimeButton
                  currentBookingSlotDate={data.raw}
                  onDuplicate={onDuplicateShowtime}
                  currentBookingSlotDates={currentBookingSlotDates}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            )
          return (
            <div
              className='flex'
              style={{ alignItems: 'center', minWidth: '350px' }}
            >
              <Button
                disabled={isBookingHistoryButtonDisabled(data.booked === 0)}
                type='button'
                className='tw-text m-0 mr-2 text-primary-blue'
                style={{ minWidth: '120px' }}
                text
                onClick={() => handleClickBookingHistory(data)}
              >
                Booking history
              </Button>
              <Button
                disabled={
                  data.booked > 0 ||
                  data.raw.status === EnumBookingTimeStatus.sold_out
                }
                className='tw-text text-primary-blue'
                type='button'
                onClick={() => {
                  onDeleteBookingSlotTimes(data.raw)
                }}
                text
              >
                Delete
              </Button>
            </div>
          )
        }}
        bodyStyle={{ border: 'none', width: '300px' }}
        headerStyle={{ border: 'none', background: 'none', width: '300px' }}
      ></Column>
    </TreeTable>
  )
}
