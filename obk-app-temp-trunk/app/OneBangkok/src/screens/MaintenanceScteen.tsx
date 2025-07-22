import {isEmpty} from 'lodash';
import React from 'react';
import {View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';

const MaintenanceScreen = () => {
  const language =
    appLanguageState.currentLanguage.get() === ''
      ? 'en'
      : appLanguageState.currentLanguage.get();
  let title = firebaseConfigState.app_maintenance.value.message.title[language];
  let decription =
    firebaseConfigState.app_maintenance.value.message.body[language];

  if (isEmpty(title) || isEmpty(decription)) {
    title = firebaseConfigState.app_maintenance.value.message.title['en'];
    decription = firebaseConfigState.app_maintenance.value.message.body['en'];
  }

  return (
    <Screen>
      <View className="flex items-center justify-center h-screen px-4">
        <Icon type="settingIcon" width={48} height={48} />
        <Spacing height={14} />
        <Text size="H3" weight="medium">
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

export default MaintenanceScreen;
