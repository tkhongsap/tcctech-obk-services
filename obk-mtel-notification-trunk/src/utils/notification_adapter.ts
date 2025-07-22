import FcmMessagesService from '../services/fcm_messages_service';
export interface SendMessageData {
  body: string;
  title: string;
  token: string;
  id: string;
  badgeCount: number;
}

type RecipientData = {
  fcmToken: string;
  recipientId: string;
  unreadMessageCount: number;
};
export interface SentMessageMultiCastData {
  title: string;
  body: string;
  recipientData: RecipientData[];
  id: string;
}

const currentProvider = 'fcm' as const;

const NOTIFICATION_PROVIDER = {
  fcm: new FcmMessagesService(),
};

export async function sendMessage(data: SendMessageData): Promise<void> {
  NOTIFICATION_PROVIDER[currentProvider].sendMessage(data);
}
