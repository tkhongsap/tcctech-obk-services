import { httpClient } from '../http-client'
import { IAddOnForm, IAddOnItem } from './model'

class ArtCAddOnServices {
  getAll(locale: string) {
    return httpClient.get<{ data: IAddOnItem[] }>('/api/art-culture/add-on', {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IAddOnItem }>(
      `/api/art-culture/add-on/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(locale: string, data: IAddOnForm) {
    return httpClient.post<IAddOnItem>(`/api/art-culture/add-on`, data, {
      params: { locale },
    })
  }

  edit(id: string, locale: string, data: IAddOnForm) {
    return httpClient.put<IAddOnItem>(`/api/art-culture/add-on/${id}`, data, {
      params: { locale },
    })
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/add-on/${id}`)
  }
}

export const artCAddOnServices = new ArtCAddOnServices()
