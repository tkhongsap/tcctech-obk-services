import { httpClient } from '@src/services/http-client'
import { DataTableStateEvent } from 'primereact/datatable'
import qs from 'qs'
import { IEventData, IEventUpload } from './model'

class EventService {
  upload(file: IEventUpload) {
    return httpClient.post<IEventData>('/api/v1/homeContent/Upload', file)
  }

  getAll(filter: any, pagination?: DataTableStateEvent) {
    return httpClient
      .get('/api/v1/Marcom/Event', {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((res) => res.data)
  }

  save(data: any) {
    return httpClient.post('/api/v1/Marcom/Event/Publish', data)
  }

  delete(data: any) {
    return httpClient.post('/api/v1/Marcom/Event/Delete', data)
  }

  getEvent(rid: string) {
    return httpClient.get('/api/v1/Marcom/Event/' + rid).then((res) => res.data)
  }
}

export const eventService = new EventService()
