import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
// import { Button } from 'primereact/button'
import router from 'next/router'
import { PCODE } from '@src/data/constants/privilege'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import React from 'react'
import {
  IFilterSchedulePlan,
  IGetSchedulePlan,
} from '@src/services/guardtour/scheduleplan/model'
import { SchedulePlanFilter } from '@components/guardtour/scheduleplan/scheduleplan-filter'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { capitalize } from 'lodash'

type Props = { routes: KeyValue[]; socMembers: [] }

export default function SchedulePlan(props: Props) {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetSchedulePlan[]>([])
  const [filter, debouncedFilter, setFilter] = useDebounce<IFilterSchedulePlan>(
    {},
    400
  )

  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'updatedDate',
    sortOrder: -1,
  })

  const { routes, socMembers } = props

  setMenuName('Schedule Plan')

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'Schedule ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'route',
        header: 'Route',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'frequency',
        header: 'Frequency',
        style: { minWidth: '100px' },
        sortable: true,
        body: (rowData) =>
          Array.isArray(rowData.frequency)
            ? rowData.frequency.map((freq: any) => capitalize(freq)).join(', ')
            : rowData.frequency,
      },
      {
        field: 'startTime',
        header: 'Start Time',
        style: { minWidth: '100px' },
        body: (rowData) => rowData.startTime?.slice(0, 5),
      },
      {
        field: 'endTime',
        header: 'End Time',
        style: { minWidth: '100px' },
        sortable: true,
        body: (rowData) => rowData.endTime?.slice(0, 5),
      },
      {
        field: 'memberName',
        header: 'Assign Member',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'isActive',
        accessorKey: 'isActive',
        header: 'Active',
        style: { maxWidth: '100px' },
        sortable: false,
        body: (data: IGetSchedulePlan) => {
          return (
            <InputSwitch
              id='isActive'
              name='isActive'
              checked={data.isActive ?? false}
              onChange={() => {
                handleChangeIsActive(data)
              }}
            />
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetSchedulePlan) => {
          return (
            <>
              <TableAction types={['edit']} id={data.id} />
            </>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  const handleChangeIsActive = (item: IGetSchedulePlan) => {
    // let updatedIsActive = (item.isActive = !item.isActive)
    console.log('item-->', item)
    const updatedItem = { ...item, isActive: !item.isActive }

    const findMemberIdByName = (
      data: { id: string; name: string }[],
      MID: string
    ): string | null => {
      const foundItem = data.find((item) => item.id === MID)
      return foundItem ? foundItem.id : null
    }

    let sendData: any = {
      sdpid: item.id,
      route: item.route,
      frequency: item.frequency,
      startTime: item.startTime,
      endTime: item.endTime,
      memberId: findMemberIdByName(socMembers, item.memberId),
      isActive: updatedItem.isActive,
    }

    schedulePlanService.updateSchedulePlan(sendData).then(() => getData())
  }

  const onCreateSchedule = () => {
    router.push({
      pathname: '/guardtour/scheduleplan/create',
    })
  }

  const onFilter = (item: IFilterSchedulePlan) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    await schedulePlanService
      .getAll(filter, tableState)
      .then((res) => {
        setData(res.data)
        setTotalRecords(res.paginate.total)
        if (res.paginate.total === 0) {
          setIsLoading(false)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          className='bg-primary-blue'
          label='Create schedule plan'
          onClick={onCreateSchedule}
        />
      </div>
    )
    setMenuAction(menuAction)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <SchedulePlanFilter routes={routes} onFilter={onFilter} />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              rows={10}
              sortField='updatedDate'
              sortOrder={-1}
              onTableStateChange={setTableState}
            />
          </div>
        </div>
      </div>
    </>
  )
}

SchedulePlan.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const RoutesRes = await schedulePlanService.getAllRoute()
    const routes = RoutesRes.data
      .map((x) => {
        return { name: x.code, value: x.id } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    const socMembers = await schedulePlanService.getSocMember()

    console.log(socMembers)

    ctx.props = { ...ctx.props, routes, socMembers }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/scheduleplan',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
