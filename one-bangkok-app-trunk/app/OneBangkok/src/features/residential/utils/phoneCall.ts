import { Linking, PermissionsAndroid, Platform } from 'react-native';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher';

export async function phoneCall(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}
