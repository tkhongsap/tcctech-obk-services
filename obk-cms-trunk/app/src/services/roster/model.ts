export interface IGetRosterRegister {
  id: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
  locationCode: string
  isActive: boolean
}
export class GetRosterRegister {
  id: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
  locationCode: string

  constructor(data: IGetRosterRegister) {
    this.id = data?.id
    this.component = data?.component
    this.weekDay = data?.weekDay
    this.weekEnd = data?.weekEnd
    this.startDateTime = data?.startDateTime
    this.endDateTime = data?.endDateTime
    this.locationCode = data?.locationCode
  }
}

export interface IGetRosterRegisterRecord {
  paginate: {
    total: number
  }
  data: IGetRosterRegister[]
}

export interface IRosterRoleList {
  id: string
  component: string
  weekDay: number
  weekEnd: number
  startDateTime: Date
  endDateTime: Date
}

export interface IFilterRosterRegister {
  filter?: string
  component?: string
}

export class FilterRosterRegister implements IFilterRosterRegister {
  filter?: string
  component?: string

  constructor(data?: IFilterRosterRegister) {
    this.filter = data?.filter
    this.component = data?.component
  }
}

export interface IUpsertRosterRegister {
  component: string
  weekDay: number
  weekEnd: number
  locationCode: string
  isActive?: boolean
}

export class UpsertRosterRegister implements IUpsertRosterRegister {
  component: string
  weekDay: number
  weekEnd: number
  locationCode: string
  isActive?: boolean

  constructor(data: IGetRosterRegister) {
    this.component = data?.component
    this.weekDay = data?.weekDay
    this.weekEnd = data?.weekEnd
    this.locationCode = data?.locationCode
    this.isActive = data.isActive
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

  constructor(data: IGetRosterRegister) {
    this.id = data?.id
  }
}
