import React from 'react';
import {Text, View} from 'react-native';
import {
  Screen,
  Header,
  BottomNextButton,
  BottomNextButtonSize,
  OBSpacing,
} from '~/components';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import SuccessIcon from '~/assets/images/icon_ announcement_success.svg';
import {StackActions, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';

const NextButton = () => {
  const navigation = useNavigation<StackNavigation>();

  const onPressNext = () => {
    navigation.dispatch(StackActions.replace('SignInScreen'));
  };

  return (
    <BottomNextButton
      enabled={true}
      size={BottomNextButtonSize.Big}
      text={t('PasswordChangedScreen__next_button', 'Login')}
      onPress={onPressNext}
    />
  );
};

const PasswordChangedScreen = () => {
  return (
    <Screen>
      <Header isTheme={true} />
      <View className={'flex-1 items-center px-7'}>
        <View className={'flex-[166]'} />
        <SuccessIcon />
        <OBSpacing height={16} />
        <Text className={getTheme('text-label text-xs font-bold')}>
          {t('PasswordChangedScreen__success', 'Success!')}
        </Text>
        <OBSpacing height={4} />
        <Text
          className={getTheme(
            'text-default text-3xl font-medium leading-loose text-center',
          )}>
          {t('Announcement__Reset_password_success__Header', 'Your password was changed')}
        </Text>
        <OBSpacing height={4} />
        <Text
          className={getTheme('text-default text-base font-normal leading-5')}>
          {t(
            'Announcement__Reset_password_success__Body',
            'Now you can login with your new password.',
          )}
        </Text>
        <View className={'flex-[267]'} />
      </View>
      <NextButton />
    </Screen>
  );
};

export default PasswordChangedScreen;
