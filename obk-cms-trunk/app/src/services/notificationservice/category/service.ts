import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'
import { ICategoryRequest } from './model'

interface IGetPage {
  query?: string
  page: number
  perPage: number
}

class CategoryRequestService {
  getAll() {
    const data = mockdata
    return getMockSuccessResponse(data)
  }

  async getPage({ query = '', page, perPage }: IGetPage) {
    console.log({ query, page, perPage })

    const pageList = mockdata
      // query contain
      .filter((e) => {
        const rs = [
          e.order,
          e.id,
          e.english,
          e.thai,
          e.chinese,
          e.count,
          e.status,
          e.lastupdate,
        ].some((v) =>
          v.toString().toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )
        return rs
      })
      .slice((page - 1) * perPage, page * perPage)

    const data = {
      page,
      perPage,
      totalPage: Math.ceil(mockdata.length / perPage),
      query,
      data: pageList,
    }
    return await getMockSuccessResponse(data)
  }
  get(categoryId: string) {
    const data = mockdata.find((x) => x.id.toString() === categoryId)
    return getMockSuccessResponse(data)
  }

  createWorkOrder(data: ICategoryRequest) {
    console.log(data)
    return getMockSuccessResponse('success')
  }

  reject(data: ICategoryRequest) {
    console.log(data)
    return getMockSuccessResponse('success')
  }
}

export const categoryRequestService = new CategoryRequestService()
