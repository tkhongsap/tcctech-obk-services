import {
  ITemplateStep,
  IMessageStep,
  IButtonStep,
  IEnablePushNotification,
} from '@components/notifications/types/notification'
import {
  MessageTemplateCreateRequestBody,
  TranslateableContentData,
  ContentType,
  MessageCategoryData,
  TargetGroupData,
  PushNotificationData,
  WrappedResponseMessageTemplateDataData,
  CampaignData,
} from 'ob-notification-sdk/dist/api'
import { v4 as uuidv4 } from 'uuid'

/**
 * UI model
 */
export type MessageTemplateModel = ITemplateStep &
  IMessageStep &
  IButtonStep &
  IEnablePushNotification

/**
 * Map data from template to UI model
 */
export class MappingMessageTemplateToTemplateUIModel
  implements MessageTemplateModel
{
  id?: string | undefined
  name?: string | undefined
  message_category_id?: string | undefined
  scheduled_at?: string | undefined
  thumbnail: string | null
  title: TranslateableContentData
  sub_title?: TranslateableContentData | undefined
  data?: ContentType[] | null | undefined
  deeplink: string | null
  isEnablePushNoti: boolean
  push_notification_data?: PushNotificationData | undefined
  isEnableButton: boolean
  deeplink_display_name?: TranslateableContentData
  deeplink_with_account_id?: boolean
  constructor(data?: WrappedResponseMessageTemplateDataData) {
    this.id = data?.id
    this.name = data?.name ?? ''
    this.message_category_id = data?.message_category_id
    this.thumbnail = data?.thumbnail ?? null
    this.title = data?.title ?? {
      en: '',
    }
    this.sub_title = data?.sub_title
    this.data = data?.data
    this.deeplink = data?.deeplink ?? ''
    this.deeplink_display_name = data?.deeplink_display_name ?? {
      en: '',
      th: '',
      zh: '',
    }
    this.isEnablePushNoti = false
    this.isEnableButton = !!data?.deeplink
    this.deeplink_with_account_id = data?.deeplink_with_account_id ?? false
  }
}

/**
 * Map data from campaign to UI model
 */
export class MappingCampaignToTemplateUIModel implements MessageTemplateModel {
  id?: string | undefined
  name?: string | undefined
  message_category_id?: string | undefined
  scheduled_at?: string | undefined
  thumbnail: string | null
  title: TranslateableContentData
  sub_title?: TranslateableContentData | undefined
  data?: ContentType[] | null | undefined
  deeplink: string | null
  isEnablePushNoti: boolean
  push_notification_data?: PushNotificationData | undefined
  isEnableButton: boolean
  deeplink_display_name?: TranslateableContentData

  constructor(data?: CampaignData) {
    this.id = uuidv4()
    this.name = ''
    this.message_category_id = data?.message_template?.message_category_id
    this.thumbnail = data?.message_template?.thumbnail ?? null
    this.title = data?.message_template?.title ?? {
      en: '',
    }
    this.sub_title = data?.message_template?.sub_title
    this.data = data?.message_template?.data
    this.deeplink = data?.message_template?.deeplink ?? ''
    this.deeplink_display_name = data?.message_template
      ?.deeplink_display_name ?? {
      en: '',
    }
    this.isEnablePushNoti = false
    this.isEnableButton = !!data?.message_template?.deeplink
  }
}

/**
 * Map data from UI model to campaigns
 */
export class MappingTemplateUIModelToMessageTemplate
  implements MessageTemplateCreateRequestBody
{
  id: string
  name: string
  personalized: boolean | null
  message_category_id: string
  notification_group_id: string | null
  thumbnail: string | null
  deeplink: string | null
  adhoc: boolean
  title: TranslateableContentData
  sub_title?: TranslateableContentData
  data?: Array<ContentType> | null
  created_at?: string
  updated_at?: string
  message_category?: MessageCategoryData | null
  campaign_target_groups?: Array<TargetGroupData> | null
  deeplink_display_name?: TranslateableContentData
  deeplink_with_account_id: boolean
  constructor(data?: MessageTemplateModel) {
    this.id = data?.id ?? uuidv4()
    this.name = data?.name ?? ''
    this.personalized = true
    this.message_category_id = data?.message_category_id ?? ''
    this.notification_group_id = null
    this.thumbnail = data?.thumbnail ?? null
    this.deeplink = data?.deeplink ?? null
    this.deeplink_display_name = data?.deeplink_display_name?.en
      ? data?.deeplink_display_name
      : undefined
    this.adhoc = true
    this.title = data?.title ?? { en: '' }
    this.sub_title = data?.sub_title
    this.data = data?.data
    this.created_at = new Date().toISOString()
    this.updated_at = new Date().toISOString()
    this.deeplink_with_account_id = data?.deeplink_with_account_id ?? false
  }
}
