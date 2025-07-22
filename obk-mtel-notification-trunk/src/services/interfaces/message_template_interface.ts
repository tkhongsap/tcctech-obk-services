interface DataInMessageTemplate {
  message_data_template_id: string;
  data?: object;
}
export interface MessageTemplateData {
  name: string;
  title: object;
  subTitle?: object;
  personalized?: string;
  messageTypeId: string;
  thumbnail?: string;
  deeplink?: string;
  data: DataInMessageTemplate[];
}
