import {View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Text} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '~/features/residential/components';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {Header} from '../../components/Header';
import t from '~/utils/text';
import firebaseConfigState from '~/states/firebase';
import {TResidenceMember} from '../../types/residenceMemberTypes';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

const ResidentialVisitorPassHomeScreen = () => {
  const navigation = useNavigation();
  const enabledCarParkPayment =
    firebaseConfigState.enable_residential_car_park_payment.value || false;
  const enabledCarParkRedemption =
    firebaseConfigState.enable_residential_car_park_redemption.value || false;
  const enabledBillPayment =
    firebaseConfigState.enable_residential_bill_payment.value || false;

  const [isLoading, setIsLoading] = useState(false);
  const [residenceMember, setResidenceMember] =
    useState<TResidenceMember | null>(null);

  useEffect(() => {
    const preload = async () => {
      try {
        setIsLoading(true);
        const rsMember = await residentialTenantAction.getResidenceMember();
        setResidenceMember(rsMember);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    preload();
  }, []);

  const isNetConnected = async () => {
    return (await NetInfo.fetch()).isConnected;
  };
  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        let status = await check(PERMISSIONS.IOS.CAMERA);
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          return true;
        }
        status = await request(PERMISSIONS.IOS.CAMERA);
        return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
      }

      if (Platform.OS === 'android') {
        let status = await check(PERMISSIONS.ANDROID.CAMERA);
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          return true;
        }
        status = await request(PERMISSIONS.ANDROID.CAMERA);
        return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
      }
      return false;
    } catch (error) {
      console.error('Error requesting camera:', error);
      return false;
    }
  };

  const onPressCarParkPayment = () => {
    if (enabledCarParkPayment) onPressExploreCamera('CAR_PARK_PAYMENT');
    else
      navigation.navigate('RestrictedAccessScreen', {
        title: t(
          'Residential__Bill_And_Payment__Car_Park_Payment',
          'Car Park Payment',
        ),
      });
  };

  const onPressCarParkRedemption = () => {
    if (enabledCarParkRedemption) {
      onPressExploreCamera('REDEMPTION_CAR_PARK');
    } else {
      navigation.navigate('RestrictedAccessScreen', {
        title: t(
          'Residential__Bill_And_Payment__Car_Park_Redemption',
          'Car Park Redemption',
        ),
      });
    }
  };

  const onPressBillPayment = () => {
    if (enabledBillPayment) return;
    else
      navigation.navigate('RestrictedAccessScreen', {
        title: t('Residential__Bill_And_Payment', 'Bills and Payments'),
      });
  };

  const onPressExploreCamera = async (
    key: 'CAR_PARK_PAYMENT' | 'REDEMPTION_CAR_PARK',
  ) => {
    const isConnected = await isNetConnected();
    if (!isConnected) {
      navigation.navigate('ResidentialInternetNotConnectionScreen');
      return;
    }

    const isGrantedCameraPermission = await requestCameraPermission();
    if (!isGrantedCameraPermission) {
      navigation.navigate('ResidentialCameraDisableScreen');
    } else {
      navigation.navigate('ResidentialParkingRedemptionScreen', {
        hookFrom: key,
      });
    }
  };

  return (
    <ScreenContainer
      bgColor={'#ffffff'}
      barStyle="light-content"
      isLoading={isLoading}>
      <StatusBar barStyle="dark-content" />
      <Header
        leftAction="goBack"
        title={t('Residential__Bill_And_Payment', 'Bills and Payments')}
      />
      {!isLoading && (
        <View className="w-full py-[24px] px-[16px] flex flex-col">
          <TouchableOpacity
            className="flex flex-row items-center justify-between py-[16px]"
            onPress={onPressCarParkPayment}
            disabled={isLoading}>
            <View className="flex flex-row items-center">
              <Icon
                type="smartParkingIcon"
                width={24}
                height={24}
                className="mr-[12px]"
              />
              <Text size="B1" weight="regular" color="dark-gray">
                {t(
                  'Residential__Bill_And_Payment__Car_Park_Payment',
                  'Car Park Payment',
                )}
              </Text>
            </View>
            <Icon type="right" width={16} height={16} />
          </TouchableOpacity>
          {residenceMember && residenceMember?.canRedemption && (
            <>
              <View className="border-b-[1px] border-[#DCDCDC] mb-[12px]"></View>
              <TouchableOpacity
                className="flex flex-row items-center justify-between py-[16px]"
                onPress={onPressCarParkRedemption}
                disabled={isLoading}>
                <View className="flex flex-row items-center">
                  <Icon
                    type="serviceRequestIcon"
                    width={24}
                    height={24}
                    className="mr-[12px]"
                  />
                  <Text size="B1" weight="regular" color="dark-gray">
                    {t(
                      'Residential__Bill_And_Payment__Car_Park_Redemption',
                      'Car Park Redemption',
                    )}
                  </Text>
                </View>
                <Icon type="right" width={16} height={16} />
              </TouchableOpacity>
            </>
          )}
          <View className="border-b-[1px] border-[#DCDCDC] mb-[12px]"></View>
          <TouchableOpacity
            className="flex flex-row items-center justify-between py-[16px]"
            onPress={onPressBillPayment}
            disabled={isLoading}>
            <View className="flex flex-row items-center">
              <Icon
                type="serviceRequestIcon"
                width={24}
                height={24}
                className="mr-[12px]"
              />
              <Text size="B1" weight="regular" color="dark-gray">
                {t('Residential__Bill_And_Payment', 'Bills and Payments')}
              </Text>
            </View>
            <Icon type="right" width={16} height={16} />
          </TouchableOpacity>
          <View className="border-b-[1px] border-[#DCDCDC]"></View>
        </View>
      )}
    </ScreenContainer>
  );
};
export default ResidentialVisitorPassHomeScreen;
