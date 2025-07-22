import { SuccessResponse, httpClient } from '@src/services/http-client'
import {
  IPrivilege,
  IRoleUpsertModel,
  RoleUpsertModel,
  IRoleFilterModel,
  IRolesResult,
} from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class RoleService {
  getAll(filter: IRoleFilterModel, pagination?: DataTableStateEvent) {
    return httpClient
      .get<SuccessResponse<IRolesResult>>('/api/v1/Roles', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  getRoles() {
    return httpClient
      .get<SuccessResponse<IRolesResult>>('/api/v1/Roles')
      .then((res) => {
        const roles = res.data.data
        const r = roles.data.filter(
          (role) => role.isActive === 1 && role.isDelete !== true
        )
        res.data.data.data = r
        return res.data
      })
  }

  getRole(rid: string) {
    return httpClient
      .get<SuccessResponse<IRoleUpsertModel>>('/api/v1/Role/' + rid)
      .then((res) => res.data)
  }

  getPrivilege() {
    return httpClient
      .get<SuccessResponse<IPrivilege[]>>('/api/v1/Role/Privileges')
      .then((res) => res.data)
  }

  upsert(data: RoleUpsertModel) {
    if (data.rid) {
      return httpClient.put('/api/v1/Role', data)
    }
    return httpClient.post('/api/v1/Role', data)
  }

  remove(roleId: string) {
    return httpClient.delete(`/api/v1/Role/Remove/${roleId}`)
  }
}

export const roleService = new RoleService()
