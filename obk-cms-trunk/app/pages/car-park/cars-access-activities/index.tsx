import { Tag } from 'primereact/tag'
import * as OBBMSSDK from 'ob-bms-sdk'
import { TableAction } from '@components/display/table-action'
import { IFilterParkingAccess } from '@components/car-park/carpark-interface'
import useTableTools from '@src/hooks/useTableTools'
import { KeyValue } from '@src/types/key-value'
import { isEmpty, snakeCase } from 'lodash'
import { useDebounce } from 'primereact/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE } from '@components/table/constants'
import dayjs from 'dayjs'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import Table from '@components/table'
import { ColumnDef } from '@tanstack/react-table'
import { AccessorType, ParkingLogResult } from 'ob-bms-sdk/dist/api'
import { ParkingAccessFilter } from '@components/car-park/carpark-filter'
export default function CarParkAccess() {
  const {
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    setPagination,
    pagination,
  } = useTableTools()
  const [data, setData] = useState<ParkingLogResult[]>([])
  const [
    filterParkingAccess,
    debouncedFilterParkingAccess,
    setFilterParkingAccess,
  ] = useDebounce<IFilterParkingAccess>({}, 400)
  const [gate, setGate] = useState<KeyValue[]>([])

  useEffect(() => {
    fetchParkingAccess()
  }, [])

  useEffect(() => {
    fetchParkingAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParkingAccess, debouncedFilterParkingAccess])

  const fetchParkingAccess = useCallback(async () => {
    let DatePicker
    if (!isEmpty(filterParkingAccess.date)) {
      DatePicker = filterParkingAccess.date?.map((item) => {
        return dayjs(item).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
      })
    }

    const result = await OBBMSSDK.client.parkingAccessLogsIndex(
      snakeCase(sorting[0]?.id),
      sorting[0]?.desc ? 'desc' : 'asc',
      currentPage,
      PAGE_SIZE,
      filterParkingAccess.type,
      filterParkingAccess.gate ?? undefined,
      undefined,
      filterParkingAccess.filter ?? undefined,
      DatePicker && DatePicker[0],
      DatePicker && DatePicker[1]
    )

    setData(result.data.data)
    setPagination({
      ...pagination,
      totalData: result.data?.pagination?.total || 1,
      currentPage: result.data?.pagination?.page_number || 1,
      totalPage: result.data?.pagination?.total_page || 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterParkingAccess, filterParkingAccess])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'id',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'plate_number',
        accessorKey: 'plate_number',
        header: 'License No.',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'transaction_date',
        accessorKey: 'transaction_date',
        header: 'Date and time',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
        cell: function render({ getValue }: any) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'terminal_id',
        accessorKey: 'terminal_id',
        header: 'Gate',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'durationTime',
        accessorKey: 'durationTime',
        header: 'Duration',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        sortable: true,
        cell: function render({ getValue }) {
          return (
            <div className=' w-full justify-center items-center'>
              <Tag
                style={{
                  backgroundColor:
                    getValue() === 'onsite' && getValue()
                      ? '#EFF8E8'
                      : '#F5F5F5',
                  color: getValue() === 'onsite' ? '#59B413' : '#1B1B1B',
                  alignItems: 'center',
                }}
              >
                {getValue() === 'onsite' ? 'Onsite' : 'Left'}
              </Tag>
            </div>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'plate_number',
        header: 'Actions',
        cell: function render({ getValue }) {
          const plateNumber = getValue()
          return <TableAction types={['show']} id={plateNumber} />
        },
      },
    ],
    []
  )
  const paginationProps = {
    currentPage: currentPage,
    pageOnChange: setCurrentPage,
    totalPage: pagination.totalPage,
  }

  const fetchGateData = async () => {
    try {
      const result = await OBBMSSDK.client.parkingAccessLogsIndex()
      const uniqueGates = Array.from(
        new Set(result.data.data.map((item: any) => item.terminal_id as string))
      )
        .filter((terminal_id): terminal_id is string => Boolean(terminal_id))
        .map((terminal_id) => ({ name: terminal_id, value: terminal_id }))
      setGate(uniqueGates)
    } catch (error) {
      console.error('Error fetching gate data:', error)
    }
  }

  useEffect(() => {
    fetchGateData()
  }, [])

  const parkingAccessFilter = () => {
    return (
      <div className='pt-5'>
        <ParkingAccessFilter
          onFilter={setFilterParkingAccess}
          search
          gate={gate}
          type={[
            {
              name: 'Registered',
              value: AccessorType.Member,
            },
            {
              name: 'Non-Registered',
              value: AccessorType.Pass,
            },
          ]}
        />
      </div>
    )
  }

  return (
    <>
      <div className='tw-max-w-inherit tw-pb-[60px]'>
        <Table
          title={'Cars Access Activities'}
          columns={columns}
          data={data}
          customComponentFilter={parkingAccessFilter}
          paginationProps={paginationProps}
          sortingProps={{ sorting, setSorting }}
          className='tw-my-5 lg:tw-my-[60px]'
          bg='#FCFCFC'
        />
      </div>
    </>
  )
}

CarParkAccess.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/car-park',
    accessPage: PCODE.VIEWCARSACCESSACTIVITIES,
  }
)
