export interface IGetActionManagement {
  id: string
  name: string
  description: string
  actionType: string
  actionTypeId: string
  atid: string
  metaData?: { qrId?: string } | null | string
}

export class GetActionManagement {
  id: string
  name: string
  description: string
  actionTypeId: string
  atid: string
  metaData?: { qrId?: string } | null | string
  actionType: iGetActionType

  constructor(data?: GetActionManagement) {
    this.id = data?.id ?? ''
    this.name = data?.name ?? ''
    this.description = data?.description ?? ''
    this.actionTypeId = data?.actionTypeId ?? ''
    this.atid = data?.atid ?? ''
    this.metaData = data?.metaData ?? {}
    this.actionType = data?.actionType ?? {}
  }
}

export interface iGetActionType {
  id?: string
  action?: string
}

export interface IFilterActionManagement {
  filter?: string
  actionTypeId?: string
}

export class FilterActionManagement implements IFilterActionManagement {
  filter?: string
  actionTypeId?: string

  constructor(data?: IFilterActionManagement) {
    this.filter = data?.filter
    this.actionTypeId = data?.actionTypeId
  }
}

export interface IGetActionManagementRecord {
  paginate: {
    total: number
  }
  data: IGetActionManagement[]
}

export interface IGetActionTypeRecord {
  data: IActionTypeRecord[]
}

export interface IActionTypeRecord {
  id?: string
  action: string
}

export interface iCreateActionManagement {
  name: string
  description: string
  atid: string
  metaData?: { qrId?: string } | null | string
}

export class CreateActionManagement implements iCreateActionManagement {
  name: string
  description: string
  atid: string
  metaData?: { qrId?: string } | null | string

  constructor(data?: IGetActionManagement) {
    this.name = data?.name ?? ''
    this.description = data?.description ?? ''
    this.atid = data?.atid ?? ''
    this.metaData = data?.metaData
  }
}
