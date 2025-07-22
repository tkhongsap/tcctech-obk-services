import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  RootStackParamList,
  useNavigation,
  removeScreenFromStack,
} from '~/navigations/AppNavigation';
import Dayjs from 'dayjs';

import t from '~/utils/text';

import {Text} from '~/components/atoms';
import {HeadText, Header, OTPField} from '~/components/molecules';
import {Screen} from '~/components/templates';
import {Spacing} from '~/components/atoms';
import {OTPService} from '~/services';
import {createNotifyScreenHook} from '~/services/EventEmitter';
import {OTPVerificationScreenEventTypes} from './OTPVerificationScreenEvent';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {useBackHandler} from '~/utils/useBackHandler';
import {OTP_TRY_LIMIT} from '../constants/OTPVerification';
import {SpecialWidget} from '~/components/Announcement';
import {logScreenView} from '~/utils/logGA';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
type Props = NativeStackScreenProps<
  RootStackParamList,
  'OTPVerificationScreen'
>;

interface OTPResendProps {
  provider: string;
  onPress: () => void;
  sentAt: number;
}

const OTPResend = (props: OTPResendProps) => {
  const {provider, onPress, sentAt} = props;

  const COUNT_DOWN_SECONDS = 60;
  const TIME_INTERVAL = 1000;
  const TIMEOUT = (COUNT_DOWN_SECONDS + 1) * 1000;
  const [countDown, setCountDown] = useState(COUNT_DOWN_SECONDS);
  const [resendAble, setResendAble] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Dayjs().unix();
      const remainingTIme = COUNT_DOWN_SECONDS - (now - sentAt);

      setCountDown(remainingTIme);

      if (remainingTIme < 1) {
        setResendAble(true);
      }
    }, TIME_INTERVAL);

    setTimeout(() => {
      clearInterval(intervalId);
    }, TIMEOUT);

    return () => clearInterval(intervalId);
  }, [TIMEOUT, sentAt]);

  const rensendText =
    provider === 'email'
      ? t('General__Resend_email', 'Resend Email')
      : t('General__Resend_otp', 'Resend OTP');

  const handleOnPress = () => {
    setCountDown(COUNT_DOWN_SECONDS);
    setResendAble(false);
    onPress();
  };

  return (
    <Text size="B2">
      <Text
        size="B2"
        color={resendAble ? 'primary' : 'muted'}
        onPress={() => resendAble && handleOnPress()}>
        {rensendText}
      </Text>
      {countDown > 0 && (
        <Text size="B2">
          {' '}
          ({countDown}{' '}
          {countDown > 1
            ? t('General__Seconds', 'seconds')
            : t('General__Second', 'second')}
          ){' '}
        </Text>
      )}
    </Text>
  );
};

export const OTPVerificationScreen = (routes: Props) => {
  const {
    route: {
      params: {
        headText,
        identity,
        description,
        allowChangeIdentifier,
        leftAction,
        screenHook,
        title,
        action,
      },
    },
  } = routes;

  const navigation = useNavigation();

  navigation.addListener('blur', () => {
    removeScreenFromStack(navigation, routes.route.key);
  });

  const notifyScreenHook =
    createNotifyScreenHook<OTPVerificationScreenEventTypes>(routes.route)();

  const memoizedOTPService = useMemo(() => OTPService.create(), []);

  const [otp, setOTP] = useState({
    reference: '',
    error: false,
    errorMessage: '',
    sentAt: undefined,
    resendAble: false,
    tryCount: 0,
    needValidate: false,
    value: '',
  });

  const resetOTPTryCount = () => {
    setOTP(prevState => {
      return {
        ...prevState,
        tryCount: 0,
      };
    });
  };
  const resetOTPNeedValidate = () => {
    setOTP(prevState => {
      return {
        ...prevState,
        needValidate: false,
      };
    });
  };
  const updateOTP = (data: any) => {
    setOTP(prevState => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const sendOTP = useCallback(async () => {
    const result = await memoizedOTPService.request(
      identity.identifier,
      identity.provider,
    );
    const {data, error} = result;
    if (error) {
      if (error.code === errorCodeOBIAM.IAM_OTP_001) {
        notifyScreenHook(screenHook, 'FAILED', result);
        navigation.navigate('AnnouncementScreen', {
          type: 'wait',
          title: t(
            'Announcement__Limit_otp__Header',
            'You have reached\nthe time limit',
          ),
          message: t(
            'Announcement__Limit_otp__Body',
            'Please wait for 60 mins before trying again.',
          ),
          buttonText: t('General__Back_to_explore', 'Back to Explore'),
          screenHook,
          data: result,
        });
      }
    } else {
      updateOTP({reference: data?.otp.reference, sentAt: Dayjs().unix()});
      resetOTPTryCount();
    }
  }, [identity, memoizedOTPService, navigation, screenHook, notifyScreenHook]);

  useEffect(() => {
    sendOTP();
  }, [sendOTP]);

  useEffect(() => {
    if (otp.needValidate) {
      (async () => {
        resetOTPNeedValidate();
        const {data} = await memoizedOTPService.verify(
          otp.value,
          otp.reference,
        );
        if (data) {
          await residentialTenantAction.getTenantId(true)
          notifyScreenHook(screenHook, 'OTP_VERIFIED', {
            identity: {
              identifier: identity.identifier,
              provider: identity.provider,
            },
            otp: {
              id: data.otp.id,
              reference: otp.reference,
            },
          });
        } else {
          notifyScreenHook(screenHook, 'OTP_INVALID', {});
          await updateOTP({
            error: true,
            errorMessage: t('General__Invalid_code', 'Invalid code'),
          });
          if (otp.tryCount >= OTP_TRY_LIMIT) {
            navigation.navigate('AnnouncementScreen', {
              type: 'error',
              title: t(
                'Announcement__Incorrect_otp__Header',
                'Too many incorrect OTP attempts',
              ),
              message: t(
                'Announcement__Incorrect_otp__Body',
                "You've entered an incorrect OTP 3 times. Please request a new OTP.\n\nKeep in mind that you can only request 5 OTPs per hour. This ensures security of our system\n\nIf you need help, please contact our support:",
              ),
              buttonText: t('General__Request_new_otp', 'Request new OTP'),
              specialWidget: SpecialWidget.contactSupport,
              screenHook,
              data: {
                isEmailProvider: identity.provider === 'email',
                identity: identity,
                screenHook,
                action,
              },
            });
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.needValidate, otp.value, otp.tryCount]);

  const handleOnChangeOTP = async (value: string) => {
    await updateOTP({error: false, errorMessage: ''});

    if (value.length >= 6) {
      await updateOTP({
        tryCount: otp.tryCount + 1,
        needValidate: true,
        value: value,
      });
    }
  };

  const handleOnAbort = () => notifyScreenHook(screenHook, 'ABORT', {});

  const handleOnChangeIdentifier = () =>
    notifyScreenHook(screenHook, 'CHANGE_IDENTIFIER', {
      identity,
    });

  useBackHandler(() => {
    handleOnAbort();
    return true;
  });
  useEffect(() => {
    logScreenView('OTPVerificationScreen');
  }, []);
  return (
    <Screen>
      <Header
        leftAction={leftAction}
        onPressLeftAction={handleOnAbort}
        title={title}
      />
      <View className="flex px-7 w-full">
        <HeadText tagline={headText.tagline} title={headText.title} />
        <Spacing height={24} />
        <View>
          <Text>
            {t('General__Sent_to', 'Sent to')}{' '}
            <Text weight="medium">
              {identity.identifier} (ref: {otp.reference})
            </Text>
          </Text>
          <Text>{description}</Text>
          <Spacing height={40} />
          <OTPField
            error={otp.error}
            helperText={otp.errorMessage}
            onChangeText={handleOnChangeOTP}
            testID="otp-field-id"
          />
          <Spacing height={32} />
          {/* TODO: Move OTP Resend countdown to a proper place */}
          {otp.sentAt && (
            <Text>
              <OTPResend
                provider={identity.provider}
                onPress={sendOTP}
                sentAt={otp.sentAt}
              />
              {allowChangeIdentifier !== false && (
                <>
                  <Text size="B2"> {t('General__or', 'or')} </Text>
                  <Text
                    color="primary"
                    size="B2"
                    onPress={handleOnChangeIdentifier}>
                    {identity.provider === 'email'
                      ? t('General__Change_Email', 'Change Email')
                      : t('General__Change_number', 'Change Number')}
                  </Text>
                </>
              )}
            </Text>
          )}
        </View>
      </View>
    </Screen>
  );
};
