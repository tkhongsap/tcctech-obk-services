import React, {useCallback, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';

import t from '~/utils/text';

import {Screen} from '~/components/templates/Screen';
import {SSOButtonGroup} from '../components';

import {StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '~/navigations/AppNavigation';

import authenAction from '~/states/authen/authenAction';
import {get, isEmpty} from 'lodash';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {Spacing, Text} from '~/components/atoms';
import {
  Button,
  Diverder,
  HeadText,
  Header,
  PhoneField,
  Tab,
  TabBody,
  TabContent,
  TabHeader,
  TabItem,
  modalActions,
} from '~/components/molecules';
import {Identity} from '~/models';
import accountAction from '~/states/account/accountAction';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {AnnouncementType} from '~/components/Announcement';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {ExitConfirmation} from '../components/ExitConfirmation';
import {combineNumberWithCC} from '~/utils/identifier';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {TextInput} from '~/components/molecules/TextInput';
import {PasswordField} from '~/components/organisms/PasswordField';
import authService, {
  LoginAuthRequest,
} from '~/services/authService/AuthService';
import {setHeaderSDK} from '~/helpers/api';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import getTheme from '~/utils/themes/themeUtils';
import firebaseConfigState from '~/states/firebase';
import appLanguageState from '~/states/appLanguage/appLanguageState';

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
  reset,
}: {
  loginAuthRequest: LoginAuthRequest;
  reset: any;
}) => {
  const navigation = useNavigation();

  const handleOnPressReactive = async () => {
    const response = await authService.reactivate(loginAuthRequest);
    const hasToken = get(response, 'token', null);
    const hasIdentity = get(response, 'identity', null);
    reset();
    if (hasToken) {
      authenAction.storeToken(response?.token?.value as string);
      setHeaderSDK(response?.token?.value);

      await accountAction.getProfile();
      await accountAction.getIdentities();

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
          'SignInScreen',
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

const NotHaveAccountSection = ({reset}: {reset: () => void}) => {
  const navigation = useNavigation();
  const onPressSignIn = () => {
    reset && reset();
    navigation.navigate('SignUpScreen');
  };
  return (
    <View className="flex flex-row w-full justify-center gap-2 mt-1 pb-6">
      <Text size="B2">
        {t(
          'Sign_in__Sign_in_email__Not_have_account',
          "Don't have an account?",
        )}
      </Text>
      <Text size="B2" color="primary" onPress={onPressSignIn}>
        {t('General__Sign_up', 'Sign up')}
      </Text>
    </View>
  );
};

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
    screenHook: 'SignInScreen',
  });
};

const handleOnReactivateAccount = (
  loginAuthRequest: LoginAuthRequest,
  reset: any,
) => {
  modalActions.setContent(
    <ReactivateAccountConfirmation
      loginAuthRequest={loginAuthRequest}
      reset={reset}
    />,
  );
  modalActions.show();
};

const Login = async (
  navigation: StackNavigation,
  body: LoginAuthRequest,
  reset: any,
  setError: any,
) => {
  try {
    const response = await authService.login(body);
    const hasToken = get(response, 'token', null);
    const hasRefreshToken = get(response, 'refreshToken', null);
    const hasIdentity = get(response, 'identity', null);
    if (hasToken && hasRefreshToken) {
      reset();
      const token = get(response, ['token', 'value'], '');
      const refreshToken = get(response, ['refreshToken', 'value'], '');
      authenAction.storeToken(token);
      authenAction.storeRefreshToken(refreshToken);
      setHeaderSDK(token);

      await accountAction.getProfile();
      await accountAction.getIdentities();

      goToHome(navigation);
    } else if (hasIdentity) {
      const identity = get(response, 'identity');
      const providerValue = get(identity, 'provider');
      const isEmailProvider = providerValue === 'email';
      if (identity) {
        reset();
        goToOtpScreen(
          isEmailProvider,
          identity,
          navigation,
          'SignInScreen',
          'login',
        );
      }
    } else {
      const errorCode = get(response, ['error', 'code']);
      if (errorCode === 'IAM_AUTH_002') {
        if (body.provider === 'email') {
          setError('email', {type: 'custom', message: ''});
          setError('passwordEmail', {
            type: 'custom',
            message: t(
              'Sign_in__Sign_in_email__Email_not_match',
              "Email and password don't match.",
            ),
          });
        } else {
          setError('phone', {type: 'custom', message: ''});
          setError('passwordPhone', {
            type: 'custom',
            message: t(
              'Sign_in__Sign_in_phone__Phone_password_not_match',
              'Phone number or password not match',
            ),
          });
        }
      } else if (errorCode === 'IAM_AUTH_003') {
        // show modal error
        handleOnReactivateAccount(body, reset);
      } else if (errorCode === 'IAM_IDT_010') {
        let language = appLanguageState.currentLanguage.get();
        if (language === '') {
          language = appLanguageState.defaultLanguage.get();
        }
        const titleฺBlacklist =
          firebaseConfigState.blacklist_announcement.title[language].value;
        const bodyBlacklist =
          firebaseConfigState.blacklist_announcement.body[language].value;

        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: titleฺBlacklist,
          message: bodyBlacklist,
          buttonText: t('General__Try_again', 'Try again'),
          screenHook: 'SignInScreen',
        });

        setError('email', {
          type: 'custom',
          message: t(
            'General__Resigned_error_text',
            'Please use the authorized email',
          ),
        });
      }
    }
  } catch (error) {
    goToAnnoucement(
      navigation,
      'error',
      t('General__Something_went_wrong', 'Something\nwent wrong'),
      t('Announcement__Error_generic__Body', 'Please wait and try again soon.'),
    );
  }
};

type ForgetPasswordProps = {
  provider: 'email' | 'phone';
  reset: () => void;
};

const ForgetPasswordLink = ({provider, reset}: ForgetPasswordProps) => {
  const navigation = useNavigation();
  const handleForgetPassword = () => {
    reset && reset();
    navigation.navigate('ForgottenPasswordScreen', {provider});
  };

  return (
    <View className="flex flex-row mx-auto">
      <Text size="B2">
        {t('Sign_in__Sign_in_email__Forgot_password', 'Forgot password?')}
      </Text>
      <TouchableOpacity onPress={handleForgetPassword}>
        <Text color="primary" size="B2">
          {' '}
          {t('General__Reset_it', 'Reset password')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const EmailForm = ({setBodyLogin}: {setBodyLogin: any}) => {
  const navigation = useNavigation();
  const {
    clearErrors,
    handleSubmit,
    formState,
    setError,
    reset,
    register,
    watch,
  } = useFormContext();
  register('email');

  const onPressNext: SubmitHandler<FieldValues> = async data => {
    const identity = new Identity({
      identifier: data.email ?? '',
      provider: 'email',
    });
    const [isValid, errors] = await identity.validateEmail(false);
    if (!isValid) {
      setError('email', {
        type: 'error',
        message: errors.identifier?.messages[0],
      });
      return;
    }

    if (isEmpty(formState?.errors?.email)) {
      if (isEmpty(watch('passwordEmail'))) {
        setError('email', {type: 'custom', message: ''});
        setError('passwordEmail', {
          type: 'custom',
          message: t(
            'Sign_in__Sign_in_email__Email_not_match',
            "Email and password don't match.",
          ),
        });
        return;
      }
    }
    const body = {
      provider: 'email' as ProviderType,
      identifier: data.email.toLocaleLowerCase(),
      password: data.passwordEmail,
    };
    setBodyLogin(body);
    await Login(navigation, body, reset, setError);
  };

  return (
    <View>
      <Spacing height={32} />
      <TextInput
        name="email"
        testID="signin-email-id"
        onFocus={() => clearErrors()}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={t('General__Your_email_domain', 'youremail@domain')}
      />
      <Spacing height={24} />
      <PasswordField
        name="passwordEmail"
        testID="signin-password-id"
        onFocus={() => clearErrors()}
        placeholder={t('General__Password', 'Password')}
        iconColor={!isEmpty(formState?.errors?.email) ? '#292929' : undefined}
      />
      <Spacing height={40} />
      <Button
        title={t('General__Continue_mail', 'Continue with email')}
        rightIcon="next"
        onPress={handleSubmit(onPressNext)}
      />
      <Spacing height={20} />
      <ForgetPasswordLink provider="email" reset={reset} />
    </View>
  );
};

const PhoneForm = ({setBodyLogin}: {setBodyLogin: any}) => {
  const navigation = useNavigation();
  const {
    clearErrors,
    handleSubmit,
    formState,
    setError,
    reset,
    setValue,
    watch,
  } = useFormContext();

  const handleOnChangeText = useCallback(
    (cc: string, number: string) => {
      setValue('phone', number);
      setValue('countryCode', cc);
    },
    [setValue],
  );

  const onPressNext: SubmitHandler<FieldValues> = async data => {
    const identity = new Identity({
      identifier: combineNumberWithCC(data.countryCode, data.phone),
      provider: 'phone',
    });

    const [isValid, errors] = await identity.validatePhone(
      false,
      true,
      data.countryCode,
    );

    if (!isValid) {
      setError('phone', {
        type: 'error',
        message: errors.identifier?.messages[0],
      });
      return;
    }
    if (isEmpty(formState?.errors?.phone)) {
      if (isEmpty(watch('passwordPhone'))) {
        setError('phone', {type: 'custom', message: ''});
        setError('passwordPhone', {
          type: 'error',
          message: t(
            'General__Type_phone_number',
            'Please, type your phone number',
          ),
        });
        return;
      }
    }
    const body = {
      provider: 'phone' as ProviderType,
      identifier: data.phone,
      password: data.passwordPhone,
      country_code: data.countryCode,
    };
    setBodyLogin(body);
    await Login(navigation, body, reset, setError);
  };

  return (
    <View>
      <Spacing height={32} />
      <PhoneField
        testID="signin-phone-id"
        error={!isEmpty(formState.errors?.phone)}
        helperText={formState.errors?.phone?.message as string}
        onChangeText={handleOnChangeText}
        onFocus={() => clearErrors()}
        number={watch('phone')}
        countryCode={watch('countryCode')}
      />
      <Spacing height={24} />
      <PasswordField
        name="passwordPhone"
        testID="signin-phone-password-id"
        onFocus={() => clearErrors()}
        placeholder={t('General__Password', 'Password')}
        iconColor={!isEmpty(formState?.errors?.phone) ? '#292929' : undefined}
      />
      <Spacing height={40} />
      <Button
        title={t('General__Continue_with_phone', 'Continue with phone')}
        rightIcon="next"
        onPress={handleSubmit(onPressNext)}
      />
      <Spacing height={20} />
      <ForgetPasswordLink provider="phone" reset={reset} />
    </View>
  );
};

const handleOnContinueEvent = (
  event: ScreenHookEventType,
  prevEvent: ScreenHookEventType,
  navigation: StackNavigation,
) => {
  if (
    event.from.params.title === 'Authorization expired' &&
    event.from.params.type === 'error'
  ) {
    navigation.goBack();
    return;
  }
  if (
    !isEmpty(prevEvent) &&
    prevEvent.name === 'OTPVerificationScreen.OTP_INVALID'
  ) {
    const {isEmailProvider, identity, screenHook, action} = event.data;
    goToOtpScreen(isEmailProvider, identity, navigation, screenHook, action);
    return;
  }
  if (
    event.from.params.type === 'error' ||
    event.from.params.type === 'success' ||
    (event.from.params.type === 'wait' &&
      event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001)
  ) {
    goToHome(navigation);
  }
};

const SignInScreen = () => {
  const navigation = useNavigation();
  const [bodyLogin, setBodyLogin] = useState<LoginAuthRequest>();
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});

  methods.register('phone');
  methods.register('countryCode');

  const handleOnPressLeftAction = () => {
    modalActions.setContent(
      <ExitConfirmation
        confirmExit={() => {
          modalActions.hide();
          navigation.navigate('SignInScreen');
        }}
        confirmButtonColor="navy"
        onPressCancel={modalActions.hide}
      />,
    );
    modalActions.show();
  };
  useScreenHook('SignInScreen', async (event, prevEvent) => {
    switch (event.name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        await onOtpVerified(event.data, event.from.params.action);
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent, navigation);
        break;
      default:
        break;
    }
  });

  const onPressLeftAction = () => {
    navigation.goBack();
  };

  const onOtpVerified = async (data: Record<string, any>, type: string) => {
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
    const token = get(response, ['token', 'value'], null);
    const refreshToken = get(response, ['refreshToken', 'value'], null);
    if (token) {
      authenAction.storeToken(token);
      authenAction.storeRefreshToken(refreshToken);
      setHeaderSDK(token);

      await accountAction.getProfile();
      await accountAction.getIdentities();
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

  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_signin_or_signup.png')}>
        <Header
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
          onPressLeftAction={onPressLeftAction}
          rightAction="switchLanguage"
          rightColor="#ffffff"
        />
        <View className="px-5">
          <HeadText
            tagline={t('General__Sign_in', 'Sign in')}
            title={t('Sign_in__Sign_in_email__Header', 'Welcome Back!')}
            titleColor="default-inverse"
            taglineColor="default-inverse"
            descriptionColor="line"
          />
        </View>
      </HeaderImage>
      <ScrollView
        className="flex flex-col w-full px-6"
        keyboardDismissMode="interactive">
        <Spacing height={24} />
        <FormProvider {...methods}>
          <Tab>
            <TabHeader>
              <TabItem onPress={() => methods.reset()}>
                {t('General__Email', 'Email')}
              </TabItem>
              <TabItem onPress={() => methods.reset()}>
                {t('General__Phone', 'Phone')}
              </TabItem>
            </TabHeader>
            <TabBody>
              <TabContent>
                <EmailForm setBodyLogin={setBodyLogin} />
              </TabContent>
              <TabContent>
                <PhoneForm setBodyLogin={setBodyLogin} />
              </TabContent>
            </TabBody>
          </Tab>
        </FormProvider>
        <Spacing height={24} />
        <Diverder text={t('General__or', 'or')} />
        <SSOButtonGroup
          sourceScreen="SignInScreen"
          reset={() => methods.reset()}
        />
        <Spacing height={28} />
        <NotHaveAccountSection reset={() => methods.reset()} />
      </ScrollView>
    </Screen>
  );
};

export default SignInScreen;
