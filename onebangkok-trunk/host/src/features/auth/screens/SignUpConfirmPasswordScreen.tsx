import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';

import t from '~/utils/text';

import {Screen} from '~/components/templates';
import {Header, HeadText, StickyButton} from '~/components/molecules';

import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {signUpState, signUpStateAction} from '../store/signUpStore';
import {TermsAndConForm} from '../components/TermsAndConForm';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {modalActions} from '~/components/molecules/Modal';
import {ExitConfirmation} from '~/features/auth/components/ExitConfirmation';
import {ChangeConfirmation} from '~/features/otp/components/ChangeConfirmation';
import {Spacing} from '~/components/atoms';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {get, isEmpty} from 'lodash';
import ConfirmPasswordForm from '../components/ConfirmPasswordForm';
import {sanitizePhoneNumber} from '~/helpers/phoneUtils';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SignUpConfirmPasswordScreen'
>;

const SignUpConfirmPasswordScreen = ({
  route: {
    params: {title, header},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const goToOtpScreen = (isEmailProvider: boolean, identity: object) => {
    navigation.navigate('OTPVerificationScreen', {
      headText: {
        tagline: t('General__Create_new_account', 'Create new account'),
        title: isEmailProvider
          ? t('General__Confirm_your_email', 'Confirm your email')
          : t('General__Confirm_number', 'Confirm your phone number'),
      },
      identity: {
        identifier: get(identity, 'identifier', ''),
        provider: get(identity, 'provider', '') as ProviderType,
      },
      description: t('General__Enter_code', 'General__Enter_code'),
      screenHook: 'SignUpConfirmPasswordScreen',
      leftAction: 'close',
    });
  };

  const handleOnContinueEvent = (
    event: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
  ) => {
    if (prevEvent.name === 'OTPVerificationScreen.OTP_INVALID') {
      const {isEmailProvider, identity} = event.data;
      goToOtpScreen(isEmailProvider, identity);
    } else if (
      prevEvent.name === OTPVerificationScreenEventNames.FAILED ||
      (event.from.params.type === 'wait' &&
        event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001)
    ) {
      navigation.navigate('HomeScreen');
    } else {
      goToProfileInfoScreen();
    }
  };

  useScreenHook('SignUpConfirmPasswordScreen', async (event, prevEvent) => {
    const {name} = event;
    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        await onOtpVerfied();
        break;
      case OTPVerificationScreenEventNames.ABORT:
        modalActions.setContent(
          <ExitConfirmation
            confirmButtonColor="navy"
            textButton={t(
              'Drawer__Warning_leave_flow__Leave',
              'Leave the sign up',
            )}
            confirmExit={goToSignUpScreen}
            onPressCancel={modalActions.hide}
            textDescription={t(
              'General__Leave_description',
              'All previous information entered and consent will be lost.',
            )}
          />,
        );
        modalActions.show();
        break;
      case OTPVerificationScreenEventNames.CHANGE_IDENTIFIER:
        modalActions.setContent(
          <ChangeConfirmation
            provider={event.data.identity.provider}
            confirmExit={goToSignUpScreen}
            onPressCancel={modalActions.hide}
          />,
        );
        modalActions.show();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent);
        break;
      default:
        break;
    }
  });

  const onOtpVerfied = async () => {
    const provider = signUpState.provider.value === 'email' ? 'email' : 'phone';

    navigation.navigate('AnnouncementScreen', {
      type: 'success',
      title: t(
        `Announcement__Signup_${provider}_confirmed__Header`,
        `Your ${provider} is confirmed !`,
      ),
      message: t(
        'General__Sign_up_success',
        'We would like to get to know you better. This helps us offer a more personalized experience.',
      ),
      buttonText: t('General__Next', 'Next'),
      screenHook: 'SignUpConfirmPasswordScreen',
    });
  };

  const goToProfileInfoScreen = () => {
    navigation.navigate('ProfileInfoScreen', {});
  };
  const goToSignUpScreen = () => {
    signUpStateAction.resetRegisterData();
    modalActions.hide();

    navigation.navigate('SignUpScreen');
  };

  const [state, setState] = useState({
    confirmPassword: '',
    showStrengthBar: false,
    errMsgPassword: '',
    errMsgConfirmPassword: '',
    errTermsConditions: false,
  });
  const setErrTermsConditions = (value: boolean) => {
    setState(prevState => {
      return {...prevState, errTermsConditions: value};
    });
  };

  const resetErrorState = () => {
    setState({...state, errTermsConditions: false});
  };

  const onPressTnC = (value: boolean) => {
    if (value === true) {
      setErrTermsConditions(false);
    }
  };
  useState(() => {
    signUpStateAction.setPassword('');
    signUpStateAction.setTermsConditions(false);
  });

  const onPressNext: SubmitHandler<FieldValues> = async data => {
    if (!signUpState.termsConditions.value) {
      setErrTermsConditions(true);
      return;
    }
    signUpStateAction.setPassword(data.password);
    const provider = signUpState.provider.value;
    goToOtpScreen(provider === 'email', {
      identifier:
        provider === 'email'
          ? signUpState.email.value
          : `${signUpState.countryCode.value}${sanitizePhoneNumber(
              signUpState.phone.value,
            )}`,
      provider: provider as ProviderType,
    });
  };

  const onPressLeftAction = () => {
    navigation.goBack();
  };

  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});

  const [setError] = useState<boolean>(false);

  useEffect(() => {
    logScreenView('SignUpConfirmPasswordScreen');
  }, []);

  return (
    <Screen>
      <Header leftAction="goBack" onPressLeftAction={onPressLeftAction} />
      <ScrollView
        className="flex w-full px-6"
        keyboardDismissMode="interactive">
        <HeadText
          tagline={header}
          title={title}
          taglineColor="subtitle-muted"
        />
        <Spacing height={30} />
        <FormProvider {...methods}>
          <ConfirmPasswordForm
            passwordTestId="signup-password-id"
            confirmPasswordTestId="signup-confirm-password-id"
            showStrengthBar={!isEmpty(methods.watch('password'))}
            onFocus={() => methods.clearErrors()}
            passwordName="password"
            confirmPasswordName="confirmPassword"
            setFormErrorPassword={setError}
            setFormErrorConfirmPassword={setError}
            persistentValue={true}
            passwordPlaceholder={t('General__Password', 'Password')}
            {...methods}
          />
        </FormProvider>
        <Spacing height={24} />
        <TermsAndConForm
          onPress={(value: boolean) => {
            onPressTnC(value);
          }}
          error={state.errTermsConditions}
          resetErrorState={resetErrorState}
        />
      </ScrollView>
      <StickyButton
        rightIcon="next"
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(onPressNext)}
      />
    </Screen>
  );
};

export default SignUpConfirmPasswordScreen;
