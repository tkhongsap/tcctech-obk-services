import {View} from 'react-native';
import React from 'react';
import {Icon, Text, Spacing} from '~/components/atoms';
import {ScreenContainer} from '../components/ScreenContainer';
import {Header} from '../components/Header';
import t from '~/utils/text';

const ResidentialInternetNotConnectionScreen = () => {
  return (
    <ScreenContainer bgColor={'#ffffff'} barStyle="light-content">
      <View className="flex flex-col w-full">
        <Header leftAction="goBack" />
        <View className="w-full h-[90vh] flex flex-col items-center justify-center px-[16px] py-[40px]">
          <Icon type="close" width={48} height={48} />
          <Spacing height={12} />
          <Text
            size="H3"
            weight="medium"
            color="dark-gray"
            className="text-center">
            {t(
              'Residential__Car_Park_Payment__No_Internet_Connection',
              'No Internet Connection',
            )}
          </Text>
          <Spacing height={4} />
          <Text
            size="B1"
            weight="regular"
            color="subtitle-muted"
            className="text-center">
            {t(
              'Residential__Car_Park_Payment__No_Internet_Connection_Des',
              'Please check your internet and try again.',
            )}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};
export default ResidentialInternetNotConnectionScreen;
