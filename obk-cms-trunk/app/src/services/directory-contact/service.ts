/* eslint-disable */
import { DataTableStateEvent } from 'primereact/datatable'
import {
  IFilterDirectoryContact,
  IGetDirectoryContactCategoryRecord,
  IGetDirectoryContact,
  IGetDirectoryContactCategory,
  UpsertDirectoryContact,
  IGetDirectoryContactRecord,
  IDirectoryContactCategoryRecord,
  UpsertCategory,
  IEditNubmer,
} from './model'
import { httpClient } from '../http-client'

class DirectoryContactService {
  async getAll(
    filter: IFilterDirectoryContact,
    pagination?: DataTableStateEvent
  ): Promise<IGetDirectoryContactRecord> {
    const res = await httpClient.get<IGetDirectoryContactRecord>(
      `/api/v1/DirectoryContact/list`,
      { params: { ...filter, ...pagination } }
    )

    return {
      data: res.data.data,
      totalRecord: res.data.totalRecord,
    }
  }

  async getDataCategory(
    filter: IFilterDirectoryContact
  ): Promise<{ data?: IGetDirectoryContactCategory }> {
    const res = await httpClient.get<IGetDirectoryContactCategoryRecord>(
      `/api/v1/DirectoryContact`,
      { params: { categoryId: filter } }
    )
    const result: IGetDirectoryContactCategory = res.data?.data[0]
    return { data: result }
  }

  async getAllCategory(): Promise<{ data: IDirectoryContactCategoryRecord[] }> {
    const res = await httpClient.get<IGetDirectoryContactCategoryRecord>(
      `/api/v1/DirectoryContact`
    )
    const result = res.data.data.map((x) => {
      return { categoryId: x.categoryId, category: x.category }
    })
    return { data: result }
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetDirectoryContact>(
      `/api/v1/DirectoryContact/${id}`
    )
    return res.data
  }

  createNumber(detail: UpsertDirectoryContact) {
    return httpClient.put(`/api/v1/DirectoryContact/Category`, detail)
  }

  editNumber(data: IEditNubmer) {
    return httpClient.put(`/api/v1/DirectoryContact/Number`, data)
  }

  deleteNumber(categoryId: string, directoryId: string) {
    return httpClient.delete('/api/v1/DirectoryContact', {
      data: { categoryId, directoryId },
    })
  }

  getCategory(): Promise<IGetDirectoryContactCategory[]> {
    return Promise.resolve(mockDirectoryContactCategory)
  }
  getCategoryById(id: string) {
    const result = mockDirectoryContactCategory.find((x) => x.categoryId === id)
    result!.contactList = mockDirectoryContact.filter(
      (x) => x.categoryId === id
    )
    return Promise.resolve(result)
  }
  upsert(data: UpsertDirectoryContact) {
    // if (data.id) {
    //   // TODO API for Create Directory Contact
    //   return Promise.resolve()
    // }
    // // TODO API for Update Directory Contact
    return Promise.resolve()
  }

  createCategory(req: UpsertCategory) {
    return httpClient.post('/api/v1/DirectoryContact/Category', req)
  }
  deleteCategory(id: string) {
    return httpClient.delete(`/api/v1/DirectoryContact/category/${id}`)
  }
}

export const directoryContactService = new DirectoryContactService()

const mockDirectoryContactCategory: IGetDirectoryContactCategory[] = [
  {
    categoryId: 'C001',
    category: 'Shopping Mall',
    contactList: [],
  },
  {
    categoryId: 'C002',
    category: 'Market',
    contactList: [],
  },
  {
    categoryId: 'C003',
    category: 'Historic Site',
    contactList: [],
  },
  {
    categoryId: 'C004',
    category: 'Park',
    contactList: [],
  },
]

const mockDirectoryContact: IGetDirectoryContact[] = [
  {
    id: 'L001',
    nameEn: 'Central World',
    nameTh: 'เซ็นทรัลเวิลด์',
    nameZh: '中央世界',
    categoryId: 'C001',
    category: 'Shopping Mall',
    phonenumber: '+66 2 646 1888',
    updatedAt: '2024-09-01',
    updatedBy: 'admin',
    seq: 1,
  },
  {
    id: 'L002',
    nameEn: 'Chatuchak Market',
    nameTh: 'ตลาดจตุจักร',
    nameZh: '乍都节市场',
    categoryId: 'C002',
    category: 'Market',
    phonenumber: '+66 2 272 4440',
    updatedAt: '2024-09-02',
    updatedBy: 'admin',
    seq: 1,
  },
  {
    id: 'L003',
    nameEn: 'Grand Palace',
    nameTh: 'พระบรมมหาราชวัง',
    nameZh: '大皇宫',
    categoryId: 'C003',
    category: 'Historic Site',
    phonenumber: '+66 2 623 5500',
    updatedAt: '2024-09-03',
    updatedBy: 'admin',
    seq: 1,
  },
  {
    id: 'L004',
    nameEn: 'Lumpini Park',
    nameTh: 'สวนลุมพินี',
    nameZh: '伦披尼公园',
    categoryId: 'C004',
    category: 'Park',
    phonenumber: '+66 2 252 7005',
    updatedAt: '2024-09-04',
    updatedBy: 'admin',
    seq: 1,
  },
]
