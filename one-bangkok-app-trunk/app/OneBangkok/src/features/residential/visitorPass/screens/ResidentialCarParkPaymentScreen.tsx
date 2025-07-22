import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {AxiosResponse} from 'axios';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import {
  ParkingTicketsIndexTypeEnum,
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
      ticketId: string;
      ticketType: ParkingTicketsIndexTypeEnum;
      fee: number;
      logId: string;
      subCode: string | null;
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

const ResidentialCarParkPaymentScreen = (props: IParkingPaymentScreenProps) => {
  const navigation = useNavigation<StackNavigation>();

  const countDownTime =
    firebaseConfigState.payment_success_count_down.value || 30 * 1000;

  let timerRef: any = useRef<null>(null);
  const [isZeroFee, setIsZeroFee] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(countDownTime);

  const {ticketId, ticketType, fee, logId, subCode} = props.route.params;

  useEffect(() => {
    logScreenView('ResidentialCarParkPaymentScreen');
  }, []);

  useEffect(() => {
    const pollingCallback = async () => {
      console.log('Polling for payment data...');
      const data = await fetchPaymentData();
      console.log('pollingCallbackData:', data);
      if (isEmpty(data) || data?.total_fee === 0) {
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

  const handleGoback = () => navigation.goBack();

  const fetchPaymentData =
    async (): Promise<WrappedResponseParkingTicketDataData> => {
      const res: AxiosResponse<WrappedResponseParkingTicketDataArray, any> =
        await OB_BMS_SDK.client
          .parkingResidentialTicketsIndex(ticketType, ticketId)
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
      console.log('====================================');
      console.log('fetchPaymentData : ', res.data);
      console.log('====================================');
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
          title={t(
            'Residential__Bill_And_Payment__Car_Park_Payment',
            'Car Park Payment',
          )}
        />
      )}
      <SafeAreaView className="flex-1">
        <WebView
          scalesPageToFit={true}
          className="flex-1"
          source={{
            uri: `${carParkUrl}/info/${logId}/payMethod?logId=${logId}&total=${fee}&hideBack=1&hideHeader=1&hideDoneSuccess=1&hideTryAgainUnsuccess=1&type=Residential&subCode=${
              subCode || null
            }`,
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
            'General__Parking_payment_countinuing_next_step_Residential',
            'Done (This page will close in 60s)',
            {time: countDown},
          )}
          rightIcon="next"
          iconHeight={25}
          iconWidth={25}
          color="dark-teal"
          onPress={handleGoback}
        />
      )}
    </View>
  );
};

export default ResidentialCarParkPaymentScreen;
