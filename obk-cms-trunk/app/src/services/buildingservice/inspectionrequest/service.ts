import { httpClient } from '../../http-client'
import {
  IGetInspectionRequestRecord,
  GetInspectionRequest,
  IGetEventTypeRecord,
  IGetProblemTypeRecord,
} from './model'
import { DataTableStateEvent } from 'primereact/datatable'

class InspectionRequestService {
  async getAll(
    pagination?: DataTableStateEvent
  ): Promise<IGetInspectionRequestRecord> {
    const [requestsRes, eventsRes, problemsRes] = await Promise.all([
      httpClient.get<IGetInspectionRequestRecord>(
        `/api/v1/urgent/service-request`,
        { params: { ...pagination } }
      ),
      this.getAllEvent(),
      this.getAllProblem(),
    ])

    const eventsMap = new Map(
      Array.isArray(eventsRes.data)
        ? eventsRes.data.map((event) => [
            event.id,
            event.name_th || event.name_en,
          ])
        : []
    )

    const problemsMap = new Map(
      Array.isArray(problemsRes.data)
        ? problemsRes.data.map((problem) => [
            problem.id,
            problem.name_th || problem.name_en,
          ])
        : []
    )

    const modifiedData = (
      Array.isArray(requestsRes.data.data) ? requestsRes.data.data : []
    ).map((item) => {
      // @ts-ignore
      const srEventIds = JSON.parse(item.srEventId || '[]') as string[]
      const srEventNames = srEventIds.map((id) => eventsMap.get(id) || id)
      // @ts-ignore
      const srProblemIds = JSON.parse(item.srProblemId || '[]') as string[]
      const srProblemNames = srProblemIds.map((id) => problemsMap.get(id) || id)

      return {
        ...new GetInspectionRequest(item),
        srEventNames,
        srProblemNames,
      }
    })
    var total = requestsRes.data.total as number

    return {
      // @ts-ignore
      data: modifiedData,
      total: requestsRes.data.total,
      paginate: {
        total: total,
      },
    }
  }

  async getById(id: string) {
    const [res, eventsRes, problemsRes] = await Promise.all([
      httpClient.get<GetInspectionRequest>(
        `/api/v1/urgent/service-request/${id}`
      ),
      this.getAllEvent(),
      this.getAllProblem(),
    ])

    const eventMap = new Map(
      (Array.isArray(eventsRes.data) ? eventsRes.data : []).map((e) => [
        e.id,
        e.name_th || e.name_en,
      ])
    )
    const problemMap = new Map(
      (Array.isArray(problemsRes.data) ? problemsRes.data : []).map((p) => [
        p.id,
        p.name_th || p.name_en,
      ])
    )

    const srEventIds = Array.isArray(res.data.srEventId)
      ? res.data.srEventId
      : JSON.parse(res.data.srEventId || '[]')
    const srProblemIds = Array.isArray(res.data.srProblemId)
      ? res.data.srProblemId
      : JSON.parse(res.data.srProblemId || '[]')
    const srEventNames = srEventIds
      .map((id: string) => eventMap.get(id) || id)
      .join(', ')
    const srProblemNames = srProblemIds
      .map((id: string) => problemMap.get(id) || id)
      .join(', ')

    const images = res.data.image
      ? typeof res.data.image === 'string'
        ? JSON.parse(res.data.image)
        : res.data.image
      : []

    return {
      ...res.data,
      srEventNames,
      srProblemNames,
      image: images,
    }
  }

  editRequest(detail: any) {
    return httpClient.post(`/api/v1/urgent/service-request/upsert`, detail)
  }

  async getAllEvent() {
    const res = await httpClient.get<IGetEventTypeRecord>(
      `/api/v1/urgent/event`
    )
    return res
  }

  async getAllProblem() {
    const res = await httpClient.get<IGetProblemTypeRecord>(
      `/api/v1/urgent/problem`
    )
    return res
  }
}

export const inspectionRequestService = new InspectionRequestService()
