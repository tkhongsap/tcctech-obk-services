import * as OB_PARKING_SDK from 'ob-parking-sdk'
import { PropertiesResponse, PropertyBody } from 'ob-parking-sdk/dist/api'

class PropertyService {
  public async getProperties(): Promise<PropertiesResponse[] | undefined> {
    try {
      const properties = await OB_PARKING_SDK.client.configPropertyIndex()
      if (properties.status === 200 && properties.data) {
        return properties.data
      }
    } catch (error) {
      console.log('Get properties error :', error)
    }
  }

  public async getPropertyData(
    id: string
  ): Promise<PropertiesResponse | undefined> {
    try {
      const property = await OB_PARKING_SDK.client.configPropertyShow(id)
      if (property.status === 200 && property.data) {
        return property.data
      }
    } catch (error) {
      console.log('Get property error :', error)
    }
  }

  public async createProperty(
    data: PropertyBody
  ): Promise<PropertiesResponse | undefined> {
    try {
      const newProperty = await OB_PARKING_SDK.client.configAddProperty(data)
      if (newProperty.status === 201 && newProperty.data) {
        return newProperty.data
      }
    } catch (error) {
      console.log('Create property error :', error)
    }
  }

  public async updateProperty(
    id: string,
    data: PropertyBody
  ): Promise<PropertiesResponse | undefined> {
    try {
      const updatedProperty = await OB_PARKING_SDK.client.configUpdateProperty(
        id,
        data
      )
      if (updatedProperty.status === 200 && updatedProperty.data) {
        return updatedProperty.data
      }
    } catch (error) {
      console.log('Update property error :', error)
    }
  }

  public async deleteProperty(id: string): Promise<boolean> {
    try {
      const updatedProperty = await OB_PARKING_SDK.client.configDeleteProperty(
        id
      )
      if (updatedProperty.status === 204) {
        return true
      }
      return false
    } catch (error) {
      console.log('Update property error :', error)
      return false
    }
  }
}

const propertyService = new PropertyService()

export default propertyService
