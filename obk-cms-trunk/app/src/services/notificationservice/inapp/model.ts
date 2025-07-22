import {
  CampaignsCreateRequestBody,
  PartialOmitMessageTemplateDataIdOrCreatedAtOrUpdatedAt,
  PushNotificationData,
  CampaignData as CampaignDataAPI,
} from 'ob-notification-sdk/dist/api'

export interface INotification {
  id: number
  title: string
  category: string
  lastupdate: Date
  updateby: string
  updated_at: Date
  status: string
}

export interface PrismaJsonValue {}
export interface InputJsonValue {}

export declare const EnumsCampaignStatus: {
  readonly Draft: 'DRAFT'
  readonly WatingForApproval: 'WATING_FOR_APPROVAL'
  readonly ApprovedScheduled: 'APPROVED_SCHEDULED'
  readonly ApprovedSent: 'APPROVED_SENT'
  readonly Rejected: 'REJECTED'
}

export interface TranslateableContentData {
  en: string
  th?: string
  zh?: string
}
export declare const ContentTypeTypeEnum: {
  readonly Text: 'text'
}

export interface ContentType {
  data: TranslateableContentData
  type: typeof ContentTypeTypeEnum
  set: Array<InputJsonValue>
}

export interface MessageCategoryData {
  id: string
  name: string
  icon_id: string
  sequence: number
  created_at: string
  updated_at: string
}

export interface MessageTemplateData {
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
  data: Array<ContentType> | null
  created_at?: string
  updated_at?: string
  message_category?: MessageCategoryData | null
  campaign_target_groups: Array<TargetGroupData> | null
}

export interface TargetGroupData {
  name: string
  id: string
  created_at: string
  updated_at: string
}

export interface TagData {
  name: string
  id: string
}

export interface CampaignData {
  data: {
    id: string
    name: string | null
    message_template_id: string | null
    push_notification_data: PrismaJsonValue | null
    updated_by: string | null
    submitted_by: string | null
    status: typeof EnumsCampaignStatus
    scheduled_at?: string
    created_at: string
    updated_at: string
    message_template: MessageTemplateData | null
    target_groups: Array<TargetGroupData>
    tags: Array<TagData>
  }
}

export interface IContentUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IContentUploadResponse {
  message: string
  filename: string
  imageUrl: string
}

export interface ICampaignRequest {
  id?: string
  name?: string
  message_category_id?: string
  scheduled_at?: string
  message_template_id?: string | null
  push_notification_data?: PrismaJsonValue
  updated_by?: string
  submitted_by?: string
  status?: string
  created_at?: string
  updated_at?: string
  message_template?: MessageTemplateData | null
  target_groups?: TargetGroupData[]
  tags: string[]
  enablePushObj?: string
}

export class CampaignRequestModel implements CampaignsCreateRequestBody {
  id?: string | undefined
  name?: string | undefined
  message_category_id?: string
  scheduled_at?: string
  // get scheduled_at(): string | undefined
  // {return this.scheduled_at_date?.toISOString()}
  //scheduled_at_date?: Date | undefined
  message_template_id?: string | null
  push_notification_data?: PushNotificationData
  updated_by?: string
  submitted_by?: string
  status?: string
  created_at?: string
  updated_at?: string
  message_template?: PartialOmitMessageTemplateDataIdOrCreatedAtOrUpdatedAt
  target_group_id?: string
  target_groups?: TargetGroupData[]
  tags: string[]
  enablePushObj?: string

  constructor(data?: CampaignDataAPI) {
    this.id = data?.id
    this.name = data?.name ?? undefined
    this.message_template_id = data?.message_template_id
    // this.message_category_id = data?.message_category_id
    this.scheduled_at = new Date(data?.scheduled_at ?? '') as any
    //this.scheduled_at_date = new Date(data?.scheduled_at??'')//
    //this.message_template_id = data?.message_template?.message_template_id
    this.push_notification_data =
      data?.push_notification_data as PushNotificationData
    this.updated_by = data?.updated_by ?? undefined
    this.submitted_by = data?.submitted_by ?? undefined
    this.status = data?.status
    this.created_at = data?.created_at
    this.updated_at = data?.updated_at
    this.message_template =
      data?.message_template as PartialOmitMessageTemplateDataIdOrCreatedAtOrUpdatedAt
    // this.target_group_id = data?.target_group_id
    this.tags = data?.tags.map((x) => x.name) ?? []
    this.enablePushObj = ''
  }
}
