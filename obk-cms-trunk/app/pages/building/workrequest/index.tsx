import { useEffect, useMemo } from 'react'

import { useTranslate } from '@refinedev/core'
import { useState } from 'react'

import withGenericServer from '@hocs/server/generic'
import mockdata from '@src/services/buildingservice/workrequest/mockdata.json'
import ListAction from '@components/listworkrq/action'
import { WorkRequestFilter } from '@components/building/workrequest/workrequest-filter'
import { Table } from '@components/table/Table'
import { ColumnProps } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { useLayoutContext } from '@src/layout/context/layoutcontext'

export default function AcRequest() {
  const translate = useTranslate()
  const [setFilters] = useState([]) as any
  const [isLoading, setIsLoading] = useState(false)
  const data = useMemo(() => mockdata, [])
  const { setMenuAction } = useLayoutContext()

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        style: { minWidth: '100px' },
        header: translate('blog_posts.fields.id'),
        // className: 'col-sticky-start',
      },
      {
        field: 'type_of_issue',
        style: { minWidth: '100px' },
        header: 'Type of issue',
      },
      {
        field: 'location',
        style: { minWidth: '100px' },
        header: 'Location',
      },
      {
        field: 'title',
        style: { minWidth: '100px' },
        header: 'Title',
      },
      {
        field: 'created_date',
        style: { minWidth: '100px' },
        header: 'Create Date',
      },
      {
        field: 'created_by',
        style: { minWidth: '100px' },
        header: 'Create by',
      },
      {
        field: 'status',
        style: { minWidth: '100px' },
        header: 'Status',
        body: ({ status }) => {
          return (
            <div>
              {status === 'Pending' && <Tag value='Pending' color='#CD1A1A' />}
              {status === 'Canceled' && (
                <Tag value='Canceled' color='#948d8d' />
              )}
              {status === 'Assigned' && (
                <Tag value='Assigned' color='#59B413' />
              )}
            </div>
          )
        },
      },
      {
        id: 'id',
        header: translate('table.actions'),
        body: ({ id }) => {
          return <ListAction types={['show']} id={id} />
        },
      },
    ],
    [translate]
  )

  const onFilter = (items: any) => {
    setFilters(items)
  }

  useEffect(() => {
    const menuAction = (
      <div>
        <Button
          className='bg-gray-900 border-gray-900 text-gray-50'
          label='Create new request'
        />
      </div>
    )

    setMenuAction(menuAction)
    setIsLoading(false)
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div className='flex justify-content-between'>
            <WorkRequestFilter onFilter={onFilter} />
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
    redirectPath: '/building/workrequest',
  }
)
