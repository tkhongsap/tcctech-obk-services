import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text, Spacing} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {useState} from 'react';
import netatmoService from '~/services/residentialService/NetatmoService';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {ShortDay} from '../components/FacilitiesList';
import {StackActions} from '@react-navigation/native';

const ActionScheduleWelcome = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const currentDayOfWeek = () => {
    const date = new Date();
    const daysOfWeek: ShortDay[] = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];
    return daysOfWeek[date.getDay()];
  };

  const onPress = async () => {
    try {
      setIsLoading(true);
      const actionSchedules =
        await residentialScheduleAction.getEventSchedules();
      if (actionSchedules.length === 0) {
        const {status, data} = await netatmoService.createActionSchedule(
          'Actions Schedule',
        );
        if (status === 200) {
          const scheduleId = data.body.schedule_id;
          await Promise.all([
            netatmoService.switchHomeSchedule(
              'activate',
              scheduleId,
              'action',
              true,
            ),
            netatmoService.activeSchedule(scheduleId, 'event'),
            residentialScheduleAction.getHome(),
          ]);
        }
      }
      navigation.dispatch(
        StackActions.replace('ResidentialSchedulesScreen_Action', {
          selectedDay: currentDayOfWeek(),
        }),
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Home_Automation__Actions_Schedule',
            'Actions Schedule',
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
                'Residential__Home_Automation__Welcome_Actions_Description',
                'Create an actions schedule to trigger automatic\nactions at certain times on your devices (lights,\nCurtains & Shutters)',
              )}
            </Text>
          </View>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t('General__Create_Actions_Schedule', 'Create Actions Schedule')}
        rightIcon="plusIcon"
        iconHeight={20}
        color="dark-teal"
        onPress={onPress}
      />
    </>
  );
};

export default ActionScheduleWelcome;
