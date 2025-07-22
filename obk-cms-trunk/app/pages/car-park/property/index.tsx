import { Box } from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import propertyService from '@src/services/carpark-config/property'

import { useRouter } from 'next/router'
import { PropertiesResponse } from 'ob-parking-sdk/dist/api'
import { Button } from 'primereact/button'
import { ColumnProps } from 'primereact/column'
import { DataTableStateEvent } from 'primereact/datatable'
import { useEffect, useMemo, useState } from 'react'

export default function PropertyPage() {
  const router = useRouter()
  const translate = useTranslate()

  const [tableState, setTableState] = useState<DataTableStateEvent>()

  const [propertiesData, setPropertiesData] = useState<PropertiesResponse[]>([])
  const [propertyPaginationData, setPropertyPaginationData] = useState<
    PropertiesResponse[]
  >([])

  useEffect(() => {
    const initialLoad = async () => {
      const properties = await propertyService.getProperties()
      properties && setPropertiesData(properties)
    }
    initialLoad()
  }, [])

  useEffect(() => {
    const page = tableState?.page ? tableState?.page + 1 : 1
    const pageSize = tableState?.rows ?? 25

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = propertiesData.slice(startIndex, endIndex)

    setPropertyPaginationData(paginated)
  }, [tableState, propertiesData])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        accessorKey: 'id',
        header: translate('general.id'),
        sortable: false,
        className: 'tw-max-w-fit tw-truncate',
      },
      {
        field: 'name',
        accessorKey: 'name',
        header: translate('property.fields.name'),
        sortable: false,
        className: 'tw-max-w-fit tw-truncate',
      },
      {
        field: 'address',
        accessorKey: 'address',
        header: translate('property.fields.address'),
        sortable: false,
        body: (info: PropertiesResponse) => {
          const cellValue = info.addresses.join(', ') || '-'
          return <span className=''>{cellValue}</span>
        },
      },
      {
        field: 'keyword',
        accessorKey: 'keyword',
        header: translate('property.fields.keyword'),
        sortable: false,
        body: (info: PropertiesResponse) => {
          const cellValue = info.keywords.join(', ') || '-'
          return <span className=''>{cellValue}</span>
        },
      },
      {
        field: 'action',
        accessorKey: 'action',
        header: translate('general.action'),
        sortable: false,
        className: 'tw-max-w-[120px] tw-truncate',
        body: (info: PropertiesResponse) => (
          <Box
            className='text-primary-blue'
            fontWeight='bold'
            cursor='pointer'
            onClick={() => router.push(`/car-park/property/edit/${info.id}`)}
          >
            {translate('general.edit')}
          </Box>
        ),
      },
    ],
    [translate]
  )

  const handleCreate = () => router.push('/car-park/property/create')

  return (
    <div className='tw-max-w-inherit tw-pb-[60px] card'>
      <div className='tw-flex tw-items-center tw-justify-between'>
        <SectionTitle> {translate('property.title')}</SectionTitle>
        <Button
          className='text-white bg-primary-blue'
          label={translate('property.button.create')}
          onClick={handleCreate}
        />
      </div>
      <Table
        columns={columns}
        data={propertyPaginationData}
        totalRecords={propertiesData.length}
        className='pt-6'
        onTableStateChange={setTableState}
      />
    </div>
  )
}

PropertyPage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/car-park/property',
  }
)
