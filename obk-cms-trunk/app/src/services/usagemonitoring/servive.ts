import { httpClient } from '@src/services/http-client'
import {
  UpsertUsageMonitorData,
  IUpsertUsageMonitoeing,
  IGetUsageMonitoringRecord,
} from './model'

class UsageMonitoring {
  async get() {
    const res = await httpClient.get<IGetUsageMonitoringRecord>(
      `/api/v1/usageMonitoring/Summary`
    )
    return res.data
  }
  publish(data: UpsertUsageMonitorData) {
    return httpClient.put<IUpsertUsageMonitoeing>(
      `/api/v1/usageMonitoring/Summary`,
      data
    )
  }
}

export const usageMonitoring = new UsageMonitoring()
