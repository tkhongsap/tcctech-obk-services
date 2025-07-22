import React, {useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import {StackActions} from '@react-navigation/native';
import t from '~/utils/text';
import {Button, Header, StickyButton, useModal} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Identity} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {useNavigation} from '~/navigations/AppNavigation';
import {Screen} from '~/components/templates';
import {PasswordField} from '~/components/organisms/PasswordField';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {combineNumberWithCC} from '~/utils/identifier';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import accountService from '~/services/accountService/AccountService';
import {logScreenView} from '~/utils/logGA';

const ExitConfirmation = ({onContinue, onCancel}: any) => {
  return (
    <>
      <Text size="B1" weight="medium">
        {t('General__Leave_now?', 'Leave now?')}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__Warning_leave_page__Body',
          'All previous information entered will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <Button
        color="navy"
        title={t('General__Leave_this_page', 'Leave this page')}
        onPress={onContinue}
      />
      <Spacing height={12} />
      <Button
        title={t('General__Cancel', 'Cancel')}
        outlined={true}
        onPress={onCancel}
      />
    </>
  );
};

const ForgetPassword = () => {
  const navigation = useNavigation();

  const handleForgetPassword = async () => {
    const strIdentity = await AsyncStorage.getItem('identity');
    var jsonIdentity: Identity;
    if (strIdentity) {
      jsonIdentity = JSON.parse(strIdentity);
    }
    navigation.navigate('OTPVerificationScreen', {
      headText: {
        title:
          jsonIdentity!.provider === 'phone'
            ? t('General__Confirm_number', 'Confirm your phone number')
            : t('General__Confirm_your_email', 'Confirm your email'),
      },
      identity: {
        identifier: combineNumberWithCC(
          jsonIdentity!.country_code || '',
          jsonIdentity!.identifier,
        ),
        provider: jsonIdentity!.provider,
      },
      description: t('General__Enter_code', 'Enter the code we just sent you'),
      screenHook: 'CurrentPasswordScreen',
      leftAction: 'close',
      title: t('General__Reset_password', 'Reset password'),
      allowChangeIdentifier: false,
    });
  };

  return (
    <View className="flex flex-row mx-auto">
      <Text color="default" size="B2">
        {t(
          'Account__Current_password__Forget_password',
          'Forgot current password?',
        )}
      </Text>
      <Spacing width={5} />
      <TouchableOpacity onPress={handleForgetPassword}>
        <Text color="primary" size="B2">
          {t('General__Reset_it', 'Reset password')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CurrentPasswordScreen = () => {
  const [_modalState, modalActions] = useModal();
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});

  const navigation = useNavigation();

  const onPressContinue: SubmitHandler<FieldValues> = async data => {
    const result = await accountService.verifyPassword(data.currentPassword);
    if (result) {
      navigation.dispatch(
        StackActions.replace('ChangeOrSetPasswordScreen', {
          header: t('General__Change_password', 'Change password'),
          isSetupPassword: false,
        }),
      );
    } else {
      methods.setError('currentPassword', {
        type: 'manual',
        message: t(
          'Account__Current_password__Supporting_text2',
          'The current password is invalid',
        ),
      });
    }
  };

  const handleOnPressLeftAction = () => {
    modalActions.setContent(
      <ExitConfirmation
        onContinue={() => {
          modalActions.hide();
          navigation.navigate('AccountInfoScreen');
        }}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };

  const handleOnContinueEvent = (
    event: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
  ) => {
    if (prevEvent.name === 'OTPVerificationScreen.OTP_INVALID') {
      const {isEmailProvider, identity, screenHook, action} = event.data;
      navigation.navigate('OTPVerificationScreen', {
        headText: {
          title: isEmailProvider
            ? t('General__Confirm_your_email', 'Confirm your email')
            : t('General__Confirm_number', 'Confirm your phone number'),
        },
        identity: identity,
        description: t(
          'General__Enter_code',
          'Enter the code we just sent you',
        ),
        screenHook: screenHook,
        leftAction: 'close',
        title: t('General__Reset_password', 'Reset password'),
        action,
        allowChangeIdentifier: false,
      });
    }
  };

  useScreenHook('CurrentPasswordScreen', async (event, prevEvent) => {
    const {name} = event;
    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        navigation.dispatch(
          StackActions.replace('ChangeOrSetPasswordScreen', {
            header: t('General__Change_password', 'Change password'),
            isSetupPassword: false,
          }),
        );
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent);
        break;
      default:
        break;
    }
  });

  const [setError] = useState<boolean>(false);

  useEffect(() => {
    logScreenView('CurrentPasswordScreen');
  }, []);

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Change_password', 'Change password')}
      />
      <ScrollView className="px-[24px] w-full h-full">
        <Spacing height={24} />
        <FormProvider {...methods}>
          <PasswordField
            name={'currentPassword'}
            placeholder={t('General__Current_password', 'Current password')}
            onFocus={() => methods.clearErrors()}
            labelText={t('General__Current_password', 'Current password')}
            persistentValue={true}
            rules={{
              required: t(
                'Account__Current_password__Supporting_text1',
                'Please, type in your current password',
              ),
            }}
            setFormError={setError}
          />
        </FormProvider>
        <Spacing height={40} />
        <ForgetPassword />
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={methods.handleSubmit(onPressContinue)}
      />
    </Screen>
  );
};

export default CurrentPasswordScreen;
