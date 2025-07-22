import { DataTableStateEvent } from 'primereact/datatable'
import { httpClient } from '../http-client'
import {
  IFilterRosterRegister,
  IGetRosterRegister,
  IGetRosterRegisterRecord,
  IRosterRoleList,
  IEditRoleUser,
} from './model'
import qs from 'qs'
import { format } from 'date-fns'

class RosterRegisterService {
  async getAll(
    filter?: IFilterRosterRegister,
    pagination?: DataTableStateEvent
  ): Promise<IGetRosterRegisterRecord> {
    const res = await httpClient.get<IGetRosterRegisterRecord>(
      `/api/v1/usageMonitoring/Roster`,
      {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      }
    )
    return res.data
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetRosterRegister>(`/api/v1/Member/${id}`)
    return res.data
  }
  async getByIdMemberSOC(roid: string) {
    const res = await httpClient.get<IGetRosterRegister>(
      `/api/v1/usageMonitoring/Roster/${roid}`
    )
    return res.data
  }
  async getUserDesignations(mid: string) {
    const res = await httpClient.get(
      `/api/v1/operation/mobile/userDesignations/${mid}`
    )
    return res.data
  }

  async getRosterRoleList() {
    const res = await httpClient.get<IRosterRoleList[]>(
      `/api/v1/operation/mobile/masterdata/Locations?types=1`
    )
    return res.data
  }

  createUser(detail: any) {
    return httpClient.post(`/api/v1/usageMonitoring/Roster/upsert`, detail)
  }

  editRoleUser(detail: IEditRoleUser) {
    return httpClient.post(`/api/v1/usageMonitoring/Roster/upsert`, detail)
  }

  async getLocations() {
    const res = await httpClient.get(
      '/api/v1/operation/mobile/masterdata/Locations?types=1'
    )
    return res.data
  }
  deleteAction(id: string) {
    return httpClient.delete(`/api/v1/usageMonitoring/Roster/${id}`)
  }

  async export() {
    return httpClient
      .get('/api/operation/v1/report/OperationOnBorad/Members', {
        responseType: 'blob',
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data)

        const link = document.createElement('a')
        link.href = href
        link.setAttribute(
          'download',
          `members_${format(new Date(), 'dd-MM-yyyy')}.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
  }
}

export const rosterregisterService = new RosterRegisterService()
