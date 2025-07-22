import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'

interface IGetPage {
  query?: string
  page: number
  perPage: number
}

class IssueTypeService {
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
          e.id,
          e.english,
          e.thai,
          e.chinese,
          e.lastupdate,
          e.remark,
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
  get(issueTypeId: string) {
    const data = mockdata.find((x) => x.id === issueTypeId)
    return getMockSuccessResponse(data)
  }
}

export const issueTypetService = new IssueTypeService()
