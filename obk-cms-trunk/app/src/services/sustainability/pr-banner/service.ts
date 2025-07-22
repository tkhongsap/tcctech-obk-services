import { httpClient } from '@src/services/http-client'
import { IBannerData, IBannerUpload } from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class BannerService {
  upload(file: IBannerUpload) {
    return httpClient.post<IBannerData>('/api/v1/homeContent/Upload', file)
  }

  save(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/PRBannerManagement/Publish',
      data
    )
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Sustainability/PRBannerManagement', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  getBanner(rid: string) {
    return httpClient
      .get('/api/v1/Sustainability/PRBannerManagement/' + rid)
      .then((res) => res.data)
  }

  delete(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/PRBannerManagement/Delete',
      data
    )
  }

  initial() {
    return httpClient.get(
      '/api/v1/Sustainability/PRBannerManagement/GetInitial'
    )
  }

  saveconfig(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/Sustainability/SaveConfig',
      data
    )
  }
}

export const bannerService = new BannerService()
