import FcmMessagesService from '../services/fcm_messages_service';

export interface SendMessageData {
  body: string;
  title: string;
  token: string;
}

const currentProvider = 'fcm' as const;

const NOTIFICATION_PROVIDER = {
  fcm: new FcmMessagesService(),
};

export async function sendMessage(data: SendMessageData) {
  NOTIFICATION_PROVIDER[currentProvider].sendMessage(data);
}
