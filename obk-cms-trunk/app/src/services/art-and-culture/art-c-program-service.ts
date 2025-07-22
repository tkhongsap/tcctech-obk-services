import { httpClient } from '../http-client'
import { IProgram, IProgramForm } from './model'

class ArtCProgramServices {
  getAll(locale: string) {
    return httpClient.get<{ data: IProgram[] }>('/api/art-culture/programs', {
      params: { locale },
    })
  }

  get(id: string, locale: string) {
    return httpClient.get<{ data: IProgram }>(
      `/api/art-culture/programs/${id}`,
      {
        params: { locale },
      }
    )
  }

  create(locale: string, data: IProgramForm) {
    return httpClient.post<IProgram>(`/api/art-culture/programs`, data, {
      params: { locale },
    })
  }

  edit(id: string, locale: string, data: IProgramForm) {
    return httpClient.put<IProgram>(`/api/art-culture/programs/${id}`, data, {
      params: { locale },
    })
  }

  delete(id: string) {
    return httpClient.delete(`/api/art-culture/programs/${id}`)
  }
}

export const artCProgramServices = new ArtCProgramServices()
