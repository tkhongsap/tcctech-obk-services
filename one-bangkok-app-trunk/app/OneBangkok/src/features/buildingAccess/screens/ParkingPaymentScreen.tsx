import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {AxiosResponse} from 'axios';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import {
  WrappedResponseParkingTicketDataArray,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import Config from 'react-native-config';

import {Header, StickyButton} from '~/components/molecules';

import {logScreenView} from '~/utils/logGA';
import t from '~/utils/text';

import {memberState} from '../store/member';

import {StackNavigation} from '~/navigations/AppNavigation';

import firebaseConfigState from '~/states/firebase';

import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

interface IParkingPaymentScreenProps {
  route: {
    params: {
      logId: string;
      fee: number;
    };
  };
}

const carParkUrl = Config.CAR_PARK_URL || 'https://carpark.onebangkok.com';
const pollingInterval = 5000;

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        statuses =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

const ParkingPaymentScreen = (props: IParkingPaymentScreenProps) => {
  const navigation = useNavigation<StackNavigation>();

  const countDownTime = firebaseConfigState.payment_success_count_down.value;

  let timerRef: any = useRef<null>(null);
  const [isZeroFee, setIsZeroFee] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(countDownTime);

  const {fee, logId} = props.route.params;

  useEffect(() => {
    logScreenView('ParkingTicketScreen');
  }, []);

  useEffect(() => {
    const pollingCallback = async () => {
      console.log('Polling for payment data...');
      const data = await fetchPaymentData();
      if (data?.total_fee === 0) {
        setIsZeroFee(true);
      } else {
        setIsZeroFee(false);
      }
    };

    const startPolling = () => {
      timerRef.current = setInterval(pollingCallback, pollingInterval);
    };

    const stopPolling = () => {
      clearInterval(timerRef?.current);
    };

    if (!isZeroFee) {
      startPolling();
    } else {
      stopPolling();
    }

    if (isZeroFee) {
      const timer = setInterval(() => {
        setCountDown(prev => prev - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }

    return () => {
      stopPolling();
    };
  }, [isZeroFee]);

  useEffect(() => {
    if (countDown === 0) {
      handleGoback();
    }
  }, [countDown]);

  // const handleGoback = () => navigation.goBack();
  const handleGoback = () => navigation.navigate('ParkingTicketScreen');

  const fetchPaymentData =
    async (): Promise<WrappedResponseParkingTicketDataData> => {
      const id = memberState.id.value ?? '';
      const res: AxiosResponse<WrappedResponseParkingTicketDataArray, any> =
        await OB_BMS_SDK.client
          .parkingTicketsIndex('member_id', id)
          .catch(() => {
            console.log('Error fetching parking ticket data');
            return {} as AxiosResponse<
              WrappedResponseParkingTicketDataArray,
              any
            >;
          });
      if (isEmpty(res.data?.data)) {
        return {} as WrappedResponseParkingTicketDataData;
      }
      return res.data?.data[0];
    };

  const INJECTED_JAVASCRIPT = `(function() {
    document.addEventListener('click', function(event) {
      if (event.target.matches('a[download]')) {
        window.ReactNativeWebView.postMessage(event.target.href);
      }
    });
  })();`;

  const handleOnMessage = async (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    const isImage = event.nativeEvent.data.startsWith('data:image');
    if (isImage) {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        console.error('Error for grained permissions');
      }
      const filePath = `${RNFS.CachesDirectoryPath}/qr.png`;
      const base64Data = data.replace(/^data:image\/png;base64,/, '');
      await RNFS.writeFile(filePath, base64Data, 'base64');
      await CameraRoll.saveAsset(filePath, {type: 'photo'});
    }
  };

  return (
    <View className="flex-1">
      {!isZeroFee && (
        <Header
          leftAction="goBack"
          title={t('General__Parking_payment_method', 'Payment Method')}
        />
      )}
      <SafeAreaView className="flex-1">
        <WebView
          scalesPageToFit={true}
          className="flex-1"
          source={{
            uri: `${carParkUrl}/info/${logId}/payMethod?logId=${logId}&total=${fee}&hideBack=1&hideHeader=1&hideDoneSuccess=1&hideTryAgainUnsuccess=1`,
          }}
          nestedScrollEnabled
          injectedJavaScript={INJECTED_JAVASCRIPT}
          onMessage={handleOnMessage}
          originWhitelist={['*']}
        />
      </SafeAreaView>
      {isZeroFee && (
        <StickyButton
          title={t(
            'General__Parking_payment_countinuing_next_step',
            'Done (continuing in {{time}}s)',
            {time: countDown},
          )}
          rightIcon="next"
          iconHeight={25}
          iconWidth={25}
          onPress={handleGoback}
        />
      )}
    </View>
  );
};

export default ParkingPaymentScreen;
