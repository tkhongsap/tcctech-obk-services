import { SendMessageData } from '../utils/notification_adapter';
import { NotificationProviderInterface } from './interfaces/notification_provider_interface';

export default class FcmMessagesService
  implements NotificationProviderInterface
{
  sendMessage(data: SendMessageData): void {
    console.log(data);
  }
}
