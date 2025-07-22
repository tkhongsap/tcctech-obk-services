import { useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import mockdata from 'src/services/buildingservice/feedbackrequest/mockdata.json'
import { ColumnProps } from 'primereact/column'
import { Tag } from 'primereact/tag'
import FeedbackRequestFilter from '@components/building/feedbackrequest/feedback-request-filter'
import { IFeedbackRequest } from '@components/building/feedbackrequest/types/feedback-request'
import { Table } from '@components/table/Table'
import ListAction from '@components/listworkrq/action'

export default function AcRequest() {
  const translate = useTranslate()
  const [setFilters] = useState([]) as any
  const [isLoading, setIsLoading] = useState(false)
  const data = useMemo<IFeedbackRequest[]>(
    () => mockdata as IFeedbackRequest[],
    []
  )

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
      },
      {
        field: 'location',
        header: 'Location',
        style: { minWidth: '200px' },
      },
      {
        field: 'problemtype',
        header: 'Problem Type',
        style: { minWidth: '200px' },
      },
      {
        field: 'issue',
        header: 'Issue',
        style: { minWidth: '200px' },
      },
      {
        field: 'author',
        header: 'Author',
        style: { minWidth: '200px' },
      },
      {
        field: 'datetime',
        header: 'Date and Time',
        style: { minWidth: '200px' },
      },
      {
        // accessorKey: 'content',
        header: 'status',
        style: { minWidth: '200px' },
        body: (data: IFeedbackRequest) => {
          const getSeverity = (data: IFeedbackRequest) => {
            switch (data.status) {
              case 'Delivered':
                return 'success'
              case 'Shipped':
                return 'warning'
              case 'On Delivery Vehicle':
                return 'info'
              case 'At Warehouse':
                return 'danger'
            }
          }
          return <Tag value={data.status} severity={getSeverity(data)}></Tag>
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IFeedbackRequest) => {
          return <ListAction types={['show']} id={data.id} />
        },
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
            <FeedbackRequestFilter onFilter={onFilter} />
          </div>
          <div>
            <Table columns={columns} data={data} loading={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}

AcRequest.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/building/feedbackrequest',
  }
)
