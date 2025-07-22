import { IFaqForm, IFaqItem } from './model'
import { httpClient } from '../http-client'
import { AxiosResponse } from 'axios'

class ArtCFaqServices {
  async getAll(locale: string): Promise<AxiosResponse<{ data: IFaqItem[] }>> {
    return httpClient.get<{
      data: IFaqItem[]
    }>(`/api/art-culture/faqs`, {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IFaqItem }>(`/api/art-culture/faqs/${id}`, {
      params: { locale },
    })
  }

  create(locale: string, data: IFaqForm) {
    return httpClient.post<IFaqItem>(`/api/art-culture/faqs`, data, {
      params: { locale },
    })
  }

  edit(id: string, locale: string, data: IFaqForm) {
    return httpClient.put<IFaqItem>(`/api/art-culture/faqs/${id}`, data, {
      params: { locale },
    })
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/faqs/${id}`)
  }

  order(ids: number[]) {
    return httpClient.put<IFaqItem>(`/api/art-culture/faqs/order/items`, {
      ids,
    })
  }
}

export const artCFaqsServices = new ArtCFaqServices()
