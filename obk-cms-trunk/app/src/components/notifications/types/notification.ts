import {
  ContentType,
  PushNotificationData,
  TranslateableContentData,
} from 'ob-notification-sdk/dist/api'

export type NotificationMessageBlock =
  | NotificationMessageTextBlock
  | NotificationMessageHyperlinkBlock
  | NotificationMessageImageBlock

export type NotificationMessageTextBlock = {
  type: undefined | 'text'
  data: {
    en: string
    th?: string
    zh?: string
  }
}

export type NotificationMessageHyperlinkBlock = {
  type: 'hyperlink'
  data: {
    message: {
      en: string
      th: string
      zh: string
    }
    url: string
  }
}

export type NotificationMessageImageBlock = {
  type: 'image'
  data: string[]
}

export interface IScheduleStep {
  id?: string
  message_category_id?: string
  scheduled_at?: Date
}

export interface ITemplateStep {
  id?: string
  name?: string
  message_category_id?: string
}

export interface IMessageStep {
  thumbnail: string | null
  title: TranslateableContentData
  sub_title?: TranslateableContentData
  data?: Array<ContentType> | null
  tags?: string[]
  deeplink_with_account_id?: boolean
}

export interface IButtonStep {
  isEnableButton: boolean
  deeplink_display_name?: TranslateableContentData
  deeplink: string | null
}

export interface IEnablePushNotification {
  isEnablePushNoti: boolean
  push_notification_data?: PushNotificationData
}

export interface ITargetGroup {
  target_groups?: { name: string; id: string }[]
  targetGroupDetails?: {
    name: string
    account_id_group: string[]
    detail?: object
    targetGroupByUserType?: targetGroupByUserType[]
  }
}
export interface targetGroupByUserType {
  userType: string | undefined
  tower: string | undefined
  floor: { name: string; value: string | undefined }[]
  floorOptions: { name: string; value: string }[]
  towerOptions: { name: string; value: string }[]
}
