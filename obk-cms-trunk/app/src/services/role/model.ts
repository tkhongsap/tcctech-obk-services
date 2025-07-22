export interface IRejectModel {
  acId: number
  reason: string
  status: string
}

export interface IRolesResult {
  totalRecords: number
  data: IRole[]
}

export interface IRole {
  rid?: string
  isActive?: number
  roleName?: string
  name?: string
  description?: string
  privilegeItems?: IPrivilegeItem[]
  updatedDate?: Date
  updatedByName?: string
  isDelete?: boolean
}

export interface IRoleUpsertModel {
  rid?: string
  roleId?: string
  status?: number | boolean
  roleName?: string
  description?: string
  privilegeItems?: IPrivilegeItem[]
}

export class RoleUpsertModel implements IRoleUpsertModel {
  rid?: string
  roleId?: string
  status?: number
  roleName?: string
  description?: string
  privilegeItems?: IPrivilegeItem[]

  constructor(data?: IRoleUpsertModel) {
    this.rid = data?.rid
    this.roleId = data?.roleId
    this.status = data?.status === true || data?.status == 1 ? 1 : 0
    this.roleName = data?.roleName ?? ''
    this.description = data?.description ?? ''
    this.privilegeItems = data?.privilegeItems ?? []
  }
}

export interface IPrivilege {
  pid: string
  name: string
  privilegeItems: IPrivilegeItem[]
}

export interface IPrivilegeItem {
  pid: string
  ptid: string
  name: string
  code?: string
  description: string
  isSelected?: boolean
}

export interface IRoleFilterModel {
  filter?: string
  privilges?: string[]
}
