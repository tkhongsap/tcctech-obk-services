export interface IGetComponentRegister {
  loginToDay: boolean
  sfid: string
  staffName: string
  email: string
  component: string
  position: string
  company: string
  location: string
  mustUseOpsApp: boolean
  isDelete: boolean
  isActive: boolean
  updatedDate: string
  keyCloakUserId: string
}
export class GetComponentRegister {
  loginToDay: boolean
  sfid: string
  staffName: string
  email: string
  component: string
  position: string
  company: string
  location: string
  mustUseOpsApp: boolean
  isDelete: boolean
  isActive: boolean
  updatedDate: string
  keyCloakUserId: string

  constructor(data: IGetComponentRegister) {
    this.loginToDay = data?.loginToDay
    this.sfid = data?.sfid
    this.staffName = data?.staffName
    this.email = data?.email
    this.component = data?.component
    this.position = data?.position
    this.company = data?.company
    this.location = data?.location
    this.mustUseOpsApp = data?.mustUseOpsApp
    this.isActive = data?.isActive
    this.isDelete = data?.isDelete

    this.updatedDate = data?.updatedDate

    this.keyCloakUserId = data?.keyCloakUserId
  }
}

export interface IGetOpsAppRegisterRecord {
  totalRecords: number
  data: IGetComponentRegister[]
}

export interface IComponentRoleList {
  loginToDay: boolean
  sfid: string
  staffName: string
  email: string
  component: string
  position: string
  company: string
  location: string
  mustUseOpsApp: boolean
  isDelete: boolean
  isActive: boolean
  updatedDate: string
  keyCloakUserId: string
}

export interface IFilterComponentRegister {
  filter?: string
  component?: string
}

export class FilterComponentRegister implements IFilterComponentRegister {
  filter?: string
  component?: string

  constructor(data?: IFilterComponentRegister) {
    this.filter = data?.filter
    this.component = data?.component
  }
}

export interface IUpsertComponentRegister {
  component: string
  location: string
}

export class UpsertComponentRegister implements IUpsertComponentRegister {
  component: string

  location: string

  constructor(data: IGetComponentRegister) {
    this.component = data?.component
    this.location = data?.location
  }
}
export interface ImapLocationandRole {
  location: number[]
  role: number[]
}
