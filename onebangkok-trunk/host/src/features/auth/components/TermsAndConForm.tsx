import t from '~/utils/text';
import React, {useState} from 'react';
import {View} from 'react-native';
import {CheckField} from '~/components/molecules/CheckField';
import {Text} from '~/components/atoms/Text';
import {Spacing} from '~/components/atoms/Spacing';
import {useNavigation} from '~/navigations/AppNavigation';
import {signUpStateAction, useSignUpState} from '../store/signUpStore';
import T from '~/utils/text';

export const TermsAndConForm = (props: any) => {
  const {error, onPress, resetErrorState} = props;
  const navigation = useNavigation();
  const {termsConditions, privacyPolicy} = useSignUpState();
  const onPressLinkTC = () => {
    // reset state here every time it's being clicked
    resetErrorState();
    navigation.navigate('LegalDocumentScreen', {
      header: 'General__Terms_and_conditions',
      category: 'terms-and-conditions',
    });
  };
  const onPressLinkPPC = () => {
    // reset state here every time it's being clicked
    resetErrorState();
    navigation.navigate('LegalDocumentScreen', {
      header: 'General__Privacy_Policy',
      category: 'privacy-policy',
    });
  };
  const onPressTC = (value: boolean) => {
    signUpStateAction.setTermsConditions(value);
    onPress(value);
  };
  const onPressPPC = (value: boolean) => {
    signUpStateAction.setPrivacyPolicy(value);
  };

  useState(() => {
    signUpStateAction.setTermsConditions(false);
    signUpStateAction.setPrivacyPolicy(false);
  });

  return (
    <>
      <CheckField
        error={error}
        onPress={onPressTC}
        testID="tnc-id"
        value={termsConditions.value}>
        <Spacing width={4} />
        <View className="flex flex-row flex-wrap">
          <Spacing width={4} />
          <Text size={'B2'} color={error ? 'error' : 'jet-black'}>
            {t('Signup__Signup_sso_ts&cs__Checkbox_ts&cs', 'I read and accept')}
          </Text>
          <Spacing width={4} />
          <Text size={'B2'} color="primary" onPress={onPressLinkTC}>
            {t('General__Terms_and_conditions', 'Terms and Conditions')}
          </Text>
          <Spacing width={4} />
          <Text size={'B2'} color={error ? 'error' : 'jet-black'}>
            {t('General__And', ' and ')}
          </Text>
          <Text size={'B2'} color="primary" onPress={onPressLinkPPC}>
            {t('General__Privacy_statement', 'Privacy Statement')}
          </Text>
        </View>
      </CheckField>
      <Spacing height={8} />

      <CheckField onPress={onPressPPC} value={privacyPolicy.value}>
        <View className="flex flex-row flex-wrap mr-[30px]">
          <Spacing width={8} />
          <Text size={'B2'}>
            {t(
              'Sign_in__Signup_sso_ts&cs__Checkbox_news',
              'I want to keep receiving news about One Bangkok',
            )}
          </Text>
        </View>
      </CheckField>

      <Spacing height={8} />
      {error && (
        <Text color="error" size="B2">
          {T(
            'General__Accept_ts&cs',
            'Please accept the terms and conditions and privacy statement',
          )}
        </Text>
      )}
    </>
  );
};
