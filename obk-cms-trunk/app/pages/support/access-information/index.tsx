import SectionTitle from '@components/display/section-title'
import { useTranslate } from '@refinedev/core'
import useLoading from '@src/hooks/useLoading'
import { useCallback, useMemo, useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'

import { DataTableStateEvent } from 'primereact/datatable'
import ListAction from '@components/list/action'

import { IAccessLocalInformationList } from '@src/types/document'
import { accessLocalInformationService } from '@src/services/access-information/service'

export default function AccessLocalInformation() {
  const translate = useTranslate()
  const [totalRecords, setTotalRecords] = useState(0)
  const { loading, startLoading, stopLoading } = useLoading()

  const [data, setData] = useState<IAccessLocalInformationList[]>([])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        accessorKey: 'id',
        header: translate('accessLocalInformation.fields.id'),
        sortable: false,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        field: 'category',
        accessorKey: 'category',
        header: translate('accessLocalInformation.fields.category'),
        sortable: false,
      },
      {
        field: 'updatedAt',
        accessorKey: 'updatedAt',
        header: translate('accessLocalInformation.fields.updatedAt'),
        sortable: false,
      },
      {
        field: 'updatedBy',
        accessorKey: 'updatedBy',
        header: translate('accessLocalInformation.fields.updatedBy'),
        sortable: false,
        body: (data: IAccessLocalInformationList) =>
          data.updated_by_name ? data.updated_by_name : '-',
      },
      {
        field: 'action',
        accessorKey: 'action',
        header: translate('accessLocalInformation.fields.action'),
        sortable: false,
        body: (data: IAccessLocalInformationList) => (
          <ListAction types={['edit']} id={data.id} />
        ),
      },
    ],
    [translate]
  )

  const fetchContent = useCallback(async (e: DataTableStateEvent) => {
    startLoading()
    const firstIndex = e.first
    const lastIndex = e.first + e.rows
    const datas = await accessLocalInformationService.getInformations(
      firstIndex,
      lastIndex
    )
    if (datas) {
      setTotalRecords(datas.total)
      setData(datas.data)
    }
    stopLoading()
  }, [])

  return (
    <div className='max-w-inherit pb-[60px] tw-space-y-[60px]'>
      <div className='mb-5'>
        <SectionTitle>{translate('accessLocalInformation.title')}</SectionTitle>
      </div>
      <div className='card'>
        <Table
          columns={columns}
          data={data}
          loading={loading}
          totalRecords={totalRecords}
          onTableStateChange={fetchContent}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/support/access-information',
  }
)
