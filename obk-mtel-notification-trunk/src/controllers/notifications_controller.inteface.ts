import { EventName } from '../utils/kafka';

export interface NotificationSendBody {
  account_id: string;
  message_template_id: string;
  email_template_name?: EventName;
  value_message: object;
}

export interface NotificationBooleanResponse {
  result: boolean;
}
