import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import {
  IAccessLocalInformationList,
  ICategory,
  ICategoryCmsResponse,
} from '@src/types/document'
import dayjs from 'dayjs'
import { AxiosResponse } from 'axios'
import { WrappedResponseCategoryResult } from 'ob-document-sdk/dist/api'

class AccessLocalInformationService {
  async getInformations(startIndex: number, endIndex: number) {
    try {
      const type = await OB_DOCUMENT_SDK.client.typeShow(
        'accesslocalinformation'
      )
      if (!type) {
        await OB_DOCUMENT_SDK.client.typeCreate({
          name: 'accesslocalinformation',
        })
      }
      const typeLocalInformation = type?.data?.data as any
      const typeId: string = typeLocalInformation && typeLocalInformation[0].id
      const categoryAccessInformation =
        await OB_DOCUMENT_SDK.client.categoryCmsShow('*', undefined, typeId)
      if (!categoryAccessInformation.data.data) {
        return { data: [], total: 0 }
      } else {
        const serializeData = await this.serializeAccessInformation(
          categoryAccessInformation?.data?.data as ICategory[]
        )
        const dataLength = serializeData.length
        const firstIndex = startIndex
        const lastIndex = startIndex + endIndex
        const paginationData = serializeData.slice(firstIndex, lastIndex)

        return { data: paginationData, total: dataLength }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id: string) {
    try {
      const informationId: AxiosResponse<WrappedResponseCategoryResult> =
        await OB_DOCUMENT_SDK.client.categoryCmsShow('*', id as string)
      console.log(informationId)
      if (informationId.data.data) {
        return this.serializeAccessInformationsId(
          informationId.data.data as ICategoryCmsResponse[]
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  async serializeAccessInformation(data: ICategory[]) {
    return data.map((item: any) => {
      const jsonTitle = JSON.parse(item.title)
      const title = jsonTitle.en
      return {
        id: item.id,
        category: title,
        updatedAt: dayjs(item.updated_at as string)
          .format('YYYY-MM-DD HH:mm')
          .toString(),
        updated_by_name: item.updated_by_name,
      } as IAccessLocalInformationList
    })
  }

  async serializeAccessInformationsId(data: ICategoryCmsResponse[]) {
    return {
      ...data[0],
    }
  }
}

export const accessLocalInformationService = new AccessLocalInformationService()
