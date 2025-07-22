import {
  IAcRequest,
  IAcRequestDetail,
} from '@src/services/buildingservice/acrequest/model'
import { formatDateTime } from 'utils/dayjs'

export function decorator(data: IAcRequest): IAcRequest {
  return {
    ...data,
    from: formatDateTime(data.from),
    to: formatDateTime(data.to),
  }
}

export function decoratorDetail(data: IAcRequestDetail): IAcRequestDetail {
  return {
    data: {
      ...data.data,
      from: formatDateTime(data.data.from),
      to: formatDateTime(data.data.to),
      created_at: formatDateTime(data.data.created_at),
    },
  }
}
