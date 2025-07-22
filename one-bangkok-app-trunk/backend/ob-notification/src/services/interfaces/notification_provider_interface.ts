import { SendMessageData } from '../../utils/notification_adapter';

export interface NotificationProviderInterface {
  sendMessage(data: SendMessageData): void;
}
