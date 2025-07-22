import { httpClient } from '@src/services/http-client'
import { IContentManagementData, IContentUpload } from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class ContentService {
  upload(file: IContentUpload) {
    return httpClient.post<IContentManagementData>(
      '/api/v1/homeContent/Upload',
      file
    )
  }

  save(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/ContentManagement/Publish',
      data
    )
  }

  delete(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/ContentManagement/Delete',
      data
    )
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Sustainability/ContentManagement', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  getContent(rid: string) {
    return httpClient
      .get('/api/v1/Sustainability/ContentManagement/' + rid)
      .then((res) => res.data)
  }

  getOption() {
    return httpClient.get('/api/v1/Sustainability/ContentManagement/MainMenu')
  }

  changeOrder(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/Sustainability/ChangeOrder',
      data
    )
  }
}

export const contentService = new ContentService()
