export interface IGetStaffTableRegister {
  sfid?: string
  staffName?: string
  email: string
  component?: string
  position?: string
  company?: string
  location?: string
  mustUseOpsApp: true
  isActive: boolean
}

export interface IGetStaffTableRegisterRecord {
  paginate: {
    total: number
  }
  data: IGetStaffTableRegister[]
}

export interface IFilterStaffTableRegister {
  filter?: string
  userType?: string
  staffName?: string
  component?: string
}

export class FilterStaffTableRegister implements IFilterStaffTableRegister {
  filter?: string
  userType?: string
  staffName?: string
  component?: string

  constructor(data?: IFilterStaffTableRegister) {
    this.filter = data?.filter
    this.userType = data?.userType
    this.staffName = data?.staffName
    this.component = data?.component
  }
}

export interface IUpsertStaffTableRegister {
  sfid?: string
  staffName?: string
  email?: string
  component?: string
  position?: string
  company?: string
  location?: string
  mustUseOpsApp?: boolean
  isActive?: boolean
}

export class UpsertsStaffTableRegister implements IUpsertStaffTableRegister {
  sfid?: string
  staffName?: string
  email?: string
  component?: string
  position?: string
  company?: string
  location?: string
  mustUseOpsApp?: boolean
  isActive?: boolean

  constructor(data: IGetStaffTableRegister) {
    this.sfid = data?.sfid
    this.staffName = data.staffName
    this.email = data.email
    this.component = data.component
    this.position = data.position
    this.company = data.company
    this.location = data.location
    this.mustUseOpsApp = data.mustUseOpsApp
    this.isActive = data.isActive
  }
}
export interface IStaffRolesList {
  paginate: Paginate
  data: Datum[]
}

export interface Datum {
  id: string
  component: string
  locationCode: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: null
  isActive: boolean
}

export interface Paginate {
  count: number
  page: number
  limit: number
  total: number
}
