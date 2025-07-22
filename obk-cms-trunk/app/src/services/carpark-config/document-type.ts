import { DocumentTypeSchema } from '@src/types/car-park/carpark.document-type'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import { ConfigDocsTypeResponse } from 'ob-parking-sdk/dist/api'

class DocumentTypeService {
  public async getDocumentTypeIndex(): Promise<
    ConfigDocsTypeResponse[] | undefined
  > {
    try {
      const response = await OB_PARKING_SDK.client.configDocIndex()
      if (response.status === 200 && response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Get document types error :', error)
    }
  }

  public async getDocumentType(
    id: string
  ): Promise<ConfigDocsTypeResponse | void> {
    try {
      const response = await OB_PARKING_SDK.client.configDocShow(id)
      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Get document type error :', error)
    }
  }

  public async createDocumentType(
    data: DocumentTypeSchema
  ): Promise<ConfigDocsTypeResponse | void> {
    try {
      const response = await OB_PARKING_SDK.client.configAddDoc({
        ...data,
      })
      if (response.status === 201 && response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Create document type error :', error)
    }
  }

  public async updateDocumentType(
    id: string,
    data: DocumentTypeSchema
  ): Promise<ConfigDocsTypeResponse | void> {
    try {
      const response = await OB_PARKING_SDK.client.configUpdateDoc(id, {
        ...data,
      })
      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Update document type error :', error)
    }
  }

  public async deleteStoreDocumentType(id: string): Promise<boolean | void> {
    try {
      await OB_PARKING_SDK.client.configDeleteDoc(id)
      return true
    } catch (error) {
      console.log('Delete document type error :', error)
    }
  }
}

export const documentTypeService = new DocumentTypeService()
