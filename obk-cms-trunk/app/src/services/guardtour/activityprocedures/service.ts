import {
  IActionList,
  ILocationListRecord,
  CreateActivityProcedures,
  IGetActivityProceduresRecord,
  IActivityProceduresTaskRecord,
  IGetActivityProceduresTaskRecord,
  IActivityProceduresLocationRecord,
  IGetActivityProceduresLocationRecord,
  IGetActivityProcedures,
  IFilterActivityProcedures,
  EditActivityProcedures,
  ILocationSelected,
} from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import { httpClient } from '../../http-client'

class ActivityProceduresService {
  async getAll(
    filter: IFilterActivityProcedures,
    pagination?: DataTableStateEvent
  ): Promise<IGetActivityProceduresRecord> {
    const res = await httpClient.get<IGetActivityProceduresRecord>(
      `/api/v1/ActivityProcedures`,
      { params: { ...filter, ...pagination } }
    )

    return {
      data: res.data.data,
      paginate: res.data.paginate,
    }
  }

  async getAllTask(): Promise<{ data: IActivityProceduresTaskRecord[] }> {
    const res = await httpClient.get<IGetActivityProceduresTaskRecord>(
      `/api/v1/ActivityProcedures`
    )
    const result = res.data.data.map((x) => {
      return { id: x.id, code: x.code }
    })
    return { data: result }
  }

  async getAllLocation(): Promise<{
    data: IActivityProceduresLocationRecord[]
  }> {
    const res = await httpClient.get<IGetActivityProceduresLocationRecord>(
      `/api/v1/ActivityProcedures`
    )
    const result = res.data.data.map((x) => {
      return { location: x.location }
    })
    return { data: result }
  }

  async getLocationList(
    typeId: number,
    parentId?: number
  ): Promise<ILocationListRecord[]> {
    const res = await httpClient.get<ILocationListRecord[]>(
      `/api/v1/operation/mobile/masterdata/Locations`,
      { params: { typeId, parentId } }
    )
    return res.data
  }

  async getLocationListById(locationId: string) {
    const res = await httpClient.get<ILocationSelected>(
      `/api/v1/Location/${locationId}`
    )
    return res.data
  }

  async getLocationSelected(refId: number) {
    const res = await httpClient.get<ILocationListRecord>(
      `/api/v1/operation/mobile/masterdata/Location`,
      { params: { refId: refId } }
    )
    return res.data
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetActivityProcedures>(
      `/api/v1/ActivityProcedure/${id}`
    )
    return res.data
  }

  async getActionList() {
    const res = await httpClient.get<{ data: IActionList[] }>(`/api/v1/Actions`)
    return res.data.data
  }

  createActivity(detail: CreateActivityProcedures) {
    return httpClient.post(`/api/v1/ActivityProcedure`, detail)
  }

  editActivity(id: string, detail: EditActivityProcedures) {
    return httpClient.put(`/api/v1/ActivityProcedure/${id}`, detail)
  }

  duplicateActivity(detail: EditActivityProcedures) {
    return httpClient.post(`/api/v1/ActivityProcedure`, detail)
  }

  deleteActivity(id: string) {
    return httpClient.delete(`/api/v1/ActivityProcedure/${id}`)
  }

  checkDuplicate(code: string) {
    return httpClient.post<{ message: string | null }>(
      `/api/v1/ActivityProcedure/CheckDuplicate`,
      { code: code }
    )
  }
}

export const activityproceduresService = new ActivityProceduresService()
