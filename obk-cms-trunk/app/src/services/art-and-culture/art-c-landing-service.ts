import { httpClient } from '../http-client'
import { ILandingPage, ILandingPageForm } from './model'

class ArtCLandingServices {
  get(locale: string) {
    return httpClient.get<{ data: ILandingPage }>(
      '/api/art-culture/landing/content',
      {
        params: { locale },
      }
    )
  }

  edit(locale: string, data: ILandingPageForm) {
    return httpClient.put<ILandingPageForm>(
      `/api/art-culture/landing/content`,
      {
        content: JSON.stringify({
          artCTitle: data.artCTitle,
          artCDesc: data.artCDesc,
          artMapTitle: data.artMapTitle,
          artMapDesc: data.artMapDesc,
          programTitle: data.programTitle,
          programDesc: data.programDesc,
        }),
        programsId: data.programsId,
        highlightAutoPlay: data.highlightAutoPlay,
        artCTypesId: data.artCTypesId,
        sectionOrder: data.sectionOrder,
      },
      {
        params: { locale },
      }
    )
  }
}

export const artCLandingServices = new ArtCLandingServices()
