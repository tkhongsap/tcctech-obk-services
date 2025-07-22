import React, {useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {Header} from '../components/Header';
import getTheme from '~/utils/themes/themeUtils';
import IconSOS from '../../../assets/icons/icon-ob-noun-sos.svg';
import SlideButton from '../components/SlideButton';
import {useNavigation} from '~/navigations/AppNavigation';
import {RouteProp, useRoute} from '@react-navigation/native';
import {phoneCall} from '../utils/phoneCall';
import {ScreenContainer} from '../components/ScreenContainer';
type RootStackParamList = {
  EmergencyScreen: {phone: string};
};
type EmergencyScreenRouteProp = RouteProp<
  RootStackParamList,
  'EmergencyScreen'
>;

const EmergencyScreen = () => {
  const route = useRoute<EmergencyScreenRouteProp>();
  const {phone} = route.params;
  const navigation = useNavigation();
  const [unlocked, setUnlocked] = useState(false);
  const phoneNumber = '00000000';
  const handleSOSPress = async () => {
    if (Platform.OS === 'ios') {
      phoneCall(phoneNumber);
      setUnlocked(true);
    } else {
      phoneCall(phoneNumber);
      setTimeout(() => navigation.goBack(), 1000);
    }
  };

  return (
    <ScreenContainer bgColor={'#FFFFFF'} barStyle={'dark-content'}>
      <View
        className={getTheme('flex-1 flex-col h-full justify-between bg-white')}>
        <Header bgColor="default" leftAction="goBack" />
        <View className={getTheme('flex-1 flex-col px-4')}>
          <Text className={getTheme('text-subtitle-muted font-medium text-sm')}>
            One Bangkok
          </Text>
          <Text className={getTheme('text-[#000000] text-[32px] font-medium')}>
            SOS / Emergency
          </Text>
        </View>
        <View
          className={getTheme('flex-1 flex-col items-center justify-end px-4')}>
          <IconSOS color="#000000" width={51.3} height={52.77} />
          <Text
            className={getTheme('text-[#000000] text-[16px] text-center mt-8')}>
            Press and slide the SOS button to send{'\n'}an emergency alert.
          </Text>
          <Text
            className={getTheme('text-[#000000] text-[16px] text-center my-6')}>
            In case of emergency, this will call the{'\n'}One Bangkok
            authorities
          </Text>
          <View className={getTheme('flex pb-8')}>
            <SlideButton onActive={handleSOSPress} unlockedStatus={unlocked} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default EmergencyScreen;
