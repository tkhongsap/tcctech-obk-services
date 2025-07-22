import { IRole } from '../role/model'

export interface IGetMember {
  mid: string
  email: string
  updatedDate: Date
  updatedByName: string
  status: number
  roles: IMemberRole[]
  name: string
  createDate: Date
}

export interface IMemberRole {
  roleName: string
  privilege: IMemberRolePrivilege[]
}

export interface IPersonalInfo {
  csid: any
  mid: string
  email: string
  updatedDate: string
  updatedBy: string
  status: number
  createdDate: Date
  createdDateDisplay: string
  name: string
  roles: IRole[]
  keyCloakUserId: string
}

export interface IMemberRolePrivilege {
  ptid: string
  privilegeName: string
}

export interface IMemberFilterModel {
  filter?: string
  roles?: string[]
  status?: number[]
}

export interface IMemberResult {
  totalRecords: number
  data: IGetMember[]
}

export interface IStatus {
  name: string
  code: number
}

export interface IMemberUpsertModel {
  mid?: string
  status?: number
  name?: string
  email?: string
  roleItem?: string[]
  isActive?: boolean
  keyCloakUserId?: string
}

export interface IRoleItem {
  rid: string
  name: string
  isSelected?: boolean
}
export interface IEditUpsertModel {
  mid?: string
  status?: number
  roleItem?: string[]
}
export interface IForgotPassword {
  email: string
}
export interface IResponseForgotPassword {
  isSuccess: boolean
  message: string
}

export interface IResetPasswordCode {
  resetPasswordCode: string
}
export interface IResponResetpassword {
  isVerify: boolean
  message: string
  email: string
  KeyCloakUserId: string
}
export class MemberUpsertModel implements IMemberUpsertModel {
  mid?: string
  status?: number
  name?: string
  email?: string
  roleItem?: string[]
  isActive?: boolean
  keyCloakUserId?: string
  constructor(data?: IMemberUpsertModel) {
    this.mid = data?.mid ?? ''
    this.status = data?.status
    this.name = data?.name ?? ''
    this.email = data?.email ?? ''
    this.roleItem = data?.roleItem ?? []
    this.isActive = data?.isActive ?? true
    this.keyCloakUserId = data?.keyCloakUserId ?? ''
  }
}
export class inviteMember {
  email: string
  roles: string[]
  constructor(data: inviteMember) {
    this.email = data.email
    this.roles = data.roles
  }
}
