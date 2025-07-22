import {
  CampaignData,
  CampaignsCreateRequestBody,
  ContentType,
  PartialOmitMessageTemplateDataIdOrCreatedAtOrUpdatedAt,
  PushNotificationData,
  TranslateableContentData,
  WrappedResponseMessageTemplateDataData,
} from 'ob-notification-sdk/dist/api'
import {
  IScheduleStep,
  IMessageStep,
  IButtonStep,
  IEnablePushNotification,
  ITargetGroup,
} from '../types/notification'
import { isEmpty } from 'lodash'

export class FilterNotification implements IFilterNotification {
  filter?: string
  status?: string
  category?: string
  tag?: string

  constructor(data?: IFilterNotification) {
    this.filter = data?.filter ?? ''
    this.status = data?.status ?? ''
    this.category = data?.category ?? ''
    this.tag = data?.tag ?? ''
  }
}

export interface IFilterNotification {
  filter?: string
  status?: string
  category?: string
  tag?: string
}

export type CampaignUIModel = IScheduleStep &
  IMessageStep &
  IButtonStep &
  IEnablePushNotification &
  ITargetGroup

/**
 * Map campaign data from template to UI model
 */
export class MappingCampaignToUIModel implements CampaignUIModel {
  message_category_id?: string | undefined
  scheduled_at?: Date
  thumbnail: string | null
  title: TranslateableContentData
  sub_title?: TranslateableContentData | undefined
  data?: ContentType[] | null | undefined
  tags?: string[] | undefined
  isEnableButton: boolean
  deeplink: string | null
  deeplink_display_name?: TranslateableContentData | undefined
  isEnablePushNoti: boolean
  push_notification_data?: PushNotificationData | undefined
  target_groups?: { name: string; id: string }[]
  targetGroupDetails?: { name: string; account_id_group: string[] } | undefined
  constructor(data?: CampaignData) {
    this.message_category_id = data?.message_template?.message_category_id
    this.scheduled_at = data?.scheduled_at
      ? new Date(data?.scheduled_at)
      : undefined
    this.thumbnail = data?.message_template?.thumbnail ?? null
    this.title = data?.message_template?.title ?? { en: '' }
    this.sub_title = data?.message_template?.sub_title
    this.data = data?.message_template?.data ?? []
    this.tags = data?.tags.map((x) => x.name) ?? []
    this.deeplink = data?.message_template?.deeplink ?? null
    this.deeplink_display_name = data?.message_template?.deeplink_display_name
    this.push_notification_data =
      data?.push_notification_data as PushNotificationData
    this.isEnableButton = !!data?.message_template?.deeplink
    this.isEnablePushNoti = !!this.push_notification_data?.title?.en
    this.target_groups = (data?.target_groups as any) || []
    // @ts-ignore
    this.targetGroupDetails = data?.targetGroupDetails
  }
}

/**
 * Map data from template to UI model
 */
export class MappingMessageTemplateToCampaignsUIModel
  implements CampaignUIModel
{
  id?: string | undefined
  message_category_id?: string | undefined
  scheduled_at?: Date
  thumbnail: string | null
  title: TranslateableContentData
  sub_title?: TranslateableContentData | undefined
  data?: ContentType[] | null | undefined
  tags?: string[] | undefined
  deeplink: string | null
  deeplink_display_name?: TranslateableContentData | undefined
  isEnablePushNoti: boolean
  push_notification_data?: PushNotificationData | undefined
  isEnableButton: boolean

  constructor(data?: WrappedResponseMessageTemplateDataData) {
    this.message_category_id = data?.message_category_id
    this.thumbnail = data?.thumbnail ?? null
    this.title = data?.title ?? {
      en: '',
    }
    this.sub_title = data?.sub_title
    this.data = data?.data ?? []
    // TODO map tags from template
    this.tags = []
    this.deeplink = data?.deeplink ?? null
    this.deeplink_display_name = data?.deeplink_display_name
    this.isEnablePushNoti = false
    this.isEnableButton = !!data?.deeplink
  }
}

/**
 * Map data from UI model to campaigns
 */
export class MappingCampaignUIToCampaigns
  implements CampaignsCreateRequestBody
{
  name?: string
  scheduled_at?: string
  push_notification_data?: PushNotificationData
  message_template?: PartialOmitMessageTemplateDataIdOrCreatedAtOrUpdatedAt
  message_category_id?: string
  target_group_id?: string
  tags?: Array<string>
  targetGroupDetails?: { name: string; account_id_group: string[] } | undefined
  updated_by?: string
  updated_by_name?: string

  constructor(data?: CampaignUIModel) {
    this.name = data?.title.en
    this.scheduled_at = data?.scheduled_at?.toISOString()
    this.push_notification_data = data?.isEnablePushNoti
      ? data?.push_notification_data
      : undefined

    if (!data?.isEnablePushNoti) {
      this.push_notification_data = undefined
    }
    this.tags = data?.tags
    this.message_template = {
      data: data?.data,
      name: data?.title.en,
      title: data?.title,
      sub_title: data?.sub_title,
      personalized: true,
      thumbnail: data?.thumbnail,
      deeplink: data?.isEnableButton ? data?.deeplink : undefined,
      deeplink_display_name: data?.deeplink_display_name?.en
        ? data?.deeplink_display_name
        : undefined,
      adhoc: true,
      deeplink_with_account_id: data?.deeplink_with_account_id ?? false,
    }
    if (!data?.isEnableButton) {
      this.message_template.deeplink_display_name = undefined
      this.message_template.deeplink = undefined
    }
    // @ts-ignore
    this.target_group_id = data?.target_groups?.[0]?.id || data?.target_groups
    this.message_category_id = data?.message_category_id

    if (isEmpty(data?.target_groups)) {
      this.targetGroupDetails = data?.targetGroupDetails
    }
  }
}
