export class FilterDraft implements IFilterDraft {
  title:
    | {
        value: string
        operator: string
      }
    | undefined
  category?: string
  schedule?: Date
  lastupdate?: Date
  updateby?: string

  constructor(data: IFilterDraft | null) {
    this.title = data?.title
    this.category = data?.category
    this.schedule = data?.schedule
    this.updateby = data?.updateby
    this.lastupdate = data?.lastupdate
  }
}

export interface IFilterDraft {
  title:
    | {
        value: string
        operator: string
      }
    | undefined
  category?: string
  schedule?: Date
  lastupdate?: Date
  updateby?: string
}
