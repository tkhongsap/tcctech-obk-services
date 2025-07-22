/* eslint-disable */
import { DataTableStateEvent } from 'primereact/datatable'
import {
  IFilterWhatHappening,
  IGetWhatHappening,
  UpsertWhatHappening,
  WhathappeningShowQuery,
  WhatheppeningResult,
} from './model'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import {
  CreateDocumentBody,
  UpdateCategoryBodyActive,
  UpdateDocumentBody,
} from 'ob-document-sdk/dist/api'
import * as OBNOTISDK from 'ob-notification-sdk'
import { v4 as uuidv4 } from 'uuid'
import { KeyValue } from '@src/types/key-value'
import _ from 'lodash'
import { s3Uploader } from '@src/utils/s3-upload'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import https from 'https'
import { getCookie } from 'cookies-next'
import { USER_NAME } from '@src/authProvider/constants'

class WhatHappeningService {
  _obDocumentInstance: AxiosInstance

  constructor() {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_BASE_URL ?? '')
    OB_DOCUMENT_SDK.setBaseUrl(process.env.OB_DOCUMENT_SDK_BASE_URL ?? '')

    this._obDocumentInstance = axios.create({
      baseURL: process.env.OB_DOCUMENT_API_BASE_URL,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
  }

  async getAll(
    filter: IFilterWhatHappening,
    pagination?: DataTableStateEvent
  ): Promise<{
    data: IGetWhatHappening[]
    totalRecords: number
    pageSize: number
    totalPage: number
  }> {
    let startDate: string | undefined
    if (filter.date && filter.date[0]) {
      startDate = filter.date[0].toDateString()
    }
    let endDate: string | undefined
    if (filter.date && filter.date[1]) {
      endDate = filter.date[1].toDateString()
    }
    const params: WhathappeningShowQuery = {
      startDateFrom: startDate,
      endDateTo: endDate,
      isCurrentDisplay: false,
      limit: pagination?.rows,
      page: pagination?.page,
      order: pagination?.sortOrder === -1 ? 'desc' : 'asc',
      filter: filter.filter,
      location: filter.location,
      sort: pagination?.sortField,
    }
    const result = await this._obDocumentInstance.get('/whathappening', {
      params: { ...params },
    })
    return {
      totalRecords: result.data.pagination?.total ?? 0,
      pageSize: result.data.pagination?.page_size ?? 0,
      totalPage: result.data.pagination?.total_page ?? 0,
      data: result.data.data as any,
    }
  }

  async getById(id: string) {
    // const data = await OB_DOCUMENT_SDK.client.documentsIndex('*', id)
    const result = await this._obDocumentInstance.get<
      AxiosResponse<WhatheppeningResult>
    >('/whathappening/' + id)
    if (!result.data.data) {
      throw 'No data.'
    }
    return result.data.data
  }

  async getCurrentDisplay(): Promise<IGetWhatHappening[]> {
    const result = await this._obDocumentInstance.get(
      '/whathappening/current/display'
    )
    return result.data.data as any
  }

  async toggleCurrentDiplay(id: string) {
    const result = await this._obDocumentInstance.post<
      AxiosResponse<WhatheppeningResult>
    >('/whathappening/toggleCurrentDisplay/' + id)
    return result.data.data
  }

  async reorderCurrentDisplay(id: string, seq: number) {
    const result = await this._obDocumentInstance.post<
      AxiosResponse<WhatheppeningResult>
    >('/whathappening/reorderCurrentDisplay/' + id, { seq: seq })

    // const result = await OB_DOCUMENT_SDK.client.documentsReorderCurrentDisplay(
    //   id,
    //   { seq: seq }
    // )

    return result
  }

  async getCategoryWhatHappening() {
    const type = await this.fetchType()
    const categories = await OB_DOCUMENT_SDK.client
      .categoryCmsShow('*', undefined, type[0].id)
      .catch((err) => {
        console.log('Fetch type error', err)
      })
    return categories?.data?.data as unknown as any[]
  }

  async getTags() {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
    return OBNOTISDK.client.tagsIndex().then((res) => {
      const tagList = (res.data?.data as any)?.map((tag: any) => ({
        name: tag.name,
        value: tag.id,
      }))
      return tagList as KeyValue
    })
  }

  async fetchType() {
    const result = await OB_DOCUMENT_SDK.client.typeShow('whathappening')
    console.log('type is ', result)
    return result?.data?.data as unknown as any[]
  }

  async upsertDocument(
    categoryId: string,
    id: string | undefined,
    bodyPayload: UpsertWhatHappening,
    published: boolean
  ) {
    const processBase64Image = async (base64Image: string) => {
      if (!base64Image.startsWith('data:')) return base64Image

      const [meta, base64] = base64Image.split(';base64,')
      const contentType = meta.replace('data:', '')
      const fileName = `${uuidv4().replace(/-/g, '')}.${
        contentType.split('/')[1]
      }`

      const uploadResponse = await s3Uploader(base64, fileName)
      return uploadResponse.imageUrl
    }

    if (bodyPayload.thumbnailImage) {
      bodyPayload.thumbnailImage = await processBase64Image(
        bodyPayload.thumbnailImage
      )
    }
    if (bodyPayload.headImage) {
      bodyPayload.headImage = await processBase64Image(bodyPayload.headImage)
    }

    const updateBy = getCookie(USER_NAME)

    if (!id) {
      const createBody: CreateDocumentBody = {
        slug: '',
        category_id: categoryId,
        title: {},
        body: bodyPayload,
        published: published,
        release_date: published
          ? bodyPayload.publishDate?.toISOString()
          : undefined,
        active: true,
        updated_by: updateBy,
      }
      return this._obDocumentInstance.post<AxiosResponse<WhatheppeningResult>>(
        '/whathappening',
        createBody,
        { headers: { 'x-account-id': updateBy } }
      )
    } else {
      // adhoc for demo
      const setActive: UpdateCategoryBodyActive = {
        set: true,
      }
      const updateBody: UpdateDocumentBody = {
        category_id: categoryId,
        title: {},
        body: bodyPayload,
        published: { set: published },
        release_date: {
          set: bodyPayload.publishDate?.toISOString(),
        },
        active: { set: published },
      }

      return this._obDocumentInstance.put<AxiosResponse<WhatheppeningResult>>(
        '/whathappening/' + id,
        updateBody,
        { headers: { 'x-account-id': updateBy } }
      )
    }
  }

  async delete(id: string) {
    return this._obDocumentInstance.delete('/whathappening/' + id)
  }

  async deleteDraft(id: string) {
    return this._obDocumentInstance.delete('/whathappening/deleteDraft/' + id)
  }
}

export const whatHappeningService = new WhatHappeningService()
