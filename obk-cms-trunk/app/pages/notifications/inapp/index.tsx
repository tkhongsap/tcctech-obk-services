import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ColumnProps } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { useTranslate } from '@refinedev/core'
import { NotificationFilter } from '@components/notifications/inapp/notification-filter'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import { CampaignData } from 'ob-notification-sdk/api/api'
import * as OBNOTISDK from 'ob-notification-sdk'
import ListAction from '@components/listworkrq/action'
import { DataTableStateEvent } from 'primereact/datatable'
import { KeyValue } from '@src/types/key-value'
import { IFilterNotification } from '@components/notifications/inapp/inapp-notification'
import { useDebounce } from 'primereact/hooks'

type Props = {
  categories: KeyValue[]
  tags: KeyValue[]
}

export default function InappNotification(props: Props) {
  const { categories, tags } = props
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const translate = useTranslate()
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [
    filterNotification,
    debouncedFilterNotification,
    setFilterNotification,
  ] = useDebounce<IFilterNotification>({}, 400)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<CampaignData[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const { setMenuAction } = useLayoutContext()

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
        sortable: true,
        sortField: 'id',
        // className: 'col-sticky-start',
      },
      {
        field: 'name',
        header: 'Title',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'name',
      },
      {
        field: 'message_template.message_category.name',
        header: 'Category',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'message_template_id',
      },
      {
        field: 'updated_at',
        header: 'Last update',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'updated_at',
      },
      {
        field: 'updated_by_name',
        header: 'Updated by',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'updated_by_name',
      },
      {
        field: 'status',
        // accessorKey: 'content',
        header: 'status',
        style: { minWidth: '180px' },
        body: ({ status }) => {
          return (
            <div>
              {status === 'WATING_FOR_APPROVAL' && (
                <Tag severity='warning'>Waiting for approval</Tag>
              )}
              {status === 'APPROVED_SCHEDULED' && (
                <Tag severity='success'>Approved(Scheduled)</Tag>
              )}
              {status === 'APPROVED_SENT' && (
                <Tag severity='success'>Approved(Sent)</Tag>
              )}
              {status === 'REJECTED' && <Tag severity='danger'>Rejected</Tag>}
            </div>
          )
        },
        sortable: true,
        sortField: 'status',
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: CampaignData) => {
          return <ListAction types={['show']} id={data.id} />
        },
      },
    ],
    [translate]
  )

  const onFilter = (items: IFilterNotification) => {
    setFilterNotification(items)
  }

  const onCreateNewInapp = () => {
    router.push({
      pathname: '/notifications/inapp/create-inapp',
    })
  }

  const onCreateNewAnnouncement = () => {
    router.push({
      pathname: '/notifications/inapp/create-announcement',
    })
  }

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          className='bg-primary-blue'
          label='Create new in-app notification'
          onClick={onCreateNewInapp}
        />
        <Button
          className='bg-primary-blue'
          label='Create new Announcement'
          onClick={onCreateNewAnnouncement}
        />
      </div>
    )

    setMenuAction(menuAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  const getData = useCallback(() => {
    const orderDirection = tableState?.sortOrder === 1 ? 'desc' : 'asc'
    setIsLoading(true)
    OBNOTISDK.client
      .campaignsIndex(
        tableState?.sortField,
        orderDirection,
        (tableState?.page ?? 0) + 1,
        tableState?.rows,
        undefined,
        undefined,
        filterNotification.filter !== ''
          ? filterNotification.filter
          : undefined,
        filterNotification.status?.trim() !== ''
          ? filterNotification.status
          : undefined,
        filterNotification.category !== ''
          ? filterNotification.category
          : undefined,
        undefined,
        filterNotification.tag !== '' ? filterNotification.tag : undefined
      )
      .then((res) => {
        setTotalRecords(res.data.pagination?.total ?? 0)
        const inappNotificationData = res?.data?.data
          .filter((campaign: CampaignData) => campaign.status !== 'DRAFT')
          .map((rs: CampaignData) => ({
            ...rs,
            updated_at: new Date(rs.updated_at)
              .toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
              .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$3-$1-$2 $4:$5'),
          })) as CampaignData[]
        setNotifications(inappNotificationData)
        return inappNotificationData
      })
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterNotification, tableState])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterNotification, tableState])

  return (
    <>
      <div className='card'>
        <div className='flex justify-content-between'>
          <NotificationFilter
            onFilter={onFilter}
            catagories={categories}
            tags={tags}
          />
        </div>
        <Table
          totalRecords={totalRecords}
          columns={columns}
          data={notifications}
          loading={isLoading}
          onTableStateChange={setTableState}
        />
      </div>
    </>
  )
}
InappNotification.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
    const tagsPromise = OBNOTISDK.client.tagsIndex().then((res) => {
      const tagList = (res.data?.data as any)?.map((tag: any) => ({
        name: tag.name,
        value: tag.id,
      }))
      return tagList as KeyValue
    })

    const categoriesPromise = OBNOTISDK.client
      .messageCategoriesIndex()
      .then((res) => {
        const categoryList = (res.data?.data as any)
          ?.filter((category: any) => category.visible)
          .map((category: any) => ({
            name: category.name,
            value: category.id,
          }))
        return categoryList as KeyValue
      })

    const res = await Promise.all([tagsPromise, categoriesPromise])
    const tags = res[0]
    const categories = res[1]

    ctx.props = { ...ctx.props, categories, tags }
    return ctx
  },
  {
    redirectPath: '/notifications/inapp',
  }
)
