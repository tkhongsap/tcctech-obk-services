import { DataTableStateEvent } from 'primereact/datatable'
import { useMemo, useCallback, useEffect } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { ICategoryRequest } from '@src/services/notificationservice/category/model'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import router from 'next/router'
import * as OBNOTISDK from 'ob-notification-sdk'
import { MessageCategoryData } from 'ob-notification-sdk/api/api'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { PCODE } from '@src/data/constants/privilege'

export default function NotificationCategory() {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [categorys, setCategorys] = useState<MessageCategoryData[]>([])
  const { setMenuAction } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'sequence',
        header: 'Ordering',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'display_name.en',
        header: 'English',
        style: { minWidth: '100px' },
      },
      {
        field: 'display_name.th',
        header: 'Thai',
        style: { minWidth: '200px' },
      },
      // {
      //   field: 'display_name.zh',
      //   header: 'Simplify Chinese',
      //   style: { minWidth: '200px' },
      // },
      {
        field: '_count.message_template',
        header: 'Count',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'visible',
        // accessorKey: 'content',
        header: 'Status',
        sortable: true,
        body: ({ visible }) => {
          {
            if (visible === true) {
              return (
                <div>
                  <Tag severity='success'>Visible</Tag>
                </div>
              )
            } else {
              return (
                <div>
                  <Tag severity='warning'>Invisible</Tag>
                </div>
              )
            }
          }
        },
      },
      {
        field: 'updated_at',
        header: 'Last update',
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
        body: (data: ICategoryRequest) => {
          return <TableAction types={['edit']} id={data.id} />
        },
      },
    ],
    [translate]
  )

  const onCreateNewCategory = () => {
    router.push({
      pathname: '/notifications/categories/create',
    })
  }

  const fetchCategory = useCallback(
    async (paginationState: DataTableStateEvent) => {
      console.log(paginationState)
      let sortfield = paginationState.sortField
      let sortorder = 'desc'
      if (paginationState.sortField === '_count.message_template')
        sortfield = 'count'

      switch (paginationState.sortOrder) {
        case -1:
          sortorder = 'asc'
      }
      await OBNOTISDK.client
        .messageCategoriesIndex(
          sortfield,
          sortorder,
          (paginationState.page ?? 0) + 1,
          paginationState.rows
        )
        .then((res: any) => {
          const categoryData = res?.data?.data.map(
            (rs: MessageCategoryData) => ({
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
            })
          ) as MessageCategoryData[]

          console.log(res)
          setCategorys(categoryData)
          setTotalRecords(res?.data?.pagination.total)
          setIsLoading(false)
          return categoryData
        })
    },
    []
  )

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          className='bg-primary-blue'
          label='Create new category'
          onClick={onCreateNewCategory}
        />
      </div>
    )

    setMenuAction(menuAction)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div>
            <Table
              columns={columns}
              data={categorys}
              loading={isLoading}
              totalRecords={totalRecords}
              onTableStateChange={fetchCategory}
            />
          </div>
        </div>
      </div>
    </>
  )
}

NotificationCategory.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/notifications/categories',
    accessPage: PCODE.VIEWINAPPNOTIFICATIONCATEGORYLISTANDDETAILS,
  }
)
