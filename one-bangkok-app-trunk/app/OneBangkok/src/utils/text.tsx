import i18next from 'i18next';
import {assign, isUndefined} from 'lodash';
import deviceEn from '../../lang/en.json';
import deviceTh from '../../lang/th.json';
import deviceCs from '../../lang/cs.json';
import RNFS from 'react-native-fs';
import appLanguageState from '../states/appLanguage/appLanguageState';
import 'intl-pluralrules'; // Import the polyfill
import semver from 'semver';

// Function to load translations
const loadTranslationsSync = async () => {
  let en = deviceEn.translation;
  let th = deviceTh.translation;
  let cs = deviceCs.translation;

  try {
    const s3EnPath = RNFS.DocumentDirectoryPath + '/en.json';
    const s3EnContent = await RNFS.readFile(s3EnPath);
    const s3En = JSON.parse(s3EnContent);
    if (semver.gt(s3En.version, deviceEn.version)) {
      en = s3En.translation;
    }
  } catch (error) {
    console.error('Error loading English translations:', error);
  }

  try {
    const s3ThPath = RNFS.DocumentDirectoryPath + '/th.json';
    const s3ThContent = await RNFS.readFile(s3ThPath);
    const s3Th = JSON.parse(s3ThContent);
    if (semver.gt(s3Th.version, deviceTh.version)) {
      th = s3Th.translation;
    }
  } catch (error) {
    console.error('Error loading Thai translations:', error);
  }

  try {
    const s3CsPath = RNFS.DocumentDirectoryPath + '/cs.json';
    const s3CsContent = await RNFS.readFile(s3CsPath);
    const s3Cs = JSON.parse(s3CsContent);
    if (semver.gt(s3Cs.version, deviceCs.version)) {
      cs = s3Cs.translation;
    }
  } catch (error) {
    console.error('Error loading Chinese translations:', error);
  }

  return {
    en: {translation: en},
    th: {translation: th},
    cs: {translation: cs},
  };
};

// Initialize i18next
const initializeI18next = async () => {
  const translations = await loadTranslationsSync();

  return new Promise((resolve, reject) => {
    i18next
      .init({
        lng: 'en', // Set the default language here
        fallbackLng: 'en',
        resources: translations,
      })
      .then(() => {
        console.log('i18next initialized successfully');
        resolve(true);
      })
      .catch(error => {
        console.error('Error initializing i18next:', error);
        reject(error);
      });
  });
};

// Call initializeI18next to start loading translations and initializing i18next
initializeI18next()
  .then(() => {
    // i18next initialized successfully, now you can use it for translations
    console.log('i18next is ready for translations');
  })
  .catch(error => {
    console.error('Initialization failed:', error);
  });

// Translation wrapper function
const T = (
  keyName: string,
  fallback: string,
  value?: object,
  locale: string | null = null,
): string => {
  const translationOptions = {defaultValue: fallback};

  if (locale) {
    assign(translationOptions, {lng: locale});
  } else {
    const currentLanguage = appLanguageState.currentLanguage.get();
    if (
      i18next.language !== currentLanguage &&
      !isUndefined(i18next.language)
    ) {
      i18next.changeLanguage(currentLanguage);
    }
    assign(translationOptions, {lng: currentLanguage});
  }

  if (value) {
    assign(translationOptions, {...value});
  }

  const translation = i18next.t(keyName, translationOptions);

  if (translation === keyName && fallback) {
    return fallback;
  }

  if (isUndefined(translation)) {
    return fallback;
  }

  return translation;
};

export default T;
