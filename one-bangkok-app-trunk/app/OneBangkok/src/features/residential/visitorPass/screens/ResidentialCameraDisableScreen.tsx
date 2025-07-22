import {View} from 'react-native';
import React from 'react';
import {Icon, Text, Spacing} from '~/components/atoms';
import {Header} from '../../components/Header';
import {ScreenContainer} from '../../components';
import t from '~/utils/text';

const ResidentialCameraDisableScreen = () => {
  return (
    <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
      <View className="flex flex-col w-full">
        <Header leftAction="goBack" />

        <View className="w-full h-[90vh] flex flex-col items-center pt-[25vh] px-[16px]">
          <Icon type="camera" width={48} height={48} />
          <Spacing height={12} />
          <Text
            size="H3"
            weight="medium"
            color="dark-gray"
            className="text-center">
            {t('Residential__Car_Park_Payment__Enable_Camera', 'Enable Camera')}
          </Text>
          <Spacing height={4} />
          <Text
            size="B1"
            weight="regular"
            color="subtitle-muted"
            className="text-center">
            {t(
              'Residential__Car_Park_Payment__Enable_Camera_Des',
              'Your camera is currently disabled. To proceed, please grant permission to use your camera.',
            )}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};
export default ResidentialCameraDisableScreen;
