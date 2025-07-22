import { TranslateableContentData } from 'ob-notification-sdk/dist/api'

export interface ICategoryRequest {
  id?: string
  name?: string
  // created_at?:Date
  // updated_at?:Date
  // icon_id?:string
  sequence?: number
  visible?: boolean
  remark?: string
  _count?: string
  display_name?: TranslateableContentData
}
export class CategoryRequestModel implements ICategoryRequest {
  id?: string
  name?: string
  // created_at?: Date
  // updated_at?: Date
  icon_id?: string
  sequence?: number
  visible?: boolean
  visibleDropdown?: number
  remark?: string
  _count?: string
  display_name?: TranslateableContentData

  constructor(data?: ICategoryRequest) {
    this.id = data?.id
    this.name = data?.name
    // this.created_at = data?.created_at
    // this.updated_at = data?.updated_at
    // this.icon_id = data?.icon_id
    this.sequence = data?.sequence
    this.visible = data?.visible
    this.visibleDropdown = data?.visible === true ? 1 : 0
    this.remark = data?.remark
    this._count = data?._count
    this.display_name = data?.display_name
  }
}

export interface INotificationCategory {
  id: string
  name: string
  created_at: Date
  updated_at: Date
  icon_id: string
  sequence: number
}
