import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {HeadText} from '~/features/auth/components';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {
  Button,
  Header,
  StickyButton,
  modalActions,
} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import {get, isEmpty} from 'lodash';
import accountAction from '~/states/account/accountAction';
import authenAction from '~/states/authen/authenAction';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {Screen} from '~/components/templates';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {useBackHandler} from '~/utils/useBackHandler';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import ConfirmPasswordForm from '../components/ConfirmPasswordForm';
import {resetPasswordStateAction} from '../store/resetPasswordStore';
import {setHeaderSDK} from '~/helpers/api';
import {logScreenView} from '~/utils/logGA';
import {CommonActions} from '@react-navigation/native';

const DescriptionText = () => {
  return (
    <Text
      className={getTheme('text-muted text-base font-normal leading-tight')}>
      {t(
        'Reset_password__Reset_password_set__Body',
        'Please enter and confirm your new password.',
      )}
    </Text>
  );
};

const ExitModalContent = ({onConfirm, onCancel}: any) => {
  return (
    <>
      <Text weight="medium">{t('General__Leave_now?', 'Leave now ?')}</Text>
      <Text>
        {t(
          'Drawer__Warning_leave_page__Body',
          'All previous information entered and consent will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('General__Back_to_sign_in', 'Back to sign in')}
          onPress={onConfirm}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});
  const [setError] = useState<boolean>(false);

  const handleOnPressLeftAction = () => {
    modalActions.setContent(
      <ExitModalContent
        onConfirm={confirmExit}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };

  const confirmExit = () => {
    modalActions.hide();
    navigation.navigate('SignInScreen');
  };

  const goToOtpScreen = (
    isEmailProvider: boolean,
    identity: object,
    screenHook: string,
  ) => {
    navigation.navigate('OTPVerificationScreen', {
      headText: {
        tagline: t('General__2FA', 'Two-Factor Authentication'),
        title: isEmailProvider
          ? t('General__Confirm_your_email', 'Confirm your email')
          : t('General__Confirm_number', 'Confirm your phone number'),
      },
      identity: {
        identifier: get(identity, 'identifier', ''),
        provider: get(identity, 'provider', '') as ProviderType,
      },
      description: t('General__Enter_code', 'Enter the code we just sent you'),
      allowChangeIdentifier: false,
      screenHook,
      leftAction: 'goBack',
    });
  };

  const handleOnPressNext: SubmitHandler<FieldValues> = async data => {
    const response = await resetPasswordStateAction.submitNewPassword(
      data.password,
    );
    const hasToken = get(response, 'token', null);
    const hasIdentity = get(response, 'identity', null);
    if (hasToken) {
      const token = get(response, ['token', 'value']);
      authenAction.storeToken(token);
      setHeaderSDK(token);

      await accountAction.getProfile();
      navigation.navigate('AnnouncementScreen', {
        type: 'success',
        title: t(
          'Announcement__Reset_password_success__Header',
          'Your password\nwas changed',
        ),
        message: t(
          'Announcement__Reset_password_success__Body',
          'Now you can login with your new password.',
        ),
        buttonText: t('General__Explore', 'Explore'),
        screenHook: 'ResetPasswordScreen',
      });
    } else if (hasIdentity) {
      const identity = get(response, 'identity');
      const providerValue = get(identity, 'provider');
      const isEmailProvider = providerValue === 'email';
      if (identity) {
        goToOtpScreen(isEmailProvider, identity, 'ResetPasswordScreen');
      }
    } else {
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: t('General__Something_went_wrong', 'Something\nwent wrong'),
        message: t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
        buttonText: t('General__Back_to_explore', 'Back to Explore'),
        screenHook: 'ResetPasswordScreen',
      });
    }
  };

  const handleOnContinueEvent = (
    event: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
  ) => {
    console.log('event', event);
    console.log('prevEvent', prevEvent);

    if (prevEvent && prevEvent.name === 'OTPVerificationScreen.OTP_INVALID') {
      const {isEmailProvider, identity, screenHook} = event.data;
      goToOtpScreen(isEmailProvider, identity, screenHook);
    } else if (event.from && event.from.params.type === 'success') {
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'MainPageScreen'}]}),
      );
    } else if (event.from && event.from.params.type === 'error') {
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'MainPageScreen'}]}),
      );
    }
  };

  useScreenHook('ResetPasswordScreen', async (event, prevEvent) => {
    switch (event.name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        await onOtpVerified(event.data);
        break;
      case OTPVerificationScreenEventNames.ABORT:
        navigation.goBack();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent);
        break;
      default:
        break;
    }
  });

  const onOtpVerified = async (data: Record<string, any>) => {
    const {
      otp: {id, reference},
    } = data;
    const response = await resetPasswordStateAction.submitNewPassword(
      methods.getValues('password'),
      id,
      reference,
    );
    const hasToken = get(response, 'token', null);

    if (hasToken) {
      const token = get(response, ['token', 'value']);
      authenAction.storeToken(token);
      setHeaderSDK(token);

      await accountAction.getProfile();
      resetPasswordStateAction.reset();
      navigation.navigate('AnnouncementScreen', {
        type: 'success',
        title: t(
          'Announcement__Reset_password_success__Header',
          'Your password\nwas changed',
        ),
        message: t(
          'Announcement__Reset_password_success__Body',
          'Now you can login with your new password.',
        ),
        buttonText: t('General__Back_to_homepage', 'Back to home page'),
        screenHook: 'ResetPasswordScreen',
      });
    } else {
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: t('General__Something_went_wrong', 'Something\nwent wrong'),
        message: t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
        buttonText: t('General__Back_to_explore', 'Back to Explore'),
        screenHook: 'ResetPasswordScreen',
      });
    }
  };

  useBackHandler(() => {
    handleOnPressLeftAction();
    return true;
  });

  useEffect(() => {
    logScreenView('ResetPasswordScreen');
  }, []);

  return (
    <Screen>
      <Header leftAction="close" onPressLeftAction={handleOnPressLeftAction} />
      <ScrollView
        className="flex w-full px-6"
        keyboardDismissMode="interactive">
        <View className="w-full">
          <HeadText
            head={t('General__Reset_password', 'Reset password')}
            title={t('General__New_password', 'New password')}
          />
          <Spacing height={4} />
          <DescriptionText />
          <Spacing height={40} />
          <FormProvider {...methods}>
            <ConfirmPasswordForm
              showStrengthBar={!isEmpty(methods.watch('password'))}
              onFocus={() => methods.clearErrors()}
              passwordName="password"
              confirmPasswordName="confirmPassword"
              passwordPlaceholder={t('General__Password', 'Password')}
              setFormErrorPassword={setError}
              setFormErrorConfirmPassword={setError}
              persistentValue={true}
              {...methods}
            />
          </FormProvider>
        </View>
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={methods.handleSubmit(handleOnPressNext)}
      />
    </Screen>
  );
};

export default ResetPasswordScreen;
