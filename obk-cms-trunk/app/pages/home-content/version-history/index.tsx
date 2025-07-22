import React, { useState, useMemo, useCallback } from 'react'
import { ColumnProps } from 'primereact/column'
import { useTranslate } from '@refinedev/core'
import { IHomeContentList } from '@src/services/homecontent/history/model'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import ListAction from '@components/listworkrq/action'
import { homeContentService } from '@src/services/homecontent/history/service'
import { DataTableStateEvent } from 'primereact/datatable'
import { PCODE } from '@src/data/constants/privilege'

export default function HomeContentEdit() {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IHomeContentList[]>([])
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'version',
        header: 'Version',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'updatedDate',
        header: 'Last update',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'updatedBy',
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
        body: (data: IHomeContentList) => {
          return <ListAction types={['show']} id={data.hcid} />
        },
      },
    ],
    [translate]
  )

  const getData = useCallback(async (e: DataTableStateEvent) => {
    setIsLoading(true)
    homeContentService
      .getAll(e)
      .then((res) => {
        setData(res.data.data)
        setTotalRecords(res.data.totalRecords)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <div className='card'>
        <Table
          columns={columns}
          data={data}
          loading={isLoading}
          totalRecords={totalRecords}
          onTableStateChange={getData}
        />
      </div>
    </>
  )
}

HomeContentEdit.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/homecontent/version-history',
    accessPage: PCODE.VIEWHOMECONTENTOFFICE,
  }
)
