/* eslint-disable unused-imports/no-unused-vars-ts */
import { httpClient } from '@src/services/http-client'
import {
  IEditUpsertModel,
  IForgotPassword,
  IGetMember,
  IMemberFilterModel,
  IMemberResult,
  IPersonalInfo,
  IResetPasswordCode,
  IResponResetpassword,
  IResponseForgotPassword,
  MemberUpsertModel,
  inviteMember,
} from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class MemberService {
  getAll(filter: IMemberFilterModel, pagination?: DataTableStateEvent) {
    let filterjson = JSON.stringify(filter)
    return httpClient
      .get<IMemberResult>('/api/v1/Members', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  get(id: string) {
    return httpClient.get<IPersonalInfo>(`/api/v1/Member/${id}`)
  }

  getByKeycloakId(id: string) {
    return httpClient.get<IPersonalInfo>(`/api/v1/Member/KeyCloakId/${id}`)
  }

  upsert(data: MemberUpsertModel) {
    let invitemember: inviteMember = {
      email: data.email!,
      roles: data.roleItem!,
    }
    return httpClient.post('/api/v1/Member/InviteMember', invitemember)
  }

  upsertEditRole(data: IEditUpsertModel) {
    return httpClient.put('/api/v1/Member/Role', data)
  }

  upsertMember(data: MemberUpsertModel) {
    return httpClient.put('/api/v1/Member', data)
  }

  resendInviteCode(id: string) {
    return httpClient.post('/api/v1/Member/ResendInvite?id=' + id)
  }

  getMembersByRole(roleId: string) {
    return httpClient.get<IGetMember[]>(
      `/api/v1/Member/GetMembersByRole/${roleId}`
    )
  }
  forgotPassword(req: IForgotPassword) {
    return httpClient.post<IResponseForgotPassword>(
      `/api/v1/Member/ForgotPassword`,
      req
    )
  }
  getResetPasswordCode(id: string) {
    return httpClient.get<IResponResetpassword>(
      `/api/v1/Member/VerifyResetPasswordToken/${id}`
    )
  }
  resetPassword(req: IResetPasswordCode) {
    return httpClient.post<IResponseForgotPassword>(
      `/api/v1/Member/ResetPassword`,
      req
    )
  }
}

export const memberService = new MemberService()
