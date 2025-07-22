import { useEffect, useMemo } from 'react'
import Tag from '@components/tag'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import mockdata from '@src/services/buildingservice/workorder/mockdata.json'
import { TableAction } from '@components/display/table-action'
import { ColumnProps } from 'primereact/column'
import { WorkOrderFilter } from '@components/building/workorder/workorder-filter'
import { Table } from '@components/table/Table'

export default function WorkOrder() {
  const translate = useTranslate()
  const [setFilters] = useState<any>([])
  const data = useMemo(() => mockdata, [])
  const [isLoading, setIsLoading] = useState(false)

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        style: { width: '200px' },
        header: translate('blog_posts.fields.id'),
      },
      {
        field: 'work_order_type',
        style: { width: '200px' },
        header: 'Work order type',
      },
      {
        field: 'service_category',
        style: { width: '200px' },
        header: 'Service Category',
      },
      {
        field: 'location',
        style: { width: '200px' },
        header: 'Location',
      },
      {
        field: 'created_date',
        style: { width: '200px' },
        header: 'Create Date',
      },
      {
        field: 'created_by',
        style: { width: '200px' },
        header: 'Create by',
      },
      {
        field: 'priority',
        style: { width: '200px' },
        header: 'Priority',
      },
      {
        field: 'status',
        style: { width: '200px' },
        header: 'status',
        body: ({ status }) => {
          return (
            <div>
              {status === 'New' && <Tag value='New' color='#0ea5e9' />}
              {status === 'Canceled' && (
                <Tag value='Canceled' color='#948d8d' />
              )}
              {status === 'progress' && (
                <Tag value='Progress' color='#C25DEE' />
              )}
              {status === 'waiting for approval' && (
                <Tag value='Waiting for approval' color='#F0A300' />
              )}
              {status === 'Done' && <Tag value='Done' color='#59B413' />}
            </div>
          )
        },
      },
      {
        field: 'actions',
        style: { width: '200px' },
        header: translate('table.actions'),
        body: ({ id }) => {
          return <TableAction types={['edit']} id={id} />
        },
        className: 'col-sticky-end', //to draw line between cell
      },
    ],
    [translate]
  )

  const onFilter = (items: any) => {
    setFilters(items)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <div className='card'>
        <div>
          <div className='flex justify-content-between'>
            <WorkOrderFilter onFilter={onFilter} />
          </div>
          <div>
            <Table columns={columns} data={data} loading={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}

WorkOrder.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/building/workorder',
  }
)
