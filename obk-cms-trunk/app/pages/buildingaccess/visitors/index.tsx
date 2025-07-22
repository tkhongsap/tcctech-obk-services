import { IFilterBuildingAccess } from '@components/building-access/building-access-interface'
import withGenericServer from '@hocs/server/generic'
import useTableTools from '@src/hooks/useTableTools'
import { KeyValue } from '@src/types/key-value'
import dayjs from 'dayjs'
import { isEmpty, snakeCase } from 'lodash'
import {
  AccessorType,
  BuildingAccessLogResult,
  TowerData,
} from 'ob-bms-sdk/dist/api'
import { useDebounce } from 'primereact/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PAGE_SIZE } from '@components/table/constants'
import Table from '@components/table'
import { ColumnDef } from '@tanstack/react-table'
import { BuildingAccessFilter } from '@components/building-access/building-access-filter'
import { Tag } from 'primereact/tag'
import { TableAction } from '@components/display/table-action'

export default function VisitorsAccess() {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const {
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    setPagination,
    pagination,
  } = useTableTools()
  const [data, setData] = useState<BuildingAccessLogResult[]>([])
  const [tower, setTower] = useState<KeyValue[]>([])
  const [
    filterBuildingAccess,
    debouncedFilterBuildingAccess,
    setFilterBuildingAccess,
  ] = useDebounce<IFilterBuildingAccess>({}, 400)

  useEffect(() => {
    fetchVisitorsAccess()
    fetchTowerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchVisitorsAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBuildingAccess, debouncedFilterBuildingAccess])

  const fetchVisitorsAccess = useCallback(async () => {
    let DatePicker

    if (!isEmpty(filterBuildingAccess.date)) {
      DatePicker = filterBuildingAccess.date?.map((item) => {
        return dayjs(item).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
      })
    }

    const buildingLogData = await OBBMSSDK.client.buildingAccessLogsIndex(
      AccessorType.Pass,
      snakeCase(sorting[0]?.id),
      sorting[0]?.desc ? 'desc' : 'asc',
      currentPage,
      PAGE_SIZE,
      filterBuildingAccess.building,
      filterBuildingAccess.filter,
      undefined,
      filterBuildingAccess.building,
      filterBuildingAccess.statusPass
        ? parseInt(filterBuildingAccess.statusPass)
        : undefined,
      DatePicker && DatePicker[0],
      DatePicker && DatePicker[1]
    )

    setData(buildingLogData.data.data)
    setPagination({
      ...pagination,
      totalData: buildingLogData.data?.pagination?.total || 1,
      currentPage: buildingLogData.data?.pagination?.page_number || 1,
      totalPage: buildingLogData.data?.pagination?.total_page || 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterBuildingAccess, filterBuildingAccess])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'fs_account_id',
        accessorKey: 'fs_account_id',
        header: 'Visitor ID',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'company_name',
        accessorKey: 'visitor.company_name',
        header: 'Company',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'name',
        accessorKey: 'visitor.name',
        header: 'Name',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'email',
        accessorKey: 'visitor.email',
        header: 'Email',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'transaction_date',
        accessorKey: 'transaction_date',
        header: 'Access time',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'display_tower',
        accessorKey: 'display_tower',
        header: 'Building',
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'turnstile_id',
        accessorKey: 'turnstile_id',
        header: 'Turnstile',
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
                    getValue() === 0 && getValue() ? '#EFF8E8' : '#F5F5F5',
                  color: getValue() === 0 ? '#59B413' : '#1B1B1B',
                  alignItems: 'center',
                }}
              >
                {getValue() === 0 ? 'Onsite' : 'Left'}
              </Tag>
            </div>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'visitor.name',
        header: 'Actions',
        cell: function render({ getValue }) {
          const name = getValue()
          return <TableAction types={['show']} id={name} />
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

  const fetchTowerData = async () => {
    try {
      const tower = await OBBMSSDK.client.towersIndex().then((res) => {
        const towerList = (res.data?.data as TowerData[])?.map(
          (tower: TowerData) => {
            return {
              name: tower.name,
              value: tower.name,
            }
          }
        )

        return towerList
      })
      setTower(tower)
    } catch (error) {
      console.error('Error fetching gate data:', error)
    }
  }

  const BuildingAccessFilters = () => {
    return (
      <div className='pt-5'>
        <BuildingAccessFilter
          onFilter={setFilterBuildingAccess}
          search
          building={tower}
        />
      </div>
    )
  }
  return (
    <>
      <div className='tw-max-w-inherit tw-pb-[60px]'>
        <Table
          title={'Visitors access log'}
          columns={columns}
          data={data}
          customComponentFilter={BuildingAccessFilters}
          paginationProps={paginationProps}
          sortingProps={{ sorting, setSorting }}
          className='tw-my-5 lg:tw-my-[60px]'
          bg='#FCFCFC'
        />
      </div>
    </>
  )
}

VisitorsAccess.activePrime = true

export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
