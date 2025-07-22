export interface IFilterBuildingAccess {
  filter?: string
  date?: string[]
  building?: string
  statusMember?: string
  statusPass?: string
  startDate?: any[]
  endDate?: any[]
}

export class FilterBuildingAccess implements IFilterBuildingAccess {
  filter?: string
  date?: string[]
  building?: string
  statusPass?: string
  statusMember?: string

  constructor(data?: IFilterBuildingAccess) {
    this.filter = data?.filter
    this.building = data?.building
    this.date = data?.date ?? ['']
    this.statusPass = data?.statusPass
    this.statusMember = data?.statusMember
  }
}
