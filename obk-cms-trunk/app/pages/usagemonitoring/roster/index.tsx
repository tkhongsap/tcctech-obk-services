import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import router from 'next/router'
import { PCODE } from '@src/data/constants/privilege'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import React from 'react'
import { Button } from 'primereact/button'
import { rosterregisterService } from '@src/services/roster/service'
import {
  IFilterRosterRegister,
  IGetRosterRegister,
} from '@src/services/roster/model'
import { RosterRegisterFilter } from '@components/roster/roster-filter'
import Heading from '@components/typography/heading'

export default function RosterRegister() {
  const translate = useTranslate()

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetRosterRegister[]>([])
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterRosterRegister>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'id',
    sortOrder: -1,
  })

  setMenuName('Roster')

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'component',
        header: 'Component',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'weekDay',
        header: 'Week Day',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'weekEnd',
        header: 'Week End',
        style: { minWidth: '100px' },
        sortable: true,
      },

      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { maxWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetRosterRegister) => {
          return (
            <>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() =>
                  router.push('/usagemonitoring/roster/edit/' + data.id)
                }
              >
                Edit
              </a>
            </>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  const onCreateUser = () => {
    router.push({
      pathname: '/usagemonitoring/roster/create',
    })
  }

  const onFilter = (item: IFilterRosterRegister) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await rosterregisterService.getAll(filter, tableState)
      setData(res.data)
      setTotalRecords(res.paginate.total)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
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
          label='Create'
          onClick={onCreateUser}
        />
      </div>
    )
    setMenuAction(menuAction)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])
  const sumWeeks = (data: any) => {
    return data.reduce(
      (total: any, item: any) => {
        if (item.isActive) {
          total.weekDay += item.weekDay
          total.weekEnd += item.weekEnd
        }
        return total
      },
      { weekDay: 0, weekEnd: 0 }
    )
  }

  const result = sumWeeks(data)
  return (
    <>
      <div className='grid gap-5 mt-4'>
        <div className='col py-0'>
          <div className='card col flex-1'>
            <div>
              <Heading as='h4' color='biscay'>
                Sum Weekday
              </Heading>
              <div className='font-medium text-base pt-1'>
                Member : {result.weekDay}
              </div>
            </div>
          </div>
        </div>
        <div className='col py-0'>
          <div className='card col flex-1'>
            <div>
              <Heading as='h4' color='biscay'>
                Sum Weekend
              </Heading>
              <div className='font-medium text-base pt-1'>
                Member : {result.weekEnd}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-5 mt-4'>
        <div className='card col flex-1'>
          <div>
            <div className='mb-4'>
              <RosterRegisterFilter data={data} onFilter={onFilter} />
            </div>

            <div>
              <Table
                columns={columns}
                data={[...data].sort(
                  (a, b) =>
                    new Date(b.startDateTime).getTime() -
                    new Date(a.startDateTime).getTime()
                )}
                totalRecords={totalRecords}
                loading={isLoading}
                rows={10}
                sortField='id'
                sortOrder={-1}
                onTableStateChange={setTableState}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

RosterRegister.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/roster',
    accessPage: PCODE.USAGEMONITORINGROSTER,
  }
)
