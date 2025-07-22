import { USER_NAME } from '@src/authProvider/constants'
import {
  StoreWhitelistPayload,
  StoreWhitelistQuery,
  StoreWhitelistType,
} from '@src/types/car-park/carpark.store-whitelist'
import { getCookie } from 'cookies-next'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import {
  AddConfigStoreWhitelist,
  PropertiesResponse,
  StoreWhitelistResponse,
} from 'ob-parking-sdk/dist/api'

class StoreWhitelistService {
  public async getStoreWhitelistIndex({
    id,
    tax_id,
    store_name,
    company_name,
    property_name,
    property_id,
    unit_no,
    address,
    building,
    has_tax_id,
    receipt_address_in_obk,
    updated_at,
    created_at,
    sort_key,
    sort_direction,
  }: StoreWhitelistQuery): Promise<StoreWhitelistType[] | void> {
    try {
      const response = await OB_PARKING_SDK.client.configStoreWhitelistIndex(
        id,
        tax_id,
        store_name,
        company_name,
        property_name,
        property_id,
        unit_no,
        address,
        building,
        has_tax_id,
        receipt_address_in_obk,
        updated_at,
        created_at,
        sort_key,
        sort_direction
      )
      if (response.status === 200 && response.data) {
        return response.data.map((item) => this.serializeStoreWhitelist(item))
      }
    } catch (error) {
      console.log('Get store whitelist error :', error)
    }
  }

  public async getStoreWhitelist(
    id: string
  ): Promise<StoreWhitelistType | void> {
    try {
      const response = await OB_PARKING_SDK.client.configStoreWhitelistShow(id)
      if (response.data) {
        return this.serializeStoreWhitelist(response.data)
      }
    } catch (error) {
      console.log('Get Store whitelist error :', error)
    }
  }

  public async createStoreWhitelist(
    data: StoreWhitelistPayload
  ): Promise<StoreWhitelistType | void> {
    try {
      const updateBy = getCookie(USER_NAME)
      const body = this.serializeStorePayload({ ...data, updateBy })
      const response = await OB_PARKING_SDK.client.configAddStoreWhitelist({
        ...body,
      })
      if (response.data) {
        return this.serializeStoreWhitelist(response.data)
      }
    } catch (error) {
      console.log('Create store whitelist error :', error)
    }
  }

  public async updateStoreWhitelist(
    id: string,
    data: StoreWhitelistPayload
  ): Promise<StoreWhitelistType | void> {
    try {
      const updateBy = getCookie(USER_NAME)
      const body = this.serializeStorePayload({ ...data, updateBy })
      const response = await OB_PARKING_SDK.client.configUpdateStoreWhitelist(
        id,
        {
          ...body,
        }
      )
      if (response.data) {
        return this.serializeStoreWhitelist(response.data)
      }
    } catch (error) {
      console.log('Update store whitelist error :', error)
    }
  }

  public async deleteStoreWhitelist(id: string): Promise<boolean | void> {
    try {
      await OB_PARKING_SDK.client.configDeleteStoreWhitelist(id)
      return true
    } catch (error) {
      console.log('Delete store whitelist error :', error)
    }
  }

  serializeStoreWhitelist(data: StoreWhitelistResponse): StoreWhitelistType {
    const {
      id,
      tax_id,
      store_name,
      company_name,
      unit_no,
      property,
      address,
      building,
      has_tax_id,
      receipt_address_in_obk,
      created_at,
      updated_at,
    } = data
    return {
      id,
      taxId: tax_id ?? undefined,
      storeName: store_name,
      companyName: company_name,
      property,
      unitNo: unit_no ?? undefined,
      address: address ?? undefined,
      building: building ?? undefined,
      hasTaxId: has_tax_id,
      receiptAddressInObk: receipt_address_in_obk,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  public async getPropertyIndex(): Promise<PropertiesResponse[] | void> {
    try {
      const response = await OB_PARKING_SDK.client.configPropertyIndex()
      if (response.status === 200 && response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Get property index error :', error)
    }
  }

  serializeStorePayload(
    data: StoreWhitelistPayload & { updateBy?: string }
  ): AddConfigStoreWhitelist {
    return {
      tax_id: data.taxId,
      store_name: data.storeName,
      company_name: data.companyName,
      property_id: data.propertyId,
      unit_no: data.unitNo,
      address: data.address,
      building: data.building,
      has_tax_id: data.hasTaxId,
      receipt_address_in_obk: data.receiptAddressInObk,
      ...(data.updateBy && { updated_by: data.updateBy }),
    }
  }
}

export const storeWhitelistService = new StoreWhitelistService()
