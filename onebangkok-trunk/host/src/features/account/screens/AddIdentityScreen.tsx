import React, {useEffect, useRef, useState} from 'react';
import {Screen} from '~/components/templates';
import {Header, StickyButton, useModal} from '~/components/molecules';
import {ScrollView} from 'react-native';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {IdentifierFrom} from '~/components/organisms/IdentifierFrom';
import {useNavigation} from '@react-navigation/native';
import {useScreenHook} from '~/services/EventEmitter';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import accountAction from '~/states/account/accountAction';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {ExitConfirmation} from '~/components/organisms/GenericModal';
import {combineNumberWithCC} from '~/utils/identifier';
import {get} from 'lodash';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {sanitizePhoneNumber} from '~/helpers/phoneUtils';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<RootStackParamList, 'AddIdentityScreen'>;

const AddIdentityScreen = ({
  route: {
    params: {provider},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const identifierRef = useRef<any>();
  const [identifier, setIdentifier] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [_modalState, modalActions] = useModal();

  const handleOTPVerified = async (data: any) => {
    return await accountAction.addNewIdentity(
      identifier,
      data.identity.provider,
      data.otp.id,
      countryCode,
    );
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

  const goToOtpScreen = (
    isEmailProvider: boolean,
    identity: object,
    screenHook: string,
    action?: string,
  ) => {
    navigation.navigate('OTPVerificationScreen', {
      headText: {
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
      action: action,
      leftAction: 'close',
      title:
        provider === 'phone'
          ? t('General__Phone_number', 'Phone number')
          : t('General__Email', 'Email'),
    });
  };
  const onPressContinue = async () => {
    if (identifierRef.current) {
      const error = await identifierRef.current.validateIdentity();
      if (!error) {
        const sanitizedNumber = sanitizePhoneNumber(identifier);
        goToOtpScreen(
          provider === 'email',
          {
            identifier: combineNumberWithCC(countryCode, sanitizedNumber),
            provider,
          },
          'AddIdentityScreen',
        );
      }
    }
  };

  useScreenHook('AddIdentityScreen', async (event, prevEvent) => {
    const {name, data} = event;
    const message =
      provider === 'phone'
        ? t(
            'Announcement__Add_phone_success__Body',
            'You have added the phone number',
          )
        : t('Anouncement__Add_email_success__Body', 'You have added the email');

    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        const result = await handleOTPVerified(data);
        if (result) {
          navigation.navigate('AnnouncementScreen', {
            type: 'success',
            title:
              provider === 'phone'
                ? t(
                    'Announcement__Add_phone_success__Header',
                    'Added Successfully',
                  )
                : t(
                    'Anouncement__Add_email_success__Header',
                    'Added Successfully',
                  ),
            message: message,
            messageDescription: data.identity.identifier,
            buttonText: t('General__Back_to_account', 'Back to my account'),
            screenHook: 'AddIdentityScreen',
          });
        }
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case OTPVerificationScreenEventNames.CHANGE_IDENTIFIER:
        setIdentifier('');
        navigation.goBack();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        if (prevEvent.name === 'OTPVerificationScreen.OTP_INVALID') {
          const {isEmailProvider, identity, screenHook, action} = event.data;
          goToOtpScreen(isEmailProvider, identity, screenHook, action);
          break;
        }
        navigation.navigate('AccountInfoScreen');
        break;
      default:
        break;
    }
  });

  const titleAndLabel =
    provider === 'phone'
      ? t('General__Phone_number', 'Phone number')
      : t('General__Email', 'Email');

  useEffect(() => {
    logScreenView('AddIdentityScreen');
  }, []);

  return (
    <Screen>
      <Header leftAction="goBack" title={titleAndLabel} />
      <ScrollView className="w-full px-6">
        <IdentifierFrom
          ref={identifierRef}
          provider={provider}
          setIdentifier={setIdentifier}
          identifier={identifier}
          label={titleAndLabel}
          setCountryCode={setCountryCode}
          countryCode={countryCode}
        />
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        onPress={onPressContinue}
        rightIcon="next"
      />
    </Screen>
  );
};
export default AddIdentityScreen;
