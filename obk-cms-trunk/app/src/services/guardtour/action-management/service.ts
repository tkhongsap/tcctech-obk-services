import { DataTableStateEvent } from 'primereact/datatable'
import {
  GetActionManagement,
  IFilterActionManagement,
  IGetActionManagementRecord,
  IGetActionTypeRecord,
} from './model'
import { httpClient } from '../../http-client'

class ActionManagement {
  async getAll(
    filter?: IFilterActionManagement,
    pagination?: DataTableStateEvent
  ): Promise<IGetActionManagementRecord> {
    const actionTypesResponse = await this.getAllActionType()
    const actionTypes = actionTypesResponse.data
    const actionTypeMap = new Map<string | undefined, string>(
      actionTypes.map((item) => [item.id, item.action])
    )
    const res = await httpClient.get<IGetActionManagementRecord>(
      `/api/v1/Actions`,
      { params: { ...filter, ...pagination } }
    )
    const modifiedData = res.data.data.map((item) => ({
      ...item,
      actionType: actionTypeMap.get(item.actionType) || item.actionType, // Replace id with action name if found
    }))

    return {
      data: modifiedData,
      paginate: res.data.paginate,
    }
  }

  async getAllActionType() {
    const res = await httpClient.get<IGetActionTypeRecord>(
      `/api/v1/ActionTypes`
    )
    return res.data
  }
  async getById(id: string) {
    const res = await httpClient.get<GetActionManagement>(
      `/api/v1/Action/${id}`
    )
    if (res.data.metaData === null || res.data.metaData === undefined) {
      res.data.metaData = {}
    }
    return res.data
  }

  createAction(detail: any) {
    return httpClient.post(`/api/v1/Action`, detail)
  }

  editAction(detail: any) {
    return httpClient.put(`/api/v1/Action`, detail)
  }

  deleteAction(actionId: string) {
    return httpClient.delete(`/api/v1/Action/${actionId}`)
  }
}

export const actionManagementService = new ActionManagement()
