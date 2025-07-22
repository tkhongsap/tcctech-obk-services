import admin from 'firebase-admin';
import serviceAccount from '../configs/one-bangkok-alpha-firebase-adminsdk-y1xa1-c9f445cc37.json';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export function sendNotificationToFCM(
  deviceToken: string,
  message: { title: string; body: string },
) {
  // Code to send the notification using the Firebase Admin SDK
  return admin.messaging().send({
    token: deviceToken,
    notification: {
      title: message.title,
      body: message.body,
    },
  });
}

export function sendBatchOfNotifications(messages: MulticastMessage) {
  return admin.messaging().sendEachForMulticast({
    ...messages,
  });
}

module.exports = {
  sendNotificationToFCM,
};
