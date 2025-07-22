import { isEmpty } from 'lodash';
import { SendMessageData, SentMessageMultiCastData } from '../utils/notification_adapter';
import { NotificationProviderInterface } from './interfaces/notification_provider_interface';
import admin from 'firebase-admin';
import logging from '../libs/logging';
import { TOKEN_CHUNK_SIZE } from '../consts/fcm_message';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
const fcmClient = admin.initializeApp(
  {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  },
  'OneBangkok',
);

export default class FcmMessagesService implements NotificationProviderInterface {
  sendMessage(data: SendMessageData): void {
    const { title, body, token, id, badgeCount } = data;
    const message = {
      notification: { title, body },
      token,
      apns: {
        payload: {
          aps: {
            badge: badgeCount,
            sound: 'default',
          },
        },
      },
      data: { id, badge: `${badgeCount}` },
      android: {
        notification: {
          channelId: 'onebangkok',
          notificationCount: badgeCount,
          sound: 'default',
        },
      },
    };
    if (!isEmpty(token)) {
      fcmClient
        .messaging()
        .send(message)
        .then((response) => {
          logging.info('Successfully sent message:', response);
        })
        .catch((error) => {
          logging.info('Error sending message:', error);
        });
    } else {
      logging.error('FCM token not found');
    }
  }

  async sentMessageMultiCast(data: SentMessageMultiCastData): Promise<void> {
    const { title, body, recipientData, id } = data;
    const convertMessageChunkArray = (array: Message[], size: number): Message[][] => {
      return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
    };
    const message = {
      notification: {
        title,
        body,
      },
    };

    logging.info('Prepared message for multicast:', message);
    const formattedMessage = recipientData.map((recipient) => {
      const badgeCount = recipient.unreadMessageCount;
      return {
        ...message,
        token: recipient.fcmToken,
        apns: {
          payload: {
            aps: {
              badge: badgeCount,
              sound: 'default',
            },
          },
        },
        data: { id, badge: `${badgeCount}` },
        android: {
          notification: {
            channelId: 'onebangkok',
            notificationCount: badgeCount,
            sound: 'default',
          },
        },
      };
    });
    const chunkedMessages = convertMessageChunkArray(formattedMessage, TOKEN_CHUNK_SIZE);
    if (!isEmpty(recipientData) && !isEmpty(id)) {
      try {
        await Promise.all(
          chunkedMessages.map(async (chunk) => {
            const response = await fcmClient.messaging().sendEach(chunk);
            logging.info('Successfully sent messages:', response);
            logging.info(`${response.successCount} messages were sent successfully`);

            if (response.failureCount > 0) {
              response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  logging.info(`Error sending message to ${chunk[idx]}:`, resp.error);
                }
              });
            }
          }),
        );
      } catch (error) {
        logging.info('Error sending multicast message:', error);
      }
    } else {
      logging.info('FCM tokens or message ID not found');
    }
  }
}
