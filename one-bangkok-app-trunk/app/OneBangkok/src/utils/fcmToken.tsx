import messaging from '@react-native-firebase/messaging';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

const getTokenWithRetry = async (maxRetries: number, retryDelay: number) => {
  let retries = 0;
  let token;

  while (retries < maxRetries) {
    try {
      token = await messaging().getToken();
      if (token) {
        return token;
      }
    } catch (error) {
      console.log('Error retrieving FCM token:', error);
    }

    retries++;
    await delay(retryDelay);
  }
  return null;
};

const getFCMToken = async () => {
  try {
    const authorized = await messaging().hasPermission();
    let fcmToken;
    if (authorized < 1) {
      await messaging().requestPermission();
    } else {
      // Handle the case when the app is reinstalled
      await handleTokenRetrieval();
    }

    fcmToken = await getTokenWithRetry(10, 1000); // Retry 10 times with a delay of 1 second

    return fcmToken;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

const handleTokenRetrieval = async () => {
  try {
    const currentToken = await messaging().getToken();
    if (!currentToken) {
      await messaging().requestPermission();
    }
  } catch (error) {
    console.log('Error retrieving FCM token:', error);
  }
};

export async function setupInAppMessaging(value: boolean) {
  try {
    await inAppMessaging().setMessagesDisplaySuppressed(value); // Suppress automatic display of messages
  } catch (error) {
    console.error('Failed to set up In-App Messaging', error);
  }
}

export default getFCMToken;
