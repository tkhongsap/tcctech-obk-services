import { getMockSuccessResponse, httpClient } from '@src/services/http-client'
import mockdata from './mockdata.json'
import { INotification } from './model'
import { IContentUpload, IContentUploadResponse } from './model'

interface IGetPage {
  query?: string
  page: number
  perPage: number
}

class NotificationService {
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
          e.title,
          e.status,
          e.category,
          e.updateby,
          e.lastupdate,
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

  createWorkOrder(data: INotification) {
    console.log(data)
    return getMockSuccessResponse('success')
  }

  upload(file: IContentUpload) {
    return httpClient.post<IContentUploadResponse>(
      '/api/v1/homeContent/Upload',
      file
    )
  }
}

export const notificationService = new NotificationService()
