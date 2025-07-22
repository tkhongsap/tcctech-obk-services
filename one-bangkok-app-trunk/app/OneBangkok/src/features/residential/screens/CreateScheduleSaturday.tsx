import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import React, {useState} from 'react';
import InputTime from '../components/InputTime';
import {
  Time,
  useCoolingCreationState,
} from '~/services/residentialService/NetamoScheduleService';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import netatmoService from '~/services/residentialService/NetatmoService';

const CreateScheduleSaturday = () => {
  const navigation = useNavigation();
  const {weekSchedule, weekDays, weekendSchedule, scheduleSaturday} =
    useCoolingCreationState();
  const [isHomeOnSaturday, setIsHomeOnSaturday] = useState<boolean | null>(
    scheduleSaturday.isHomeOnSaturday.value,
  );
  const [leaveHomeAt, setLeaveHomeAt] = useState<Time>(
    scheduleSaturday.leaveHomeAt.value,
  );
  const [comeBackHomeAt, setComeBackHomeAt] = useState<Time>(
    scheduleSaturday.comeBackHomeAt.value,
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
          startTime: formatTime(
            weekendSchedule.getUpAt.hour.value,
            weekendSchedule.getUpAt.minute.value,
          ),
          endTime: formatTime(
            weekendSchedule.goToBedAt.hour.value,
            weekendSchedule.goToBedAt.minute.value,
          ),
        },
        {
          isHome: isHomeOnSaturday,
          startTime: formatTime(
            isHomeOnSaturday
              ? scheduleSaturday.leaveHomeAt.hour.value
              : leaveHomeAt.hour,
            isHomeOnSaturday
              ? scheduleSaturday.leaveHomeAt.minute.value
              : leaveHomeAt.minute,
          ),
          endTime: formatTime(
            isHomeOnSaturday
              ? scheduleSaturday.comeBackHomeAt.hour.value
              : comeBackHomeAt.hour,
            isHomeOnSaturday
              ? scheduleSaturday.comeBackHomeAt.minute.value
              : comeBackHomeAt.minute,
          ),
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
        scheduleSaturday.set(
          JSON.parse(
            JSON.stringify({
              isHomeOnSaturday,
              leaveHomeAt,
              comeBackHomeAt,
            }),
          ),
        );
        navigation.navigate('CreateScheduleSunday');
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
      screenHook: 'CreateScheduleSaturday',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('CreateScheduleSaturday'),
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
                {t('Residential__Home_Automation__full_Saturday', 'Saturday')}
              </Text>
            </View>
            <View className="flex flex-col mb-3" style={{gap: 16}}>
              <Text size="B1" color="default" weight="medium">
                {t(
                  'Residential__Home_Automation__Saturday_Question_One',
                  'Are you usually home on Saturday?',
                )}
              </Text>
              <View
                className="flex flex-row items-center justify-center"
                style={{gap: 10}}>
                <TouchableOpacity
                  className="flex flex-row items-center justify-center border border-line-light"
                  onPress={() => setIsHomeOnSaturday(false)}
                  disabled={isLoading}>
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        paddingVertical: 5,
                      },
                      isHomeOnSaturday === false
                        ? styles.buttonTimeOnActive
                        : styles.buttonTimeInActive,
                    ]}
                    className="font-obMedium min-w-[104px] px-4">
                    {t('Residential__Home_Automation__No', 'No')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex flex-row items-center justify-center border border-line-light"
                  onPress={() => setIsHomeOnSaturday(true)}
                  disabled={isLoading}>
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        paddingVertical: 5,
                      },
                      isHomeOnSaturday
                        ? styles.buttonTimeOnActive
                        : styles.buttonTimeInActive,
                    ]}
                    className="font-obMedium min-w-[104px] px-4">
                    {t('Residential__Home_Automation__Yes', 'Yes')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isHomeOnSaturday === false && (
              <>
                <View className="flex flex-col" style={{gap: 4}}>
                  <Text size="B1" color="default" weight="medium">
                    {t(
                      'Residential__Home_Automation__Saturday_Question_Two',
                      'What time do you leave home?',
                    )}
                  </Text>
                  <InputTime
                    time={leaveHomeAt}
                    setTime={setLeaveHomeAt}
                    disabled={isLoading}
                  />
                </View>
                <View className="flex flex-col" style={{gap: 4}}>
                  <Text size="B1" color="default" weight="medium">
                    {t(
                      'Residential__Home_Automation__Saturday_Question_Three',
                      'What time do you come back home?',
                    )}
                  </Text>
                  <InputTime
                    time={comeBackHomeAt}
                    setTime={setComeBackHomeAt}
                    disabled={isLoading}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
      {isHomeOnSaturday !== null && (
        <StickyButton
          title={t('Residential__Home_Automation__Next', 'Next')}
          rightIcon="next"
          iconHeight={20}
          color="dark-teal"
          onPress={() => onPressNext(2)}
          disabled={isLoading}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonTimeInActive: {
    backgroundColor: 'white',
    color: '#292929',
  },
  buttonTimeOnActive: {
    backgroundColor: '#014541',
    color: 'white',
  },
});

export default CreateScheduleSaturday;
