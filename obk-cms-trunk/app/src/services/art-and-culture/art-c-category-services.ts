import { IArtCCategoryItem, IArtCTypeForm } from './model'
import { httpClient } from '../http-client'

class ArtCCategoryServices {
  getAll(typeId: string, locale: string) {
    return httpClient.get<{
      data: IArtCCategoryItem[]
    }>(`/api/art-culture/art-c/category/${typeId}`, {
      params: { locale },
    })
  }

  get(typeId: string, id: string, locale: string) {
    return httpClient.get<{ data: IArtCCategoryItem }>(
      `/api/art-culture/art-c/category/${typeId}/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(typeId: string, locale: string, data: IArtCTypeForm) {
    return httpClient.post<IArtCCategoryItem>(
      `/api/art-culture/art-c/category/${typeId}`,
      data,
      {
        params: { locale },
      }
    )
  }

  edit(typeId: string, id: string, locale: string, data: IArtCTypeForm) {
    return httpClient.put<IArtCCategoryItem>(
      `/api/art-culture/art-c/category/${typeId}/${id}`,
      data,
      {
        params: { locale },
      }
    )
  }

  delete(typeId: string, id: string) {
    return httpClient.delete(`/api/art-culture/art-c/category/${typeId}/${id}`)
  }
}

export const artCCategoryServices = new ArtCCategoryServices()
