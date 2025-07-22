import { HistoryDocumentResult } from 'ob-document-sdk/dist/api'

export interface IProfile {
  id: string
  gender: string
  title?: string | null
  first_name?: string | null
  last_name?: string | null
  middle_name?: string | null
  dob: string
  created_at: string
  updated_at: string
  account_id?: string
}

export interface IAccount {
  account?: {
    isDeleted?: boolean | null
    device: {
      id: string
    }
    profile: IProfile
    identity?: object[]
  }
}

export interface IDocument {
  id?: string
  version?: number
  created_by?: IAccount
  created_at?: Date | string
  updated_by?: IAccount
  updated_at?: Date | string
  category_id?: string
  body?: {
    [key: string]: string
  }
  title?: {
    [key: string]: string
  }
  image?: string[] | null
  active?: boolean
  published?: boolean
  release_date?: string | null
  slug?: string
  history_categoryId?: string | null
  deleted_at?: string | null
}

export interface ICategory {
  id: string
  title: {
    en: string
    th: string
  }
  active: boolean
  image?: string[] | null
  list?: string[]
  type_id: string
  created_at: string
  updated_at: string
  version: number
  deleted_at?: string | null
  updated_by: string | null
  updated_by_name: string
  type?: {
    id: string
    type: string
  }
}

export interface IDocumentLog {
  id?: string
  version?: number
  updated_by?: IAccount
  updated_at?: Date | string
  action?: string
  document_id?: string
  document?: IDocument
}

export interface IHistoryDocumenResponse {
  id: string
  category_id: string
  title: {
    en: string
    th: string
  }
  body: {
    en: string
    th: string
  }
  image?: string[] | null
  active: boolean
  created_at: string
  updated_at: string
  published: boolean
  release_date?: string | null
  slug: string
  version: number
  document_id: string
  updated_by: string
  history_category_id: string
}

export interface IHistoryCategoryResponse {
  id: string
  title?: {
    en: string
    th: string
  }
  active?: boolean
  image?: string[] | null
  type_id?: string
  created_at?: string
  updated_at?: string
  version: number
  category_id?: string
  updated_by?: IAccount
  updated_by_name?: string
  history_document?: IHistoryDocumenResponse[]
  category?: ICategory
  deleted_at?: string | null
  list?: IDocument[]
}

export interface IFaqDocumentLog {
  id: string
  title: {
    en: string
    th: string
  }
  version: number
  active: boolean
  updatedAt: string
  updatedBy?: IAccount | string
  documents?: HistoryDocumentResult[]
  image?: string[] | null
  numberOfDocuments: number
}

export interface IFaqDocumentDetail {
  active?: boolean
  category_id?: string
  created_at?: string
  history_document?: IHistoryDocumenResponse[]
  id: string
  image?: string[] | null
  title: {
    en: string
    th: string
    cn: string
  }
  type_id?: string
  updated_at?: string
  updated_by?: IAccount
  updated_by_name?: string
  version: number
}

export interface IAppVersionDocumentLog {
  id: string
  system: 'Android' | 'iOS'
  updateType: 'Hard' | 'Soft'
  version: string
  updatedAt: string
  updatedBy?: IAccount | string
  message?: {
    title: {
      [key: string]: string
    }
    body: {
      [key: string]: string
    }
  }
}

export interface IAppVersionDocument {
  id: string
  system: 'Android' | 'iOS'
  updateType: 'Hard' | 'Soft'
  version: string
  updatedAt: string
  updatedBy?: IAccount | string
  schedule?: string
  body?: {
    [key: string]: string
  }
  title?: {
    [key: string]: string
  }
}

export interface IType {
  id: string
  type: string
}

export interface IAccessLocalInformationList {
  id: string
  category: string
  updatedAt: string
  updated_by_name?: string
}

export interface ICategoryCmsResponse {
  active: boolean
  id: string
  image: string
  list: IDocument[]
  title: string
  type: { id: string; type: string }
  type_id: string
  updated_at: string
  updated_by: string
  updated_by_name: string
  version: number
}
