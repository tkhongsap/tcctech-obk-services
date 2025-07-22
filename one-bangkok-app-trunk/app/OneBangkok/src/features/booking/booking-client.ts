import axios from 'axios';
import Config from 'react-native-config';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import authenState from '~/states/authen/authenState';

export const bookingClient = axios.create({
  baseURL: `${Config.ART_C_BASEURL}/user-api`,
});
bookingClient.interceptors.request.use(config => {
  config.headers.set(
    'locale',
    appLanguageState.currentLanguage.get() ||
      appLanguageState.defaultLanguage.get(),
  );
  config.headers.set('Time-Zone', 'Asia/Bangkok');
  config.headers.set('Authorization', `Bearer ${authenState.token.get()}`);
  return config;
});
