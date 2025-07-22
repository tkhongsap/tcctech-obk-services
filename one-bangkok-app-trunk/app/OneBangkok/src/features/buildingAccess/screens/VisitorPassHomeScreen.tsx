import {View, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {Icon, Text} from '~/components/atoms';
import {Header} from '~/components/Header';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '~/features/residential/components';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const VisitorPassHomeScreen = () => {
  const navigation = useNavigation();

  const isNetConnected = async () => {
    return (await NetInfo.fetch()).isConnected;
  };
  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) return true;
      // else if (result === RESULTS.DENIED) {
      // } else if (result === RESULTS.BLOCKED) {
      // }
    } catch (error) {
      console.error('Error requesting camera:', error);
    }
    return false;
  };

  const onPressExploreCamera = async (
    key: 'CAR_PARK_PAYMENT' | 'REDEMPTION_CAR_PARK',
  ) => {
    const isConnected = await isNetConnected();
    if (!isConnected) navigation.navigate('InternetNotConnectionScreen');

    // Android section
    if (Platform.OS === 'android') {
      const isGranted = await requestCameraPermission();
      // Inform: Need camera is disabled screen
      if (!isGranted) navigation.navigate('CameraDisableScreen');
      // To: QRCode scanner
      else navigation.navigate('ParkingRedemptionScreen', {hookFrom: key});
    } else {
      navigation.navigate('ParkingRedemptionScreen', {hookFrom: key});
    }
  };

  return (
    <ScreenContainer bgColor={'#ffffff'} barStyle="light-content">
      <StatusBar barStyle="dark-content" />
      <Header leftAction="goBack" title="Bill and Payments" />
      <View className="w-full py-[24px] px-[16px] flex flex-col">
        <TouchableOpacity
          className="flex flex-row items-center justify-between py-[16px]"
          onPress={() => onPressExploreCamera('CAR_PARK_PAYMENT')}>
          <View className="flex flex-row items-center">
            <Icon
              type="smartParkingIcon"
              width={24}
              height={24}
              className="mr-[12px]"
            />
            <Text size="B1" weight="regular" color="dark-gray">
              Car Park Payment
            </Text>
          </View>
          <Icon type="right" width={16} height={16} />
        </TouchableOpacity>
        <View className="border-b-[1px] border-[#DCDCDC] mb-[12px]"></View>
        <TouchableOpacity
          className="flex flex-row items-center justify-between py-[16px]"
          onPress={() => onPressExploreCamera('REDEMPTION_CAR_PARK')}>
          <View className="flex flex-row items-center">
            <Icon
              type="serviceRequestIcon"
              width={24}
              height={24}
              className="mr-[12px]"
            />
            <Text size="B1" weight="regular" color="dark-gray">
              Redemption car park
            </Text>
          </View>
          <Icon type="right" width={16} height={16} />
        </TouchableOpacity>
        <View className="border-b-[1px] border-[#DCDCDC]"></View>
        <TouchableOpacity className="flex flex-row items-center justify-between py-[16px]">
          <View className="flex flex-row items-center">
            <Icon
              type="serviceRequestIcon"
              width={24}
              height={24}
              className="mr-[12px]"
            />
            <Text size="B1" weight="regular" color="dark-gray">
              Bill Payment
            </Text>
          </View>
          <Icon type="right" width={16} height={16} />
        </TouchableOpacity>
        <View className="border-b-[1px] border-[#DCDCDC]"></View>
      </View>
    </ScreenContainer>
  );
};
export default VisitorPassHomeScreen;
