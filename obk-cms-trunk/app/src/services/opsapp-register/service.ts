import { DataTableStateEvent } from 'primereact/datatable'
import { httpClient } from '../http-client'
import {
  IEditRoleUser,
  IFilterOpsAppRegister,
  IGetOpsAppRegister,
  IGetOpsAppRegisterRecord,
  IOpsAppRoleList,
  isActive,
  ResetPassword,
  UnlockUser,
} from './model'
import qs from 'qs'
import { format } from 'date-fns'

class OpsAppRegisterService {
  async getAll(
    filter?: IFilterOpsAppRegister,
    pagination?: DataTableStateEvent
  ): Promise<IGetOpsAppRegisterRecord> {
    const res = await httpClient.get<IGetOpsAppRegisterRecord>(
      `/api/v1/MembersOpsApp`,
      {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      }
    )
    return res.data
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetOpsAppRegister>(`/api/v1/Member/${id}`)
    return res.data
  }
  async getByIdMemberSOC(id: string) {
    const res = await httpClient.get<IGetOpsAppRegister>(
      `/api/v1/MemberAndSOCWithOutActive/${id}`
    )
    return res.data
  }
  async getUserDesignations(mid: string) {
    const res = await httpClient.get(
      `/api/v1/operation/mobile/userDesignations/${mid}`
    )
    return res.data
  }

  async getOpsAppRoleList() {
    const res = await httpClient.get<IOpsAppRoleList[]>(
      `/api/v1/operation/mobile/masterdata/OpsAppRoles`
    )
    return res.data
  }

  createUser(detail: any) {
    return httpClient.post(
      `/api/v1/operation/mobile/authentication/Register`,
      detail
    )
  }

  editRoleUser(detail: IEditRoleUser) {
    return httpClient.post(`/api/v1/operation/user/Role`, detail)
  }

  async getFunctionRoles() {
    const res = await httpClient.get(
      '/api/v1/operation/mobile/masterdata/functionRoles'
    )
    return res.data
  }

  async getLocations() {
    const res = await httpClient.get(
      '/api/v1/operation/mobile/masterdata/Locations?types=1'
    )
    return res.data
  }

  async export() {
    return httpClient
      .get('/api/operation/v1/report/OperationOnBorad/Members', {
        responseType: 'blob',
      })
      .then((res) => {
        // create file link in browser's memory
        const href = URL.createObjectURL(res.data)

        // create "a" HTML element with href to file & click
        const link = document.createElement('a')
        link.href = href
        link.setAttribute(
          'download',
          `members_${format(new Date(), 'dd-MM-yyyy')}.xlsx`
        ) //or any other extension
        document.body.appendChild(link)
        link.click()

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
  }

  unlockUser(detail: UnlockUser) {
    return httpClient.post(`/api/v1/MembersOpsApp/UnblockAccount`, detail)
  }

  isActive(detail: isActive) {
    return httpClient.post(`/api/v1/MembersOpsApp/isActive`, detail)
  }

  resetPassword(detail: ResetPassword) {
    return httpClient.post(
      `/api/v1/ResetPasswordByAdmin/ResetPasswordToDefault`,
      detail
    )
  }
}

export const opsappregisterService = new OpsAppRegisterService()
