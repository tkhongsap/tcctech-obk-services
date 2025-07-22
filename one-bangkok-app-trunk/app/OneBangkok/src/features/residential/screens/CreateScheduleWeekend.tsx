import {View, ScrollView, Alert} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {useNavigation} from '~/navigations/AppNavigation';
import React, {useState} from 'react';
import InputTime from '../components/InputTime';
import {
  Time,
  useCoolingCreationState,
} from '~/services/residentialService/NetamoScheduleService';
import netatmoService from '~/services/residentialService/NetatmoService';

const CreateScheduleWeekend = () => {
  const navigation = useNavigation();
  const {weekSchedule, weekDays, weekendSchedule} = useCoolingCreationState();
  const [getUpAt, setGetUpAt] = useState<Time>(weekendSchedule.getUpAt.value);
  const [goToBedAt, setGoToBedAt] = useState<Time>(
    weekendSchedule.goToBedAt.value,
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateTime = async () => {
    try {
      const {status} = await netatmoService.validateCrateSchedule([
        {
          startTime: formatTime(
            weekSchedule.getUpAt.hour.value,
            weekSchedule.getUpAt.minute.value,
          ),
          endTime: formatTime(
            weekSchedule.goToBedAt.hour.value,
            weekSchedule.goToBedAt.minute.value,
          ),
        },
        {
          isHome: weekDays.isHomeDuringTheDay.value,
          startTime: formatTime(
            weekDays.leaveHomeAt.hour.value,
            weekDays.leaveHomeAt.minute.value,
          ),
          endTime: formatTime(
            weekDays.comeBackHomeAt.hour.value,
            weekDays.comeBackHomeAt.minute.value,
          ),
        },
        {
          startTime: formatTime(getUpAt.hour, getUpAt.minute),
          endTime: formatTime(goToBedAt.hour, goToBedAt.minute),
        },
      ]);

      return status === 200;
    } catch (error: any) {
      if (error?.errorDetail) {
        Alert.alert(
          t('General__Something_went_wrong', 'Something went wrong'),
          error.errorDetail,
        );
        return false;
      } else {
        throw error;
      }
    }
  };

  const onPressNext = async (retry = 2) => {
    try {
      setIsLoading(true);
      const validTime = await validateTime();
      if (validTime) {
        weekendSchedule.set(JSON.parse(JSON.stringify({getUpAt, goToBedAt})));
        navigation.navigate('CreateScheduleSaturday');
      }
    } catch (error) {
      if (retry >= 1) {
        await onPressNext(retry - 1);
      } else {
        navigateToErrorScreen();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'CreateScheduleWeekend',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('CreateScheduleWeekend'),
    });
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
            'Residential__Home_Automation__Create_A_Schedule',
            'Create a schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <ScrollView className="w-full bg-white pt-10 pb-20" style={{gap: 12}}>
          <View className="mb-4 px-4 flex flex-col" style={{gap: 12}}>
            <View className="flex flex-row items-center" style={{gap: 8}}>
              <Icon
                type={'calendar'}
                width={20}
                height={20}
                color={'#000000'}
              />
              <Text size="H3" color="default" weight="medium">
                {t('Residential__Home_Automation__Weekend', 'Weekend')}
              </Text>
            </View>
            <View className="flex flex-col" style={{gap: 4}}>
              <Text size="B1" color="default" weight="medium">
                {t(
                  'Residential__Home_Automation__Weekend_Question_One',
                  'What time do you get up during the Week-end?',
                )}
              </Text>
              <InputTime
                time={getUpAt}
                setTime={setGetUpAt}
                disabled={isLoading}
              />
            </View>
            <View className="flex flex-col" style={{gap: 4}}>
              <Text size="B1" color="default" weight="medium">
                {t(
                  'Residential__Home_Automation__Weekend_Question_Two',
                  'What time do you go to bed during the Week-end?',
                )}
              </Text>
              <InputTime
                time={goToBedAt}
                setTime={setGoToBedAt}
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>

      <StickyButton
        title={t('Residential__Home_Automation__Next', 'Next')}
        rightIcon="next"
        iconHeight={20}
        color="dark-teal"
        onPress={() => onPressNext(2)}
        disabled={isLoading}
      />
    </>
  );
};

export default CreateScheduleWeekend;
