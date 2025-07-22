export interface IGetRosterStaff {
  id: string
  email: string
  staffName: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
  locationCode: string
  loginToDay: boolean
}
export class GetRosterStaff {
  id: string
  email: string
  staffName: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
  locationCode: string
  loginToDay: boolean

  constructor(data: IGetRosterStaff) {
    this.id = data?.id
    this.component = data?.component
    this.weekDay = data?.weekDay
    this.weekEnd = data?.weekEnd
    this.startDateTime = data?.startDateTime
    this.endDateTime = data?.endDateTime
    this.locationCode = data?.locationCode
    this.email = data?.email
    this.staffName = data?.staffName
    this.loginToDay = data?.loginToDay
  }
}

export interface IGetRosterStaffRecord {
  paginate: {
    total: number
  }
  data: IGetRosterStaff[]
}

export interface IOpsAppRoleList {
  id: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
}

export interface IFilterRosterStaff {
  filter?: string
  Component?: string
}

export class FilterRosterStaff implements IFilterRosterStaff {
  filter?: string
  Component?: string

  constructor(data?: IFilterRosterStaff) {
    this.filter = data?.filter
    this.Component = data?.Component
  }
}

export interface IUpsertRosterStaff {
  component: string
  weekDay: number
  weekEnd: number
  locationCode: string
}

export class UpsertRosterStaff implements IUpsertRosterStaff {
  component: string
  weekDay: number
  weekEnd: number
  locationCode: string

  constructor(data: IGetRosterStaff) {
    this.component = data?.component
    this.weekDay = data?.weekDay
    this.weekEnd = data?.weekEnd
    this.locationCode = data?.locationCode
  }
}
export interface ImapLocationandRole {
  location: number[]
  role: number[]
}

export interface IEditRoleUser {
  id: string
}

export class EditRoleUser {
  id: string

  constructor(data: IGetRosterStaff) {
    this.id = data?.id
  }
}
