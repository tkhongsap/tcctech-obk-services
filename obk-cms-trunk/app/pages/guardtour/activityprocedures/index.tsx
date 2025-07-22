import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import { PCODE } from '@src/data/constants/privilege'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'
import {
  IFilterActivityProcedures,
  IGetActivityProcedures,
} from '@src/services/guardtour/activityprocedures/model'

// eslint-disable-next-line unused-imports/no-unused-imports-ts
import { ActivityProceduresFilter } from '@components/guardtour/activityprocedures/activityprocedures-filter'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import React from 'react'

type Props = { routes: KeyValue[]; tasks: KeyValue[] }

export default function ActivityProcedures(props: Props) {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetActivityProcedures[]>([])
  // eslint-disable-next-line react-hooks/exhaustive-deps, unused-imports/no-unused-vars-ts
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterActivityProcedures>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'code',
    sortOrder: -1,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps, unused-imports/no-unused-vars-ts
  const { routes, tasks } = props

  setMenuName('Activity Procedures')

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'code',
        header: 'Route',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'taskName',
        header: 'Task Name',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'location',
        header: 'Location',
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
        body: (data: IGetActivityProcedures) => {
          return (
            <>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() =>
                  router.push('/guardtour/activityprocedures/edit/' + data.id)
                }
              >
                Edit
              </a>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() =>
                  router.push(
                    '/guardtour/activityprocedures/duplicate/' + data.id
                  )
                }
              >
                Duplicate
              </a>
            </>
          )
        },
      },
    ],
    [translate]
  )

  const onCreateActivityProcedures = () => {
    router.push({
      pathname: '/guardtour/activityprocedures/create',
    })
  }

  const onFilter = (item: IFilterActivityProcedures) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    await activityproceduresService
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
          label='Create new activity'
          onClick={onCreateActivityProcedures}
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
            <ActivityProceduresFilter routes={routes} onFilter={onFilter} />
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

ActivityProcedures.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const RoutesRes = await activityproceduresService.getAllTask()
    const routes = RoutesRes.data
      .map((x) => {
        return { name: x.code, value: x.id } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    ctx.props = { ...ctx.props, routes }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/activityprocedures',
    accessPage: PCODE.VIEWGUARDTOURACTIVITYPROCUDER,
  }
)
