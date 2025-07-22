import { httpClient } from '@src/services/http-client'
import {
  UpsertEmergencyContactData,
  IUpsertEmergencyContact,
  IGetEmergencyContactRecord,
} from './model'

class EmergencyContact {
  async get() {
    const res = await httpClient.get<IGetEmergencyContactRecord>(
      `/api/v1/EmergencyContact`
    )
    return res.data.data
  }
  publish(data: UpsertEmergencyContactData) {
    return httpClient.put<IUpsertEmergencyContact>(
      `/api/v1/EmergencyContact`,
      data
    )
  }
}

export const emergencyContact = new EmergencyContact()
