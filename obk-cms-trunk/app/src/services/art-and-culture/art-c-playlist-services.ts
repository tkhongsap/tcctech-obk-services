import { IPlaylist, IPlaylistForm } from './model'
import { httpClient } from '../http-client'

class ArtCPlaylistServices {
  getAll(locale: string) {
    return httpClient.get<{
      data: IPlaylist[]
    }>(`/api/art-culture/playlist`, {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IPlaylist }>(
      `/api/art-culture/playlist/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(locale: string, data: IPlaylistForm) {
    return httpClient.post<IPlaylist>(`/api/art-culture/playlist`, data, {
      params: { locale },
    })
  }

  edit(id: string, locale: string, data: IPlaylistForm) {
    return httpClient.put<IPlaylist>(`/api/art-culture/playlist/${id}`, data, {
      params: { locale },
    })
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/playlist/${id}`)
  }
}

export const artCPlaylistServices = new ArtCPlaylistServices()
