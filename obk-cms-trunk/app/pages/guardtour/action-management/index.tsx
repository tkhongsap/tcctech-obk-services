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

import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import React from 'react'

import { Button } from 'primereact/button'
import {
  IFilterActionManagement,
  IGetActionManagement,
} from '@src/services/guardtour/action-management/model'
import { actionManagementService } from '@src/services/guardtour/action-management/service'
import { ActionManagementFilter } from '@components/guardtour/action-management/action-management-filter'

type Props = { actions: KeyValue[] }

export default function ActionManagement(props: Props) {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext() //Title Name (temporary)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetActionManagement[]>([])
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterActionManagement>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'name',
    sortOrder: -1,
  })

  const { actions } = props

  setMenuName('Action Management')

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'Action ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'name',
        header: 'Action Name',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'description',
        header: 'Description',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'actionType',
        header: 'Action Type',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetActionManagement) => {
          return (
            <>
              <TableAction types={['edit']} id={data.id} />
            </>
          )
        },
      },
    ],
    [translate]
  )

  const onCreateAction = () => {
    router.push({
      pathname: '/guardtour/action-management/create',
    })
  }

  const onFilter = (item: IFilterActionManagement) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    await actionManagementService
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
          label='Create Action'
          onClick={onCreateAction}
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
            <ActionManagementFilter actions={actions} onFilter={onFilter} />
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

ActionManagement.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const ActionsRes = await actionManagementService.getAllActionType()
    const actions = ActionsRes.data
      .map((x) => {
        return { name: x.action, value: x.id } as KeyValue
      })
      .sort((a, b) => a.value.localeCompare(b.value))

    ctx.props = { ...ctx.props, actions }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/action-management',
    accessPage: PCODE.VIEWGUARDTOURACTIONMANAGEMENT,
  }
)
