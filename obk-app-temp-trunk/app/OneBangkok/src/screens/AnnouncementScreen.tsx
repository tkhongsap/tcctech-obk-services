import React from 'react';
import {ScrollView, View} from 'react-native';
import Announcement from '../components/Announcement';
import {
  RootStackParamList,
  removeScreenFromStack,
  useNavigation,
} from '../navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '~/components/templates';
import {createNotifyScreenHook} from '~/services/EventEmitter';
import getTheme from '~/utils/themes/themeUtils';
import {StickyButton} from '~/components/molecules';
import {AnnouncementScreenEventTypes} from './AnnouncementScreenEvent';
import {useBackHandler} from '~/utils/useBackHandler';

type Props = NativeStackScreenProps<RootStackParamList, 'AnnouncementScreen'>;

const AnnouncementScreen = (routes: Props) => {
  const {
    route: {
      params: {
        type,
        title,
        message,
        buttonText,
        screenHook,
        messageDescription,
        specialWidget,
        data,
        buttonColor = 'navy',
      },
    },
  } = routes;
  const navigation = useNavigation();

  navigation.addListener('blur', () => {
    removeScreenFromStack(navigation, routes.route.key);
  });

  const notifyScreenHook = createNotifyScreenHook<AnnouncementScreenEventTypes>(
    routes.route,
  )();

  const onPress = () => {
    notifyScreenHook(screenHook, 'CONTINUE', data);
  };

  useBackHandler(() => {
    return true;
  });
  return (
    <Screen>
      <ScrollView
        className={getTheme('bg-default')}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flex: 1,
        }}
        keyboardDismissMode="interactive">
        <View className="h-full justify-center items-center">
          <Announcement
            type={type}
            title={title}
            message={message}
            specialWidget={specialWidget}
            messageDescription={messageDescription}
          />
        </View>
      </ScrollView>
      <StickyButton
        color={buttonColor}
        title={buttonText}
        onPress={onPress}
        rightIcon="next"
      />
    </Screen>
  );
};

export default AnnouncementScreen;
