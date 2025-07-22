export interface IContentManagement {
  filter?: string
  status?: string
  time?: string
  show?: boolean
}

export class ContentManagement implements IContentManagement {
  filter?: string
  status?: string
  time?: string
  show?: boolean

  constructor(data?: IContentManagement) {
    this.filter = data?.filter
    this.status = data?.status
    this.time = data?.time
    this.show = data?.show
  }
}
