import { DataTableStateEvent } from 'primereact/datatable'
import {
  IActionList,
  ICancelTask,
  IFilterTaskManagement,
  IGetTaskManagementById,
  IGetTaskManagementRecord,
  UpsertTaskManagement,
} from './model'
import { httpClient } from '../../http-client'
import { KeyValue } from '@src/types/key-value'

class TaskManagement {
  async getAll(
    filter: IFilterTaskManagement,
    pagination?: DataTableStateEvent
  ): Promise<IGetTaskManagementRecord> {
    const res = await httpClient.get<IGetTaskManagementRecord>(
      `/api/v1/Tasks`,
      { params: { ...filter, ...pagination } }
    )
    res.data.data.forEach((x) => {
      x.statusText = this.getStatusTask(x.status)
    })
    return {
      data: res.data.data,
      paginate: res.data.paginate,
    }
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetTaskManagementById>(
      `/api/v1/Task/${id}`
    )
    return res.data
  }

  async getActionList() {
    const res = await httpClient.get<{ data: IActionList[] }>(`/api/v1/Actions`)
    return res.data.data
  }
  async createTask(detail: UpsertTaskManagement) {
    return httpClient.post(`/api/v1/TaskSubTasks/create`, detail)
  }

  updateTask(detail: UpsertTaskManagement) {
    return httpClient.put(`/api/v1/TaskSubTasks/update`, detail)
  }

  checkDuplicate(id: string | null, name: string) {
    return httpClient.post<{ message: string | null }>(
      `/api/v1/Task/CheckDuplicate`,
      { id: id, name: name }
    )
  }

  async downloadReport(id: string) {
    return httpClient.get<any>(
      `/api/operation/v1/report/GuardTour/TaskDetail?TID=${id}`
    )
  }
  async getActivity() {
    const res = await httpClient.get(
      `/api/v1/ActivityProcedureByTask/GetTaskActivity`
    )
    return res
  }

  async createTaskByActivity(detail: UpsertTaskManagement) {
    return httpClient.post(
      `/api/v1/ActivityProcedureByTask/CreateActivityProcedure/ByTask`,
      detail
    )
  }

  getListStatus = () => {
    let data: KeyValue[] = [
      { name: 'Assigned', value: '0' },
      { name: 'Inprogress', value: '1' },
      { name: 'Completed', value: '2' },
      { name: 'Skip', value: '3' },
      { name: 'Ready for complete', value: '4' },
      { name: 'Incomplete', value: '5' },
      { name: 'Cancelled', value: '6' },
    ]
    return data
  }

  getStatusTask(status: number) {
    switch (status) {
      case 0:
        return 'Assigned'
      case 1:
        return 'Inprogress'
      case 2:
        return 'Completed'
      case 3:
        return 'Skip'
      case 4:
        return 'Ready for complete'
      case 5:
        return 'Incomplete'
      case 6:
        return 'Cancelled'
      default:
        'N/A'
    }
  }

  deleteTask(detail: ICancelTask) {
    return httpClient.put(`/api/v1/Task/status`, detail)
  }
}

export const taskManagementService = new TaskManagement()
