import React from 'react'
import withGenericServer from '@hocs/server/generic'
import * as OBNOTISDK from 'ob-notification-sdk'
import { KeyValue } from '@src/types/key-value'
import { WrappedResponseMessageTemplateDataData } from 'ob-notification-sdk/dist/api'
import NotificationUpsert from '@components/notifications/inapp/notification-upsert'
import { MappingMessageTemplateToCampaignsUIModel } from '@components/notifications/inapp/inapp-notification'
import * as OBBMSSDK from 'ob-bms-sdk'

type floorValue = {
  name: string
  value: string
  towerId: string
}[]

type Props = {
  templateData: WrappedResponseMessageTemplateDataData
  categories: KeyValue[]
  tags: KeyValue[]
  targetGroups?: KeyValue[]
  towers?: KeyValue[]
  floors?: floorValue
}

export default function NotificationFromCreate(props: Props) {
  const { templateData, categories, tags, targetGroups, towers, floors } = props
  const formData = new MappingMessageTemplateToCampaignsUIModel(templateData)

  return (
    <NotificationUpsert
      formData={formData}
      categories={categories}
      tags={tags}
      isAnnouncement={false}
      targetGroups={targetGroups}
      towers={towers}
      floors={floors}
    />
  )
}

NotificationFromCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
    const { id } = ctx.props.query
    const dataPromise = OBNOTISDK.client
      .messageTemplatesShow(id)
      .then((res) => res.data.data)

    const tagsPromise = OBNOTISDK.client.tagsIndex().then((res) => {
      const tagList = (res.data?.data as any)?.map((tag: any) => ({
        name: tag.name,
        value: tag.id,
      }))
      return tagList as KeyValue
    })

    const categoriesPromise = OBNOTISDK.client
      .messageCategoriesIndex()
      .then((res) => {
        const categoryList = (res.data?.data as any)
          ?.filter((category: any) => category.visible)
          .map((category: any) => ({
            name: category.name,
            value: category.id,
          }))
        return categoryList as KeyValue
      })

    const targetGroupsResult = OBNOTISDK.client
      .targetGroupsIndex()
      .then((res) => {
        const targetGroups = (res.data?.data as any)?.map((target: any) => ({
          name: target.name,
          value: target.id,
        }))
        return targetGroups as KeyValue
      })

    const towersResult = OBBMSSDK.client.towersIndex().then((res) => {
      const towers = (res.data?.data as any)?.map((tower: any) => ({
        name: tower.name,
        value: tower.id,
      }))
      return towers as KeyValue
    })

    const floorsResult = OBBMSSDK.client.floorsIndex().then((res) => {
      const floors = (res.data?.data as any)?.map((floor: any) => ({
        name: floor.name,
        value: floor.id,
        towerId: floor.tower_id,
      }))
      return floors as floorValue
    })

    const res = await Promise.all([
      dataPromise,
      tagsPromise,
      categoriesPromise,
      targetGroupsResult,
      towersResult,
      floorsResult,
    ])
    const templateData = res[0]
    const tags = res[1]
    const categories = res[2]
    const targetGroups = res[3]
    const towers = res[4]
    const floors = res[5]

    ctx.props = {
      ...ctx.props,
      templateData,
      categories,
      tags,
      targetGroups,
      towers,
      floors,
    }
    return ctx
  },
  {
    redirectPath: '/notifications/inapp',
  }
)
