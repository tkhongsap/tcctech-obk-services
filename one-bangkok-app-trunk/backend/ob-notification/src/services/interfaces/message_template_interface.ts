export interface MessageTemplateData {
  name: string;
  title: string;
  subTitle?: string;
  personalized?: string;
  messageTypeId: string;
  thumbnail?: string;
  deeplink?: string;
  data: JSON[];
}
