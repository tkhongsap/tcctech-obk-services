import { httpClient } from '@src/services/http-client'

class AppConfigService {
  get(name: string) {
    return httpClient.get(`/api/v1/appConfig/${name}`)
  }
}

export const appConfigService = new AppConfigService()
