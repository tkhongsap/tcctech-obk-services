import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';

import {Screen, Header, Announcement, CustomButton} from '~/components';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import NextIcon from '~/assets/images/ArrowNext.svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';

import {accountStateAction} from '~/states/account/accountState';
import accountAction from '~/states/account/accountAction';
import {isEmpty} from 'lodash';
import {StickyButton, Button} from '~/components/molecules';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {useBackHandler} from '~/utils/useBackHandler';
import {Spacing, Text} from '~/components/atoms';
const TwoFACard = () => {
  const navigation = useNavigation<StackNavigation>();
  const [provider, setProvider] = useState('');
  // TODO: this is super weird, will work on anoter ticket to imporve get currentAccount flow
  useEffect(() => {
    (async () => {
      await accountAction.getIdentities();
      const emailIdentifiers = accountStateAction.getIdentifiers('email');
      const _provider = isEmpty(emailIdentifiers) ? 'email' : 'phone';
      await setProvider(_provider);
    })();
  }, []);

  return (
    <View className={`p-6 ${getTheme('bg-light-gray')}`}>
      <View className="mb-2">
        <Text className={getTheme('text-base font-bold')}>
          {t('Signup__Signup_success__Header_2', 'Optional security layer')}
        </Text>
      </View>
      <View className="mb-6">
        <Text className={getTheme('text-default text-sm font-normal')}>
          {t(
            'Signup__Signup_success__Body_2',
            'Two-Factor Authentication (2FA) helps secure your account better. Itwill take a few minutes to set up.',
          )}
        </Text>
      </View>
      <View
        testID="completed-sign-up-setup-2fa"
        className={`bg-black self-start w-full h-[48px] ${getTheme(
          'bg-navy',
        )}`}>
        <Button
          title={t('Signup__Signup_success__Button_primary', 'Setup 2FA')}
          rightIcon="next"
          rightIconColor="#fff"
          iconHeight={25}
          iconWidth={25}
          color="navy"
          onPress={() =>
            navigation.navigate('Setup2FAScreen', {
              provider: provider as ProviderType,
              sourceScreen: 'SignUpCompleteScreen',
              newAccount: true,
            })
          }
        />
      </View>
    </View>
  );
};

const SignUpCompleteScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  useBackHandler(() => {
    return true;
  });

  return (
    <Screen>
      <Header withBackButton={false} />
      <ScrollView className="w-full">
        <View className="mt-20">
          <Announcement
            type="success"
            title={t('Signup__Signup_success__Header', 'Account created')}
            message={t(
              'Signup__Signup_success__Body',
              'You can now explore all benefits as One Bangkok member',
            )}
          />
        </View>
        <Spacing height={60} />
        <View className="px-6">
          <TwoFACard />
        </View>
      </ScrollView>
      <StickyButton
        onPress={() => navigation.reset({routes: [{name: 'HomeScreen'}]})}
        title={t('General__Explore', 'Explore')}
        rightIcon="next"
      />
    </Screen>
  );
};

export default SignUpCompleteScreen;
