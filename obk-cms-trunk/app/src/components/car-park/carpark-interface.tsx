import { AccessorType } from 'ob-bms-sdk/dist/api'

export interface IFilterParkingAccess {
  filter?: string
  date?: string[]
  type?: AccessorType
  gate?: string
}

export class FilterParkingAccess implements IFilterParkingAccess {
  filter?: string
  date?: string[]
  type?: AccessorType
  gate?: string

  constructor(data?: IFilterParkingAccess) {
    this.filter = data?.filter
    this.type = data?.type
    this.date = data?.date ?? ['']
    this.gate = data?.gate
  }
}
