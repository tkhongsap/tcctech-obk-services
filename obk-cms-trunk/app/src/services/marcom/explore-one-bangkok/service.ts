import { httpClient } from '@src/services/http-client'
import { IExploreData, IExploreUpload } from '../explore-one-bangkok/model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class ExploreService {
  upload(file: IExploreUpload) {
    return httpClient.post<IExploreData>('/api/v1/homeContent/Upload', file)
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Marcom/Explore', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  changeOrder(data: any) {
    return httpClient.post('/api/v1/Marcom/Marcom/ChangeOrder', data)
  }

  save(data: any) {
    return httpClient.post('/api/v1/Marcom/Explore/Publish', data)
  }

  get(rid: string) {
    return httpClient
      .get('/api/v1/Marcom/Explore/' + rid)
      .then((res) => res.data)
  }

  delete(data: any) {
    return httpClient.post('/api/v1/Marcom/Explore/Delete', data)
  }
}

export const exploreService = new ExploreService()
