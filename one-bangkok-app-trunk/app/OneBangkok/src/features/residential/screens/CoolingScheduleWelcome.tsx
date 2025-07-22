import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text, Spacing} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {StackActions} from '@react-navigation/native';

const CoolingScheduleWelcome = () => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.dispatch(
      StackActions.replace('CreateCoolingSchedule', {schedules: undefined}),
    );
  };

  return (
    <>
      <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Home_Automation__Temperature_Schedule',
            'Temperature Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <View className="bg-[#ffffff] w-full flex-1 p-4 pt-10">
          <View className="flex flex-col justify-center items-center">
            <Icon type="calendarPlus" width={55} height={56} color="#000000" />
            <Spacing height={28} />
            <Text weight="medium" className="dark-gray">
              {t('Residential__Home_Automation__Welcome', 'Welcome')}!
            </Text>
            <Spacing height={4} />
            <Text
              size="B2"
              weight="regular"
              color="subtitle-muted"
              className="text-center px-4">
              {t(
                'Residential__Home_Automation__Welcome_cooling_schedule_description',
                'Create an temperature schedule to trigger automatic\nactions at certain times on your devices (air\nconditioner)',
              )}
            </Text>
          </View>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t(
          'General__Create_Cooling_Schedule',
          'Create a cooling schedule',
        )}
        rightIcon="next"
        iconHeight={20}
        color="dark-teal"
        onPress={onPress}
      />
    </>
  );
};

export default CoolingScheduleWelcome;
