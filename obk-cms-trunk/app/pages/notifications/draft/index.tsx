import { useCallback, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import * as OBNOTISDK from 'ob-notification-sdk'
import { CampaignData } from 'ob-notification-sdk/api/api'
import { DataTableStateEvent } from 'primereact/datatable'
import Link from 'next/link'
import { PCODE } from '@src/data/constants/privilege'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

export default function NotificationDraft() {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const router = useRouter()
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState('')
  const [draftnotifications, setDraftNotification] = useState<CampaignData[]>(
    []
  )
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'message_template.title.en',
        header: 'Title',
        style: { minWidth: '200px' },
      },
      {
        field: 'message_template.message_category.name',
        header: 'Category',
        style: { minWidth: '200px' },
      },
      {
        field: 'scheduled_at',
        header: 'Schedule',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'updated_at',
        header: 'Last update',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'updated_by_name',
        header: 'Update by',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: any) => {
          switch (data.message_template?.message_category?.name) {
            case 'Announcement':
              return (
                <div className='flex items-center gap-4'>
                  <Link
                    className='cursor-pointer'
                    href={`/notifications/inapp/edit-announcement/${data.id}`}
                  >
                    <span className='text-primary-blue font-xl font-bold'>
                      Edit
                    </span>
                  </Link>
                  <Button
                    text
                    severity='danger'
                    label='Delete'
                    onClick={() => {
                      setVisibleDeleteDialog(true)
                      setSelectedDraft(data.id)
                    }}
                    className='py-0 px-1'
                  />
                </div>
              )
            default:
              return (
                <div className='flex items-center gap-4'>
                  <Link
                    className='cursor-pointer'
                    href={`/notifications/inapp/edit/${data.id}`}
                  >
                    <span className='text-primary-blue font-xl font-bold'>
                      Edit
                    </span>
                  </Link>
                  <Button
                    text
                    severity='danger'
                    label='Delete'
                    onClick={() => {
                      setVisibleDeleteDialog(true)
                      setSelectedDraft(data.id)
                    }}
                    className='py-0 px-1'
                  />
                </div>
              )
          }
        },
      },
    ],
    [translate]
  )
  const fetchDraftNotification = useCallback(
    async (paginationState: DataTableStateEvent) => {
      const sortfield = paginationState.sortField
      let sortorder = 'desc'
      switch (paginationState.sortOrder) {
        case -1:
          sortorder = 'asc'
      }
      await OBNOTISDK.client
        .campaignsIndex(
          sortfield,
          sortorder,
          (paginationState.page ?? 0) + 1,
          paginationState.rows,
          undefined,
          undefined,
          undefined,
          'DRAFT'
        )
        .then((res: any) => {
          const draftNotificationData = res?.data?.data.map(
            (rs: CampaignData) => ({
              ...rs,
              updated_at: rs.updated_at
                ? new Date(rs.updated_at)
                    .toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .replace(
                      /(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/,
                      '$3-$1-$2 $4:$5'
                    )
                : '',
              scheduled_at: rs.scheduled_at
                ? new Date(rs.scheduled_at)
                    .toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .replace(
                      /(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/,
                      '$3-$1-$2 $4:$5'
                    )
                : '',
            })
          ) as CampaignData[]
          setDraftNotification(draftNotificationData)
          setTotalRecords(res?.data?.pagination.total)
          setIsLoading(false)
          return draftNotificationData
        })
    },
    []
  )

  const deleteNotification = async (id: string) => {
    await OBNOTISDK.client.campaignsDelete(id)
    setVisibleDeleteDialog(false)
    router.refresh()
  }

  return (
    <>
      <div className='card'>
        <div>
          <div>
            <Table
              columns={columns}
              data={draftnotifications}
              loading={isLoading}
              totalRecords={totalRecords}
              onTableStateChange={fetchDraftNotification}
            />
          </div>
        </div>
      </div>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this draft?
            </span>
            <div className='flex gap-3 mt-5'>
              {/* Event SaveDraft */}
              <Button
                type='button'
                onClick={() => deleteNotification(selectedDraft!)}
                severity='danger'
                label='Delete'
              />
              <Button
                type='button'
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
NotificationDraft.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/notifications/draft',
    accessPage: PCODE.VIEWDRAFTLISTANDDETAILS,
  }
)
