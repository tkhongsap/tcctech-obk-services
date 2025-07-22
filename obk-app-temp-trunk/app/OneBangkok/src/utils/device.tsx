import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';

export const getDeviceId = async (): Promise<string> => {
  const uniqueId = await getUniqueId();
  return uniqueId;
};

export const getOs = (): string => {
  return Platform.OS;
};
