import React from 'react'
import withGenericServer from '@hocs/server/generic'
import * as OBNOTISDK from 'ob-notification-sdk'
import { KeyValue } from '@src/types/key-value'
import { CampaignData } from 'ob-notification-sdk/dist/api'
import NotificationUpsert from '@components/notifications/inapp/notification-upsert'
import { MappingCampaignToUIModel } from '@components/notifications/inapp/inapp-notification'

type Props = {
  data: CampaignData
  categories: KeyValue[]
  tags: KeyValue[]
}

export default function NotificationFromDuplicate(props: Props) {
  const { data, categories, tags } = props
  const formData = new MappingCampaignToUIModel(data)

  return (
    <NotificationUpsert
      formData={formData}
      categories={categories}
      tags={tags}
      isAnnouncement={false}
    />
  )
}

NotificationFromDuplicate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
    const { id } = ctx.props.query
    const dataPromise = OBNOTISDK.client
      .campaignsShow(id)
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

    const res = await Promise.all([dataPromise, tagsPromise, categoriesPromise])
    const data = res[0]
    const tags = res[1]
    const categories = res[2]

    ctx.props = { ...ctx.props, data, categories, tags }
    return ctx
  },
  {
    redirectPath: '/notifications/inapp',
  }
)
