import { httpClient } from '@src/services/http-client'
import { IDigitalLibraryData, ILibraryUpload } from './model'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'

class LibraryService {
  upload(file: ILibraryUpload) {
    return httpClient.post<IDigitalLibraryData>(
      '/api/v1/homeContent/Upload',
      file
    )
  }

  uploadDoc(file: ILibraryUpload) {
    return httpClient.post<IDigitalLibraryData>(
      '/api/v1/Sustainability/Upload',
      file
    )
  }

  delete(data: any) {
    return httpClient.post('/api/v1/Sustainability/DigitalLibrary/Delete', data)
  }

  save(data: any) {
    return httpClient.post(
      '/api/v1/Sustainability/DigitalLibrary/Publish',
      data
    )
  }

  getLib(rid: string) {
    return httpClient
      .get('/api/v1/Sustainability/DigitalLibrary/' + rid)
      .then((res) => res.data)
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Sustainability/DigitalLibrary', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }
}

export const libraryService = new LibraryService()
