import { IPartnerForm, IPartnerItem } from './model'
import { httpClient } from '../http-client'

class ArtCPartnerServices {
  getAll(locale: string) {
    return httpClient.get<{
      data: IPartnerItem[]
    }>(`/api/art-culture/partners`, {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IPartnerItem }>(
      `/api/art-culture/partners/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(locale: string, data: IPartnerForm) {
    return httpClient.post<IPartnerItem>(`/api/art-culture/partners`, data, {
      params: { locale },
    })
  }

  edit(id: string, locale: string, data: IPartnerForm) {
    return httpClient.put<IPartnerItem>(
      `/api/art-culture/partners/${id}`,
      data,
      {
        params: { locale },
      }
    )
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/partners/${id}`)
  }
}

export const artCPartnerServices = new ArtCPartnerServices()
