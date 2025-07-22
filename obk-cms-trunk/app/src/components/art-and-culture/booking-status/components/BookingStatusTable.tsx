import { EnumBookingTimeStatus } from '@components/art-and-culture/booking-setting/utils/constants'
import {
  convertBookingSlotTimeStatus,
  convertToTimeRageFormat,
  formatDate,
} from '@components/art-and-culture/booking-setting/utils/helper'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { bookingSlotDateService } from '@src/services/art-and-culture/booking/booking-slot-date-service'
import { bookingSlotTimeService } from '@src/services/art-and-culture/booking/booking-slot-time-service'
import { IBookingSlotTime } from '@src/services/art-and-culture/booking/model'
import { defaultToastMessage } from '@src/utils/default-toast'
import { Switch } from 'antd'
import { get, isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { confirmDialog } from 'primereact/confirmdialog'
import { TreeNode } from 'primereact/treenode'
import {
  TreeTable,
  TreeTableEvent,
  TreeTablePageEvent,
} from 'primereact/treetable'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

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

export const BookingStatusTable = () => {
  const router = useRouter()
  const [nodeData, setNodeData] = useState<TreeNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    {}
  )

  const { checkAccess } = usePermission()

  const handleConfirmUpdateStatus = async ({ id, value }: any) => {
    try {
      await bookingSlotTimeService.updateBookingTimeStatus(
        id,
        value ? 'sold_out' : 'available'
      )
      toast.success('Save Booking Setting Success')
      await fetchBookingHistory()
    } catch (error) {
      const message = get(
        error,
        'response.data.message',
        defaultToastMessage.error
      )
      toast.error(message)
    }
  }

  const handleChangeToSoldOut = async ({ data, checked }: any) => {
    const { id, beginSlotTime, program } = data.raw
    const programName = program.title
    const showDate = formatDate(beginSlotTime)
    const range = data.showtime
    let header = `Are you sure you want to unmark ${programName}  on ${showDate}, ${range} as sold out ?`
    if (checked)
      header = `Are you sure you want to mark ${programName} on ${showDate}, ${range} as sold out ?`
    confirmDialog({
      header: <p className='text-primary-700 tw-text-xl'>{header}</p>,
      message: checked ? (
        <div className='tw-flex justify-content-start'>
          <p className='text-warning font-semi' style={{ textAlign: 'left' }}>
            No more client can book this show
          </p>
        </div>
      ) : (
        ''
      ),
      closable: false,
      style: { width: '640px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='button'
            label={checked ? 'Mark as sold out' : 'Unmark this program'}
            className={checked ? '' : 'bg-primary-blue'}
            severity={checked ? 'danger' : undefined}
            onClick={async () => {
              handleConfirmUpdateStatus({ id, value: checked })
              accept()
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            outlined
            style={{ width: '120px' }}
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const fetchBookingHistory = useCallback(async () => {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    const { programId, ...filters } = router.query

    try {
      const response = await bookingSettingService.getList(filters)
      const newList: TreeNode[] = []
      const list = response.data.data
      setTotalRecords(response.data.totalRecords)

      for (const data of list) {
        const node: TreeNode = {
          key: data.id,
          data: {
            showName: data.program.title,
            locations: data.program.locations?.join(','),
            raw: data,
            booked: data.bookedCount,
            maxTickets: data.maxTickets,
            isHeader: true,
            checkedCount: data.checkedCount,
          },
          leaf: false,
        }

        if (expandedKeys[data.id]) {
          const lazyNode = await loadChild(data.id, node)
          newList.push(lazyNode)
        } else {
          newList.push(node)
        }
      }

      setNodeData(newList)
    } catch (error) {
      console.error('Error fetching booking status:', error)
    }
  }, [router.query, expandedKeys])

  const isSwitchDisabled = useCallback(
    (booked: boolean, isCompleted: boolean) => {
      const canAccess = checkAccess(PCODE.EDITBOOKINGSTATUS)
      if (!canAccess) return true

      return booked || isCompleted
    },
    [checkAccess]
  )

  const loadChild = async (bookingSettingId: string, node: TreeNode) => {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    const { programId, status, ...filters } = router.query
    const bookingSlotDatesResponse =
      await bookingSlotDateService.getBookingSlotDates({
        bookingSettingId,
        ...filters,
        page: 1,
        limit: 999,
      })
    const bookingSlotDates = bookingSlotDatesResponse.data.data

    let lazyNode = { ...node }

    const children: TreeNode[] = []

    const now = new Date().getTime()
    const beforeNow = bookingSlotDates
      .filter(
        (bookingSlotDate) => new Date(bookingSlotDate.slotDate).getTime() < now
      )
      .sort(
        (a, b) =>
          new Date(b.slotDate).getTime() - new Date(a.slotDate).getTime()
      )
    const afterOrEqualNow = bookingSlotDates
      .filter(
        (bookingSlotDate) => new Date(bookingSlotDate.slotDate).getTime() >= now
      )
      .sort(
        (a, b) =>
          new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime()
      )

    for (const bookingSlotDate of [...afterOrEqualNow, ...beforeNow]) {
      const orderedBookingSlotTime = bookingSlotDate.bookingSlotTimes.sort(
        (a: any, b: any) =>
          new Date(a.beginSlotTime).getTime() -
          new Date(b.beginSlotTime).getTime()
      )
      orderedBookingSlotTime.map(
        (bookingSlotTime: IBookingSlotTime, bookingSlotTimeIndex: number) => {
          children.push({
            key: `${node.key}-${bookingSlotTimeIndex}`,
            data: {
              date:
                bookingSlotTimeIndex === 0
                  ? formatDate(bookingSlotDate.slotDate)
                  : '',
              showtime: convertToTimeRageFormat(
                bookingSlotTime.beginSlotTime,
                bookingSlotTime.endSlotTime
              ),
              booked: bookingSlotTime.bookedTicketsCount,
              maxTickets: bookingSlotTime.maxTicketsPerSlotTime,
              status: convertBookingSlotTimeStatus(
                bookingSlotTime.status,
                bookingSlotTime.endSlotTime,
                node.data.raw.openBookingTime
              ),
              checkedCount: bookingSlotTime.checkedInTicketsCount,
              raw: { ...bookingSlotTime, program: node.data.raw.program },
            },
          })
        }
      )
    }
    let filtered = children

    if (status)
      filtered = children.filter((item) => item.data.status === status)
    lazyNode.children = filtered
    return lazyNode
  }

  const handleExpandRow = async (event: TreeTableEvent) => {
    const bookingSettingId = event.node.data.raw.id
    const currentNode = event.node

    const lazyNode = await loadChild(bookingSettingId, currentNode)

    let _nodes = nodeData.map((node) => {
      if (node.key === currentNode.key) {
        node = lazyNode
      }

      return node
    })

    setNodeData(_nodes)

    setExpandedKeys({ ...expandedKeys, [event.node.key as string]: true })
  }

  const handleCollapseRow = (event: TreeTableEvent) => {
    setExpandedKeys({ ...expandedKeys, [event.node.key as string]: false })
  }

  const rowPerPage = 10

  const [rows, setRows] = useState<number>(rowPerPage)
  const [first, setFirst] = useState(0)
  const [totalRecords, setTotalRecords] = useState<number>(0)

  const onPage = (event: TreeTablePageEvent) => {
    const currentQuery = router.query
    const currentPath = router.pathname
    const newQueryParams = {
      ...currentQuery,
      page: event.page + 1,
      limit: event.rows,
    }
    router.push({
      pathname: currentPath,
      query: newQueryParams,
    })
    setFirst(event.first)
    setRows(event.rows)
    fetchBookingHistory()
  }

  useEffect(() => {
    const currentQuery = router.query
    const currentPath = router.pathname

    if (currentQuery.page && currentQuery.limit) {
      fetchBookingHistory()
      return
    }

    const newQueryParams = {
      ...currentQuery,
      page: 1,
      limit: rowPerPage,
    }
    router.push({
      pathname: currentPath,
      query: newQueryParams,
    })
  }, [fetchBookingHistory, router])

  return (
    <>
      <TreeTable
        id='booking-status-table'
        value={nodeData}
        rowClassName={(node: TreeNode) => {
          return { ['highlight-row']: node.key?.toString().includes('-') }
        }}
        expandedKeys={expandedKeys}
        onCollapse={handleCollapseRow}
        paginatorLeft
        paginator
        onPage={onPage}
        totalRecords={totalRecords}
        rows={rows}
        first={first}
        lazy
        onExpand={handleExpandRow}
        emptyMessage={
          <p className='tw-text' style={{ color: '#B0B0B0' }}>
            No Data
          </p>
        }
        scrollable
        scrollHeight='60vh'
      >
        <Column
          field='showName'
          header='Show Name '
          expander
          headerStyle={{
            border: 'none',
            width: '380px',
            background: 'none',
          }}
          bodyStyle={{
            border: 'none',
            width: '380px',
            color: '#273281',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        ></Column>
        <Column
          field='locations'
          header='Locations '
          headerStyle={{
            border: 'none',
            width: '180px',
            background: 'none',
          }}
          bodyStyle={{
            border: 'none',
            width: '180px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        ></Column>
        <Column
          field='date'
          header='Date '
          headerStyle={{
            border: 'none',
            width: '200px',
            background: 'none',
          }}
          bodyStyle={{
            border: 'none',
            width: '200px',
          }}
        ></Column>
        <Column
          field='showtime'
          header='Showtimes '
          headerStyle={{
            border: 'none',
            width: '140px',
            background: 'none',
          }}
          bodyStyle={{
            border: 'none',
            width: '140px',
          }}
        ></Column>
        <Column
          field='checkedCount'
          header='Check-in '
          headerStyle={{
            border: 'none',
            width: '108px',
            background: 'none',
            textAlign: 'right',
          }}
          bodyStyle={{ border: 'none', width: '108px', textAlign: 'right' }}
          bodyClassName={(data) => {
            if (isEmpty(data.showName)) return 'faded-text'
            return 'bold-text'
          }}
        ></Column>
        <Column
          field='booked'
          header='Booked '
          headerStyle={{
            border: 'none',
            width: '108px',
            background: 'none',
            textAlign: 'right',
          }}
          bodyStyle={{ border: 'none', width: '108px', textAlign: 'right' }}
          bodyClassName={(data) => {
            if (isEmpty(data.showName)) return 'faded-text'
            return 'bold-text'
          }}
        ></Column>

        <Column
          field='maxTickets'
          header='Max tickets '
          headerStyle={{
            border: 'none',
            width: '120px',
            background: 'none',
            textAlign: 'right',
          }}
          bodyStyle={{ border: 'none', width: '120px', textAlign: 'right' }}
          bodyClassName={(data) => {
            if (isEmpty(data.showName)) return 'faded-text'
            return 'bold-text'
          }}
        ></Column>
        <Column
          header='Status '
          headerStyle={{
            border: 'none',
            width: '120px',
            background: 'none',
            textAlign: 'center',
          }}
          bodyStyle={{ border: 'none', width: '120px', textAlign: 'center' }}
          body={({ data }) => {
            if (data.status)
              return (
                <Badge
                  id='booking-badge'
                  value={
                    statusDisplay[data.status as keyof typeof statusDisplay]
                  }
                  severity={
                    badgeStatus[data.status as keyof typeof badgeStatus]
                  }
                  className={
                    badgeStatus[data.status as keyof typeof badgeStatus] ===
                    null
                      ? 'p-badge-secondary'
                      : ''
                  }
                />
              )
          }}
        ></Column>
        <Column
          header='Mark as sold out '
          headerStyle={{
            border: 'none',
            width: '150px',
            background: 'none',
            textAlign: 'left',
          }}
          bodyStyle={{ border: 'none', width: '140px', textAlign: 'left' }}
          body={({ data }) => {
            if (!data.isHeader)
              return (
                <Switch
                  disabled={isSwitchDisabled(
                    data.booked === data.maxTickets,
                    data.status === EnumBookingTimeStatus.completed
                  )}
                  value={data.status === EnumBookingTimeStatus.sold_out}
                  onChange={(checked) =>
                    handleChangeToSoldOut({ data, checked })
                  }
                />
              )
          }}
        ></Column>
      </TreeTable>
    </>
  )
}
