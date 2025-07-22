import dayjs from 'dayjs';
import {get, isEmpty, isNull} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {Header} from '~/components/molecules';
import QRCodeWidget from '~/components/molecules/QrCode';
import qrTokenService from '~/services/QRTokenService';
import t from '~/utils/text';
import ShortCut from '../components/shortcut';
import {ScrollView} from 'react-native-gesture-handler';
import {memberAction} from '../store/member';
import {Screen} from '~/components/templates/Screen';
import {
  TouchableOpacity,
  View,
  AppState,
  AppStateStatus,
  Platform,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Spacing, Text} from '~/components/atoms';
import Switch from '~/components/atoms/Switch';
import {
  buildingAccessAction,
  buildingAccessState,
  useBuildingAccessState,
} from '../store/buildingAccess';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {useFocusEffect} from '@react-navigation/native';
import {logScreenView} from '~/utils/logGA';

const BRIGHTNESS_LEVEL = 1;

const ResidentialBuildingAccessQrScreen = () => {
  const [qrValue, setQrValue] = useState('');
  const [qrCountdownSeconds, setQrCountdownSeconds] = useState(0);
  const [qrGenerationTime, setQrGenerationTime] = useState(0);
  const [isFsMember, setIsFsMember] = useState(false);
  const {showMyQrWhenLaunchesApp} = useBuildingAccessState();

  const setBrightnessToDefault = async (brightnessCurrent: number) => {
    await DeviceBrightness.setBrightnessLevel(brightnessCurrent);
  };

  const getBrightnessOfDevice = async () => {
    let brightnessCurrent: any;
    if (Platform.OS === 'ios') {
      brightnessCurrent = await DeviceBrightness.getBrightnessLevel();
    } else if (Platform.OS === 'android') {
      brightnessCurrent = await DeviceBrightness.getSystemBrightnessLevel();
    }
    await DeviceBrightness.setBrightnessLevel(BRIGHTNESS_LEVEL);

    return brightnessCurrent;
  };
  const handleAppStateChange = async (
    brightnessDefault: number,
    nextAppState: AppStateStatus,
  ) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      await setBrightnessToDefault(brightnessDefault);
    } else if (nextAppState === 'active') {
      await DeviceBrightness.setBrightnessLevel(BRIGHTNESS_LEVEL);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let brightnessDefault = 0;
      const getBrightnessDefault = async () => {
        brightnessDefault = await getBrightnessOfDevice();
      };

      getBrightnessDefault();

      const appState = AppState.addEventListener('change', nextAppState =>
        handleAppStateChange(brightnessDefault, nextAppState),
      );

      return () => {
        setBrightnessToDefault(brightnessDefault);
        appState.remove();
      };
    }, []),
  );

  const generateQrCode = async () => {
    const result = await qrTokenService.generate();
    const qrData = get(result, 'data');

    if (!isNull(qrData) && !isEmpty(qrData)) {
      const token = qrData.token;
      const expirationTimestamp = dayjs(token.expired_date).unix();
      const generationTimestamp = dayjs().unix();
      const tokenString = JSON.stringify(token);
      setQrValue(tokenString);
      setQrCountdownSeconds(expirationTimestamp - generationTimestamp);
      setQrGenerationTime(generationTimestamp);
    }
  };

  const fetchQrCode = useCallback(async () => {
    const result = await qrTokenService.get();
    const qrData = get(result, 'data');

    if (isNull(qrData) || isEmpty(qrData)) {
      await generateQrCode();
    } else {
      const token = qrData.token;
      const expirationTimestamp = dayjs(token.expired_date).unix();
      const generationTimestamp = dayjs().unix();
      const tokenString = JSON.stringify(token);
      setQrValue(tokenString);
      setQrCountdownSeconds(expirationTimestamp - generationTimestamp);
      setQrGenerationTime(generationTimestamp);
    }
  }, []);

  const getMemberId = useCallback(async () => {
    const result = await memberAction.getMemberId();
    setIsFsMember(result);
    console.log('member id result = ', result);
  }, []);

  useEffect(() => {
    getMemberId();
    fetchQrCode();
  }, [fetchQrCode, getMemberId]);

  const handleOnSwitch = () => {
    buildingAccessAction.setShowMyQrWhenLaunchesApp(
      !buildingAccessState.showMyQrWhenLaunchesApp.value,
    );
  };

  useEffect(() => {
    logScreenView('ResidentialBuildingAccessQrScreen');
  }, []);

  return (
    <Screen>
      <Header
        title={t('Residential__My_QR_Code', 'My QR Code')}
        leftAction="goBack"
      />
      <ScrollView
        className={`w-full ${isFsMember ? getTheme('bg-light-gray') : ''}`}
        bounces={false}
        overScrollMode="never">
        {qrValue && qrCountdownSeconds > 0 && qrGenerationTime > 0 && (
          <>
            <View className={`${getTheme('bg-default')} px-5`}>
              <Spacing height={16} />
              <QRCodeWidget
                value={qrValue}
                description={t(
                  'Residential__My_QR_Code__Des',
                  'Use this for building access, car park, payment, etc. within One Bangkok',
                )}
                onRegenerate={() => {
                  generateQrCode();
                }}
                initialCountdown={qrCountdownSeconds}
                generateTime={qrGenerationTime}
              />
              <View
                className={`flex-row justify-between py-3 px-5 ${getTheme(
                  'border border-line',
                )}`}>
                <View className="w-10/12">
                  <Text>
                    {t('General__Show_qr', 'Show my QR code when app launches')}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleOnSwitch} activeOpacity={1}>
                  <View className="flex justify-center" pointerEvents="none">
                    <Switch
                      value={showMyQrWhenLaunchesApp.value}
                      onValueChange={handleOnSwitch}
                      disabled={false}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <Spacing height={16} />
            </View>

            <ShortCut isFsMember={isFsMember} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default ResidentialBuildingAccessQrScreen;
