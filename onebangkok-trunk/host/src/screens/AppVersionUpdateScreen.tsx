import {isEmpty} from 'lodash';
import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import {logScreenView} from '~/utils/logGA';

const AppVersionUpdateScreen = () => {
  const language =
    appLanguageState.currentLanguage.get() === ''
      ? 'en'
      : appLanguageState.currentLanguage.get();
  const os = Platform.OS;

  let title =
    firebaseConfigState.app_version_update[os].value.message.title[language];
  let decription =
    firebaseConfigState.app_version_update[os].value.message.body[language];

  if (isEmpty(title) || isEmpty(decription)) {
    title = firebaseConfigState.app_version_update[os].value.message.title.en;
    decription =
      firebaseConfigState.app_version_update[os].value.message.body.en;
  }
  useEffect(() => {
    logScreenView('AppVersionUpdateScreen');
  }, []);
  return (
    <Screen>
      <View className="flex items-center justify-center h-screen px-4">
        <Icon type="settingIcon" width={48} height={48} />
        <Spacing height={14} />
        <Text size="H3" weight="medium" className="text-center">
          {title}
        </Text>
        <Text
          size="B1"
          weight="regular"
          color="subtitle-muted"
          className="text-center">
          {decription}
        </Text>
      </View>
    </Screen>
  );
};

export default AppVersionUpdateScreen;
