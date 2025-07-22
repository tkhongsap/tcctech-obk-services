import axios from 'axios';
import Config from 'react-native-config';
import appLanguageState from '~/states/appLanguage/appLanguageState';

export const bookingPublicClient = axios.create({
  baseURL: `${Config.ART_C_BASEURL}/api`,
});
bookingPublicClient.interceptors.request.use(config => {
  config.headers.set(
    'locale',
    appLanguageState.currentLanguage.get() ||
      appLanguageState.defaultLanguage.get(),
  );
  config.headers.set('Time-Zone', 'Asia/Bangkok');
  return config;
});
