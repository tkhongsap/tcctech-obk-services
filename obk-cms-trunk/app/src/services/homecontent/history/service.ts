import { httpClient } from '@src/services/http-client'
import {
  HomeContentData,
  IHomeContentData,
  IHomeContentList,
  IHomeContentUpload,
  ILastVersion,
} from './model'
import { DataTableStateEvent } from 'primereact/datatable'

class HomeContentService {
  getAll(pagination: DataTableStateEvent) {
    return httpClient.get<{ totalRecords: number; data: IHomeContentList[] }>(
      '/api/v1/homeContent/versions',
      {
        params: { ...pagination },
      }
    )
  }

  get(hcid: string) {
    return httpClient.get<IHomeContentList>(
      `/api/v1/homeContent/version/${hcid}`
    )
  }

  getLastVersion() {
    return httpClient.get<ILastVersion | null>(
      '/api/v1/homeContent/LatestVersion'
    )
  }

  upload(file: IHomeContentUpload) {
    return httpClient.post<IHomeContentData>('/api/v1/homeContent/Upload', file)
  }

  publish(data: HomeContentData) {
    return httpClient.post('/api/v1/homeContent/publish', data)
  }
}

export const homeContentService = new HomeContentService()
