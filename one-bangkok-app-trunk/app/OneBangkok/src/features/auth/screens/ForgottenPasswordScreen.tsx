import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {Identity} from '~/models/Identity';
import {
  EmailField,
  PhoneField,
  HeadText,
  StickyButton,
  Header,
  useModal,
} from '~/components/molecules';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {Spacing, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import {resetPasswordStateAction} from '../store/resetPasswordStore';
import {ExitConfirmation} from '~/features/auth/components/ExitConfirmation';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {combineNumberWithCC} from '~/utils/identifier';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {get} from 'lodash';
import {sanitizePhoneNumber} from '~/helpers/phoneUtils';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ForgottenPasswordScreen'
>;

const DescriptionText = ({provider}: any) => {
  return (
    <Text
      className={getTheme('text-muted text-base font-normal leading-tight')}>
      {provider === 'email'
        ? t(
            'Reset_password__Reset_password_email__Body',
            'Before we change your password, we need to confirm your identity.\n\nEnter your email and you will receive a link to reset your password.',
          )
        : t(
            'Reset_password__Reset_password_phone__Body',
            'Before we change your password, we need to confirm your identity.\n\nEnter your phone and you will receive a link to reset your password.',
          )}
    </Text>
  );
};

interface FormProps {
  error: boolean;
  errorMessage: string;
  handleOnChangeText?: (text: string) => void;
}

const EmailForm = (props: FormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    handleOnChangeText,
  } = props;

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(_error);
    setErrorMessage(_errorMessage);
  }, [_error, _errorMessage]);

  return (
    <View>
      <EmailField
        error={error}
        helperText={errorMessage}
        onChangeText={handleOnChangeText}
        labelText={t('General__Email', 'Email')}
      />
    </View>
  );
};

const goToOtpScreen = (
  isEmailProvider: boolean,
  identity: object,
  navigation: StackNavigation,
  screenHook: string,
  action?: string,
) => {
  navigation.navigate('OTPVerificationScreen', {
    headText: {
      tagline: t('General__Reset_password', 'Reset password'),
      title: isEmailProvider
        ? t('General__Confirm_your_email', 'Confirm your email')
        : t('General__Confirm_number', 'Confirm your phone number'),
    },
    identity: {
      identifier: get(identity, 'identifier', ''),
      provider: get(identity, 'provider', '') as ProviderType,
    },
    description: t('General__Enter_code', 'Enter the code we just sent you'),
    screenHook: screenHook,
    allowChangeIdentifier: false,
    leftAction: 'close',
    action,
  });
};

interface PhoneFormProps extends FormProps {
  onChangePhone?: (
    countryCode: string,
    number: string,
    fullNumber: string,
  ) => void;
}

const PhoneForm = (props: PhoneFormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    onChangePhone: _onChangePhone,
  } = props;

  const handleOnChangeText = useCallback(
    (_cc: string, _number: string, _fullNumber: string) => {
      let trimmedNumber = sanitizePhoneNumber(_number);
      _onChangePhone && _onChangePhone(_cc, trimmedNumber, _fullNumber);
    },
    [_onChangePhone],
  );

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(_error);
    setErrorMessage(_errorMessage);
  }, [_error, _errorMessage]);

  return (
    <View>
      <PhoneField
        error={error}
        helperText={errorMessage}
        onChangeText={handleOnChangeText}
        label={t('General__Phone_number', 'Phone number')}
      />
    </View>
  );
};

const ForgottenPasswordScreen = ({
  route: {
    params: {provider},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [_modalState, modalActions] = useModal();

  const handleOnPressLeftAction = () => {
    modalActions.setContent(
      <ExitConfirmation
        confirmExit={() => {
          modalActions.hide();
          navigation.navigate('SignInScreen');
        }}
        onPressCancel={modalActions.hide}
        confirmButtonColor="navy"
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
      goToOtpScreen(isEmailProvider, identity, navigation, screenHook, action);
    } else if (
      event.from.params.type === 'wait' &&
      event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001
    ) {
      navigation.navigate('HomeScreen');
    }
  };

  useScreenHook('ForgottenPasswordScreen', async (event, prevEvent) => {
    const {name} = event;
    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        resetPasswordStateAction.setIdentityVariable(
          identifier,
          countryCode,
          provider,
          event.data.otp.id,
          event.data.otp.reference,
        );
        navigation.navigate('ResetPasswordScreen');
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case OTPVerificationScreenEventNames.CHANGE_IDENTIFIER:
        navigation.goBack();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent);
        break;
      default:
        break;
    }
  });

  const resetError = () => {
    setError(() => false);
    setErrorMessage(() => '');
  };

  const onPressNext = async () => {
    let _error = false;
    await resetError();

    switch (provider) {
      case 'email': {
        const identity = new Identity({
          identifier,
          provider,
        });
        const [isValid, errors] = await identity.validateEmail(true, false);

        setError(!isValid);
        setErrorMessage(errors.identifier?.messages[0] || '');
        _error = !isValid;
        break;
      }
      case 'phone': {
        const identity = new Identity({
          identifier,
          provider,
          countryCode,
        });
        const [isValid, errors] = await identity.validatePhone(
          true,
          false,
          countryCode,
        );
        setError(!isValid);
        setErrorMessage(errors.identifier?.messages[0] || '');
        _error = !isValid;
        break;
      }
      default:
        break;
    }
    if (_error) {
      return;
    }
    goToOtpScreen(
      provider === 'email',
      {
        identifier: combineNumberWithCC(countryCode, identifier),
        provider,
      },
      navigation,
      'ForgottenPasswordScreen',
    );
  };

  const handleOnEmailChange = (text: string) => {
    setIdentifier(text);
  };

  const handleOnPhoneChange = useCallback(
    (contryCode: string, number: string) => {
      setCountryCode(contryCode);
      setIdentifier(number);
    },
    [],
  );

  useEffect(() => {
    resetPasswordStateAction.reset();
  }, []);

  useEffect(() => {
    logScreenView('ForgottenPasswordScreen');
  }, []);

  return (
    <Screen>
      <Header leftAction="goBack" />
      <ScrollView
        className="flex w-full px-6"
        keyboardDismissMode="interactive">
        <View className=" w-full">
          <HeadText
            tagline={t('General__Reset_password', 'Reset password')}
            title={t('General__Forgotten_password', 'Forgotten password')}
          />
          <Spacing height={4} />
          <DescriptionText provider={provider} />
          <Spacing height={32} />
          {provider === 'email' ? (
            <EmailForm
              error={error}
              errorMessage={errorMessage}
              handleOnChangeText={handleOnEmailChange}
            />
          ) : (
            <PhoneForm
              error={error}
              errorMessage={errorMessage}
              onChangePhone={handleOnPhoneChange}
            />
          )}
        </View>
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={onPressNext}
      />
    </Screen>
  );
};

export default ForgottenPasswordScreen;
