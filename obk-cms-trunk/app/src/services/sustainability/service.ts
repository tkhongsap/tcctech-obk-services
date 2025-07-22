import { httpClient } from '@src/services/http-client'
import { ISustainabilityContentUpload, ISustainabilityData } from './model'

class SustainabilityContentService {
  upload(file: ISustainabilityContentUpload) {
    return httpClient.post<ISustainabilityData>(
      '/api/v1/homeContent/Upload',
      file
    )
  }

  publish(data: any) {
    return httpClient.post('/api/v1/Sustainability/Banner/Publish', data)
  }

  get() {
    return httpClient.post('/api/v1/Sustainability/GetBanner')
  }
}

export const sustainabilityContentService = new SustainabilityContentService()
