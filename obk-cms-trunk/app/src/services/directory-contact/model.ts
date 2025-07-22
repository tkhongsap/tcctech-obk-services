export interface IGetDirectoryContact {
  id: string
  nameEn: string
  nameTh?: string
  nameZh?: string
  categoryId: string
  category: string
  phonenumber: string
  updatedAt: string
  updatedBy: string
  seq: number
}

export interface IGetDirectoryContactCategory {
  categoryId: string
  category: string
  contactList: IGetDirectoryContact[]
}

export interface IGetDirectoryContactCategoryRecord {
  total: number
  data: IGetDirectoryContactCategory[]
}

export interface IGetDirectoryContactRecord {
  totalRecord: number
  data: IGetDirectoryContact[]
}

export interface IFilterDirectoryContact {
  categoryId?: string
}

export class FilterDirectoryContact implements IFilterDirectoryContact {
  categoryId?: string

  constructor(data?: IFilterDirectoryContact) {
    this.categoryId = data?.categoryId
  }
}

export interface IUpsertDirectoryContact {
  categoryId: string
  categoryName: string
  categoryMoveto?: string
  contactList: IGetDirectoryContact[]
}

export interface IEditNubmer {
  CategoryId: string
  MoveCategoryId: string
  Id: string
  phonenumber: string
  nameEn: string
  nameTh?: string
  nameZh?: string
  seq: number
}

export class UpsertDirectoryContact implements IUpsertDirectoryContact {
  categoryId: string
  categoryName: string
  categoryMoveto?: string
  contactList: IGetDirectoryContact[]

  constructor(data: IUpsertDirectoryContact) {
    this.categoryId = data?.categoryId
    this.categoryName = data?.categoryName
    this.categoryMoveto = data?.categoryMoveto
    this.contactList = data?.contactList
  }
}

export interface IUpsertDirectoryContactCategory {
  categoryId?: string
  category: string
}
export interface IDirectoryContactCategoryRecord {
  categoryId?: string
  category: string
}
export class UpsertDirectoryContactCategory
  implements IUpsertDirectoryContactCategory
{
  categoryId?: string
  category: string

  constructor(data?: IUpsertDirectoryContactCategory) {
    this.categoryId = data?.categoryId
    this.category = data?.category ?? ''
  }
}

export interface IUpsertCategory {
  categoryName: string
}

export class UpsertCategory implements IUpsertCategory {
  categoryName: string

  constructor(data?: IUpsertCategory) {
    this.categoryName = data?.categoryName ?? ''
  }
}
