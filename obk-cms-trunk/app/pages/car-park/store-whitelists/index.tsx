import { Box } from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import { storeWhitelistService } from '@src/services/carpark-config/store-whitelist'
import { StoreWhitelistType } from '@src/types/car-park/carpark.store-whitelist'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { DataTableStateEvent } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

const sortingKey = {
  id: 'id',
  taxId: 'tax_id',
  storeName: 'store_name',
  companyName: 'company_name',
  property: 'property_name',
  unitNo: 'unit_no',
  address: 'address',
  building: 'building',
  hasTaxId: 'has_tax_id',
  receiptAddressInObk: 'receipt_address_in_obk',
}

type SearchStore = {
  storeName: string
  companyName: string
  address: string
}

const CustomFilter = ({
  setSearchStore,
}: {
  setSearchStore: Dispatch<SetStateAction<SearchStore>>
}) => (
  <div className='tw-full tw-flex tw-justify-end gap-3 bg-red'>
    <InputText
      placeholder='Store name'
      onChange={(e) =>
        setSearchStore((prev) => ({ ...prev, storeName: e.target.value }))
      }
    />{' '}
    <InputText
      placeholder='Company name'
      onChange={(e) =>
        setSearchStore((prev) => ({ ...prev, companyName: e.target.value }))
      }
    />{' '}
    <InputText
      placeholder='Address'
      onChange={(e) =>
        setSearchStore((prev) => ({ ...prev, address: e.target.value }))
      }
    />
  </div>
)

export default function WhitelistPage() {
  const router = useRouter()
  const translate = useTranslate()

  const [storeWhitelistData, setStoreWhitelistData] = useState<
    StoreWhitelistType[]
  >([])
  const [storeWhitelistPaginationData, setStoreWhitelistPaginationData] =
    useState<StoreWhitelistType[]>([])
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [searchStore, setSearchStore] = useState<SearchStore>({
    storeName: '',
    companyName: '',
    address: '',
  })
  const [totalData, setTotalData] = useState<number>(0)

  const sortingState = useMemo(
    () => ({
      sortField: tableState?.sortField,
      sortOrder: tableState?.sortOrder,
    }),
    [tableState?.sortField, tableState?.sortOrder]
  )

  useEffect(() => {
    const initialLoad = async () => {
      if (!router.isReady) return
      const { sortField, sortOrder } = sortingState
      const sorting = sortField
      const direction =
        sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : undefined
      const isSorting = Boolean(sorting && direction)
      const stores = await storeWhitelistService.getStoreWhitelistIndex({
        ...(isSorting && {
          sort_key: sortingKey[sorting as keyof typeof sortingKey],
          sort_direction: direction,
        }),
      })
      stores && setStoreWhitelistData(stores)
    }
    initialLoad()
  }, [sortingState, router.query.direction])

  useEffect(() => {
    const { address, companyName, storeName } = searchStore
    const page = tableState?.page ? tableState?.page + 1 : 1
    const pageSize = tableState?.rows ?? 25

    const filtered = storeWhitelistData.filter((item) => {
      return (
        (!address ||
          item.address?.toLowerCase().includes(address.toLowerCase())) &&
        (!companyName ||
          item.companyName
            ?.toLowerCase()
            .includes(companyName.toLowerCase())) &&
        (!storeName ||
          item.storeName?.toLowerCase().includes(storeName.toLowerCase()))
      )
    })

    const totalData = filtered.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)

    setStoreWhitelistPaginationData(paginated)
    setTotalData(totalData)
  }, [
    searchStore.address,
    searchStore.companyName,
    searchStore.storeName,
    storeWhitelistData,
    tableState,
    setStoreWhitelistPaginationData,
  ])

  const columns = useMemo(
    () => [
      {
        field: 'id',
        header: translate('general.id'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
      },
      {
        field: 'taxId',
        header: translate('storeWhitelist.fields.taxId'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => <>{info.taxId || '-'}</>,
      },
      {
        field: 'storeName',
        header: translate('storeWhitelist.fields.storeName'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
      },
      {
        field: 'companyName',
        header: translate('storeWhitelist.fields.companyName'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
      },
      {
        field: 'property',
        header: translate('storeWhitelist.fields.property'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => <>{info.property.name}</>,
      },
      {
        field: 'unitNo',
        header: translate('storeWhitelist.fields.unitNo'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => <>{info.unitNo || '-'}</>,
      },
      {
        field: 'address',
        header: translate('storeWhitelist.fields.address'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => <>{info.address || '-'}</>,
      },
      {
        field: 'building',
        header: translate('storeWhitelist.fields.building'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => <>{info.building || '-'}</>,
      },
      {
        field: 'hasTaxId',
        header: translate('storeWhitelist.fields.hasTaxId'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
      },
      {
        field: 'receiptAddressInObk',
        header: translate('storeWhitelist.fields.receiptAddressInObk'),
        sortable: true,
        className: 'tw-w-fit tw-truncate',
      },
      {
        field: 'action',
        header: translate('general.action'),
        className: 'tw-w-fit tw-truncate',
        body: (info: StoreWhitelistType) => (
          <Box
            className='text-primary-blue'
            fontWeight='bold'
            cursor='pointer'
            onClick={() =>
              router.push(`/car-park/store-whitelists/edit/${info.id}`)
            }
          >
            {translate('general.edit')}
          </Box>
        ),
      },
    ],
    []
  )

  const handleCreate = () => router.push('/car-park/store-whitelists/create')

  return (
    <div className='tw-max-w-inherit tw-pb-[60px] card'>
      <div className='tw-flex tw-items-center tw-justify-between'>
        <SectionTitle> {translate('storeWhitelist.title')}</SectionTitle>
        <Button
          className='text-white bg-primary-blue'
          label={translate('storeWhitelist.button.create')}
          onClick={handleCreate}
        />
      </div>
      <div className='w-full mt-5 lg:mt-[60px] tw-space-y-2'>
        <CustomFilter setSearchStore={setSearchStore} />
        <Table
          columns={columns}
          data={storeWhitelistPaginationData}
          onTableStateChange={setTableState}
          totalRecords={totalData}
        />
      </div>
    </div>
  )
}

WhitelistPage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/car-park/store-whitelists',
  }
)
