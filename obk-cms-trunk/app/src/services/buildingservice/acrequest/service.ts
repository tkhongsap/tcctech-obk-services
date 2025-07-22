import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'
import { IAcRequest, IRejectModel } from './model'

interface IGetPage {
  query?: string
  page: number
  perPage: number
}
class AcRequestService {
  getAll() {
    const data = mockdata
    return getMockSuccessResponse(data)
  }

  async getPage({ query = '', page, perPage }: IGetPage) {
    console.log({ query, page, perPage })

    // Mock data
    const pageList = mockdata
      // query contain
      .filter((e) => {
        const rs = [
          e.id,
          e.tenant_name,
          e.unit,
          e.date,
          e.status,
          e.location,
          e.floor,
          e.zone,
          e.duration,
        ].some((v) =>
          v.toString().toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )

        return rs
      })
      // page spilt
      .slice((page - 1) * perPage, page * perPage)

    const data = {
      page,
      perPage,
      totalPage: Math.ceil(mockdata.length / perPage),
      query,
      data: pageList,
    }
    // console.log({ data });
    return await getMockSuccessResponse(data)
  }

  get(acId: string) {
    const data = mockdata.find((x) => x.id.toString() === acId)
    return getMockSuccessResponse(data)
  }

  createWorkOrder(data: IAcRequest) {
    console.log(data)
    return getMockSuccessResponse('success')
  }

  reject(data: IRejectModel) {
    console.log(data)
    return getMockSuccessResponse('success')
  }
}

export const acRequestService = new AcRequestService()
