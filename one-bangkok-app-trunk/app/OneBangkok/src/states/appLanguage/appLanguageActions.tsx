import {isEmpty} from 'lodash';
import appLanguageState from './appLanguageState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {settingStateAction} from '~/features/setting/store';
import {SupportLanguage} from 'ob-iam-sdk/dist/api';

const appLanguageActions = {
  setLanguage: (language: string) => {
    appLanguageState.currentLanguage.set(language);
    AsyncStorage.setItem('appLanguage', language);
    settingStateAction.updateSetting({
      current_language: language as SupportLanguage,
    });
  },
  initializeLanguage: async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('appLanguage');
      if (storedLanguage) {
        appLanguageState.currentLanguage.set(storedLanguage);
      }
    } catch (error) {
      console.log('Error initializing app language:', error);
    }
  },
  getLanguage: () => {
    const currentLanguage = isEmpty(appLanguageState.currentLanguage.value)
      ? appLanguageState.defaultLanguage.value
      : appLanguageState.currentLanguage.value;
    return currentLanguage;
  },
};

export default appLanguageActions;
