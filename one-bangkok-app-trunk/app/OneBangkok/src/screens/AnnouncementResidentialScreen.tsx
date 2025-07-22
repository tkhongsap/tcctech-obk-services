import React from 'react';
import {ScrollView, View} from 'react-native';
import AnnouncementResidential from '../components/AnnouncementResidential';
import {
  RootStackParamList,
  removeScreenFromStack,
  useNavigation,
} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '~/components/templates';
import {createNotifyScreenHook} from '~/services/EventEmitter';
import getTheme from '~/utils/themes/themeUtils';
import {StickyButton} from '~/components/molecules';
import {AnnouncementResidentialScreenEventTypes} from './AnnouncementResidentialScreenEvent';
import {useBackHandler} from '~/utils/useBackHandler';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AnnouncementResidentialScreen'
>;

const AnnouncementResidentialScreen = (routes: Props) => {
  const {
    route: {
      params: {
        type,
        title,
        message,
        buttonText,
        buttonCenter,
        emailSupport,
        telSupport,
        screenHook,
        messageDescription,
        specialWidget,
        data,
        buttonColor = 'navy',
        onPressBack,
      },
    },
  } = routes;
  const navigation = useNavigation();

  navigation.addListener('blur', () => {
    removeScreenFromStack(navigation, routes.route.key);
  });

  const notifyScreenHook =
    createNotifyScreenHook<AnnouncementResidentialScreenEventTypes>(
      routes.route,
    )();

  const onPress = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
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
          <AnnouncementResidential
            type={type}
            title={title}
            message={message}
            specialWidget={specialWidget}
            messageDescription={messageDescription}
            buttonCenter={buttonCenter}
            emailSupport={emailSupport}
            telSupport={telSupport}
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

export default AnnouncementResidentialScreen;
