import React from 'react'
import withGenericServer from '@hocs/server/generic'
import * as OBNOTISDK from 'ob-notification-sdk'
import { KeyValue } from '@src/types/key-value'
import { CampaignData } from 'ob-notification-sdk/dist/api'
import * as OBBMSSDK from 'ob-bms-sdk'
import { MappingCampaignToUIModel } from '@components/notifications/inapp/inapp-notification'
import NotificationUpsert from '@components/notifications/inapp/notification-upsert'
import Papa from 'papaparse'
import { TargetGroupData } from 'ob-notification-sdk/api/api'

type Props = {
  id: string
  categories: KeyValue[]
  tags: KeyValue[]
  data: CampaignData
  targetGroups?: KeyValue[]
  towers?: KeyValue[]
  floors?: {
    name: string
    value: string
    towerId: string
  }[]
}

type floorValue = {
  name: string
  value: string
  towerId: string
}[]

type TargetGrops = {
  tower: { name: string; value: string }
  floors: { name: string; value: string; towerId: string }[]
}

export default function NotificationEdit(props: Props) {
  const { id, categories, tags, data, targetGroups, towers, floors } = props
  const formData = new MappingCampaignToUIModel(data)

  return (
    <NotificationUpsert
      id={id}
      formData={formData}
      categories={categories}
      tags={tags}
      targetGroups={targetGroups}
      isAnnouncement={false}
      towers={towers}
      floors={floors}
    />
  )
}

NotificationEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')

    const { id } = ctx.props.query
    const campaignData = await OBNOTISDK.client.campaignsShow(id)
    const data = campaignData.data.data

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
      return towers as KeyValue[]
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
      tagsPromise,
      categoriesPromise,
      targetGroupsResult,
      towersResult,
      floorsResult,
    ])
    const tags = res[0]
    const categories = res[1]
    const targetGroups = res[2]
    const towers = res[3]
    const floors = res[4]
    const targetGroup = (data.target_groups as TargetGroupData[])?.[0]
    const isAllTarget = targetGroup.name === 'all'
    // @ts-ignore
    const isCsvData = targetGroup?.account_id_group?.length > 0

    let formattedData
    if (isCsvData) {
      // @ts-ignore
      const csvFile = Papa.unparse(targetGroup.account_id_group, {
        header: true,
        skipEmptyLines: true,
      })
      formattedData = {
        ...data,
        targetGroupDetails: {
          // @ts-ignore
          account_id_group: targetGroup.account_id_group.map(
            (account: { account_id: string }) => account.account_id
          ),
          name: targetGroup.name,
          detail: csvFile,
        },
      }
    } else if (!isAllTarget && !isCsvData) {
      const targetGroupValues = data.target_groups as any[]
      const parsedTargetGroups: TargetGrops[] =
        targetGroupValues.length > 0
          ? JSON.parse((targetGroupValues[0] as any)?.name ?? '{}')
          : []
      const formattedTargetGroups = parsedTargetGroups.map((targetGroup) => {
        const tower = targetGroup.tower
        const matchedFloorTower = floors.filter(
          (floor) => floor.towerId === tower.value
        )

        return {
          userType: 'custom',
          tower: targetGroup.tower.value,
          floor: [...targetGroup.floors],
          floorOptions: matchedFloorTower,
          towerOptions: [
            {
              name: tower.name,
              value: tower.value,
            },
          ],
        }
      })

      formattedData = {
        ...data,
        targetGroupDetails: {
          targetGroupByUserType: [...formattedTargetGroups],
        },
      }
    }

    ctx.props = {
      ...ctx.props,
      id,
      categories,
      tags,
      data: isAllTarget ? data : formattedData,
      targetGroups,
      floors,
      towers,
    }
    return ctx
  },
  {
    redirectPath: '/notifications/inapp',
  }
)
