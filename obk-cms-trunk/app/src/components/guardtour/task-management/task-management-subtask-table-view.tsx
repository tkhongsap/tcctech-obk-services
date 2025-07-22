import React, { useMemo } from 'react'
import { KeyValue } from '@src/types/key-value'
import { IGetSubTaskbyId } from '@src/services/guardtour/task-management/model'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import { IActionList } from '@src/services/guardtour/task-management/model'
import { taskManagementService } from '@src/services/guardtour/task-management/service'

type Props = {
  subtasks?: IGetSubTaskbyId
  actions: IActionList[]
  statusDropdown: KeyValue[]
}

const TaskManagementSubtaskTableViewComponent = (props: Props) => {
  const { subtasks } = props

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'name',
        header: 'Name',
        style: { minWidth: '100px' },
      },
      {
        field: 'actions',
        header: 'Action',
        style: { minWidth: '100px' },
        body: (data: { action: IActionList[] }) => {
          const getAction = () => {
            return (data.action || [])
              .map((a) => a.name || 'Unnamed Action')
              .join(', ')
          }
          return <span>{getAction()}</span>
        },
      },
      {
        field: 'status',
        header: 'Status',
        style: { minWidth: '100px' },
        body: (data: { status: number }) => {
          const statusText = taskManagementService.getStatusTask(data.status)
          return <span>{statusText}</span> // Render the mapped status
        },
      },
    ],
    []
  )

  return (
    <>
      <div className='card'>
        <div className='flex mb-4 justify-content-between'>
          <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
            Subtask
          </h3>
        </div>
        <div>
          <Table
            columns={columns}
            data={subtasks?.data ?? []}
            totalRecords={subtasks?.data.length ?? 0}
            rows={10}
            sortField='name'
            sortOrder={-1}
            paginator={false}
          />
        </div>
      </div>
    </>
  )
}

export const TaskManagementSubtaskTableView =
  TaskManagementSubtaskTableViewComponent
