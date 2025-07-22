import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import router from 'next/router'
import { PCODE } from '@src/data/constants/privilege'

import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import React from 'react'

import { Button } from 'primereact/button'

import {
  IFilterTaskManagement,
  IGetTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { taskManagementService } from '@src/services/guardtour/task-management/service'
import { TaskManagementFilter } from '@components/guardtour/task-management/task-management-filter'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'

type Props = {
  statusDropdown: KeyValue[]
  memberDropdown: KeyValue[]
  isCreateTaskByActivity: boolean
}

export default function TaskManagement(props: Props) {
  const { isCreateTaskByActivity } = props
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetTaskManagement[]>([])
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterTaskManagement>({}, 400)

  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'name',
    sortOrder: -1,
  })

  const { memberDropdown, statusDropdown } = props

  setMenuName('Task Management')

  const onDownloadReport = (id: string) => {
    setIsLoading(true)
    taskManagementService
      .downloadReport(id)
      .then((rs) => {
        router.push(rs.data.path)
      })
      .finally(() => setIsLoading(false))
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'name',
        header: 'Task Name',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'statusText',
        header: 'Status',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'memberName',
        header: 'Assigned',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'startDate',
        header: 'Start Date',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'endDate',
        header: 'End Date',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        id: 'report',
        accessorKey: 'id',
        header: translate('report'),
        body: (data: IGetTaskManagement) => {
          return (
            <>
              <Button
                onClick={() => onDownloadReport(data.id)}
                label='Download'
                text
              ></Button>
            </>
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
        body: (data: IGetTaskManagement) => {
          if (data.status === 6 || data.status === 2) {
            return (
              <>
                <TableAction types={['show']} id={data.id} />
              </>
            )
          }

          return (
            <>
              <TableAction types={['edit', 'show']} id={data.id} />
            </>
          )
        },
      },
    ],
    [translate]
  )

  const onCreateAction = () => {
    router.push({
      pathname: '/guardtour/task-management/create',
    })
  }
  const onCreateActivityAction = () => {
    router.push({
      pathname: '/guardtour/task-management/create_activity',
    })
  }

  const onFilter = (item: IFilterTaskManagement) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    await taskManagementService
      .getAll(filter, tableState)
      .then(async (res) => {
        const mappedData = res.data.map((item) => {
          const memberName = memberDropdown.find(
            (member) => member.value === item.memberId
          )?.name
          return { ...item, memberName }
        })

        setData(mappedData)
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
        {isCreateTaskByActivity && (
          <Button
            label='Create task by activity'
            className='bg-primary-blue'
            onClick={onCreateActivityAction}
          />
        )}
        <Button
          label='Create task'
          className='bg-primary-blue'
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
            <TaskManagementFilter
              status={statusDropdown}
              members={memberDropdown}
              onFilter={onFilter}
            />
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

TaskManagement.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const isCreateTaskByActivity = ctx.props?.can?.includes('GT006')
    const statusDropdown: KeyValue[] = [
      { name: 'Assigned', value: '0' },
      { name: 'Inprogress', value: '1' },
      { name: 'Completed', value: '2' },
      { name: 'Cancelled', value: '6' },
    ]
    let member = await schedulePlanService.getSocMember()
    const memberDropdown: KeyValue[] = member.map((x) => {
      let res: KeyValue = {
        name: x.name,
        value: x.id,
      }
      return res
    })
    ctx.props = {
      ...ctx.props,
      statusDropdown,
      memberDropdown,
      isCreateTaskByActivity,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/task-management',
    accessPage: PCODE.VIEWGUARDTOURTASKMANAGEMENT,
  }
)
