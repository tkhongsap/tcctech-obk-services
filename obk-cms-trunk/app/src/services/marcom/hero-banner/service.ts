import { httpClient } from '@src/services/http-client'
import { IHeroData, IHeroUpload } from '../hero-banner/model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class HeroService {
  upload(file: IHeroUpload) {
    return httpClient.post<IHeroData>('/api/v1/homeContent/Upload', file)
  }

  uploadDoc(file: IHeroUpload) {
    return httpClient.post<IHeroData>('/api/v1/Sustainability/Upload', file)
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Marcom/MarcomBanner', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  save(data: any) {
    return httpClient.post('/api/v1/Marcom/MarcomBanner/Publish', data)
  }

  getBanner(rid: string) {
    return httpClient
      .get('/api/v1/Marcom/MarcomBanner/' + rid)
      .then((res) => res.data)
  }

  delete(data: any) {
    return httpClient.post('/api/v1/Marcom/MarcomBanner/Delete', data)
  }

  changeOrder(data: any) {
    return httpClient.post('/api/v1/Marcom/Marcom/ChangeOrder', data)
  }

  saveconfig(data: any) {
    return httpClient.post('/api/v1/Marcom/Marcom/SaveConfig', data)
  }
}

export const heroService = new HeroService()
