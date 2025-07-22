import { httpClient } from '@src/services/http-client'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'
import { IHappeningData, IHappeningUpload } from './model'

class HappeningService {
  upload(file: IHappeningUpload) {
    return httpClient.post<IHappeningData>('/api/v1/homeContent/Upload', file)
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Marcom/Category', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  save(data: any) {
    return httpClient.post('/api/v1/Marcom/Happening/Publish', data)
  }

  delete(data: any) {
    return httpClient.post('/api/v1/Marcom/Happening/Delete', data)
  }

  get(rid: string) {
    return httpClient
      .get('/api/v1/Marcom/Happening/' + rid)
      .then((res) => res.data)
  }

  getAllContent(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Marcom/Content', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  getOption(data: any) {
    return httpClient.get('/api/v1/Marcom/Happening/Category', {
      params: { ...data },
      paramsSerializer: (params) => qs.stringify(params),
    })
  }
}

export const happeningService = new HappeningService()
