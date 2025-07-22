import React, {useState} from 'react';

import {useNavigation, StackActions} from '@react-navigation/native';
import {View, Platform} from 'react-native';
import {StackNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';

import {
  SignInWithAppleButton,
  SignInWithGoogleButton,
  SignInWithMicrosoftButton,
} from '.';
import {signUpStateAction} from '../store/signUpStore';
import {SSOProviderType} from '~/constants/AuthsConstant';
import {SSOService} from '~/services/SSOService';
import {get} from 'lodash';
import authenAction from '~/states/authen/authenAction';
import accountAction from '~/states/account/accountAction';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {Button, modalActions} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import {AnnouncementType} from '~/components/Announcement';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {ExitConfirmation} from './ExitConfirmation';
import {RootStackParamList} from '~/navigations/AppNavigation';
import authService, {
  LoginAuthRequest,
} from '~/services/authService/AuthService';
import {setHeaderSDK} from '~/helpers/api';
import firebaseConfigState from '~/states/firebase';

const goToHome = (navigation: StackNavigation) => {
  navigation.navigate('HomeScreen');
};

const goToAnnoucement = (
  navigation: StackNavigation,
  type: AnnouncementType,
  title: string,
  message: string,
) => {
  navigation.navigate('AnnouncementScreen', {
    type,
    title,
    message,
    buttonText: t('General__Back_to_explore', 'Back to Explore'),
    screenHook: 'SSOButtonGroup',
  });
};

const goToOtpScreen = (
  isEmailProvider: boolean,
  identity: object,
  navigation: StackNavigation,
  screenHook: string,
  action: string,
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
    leftAction: 'close',
    action,
  });
};

const ReactivateAccountConfirmation = ({
  loginAuthRequest,
}: {
  loginAuthRequest: LoginAuthRequest;
}) => {
  const navigation = useNavigation<StackNavigation>();

  const handleOnPressReactive = async () => {
    const response = await authService.reactivate(loginAuthRequest);
    const hasToken = get(response, 'token', null);
    const hasIdentity = get(response, 'identity', null);
    if (hasToken) {
      authenAction.storeToken(response?.token?.value as string);
      setHeaderSDK(response?.token?.value);
      await accountAction.getProfile();
      modalActions.hide();
      goToAnnoucement(
        navigation,
        'success',
        t(
          'Announcement__Success_account_reactivate__Header',
          'Your account\nis activated !',
        ),
        t(
          'Announcement__Success_account_reactivate__Body',
          'Welcome back to One Bangkok.You can now explore all benefits as One Bangkok member once again.',
        ),
      );
    } else if (hasIdentity) {
      const identity = get(response, 'identity');
      const providerValue = get(identity, 'provider');
      const isEmailProvider = providerValue === 'email';
      if (identity) {
        modalActions.hide();
        goToOtpScreen(
          isEmailProvider,
          identity,
          navigation,
          'SSOButtonGroup',
          'reactivate',
        );
      }
    }
  };

  return (
    <>
      <Text>
        {loginAuthRequest.provider === 'phone'
          ? t(
              'Drawer__Phone_reactivate__Header',
              'This phone has been previously registered and deactivated. Would you like to reactivate your account?',
            )
          : t(
              'Drawer__Email_reactivate__Header',
              'This email has been previously registered and deactivated. Would you like to reactivate your account?',
            )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('General__Activate_now', 'Activate now')}
          onPress={async () => {
            await handleOnPressReactive();
          }}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={modalActions.hide}
        />
      </View>
    </>
  );
};
type SSOButtonGroupProps = {
  sourceScreen?: keyof RootStackParamList;
  reset?: () => void;
};

export const SSOButtonGroup = (props: SSOButtonGroupProps) => {
  const {sourceScreen, reset} = props;
  const navigation = useNavigation<StackNavigation>();
  const [bodyLogin, setBodyLogin] = useState<LoginAuthRequest>();

  const validateIdentity = async (
    email: string,
    provider: SSOProviderType,
    data: object,
    uid: string,
  ) => {
    const ssoService = new SSOService();
    const response = await ssoService.link(email, uid, provider, data);
    const result = get(response, ['data', 'result']);
    return result;
  };

  const handleOnReactivateAccount = (loginAuthRequest: LoginAuthRequest) => {
    modalActions.setContent(
      <ReactivateAccountConfirmation loginAuthRequest={loginAuthRequest} />,
    );
    modalActions.show();
  };

  const handleOnPressLeftAction = () => {
    const validScreen =
      sourceScreen === 'SignInScreen' || sourceScreen === 'SignUpScreen';

    modalActions.setContent(
      <ExitConfirmation
        confirmExit={() => {
          if (validScreen) {
            modalActions.hide();
            navigation.navigate(sourceScreen);
          }
        }}
        onPressCancel={modalActions.hide}
        confirmButtonColor="navy"
        textButton={
          sourceScreen === 'SignUpScreen'
            ? t('General__Back_to_sign_up', 'Back to sign up')
            : t('General__Back_to_sign_in', 'Back to sign in')
        }
      />,
    );
    modalActions.show();
  };

  const onAuthorize = async (
    provider: string,
    result: boolean,
    data: any | undefined,
  ) => {
    if (result) {
      let email = '';
      let uid = '';
      switch (provider) {
        case SSOProviderType.apple:
          email = data.email;
          uid = data.sub;
          break;
        case SSOProviderType.google:
          email = data.user.email;
          uid = data.user.id;
          break;
        case SSOProviderType.microsoft:
          email = data.mail;
          uid = data.id;
          break;
        default:
          break;
      }
      const isValid = await validateIdentity(
        email,
        provider as SSOProviderType,
        data,
        uid,
      );
      if (isValid) {
        const body = {
          provider: 'sso' as ProviderType,
          identifier: email,
        };
        setBodyLogin(body);
        const response = await authService.login(body);
        const hasToken = get(response, 'token', null);
        const hasIdentity = get(response, 'identity', null);
        if (hasToken) {
          const token = get(response, ['token', 'value']);
          authenAction.storeToken(token);
          setHeaderSDK(token);

          await accountAction.getProfile();
          goToHome(navigation);
        } else if (hasIdentity) {
          const identity = get(response, 'identity');
          const providerValue = get(identity, 'provider');
          const isEmailProvider = providerValue === 'email';
          if (identity) {
            goToOtpScreen(
              isEmailProvider,
              identity,
              navigation,
              'SSOButtonGroup',
              'login',
            );
          }
        } else {
          const errorCode = get(response, ['error', 'code']);
          if (errorCode === 'IAM_AUTH_003') {
            handleOnReactivateAccount(body);
          }
        }
      } else {
        signUpStateAction.setEmail(email);
        signUpStateAction.setProvider('sso');
        signUpStateAction.setMeta(data);
        signUpStateAction.setUid(uid);
        signUpStateAction.setProviderType(provider as SSOProviderType);

        navigation.dispatch(StackActions.replace('SignUpScreen'));
        navigation.navigate('TermsAndConScreen');
      }
    } else {
      // TODO How can i handle this ?
    }
  };

  const handleOnContinueEvent = (
    event: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
  ) => {
    if (prevEvent.name === 'OTPVerificationScreen.OTP_INVALID') {
      const {isEmailProvider, identity, screenHook, action} = event.data;
      goToOtpScreen(isEmailProvider, identity, navigation, screenHook, action);
    } else if (
      event.from.params.type === 'error' ||
      event.from.params.type === 'success' ||
      (event.from.params.type === 'wait' &&
        event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001)
    ) {
      goToHome(navigation);
    }
  };
  useScreenHook('SSOButtonGroup', async (event, prevEvent) => {
    switch (event.name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        await onOtpVerfied(event.data, event.from.params.action);
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

  const onOtpVerfied = async (data: Record<string, any>, type: string) => {
    const {
      otp: {id, reference},
    } = data;
    let response;
    const body = {...bodyLogin} as LoginAuthRequest;
    body.id = id;
    body.reference = reference;
    if (type === 'login') {
      response = await authService.login(body);
    } else {
      response = await authService.reactivate(body);
    }

    const hasToken = get(response, 'token', null);
    if (hasToken) {
      const token = get(response, ['token', 'value']);

      authenAction.storeToken(token);
      setHeaderSDK(token);
      await accountAction.getProfile();
      if (type === 'reactivate') {
        goToAnnoucement(
          navigation,
          'success',
          t(
            'Announcement__Success_account_reactivate__Header',
            'Your account\nis activated !',
          ),
          t(
            'Announcement__Success_account_reactivate__Body',
            'Welcome back to One Bangkok.You can now explore all benefits as One Bangkok member once again.',
          ),
        );
      } else {
        goToHome(navigation);
      }
    } else {
      goToAnnoucement(
        navigation,
        'error',
        t('General__Something_went_wrong', 'Something\nwent wrong'),
        t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
      );
    }
  };
  const useSpacing =
    firebaseConfigState.enable_sso_signin.apple.value ||
    firebaseConfigState.enable_sso_signin.google.value ||
    firebaseConfigState.enable_sso_signin.microsoft.value;

  return (
    <View className="flex gap-2">
      {useSpacing && <Spacing height={24} />}
      {Platform.OS === 'ios' &&
      firebaseConfigState.enable_sso_signin.apple.value ? (
        <SignInWithAppleButton onAuthorize={onAuthorize} reset={reset} />
      ) : null}
      {firebaseConfigState.enable_sso_signin.google.value && (
        <SignInWithGoogleButton onAuthorize={onAuthorize} reset={reset} />
      )}
      {firebaseConfigState.enable_sso_signin.microsoft.value && (
        <SignInWithMicrosoftButton onAuthorize={onAuthorize} reset={reset} />
      )}
    </View>
  );
};
