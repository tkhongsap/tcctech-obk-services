import React, {useCallback, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {ScrollView, View} from 'react-native';

import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import accountAction from '~/states/account/accountAction';
import {settingStateAction} from '~/features/setting/store';
import {Spacing, Text} from '~/components/atoms';
import {
  HeadText,
  PhoneField,
  EmailField,
  StickyButton,
  Header,
  useModal,
  Button,
} from '~/components/molecules';
import {Identity} from '~/models';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {useBackHandler} from '~/utils/useBackHandler';
import {ChangeConfirmation} from '~/features/otp/components/ChangeConfirmation';
import {combineNumberWithCC} from '~/utils/identifier';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {get, includes} from 'lodash';
import {ExitConfirmation} from '~/components/organisms/GenericModal';
import {sanitizePhoneNumber} from '~/helpers/phoneUtils';
import firebaseConfigState from '~/states/firebase';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<RootStackParamList, 'Setup2FAScreen'>;

interface FormProps {
  error: boolean;
  errorMessage: string;
  onChangeText?: (text: string) => void;
  newAccount?: boolean;
}

const EmailForm = (props: FormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    onChangeText,
    newAccount,
  } = props;

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(_error);
    setErrorMessage(_errorMessage);
  }, [_error, _errorMessage]);

  return (
    <>
      <HeadText
        tagline={t('General__2FA', 'Two-Factor Authentication')}
        tagSpacing={12}
        title={t('General__What_email', 'What is your email?')}
        description={
          newAccount
            ? ''
            : t(
                'Account__Account_2fa_email__Body',
                'Please enter your email address to receive a security code for setting up Two-Factor Authentication (2FA).',
              )
        }
      />
      <Spacing height={40} />
      <EmailField
        testID="setup-2fa-email-field"
        error={error}
        helperText={errorMessage}
        onChangeText={onChangeText}
      />
    </>
  );
};
interface PhoneFormProps extends FormProps {
  onChangePhone?: (
    countryCode: string,
    number: string,
    fullNumber: string,
  ) => void;
  newAccount?: boolean;
}

const PhoneForm = (props: PhoneFormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    onChangePhone: _onChangePhone,
    newAccount,
  } = props;

  const onChangeText = useCallback(
    (_cc: string, _number: string, _fullNumber: string) => {
      _onChangePhone && _onChangePhone(_cc, _number, _fullNumber);
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
    <>
      <HeadText
        tagline={t('General__2FA', 'Two-Factor Authentication')}
        tagSpacing={12}
        title={t('General__What_number', 'What is your \nphone number?')}
        description={
          newAccount
            ? ''
            : t(
                'Account__Account_2fa_phone__Body',
                'Please enter your phone number to receive a security code for setting up Two-Factor Authentication (2FA).',
              )
        }
      />
      <Spacing height={40} />
      <PhoneField
        testID="setup-2fa-phone-field"
        error={error}
        helperText={errorMessage}
        onChangeText={onChangeText}
      />
    </>
  );
};

const ExitEnableTwoFAConfirmation = ({onContinue, onCancel}: any) => {
  return (
    <>
      <Text size="B1" weight="medium">
        {t('General__Leave_now?', 'Leave now?')}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__Warning_2fa_signup__Header',
          'You can set 2FA in setting later anytime.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('Drawer__Warning_2fa_signup__Skip', 'Skip for now')}
          onPress={onContinue}
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

const Setup2FAScreen = ({
  route: {
    params: {provider, sourceScreen, newAccount},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [_modalState, modalActions] = useModal();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const handleOTPVerified = async (data: any) => {
    await accountAction.addNewIdentity(
      identifier,
      data.identity.provider,
      data.otp.id,
      countryCode,
    );
    await settingStateAction.toggle2FA(true);
  };

  const goToOtpScreen = (isEmailProvider: boolean, identity: object) => {
    let trimmedIdentifier = sanitizePhoneNumber(identifier);
    // Combine the trimmed identifier with the country code
    const fullIdentifier = combineNumberWithCC(countryCode, trimmedIdentifier);

    navigation.navigate('OTPVerificationScreen', {
      headText: {
        tagline: t('General__2FA', 'Two-Factor Authentication'),
        title: isEmailProvider
          ? t('General__Confirm_your_email', 'Confirm your email')
          : t('General__Confirm_number', 'Confirm your phone number'),
      },
      identity: {
        identifier: fullIdentifier,
        provider: get(identity, 'provider', '') as ProviderType,
      },
      description: t('General__Enter_code', 'Enter the code we just sent you'),
      screenHook: 'Setup2FAScreen',
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
      event.from.params.type === 'success' ||
      (event.from.params.type === 'wait' &&
        event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001)
    ) {
      if (sourceScreen === 'SignUpCompleteScreen') {
        navigation.navigate('HomeScreen');
      } else {
        navigation.navigate('AccountInfoScreen');
      }
    }
  };

  useScreenHook('Setup2FAScreen', async (event, prevEvent) => {
    const {name, data} = event;
    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        await handleOTPVerified(data);
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t('General__2FA_set', 'Two-Factor Authentication is set!'),
          message: t(
            'General__2FA_set_body',
            'Your account is safer than ever with \nthe Two-Factor Authentication (2FA)',
          ),
          buttonText:
            sourceScreen === 'SignUpCompleteScreen'
              ? t('General__Explore', 'Explore')
              : t('General__Back_to_account', 'Back to my account'),
          screenHook: 'Setup2FAScreen',
        });
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case OTPVerificationScreenEventNames.CHANGE_IDENTIFIER:
        modalActions.setContent(
          <ChangeConfirmation
            provider={data.identity.provider}
            confirmExit={() => {
              modalActions.hide();
              navigation.goBack();
            }}
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
        const [isValid, errors] = await identity.validateEmail();
        let language = appLanguageState.currentLanguage.get();
        if (language === '') {
          language = appLanguageState.defaultLanguage.get();
        }

        const title =
          firebaseConfigState.whitelist_announcement.title[language].value;
        const body =
          firebaseConfigState.whitelist_announcement.body[language].value;

        if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
          setError(true);
          setErrorMessage(
            t(
              'General__Error_mail_domain',
              'Please use the authorized mail domain',
            ),
          );
          _error = !isValid;

          break;
        }
        setError(!isValid);
        setErrorMessage(errors.identifier?.messages[0] || '');
        _error = !isValid;
        break;
      }
      case 'phone': {
        const identity = new Identity({
          identifier,
          provider,
        });
        const [isValid, errors] = await identity.validatePhone(
          true,
          true,
          countryCode,
        );
        let language = appLanguageState.currentLanguage.get();
        if (language === '') {
          language = appLanguageState.defaultLanguage.get();
        }

        const title =
          firebaseConfigState.whitelist_announcement.title[language].value;
        const body =
          firebaseConfigState.whitelist_announcement.body[language].value;

        console.log(errors.identifier?.messages);
        if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
          setError(true);
          setErrorMessage(
            t('General__Error_phone_domain', 'Please use the authorized phone'),
          );
          _error = !isValid;

          break;
        }
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
    goToOtpScreen(provider === 'email', {
      identifier: combineNumberWithCC(countryCode, identifier),
      provider,
    });
  };

  const handleOnContinueExitConfirmation = () => {
    modalActions.hide();

    if (sourceScreen === 'SignUpCompleteScreen') {
      navigation.navigate('HomeScreen');
    } else {
      navigation.navigate('AccountInfoScreen');
    }
  };

  const handleOnPressLeftAction = () => {
    if (sourceScreen !== 'SignUpCompleteScreen') {
      modalActions.setContent(
        <ExitConfirmation
          onContinue={handleOnContinueExitConfirmation}
          onCancel={() => modalActions.hide()}
        />,
      );
    } else {
      modalActions.setContent(
        <ExitEnableTwoFAConfirmation
          onContinue={handleOnContinueExitConfirmation}
          onCancel={() => modalActions.hide()}
        />,
      );
    }
    modalActions.show();
  };

  const handleOnPhoneChange = useCallback(
    (contryCode: string, number: string) => {
      setCountryCode(contryCode);
      setIdentifier(number);
    },
    [],
  );

  useBackHandler(() => {
    if (newAccount) {
      handleOnPressLeftAction();
      return true;
    }
    return false;
  });

  useEffect(() => {
    logScreenView('Setup2FAScreen');
  }, []);

  return (
    <Screen>
      <Header
        leftAction={newAccount ? 'close' : 'goBack'}
        onPressLeftAction={newAccount ? handleOnPressLeftAction : undefined}
      />
      <ScrollView className="w-full px-6">
        {provider === 'email' ? (
          <EmailForm
            error={error}
            errorMessage={errorMessage}
            onChangeText={setIdentifier}
            newAccount={newAccount}
          />
        ) : (
          <PhoneForm
            error={error}
            errorMessage={errorMessage}
            onChangePhone={handleOnPhoneChange}
            newAccount={newAccount}
          />
        )}
      </ScrollView>
      <StickyButton
        testID="continue"
        title={t('General__Continue', 'Continue')}
        onPress={onPressNext}
        rightIcon="next"
      />
    </Screen>
  );
};

export default Setup2FAScreen;
