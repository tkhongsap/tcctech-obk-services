import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ColumnProps } from 'primereact/column'
import { useTranslate } from '@refinedev/core'
import { NotificationTemplateFilter } from '@components/notifications/template/template-filter'
import { Table } from '@components/table/Table'
// import mockdata from 'src/services/notificationservice/template/mockdata.json'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import * as OBNOTISDK from 'ob-notification-sdk'
import { MessageTemplateData } from 'ob-notification-sdk/api/api'
import { DataTableStateEvent } from 'primereact/datatable'
import { KeyValue } from '@src/types/key-value'
import { IFilterNotificationTemplate } from '@components/notifications/template/types/filter'
import { useDebounce } from 'primereact/hooks'
import ListAction from '@components/listworkrq/action'

type Props = {
  categories: KeyValue[]
  tags: KeyValue[]
}

export default function InappTemplateNotification(props: Props) {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const translate = useTranslate()
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterNotificationTemplate>({}, 400)
  const [isLoading, setIsLoading] = useState(false)
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [totalRecord, setTotalRecord] = useState(0)
  const [CampaignData, setTemplates] = useState<MessageTemplateData[]>([])
  const { setMenuAction } = useLayoutContext()
  const { categories, tags } = props

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
        sortable: true,
        sortField: 'id',
      },
      {
        field: 'name',
        header: 'Template name',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'name',
      },
      {
        field: 'message_category.name',
        header: 'Category',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'message_category.name',
      },
      {
        field: 'target',
        header: 'Target Audience',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'target',
      },
      {
        field: 'updated_at',
        header: 'Last update',
        style: { minWidth: '200px' },
        sortable: true,
        sortField: 'updated_at',
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: MessageTemplateData) => {
          return <ListAction types={['show']} id={data.id} />
        },
      },
    ],
    [translate]
  )

  const onCreateNewInapp = () => {
    router.push({
      pathname: '/notifications/template/create-inapp',
    })
  }

  const onCreateNewAnnouncement = () => {
    router.push({
      pathname: '/notifications/template/create-announcement',
    })
  }

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          label='Create new notification template'
          className='bg-primary-blue'
          onClick={onCreateNewInapp}
        />
        <Button
          label='Create new Announcement template'
          className='bg-primary-blue'
          onClick={onCreateNewAnnouncement}
        />
      </div>
    )
    setMenuAction(menuAction)
  }, [setMenuAction])

  const getData = useCallback(() => {
    setIsLoading(true)
    const orderDirection = tableState?.sortOrder === 1 ? 'desc' : 'asc'
    OBNOTISDK.client
      .messageTemplatesIndex(
        tableState?.sortField,
        orderDirection,
        (tableState?.page ?? 0) + 1,
        undefined,
        filter.name !== '' ? filter.name : undefined
      )
      .then((res) => {
        const templateData = (res?.data?.data as any[])?.map(
          (rs: MessageTemplateData) => {
            if (rs.updated_at) {
              return {
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
                  .replace(
                    /(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/,
                    '$3-$1-$2 $4:$5'
                  ),
              }
            } else {
              return rs
            }
          }
        ) as MessageTemplateData[]
        setTotalRecord(res.data.pagination?.total ?? 0)
        setTemplates(templateData)
        console.log(templateData)
      })
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <>
      <div className='card'>
        <div className='flex justify-content-between'>
          <NotificationTemplateFilter
            categories={categories}
            tags={tags}
            onFilter={setFilter}
          />
        </div>
        <Table
          columns={columns}
          data={CampaignData}
          loading={isLoading}
          onTableStateChange={setTableState}
          totalRecords={totalRecord}
        />
      </div>
    </>
  )
}

InappTemplateNotification.activePrime = true

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
    redirectPath: '/notifications/template',
  }
)
