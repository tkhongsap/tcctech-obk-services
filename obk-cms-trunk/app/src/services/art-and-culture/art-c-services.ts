import { IArtCTypeForm, IArtCTypeItem } from './model'
import { httpClient } from '../http-client'

class ArtCServices {
  getAll(locale: string) {
    return httpClient.get<{
      data: IArtCTypeItem[]
    }>(`/api/art-culture/art-c`, {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IArtCTypeItem }>(
      `/api/art-culture/art-c/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(locale: string, data: IArtCTypeForm) {
    const playlist = data.playlist
      ? data.playlist.map((item) => parseInt(item))
      : []

    return httpClient.post<IArtCTypeItem>(
      `/api/art-culture/art-c`,
      { ...data, playlist },
      {
        params: { locale },
      }
    )
  }

  edit(id: string, locale: string, data: IArtCTypeForm) {
    const playlist = data.playlist
      ? data.playlist.map((item) => parseInt(item))
      : []

    return httpClient.put<IArtCTypeItem>(
      `/api/art-culture/art-c/${id}`,
      { ...data, playlist },
      {
        params: { locale },
      }
    )
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/art-c/${id}`)
  }
}

export const artCServices = new ArtCServices()
