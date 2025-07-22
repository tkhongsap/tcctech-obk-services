import { httpClient } from '../http-client'
import { IArtCultureContentUpload, IArtCultureContentUploadData } from './model'

class ArtCGeneralServices {
  uploadImage(file: IArtCultureContentUpload) {
    return httpClient.post<IArtCultureContentUploadData>(
      '/api/v1/homeContent/Upload',
      file
    )
  }
}

export const artCGeneralServices = new ArtCGeneralServices()
