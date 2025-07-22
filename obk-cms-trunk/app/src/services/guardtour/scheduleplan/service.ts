// eslint-disable-next-line unused-imports/no-unused-imports-ts
import { DataTableStateEvent } from 'primereact/datatable'
import {
  IFilterSchedulePlan,
  IGetSchedulePlan,
  IGetSchedulePlanRecord,
  IGetSchedulePlanRouteRecord,
  IGetSocMember,
  ISchedulePlanRouteRecord,
} from './model'
import { httpClient } from '../../http-client'
// import { capitalize } from 'lodash'

class SchedulePlanService {
  async getAll(
    filter?: IFilterSchedulePlan,
    pagination?: DataTableStateEvent
  ): Promise<IGetSchedulePlanRecord> {
    const res = await httpClient.get<IGetSchedulePlanRecord>(
      `/api/v1/SchedulePlans`,
      { params: { ...filter, ...pagination } }
    )

    return {
      data: res.data.data,
      paginate: res.data.paginate,
    }
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetSchedulePlan>(
      `/api/v1/SchedulePlan/${id}`
    )
    return res.data
  }

  async getAllRoute(): Promise<{ data: ISchedulePlanRouteRecord[] }> {
    const res = await httpClient.get<IGetSchedulePlanRouteRecord>(
      `/api/v1/ActivityProcedures`
    )
    const result = res.data.data.map((x) => {
      return { id: x.id, code: x.code }
    })
    return { data: result }
  }

  createSchedule(detail: any) {
    return httpClient.post(`/api/v1/SchedulePlan`, detail)
  }

  updateSchedulePlan(detail: any) {
    return httpClient.put(`/api/v1/SchedulePlan`, detail)
  }

  deleteSchedule(schedulePlanId: string) {
    return httpClient.delete(`/api/v1/SchedulePlan/${schedulePlanId}`)
  }

  toggleActiveStatus(detail: any, isActive: boolean) {
    return httpClient.put(`/api/v1/SchedulePlan`, { detail, isActive })
  }

  getFrequencyOptions() {
    return [
      { frequencyId: 'MON', frequency: 'MON' },
      { frequencyId: 'TUE', frequency: 'TUE' },
      { frequencyId: 'WED', frequency: 'WED' },
      { frequencyId: 'THU', frequency: 'THU' },
      { frequencyId: 'FRI', frequency: 'FRI' },
      { frequencyId: 'SAT', frequency: 'SAT' },
      { frequencyId: 'SUN', frequency: 'SUN' },
    ]
  }

  async getSocMember() {
    const res = await httpClient.get<IGetSocMember>(`/api/v1/User/Member`)
    return res.data.data
  }
}

export const schedulePlanService = new SchedulePlanService()
