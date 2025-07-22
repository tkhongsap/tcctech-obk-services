import {hookstate} from '@hookstate/core';

const appLanguageState = hookstate({
  currentLanguage: '',
  defaultLanguage: 'en',
});

export default appLanguageState;
