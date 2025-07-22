import { Box } from '@chakra-ui/react'
import { Table } from '@components/table/Table'
import { useTranslate } from '@refinedev/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import SectionTitle from '@components/display/section-title'
import { Button } from 'primereact/button'
import { documentTypeService } from '@src/services/carpark-config/document-type'
import withGenericServer from '@hocs/server/generic'
import { ConfigDocsTypeResponse } from 'ob-parking-sdk/dist/api'
import { ColumnProps } from 'primereact/column'
import { DataTableStateEvent } from 'primereact/datatable'
export default function DocumentTypePage() {
  const router = useRouter()
  const translate = useTranslate()
  const [tableState, setTableState] = useState<DataTableStateEvent>()

  const [documentTypeData, setDocumentTypeData] = useState<
    ConfigDocsTypeResponse[]
  >([])
  const [documentTypePaginationData, setDocumentPaginationTypeData] = useState<
    ConfigDocsTypeResponse[]
  >([])

  useEffect(() => {
    const initialLoad = async () => {
      const docsType = await documentTypeService.getDocumentTypeIndex()
      docsType && setDocumentTypeData(docsType)
    }
    initialLoad()
  }, [])

  useEffect(() => {
    const page = tableState?.page ? tableState?.page + 1 : 1
    const pageSize = tableState?.rows ?? 25

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = documentTypeData.slice(startIndex, endIndex)

    setDocumentPaginationTypeData(paginated)
  }, [tableState, documentTypeData])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: translate('general.id'),
        style: { minWidth: '75px' },
        sortable: false,
      },
      {
        field: 'keyword',
        header: translate('docsType.fields.keyword'),
        sortable: false,
        className: 'tw-max-w-fit tw-truncate',
      },
      {
        field: 'type',
        header: translate('docsType.fields.type'),
        sortable: false,
        className: 'tw-max-w-fit tw-truncate',
      },
      {
        field: 'action',
        header: translate('general.action'),
        sortable: false,
        className: 'tw-max-w-fit tw-truncate',
        body: (info: ConfigDocsTypeResponse) => (
          <Box
            className='text-primary-blue'
            fontWeight='bold'
            cursor='pointer'
            onClick={() =>
              router.push(`/car-park/document-type/edit/${info.id}`)
            }
          >
            {translate('general.edit')}
          </Box>
        ),
      },
    ],
    []
  )

  const handleCreate = () => router.push('/car-park/document-type/create')

  return (
    <div className='tw-max-w-inherit tw-pb-[60px] card'>
      <div className='tw-flex tw-items-center tw-justify-between'>
        <SectionTitle> {translate('docsType.title')}</SectionTitle>
        <Button
          className='text-white bg-primary-blue'
          label={translate('docsType.button.create')}
          onClick={handleCreate}
        />
      </div>
      <Table
        columns={columns}
        data={documentTypePaginationData}
        totalRecords={documentTypeData.length}
        onTableStateChange={setTableState}
        className='pt-6'
      />
    </div>
  )
}

DocumentTypePage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/car-park/document-type',
  }
)
