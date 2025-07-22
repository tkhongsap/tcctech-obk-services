import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {useNavigation} from '~/navigations/AppNavigation';
import {useEffect, useState} from 'react';
import netatmoService from '~/services/residentialService/NetatmoService';
import InputTextWithClearButton from '../components/InputTextWithClearButton';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TemperatureScheduleRename'
>;

const TemperatureScheduleRename = ({
  route: {
    params: {schedules, schedule},
  },
}: Props) => {
  const navigation = useNavigation();
  const [name, setName] = useState<string | undefined>(schedule.name);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (isError) {
      setIsError(false);
    }
  }, [name]);

  const checkNameIsExist = (name: any) => {
    return schedules.some(schedule => schedule.name === name);
  };

  const onPress = async () => {
    try {
      setIsLoading(true);
      const nameExist = checkNameIsExist(name);
      setIsError(nameExist);
      if (nameExist) {
        return;
      }
      const homeId = await residentialTenantAction.getHomeId();
      const {status} = await netatmoService.syncHomeSchedule({
        schedule_id: schedule.id,
        home_id: homeId,
        name,
        operation: 'action',
        schedule_type: 'cooling',
        zones: schedule.zones,
        timetable: schedule.timetable,
        cooling_away_temp: schedule.zones
          .find(zone => zone.name === 'Comfort')
          ?.rooms.find(room => room.cooling_setpoint_temperature !== null)
          ?.cooling_setpoint_temperature,
        away_temperature_mode: 'on',
      });

      if (status === 200 && !nameExist) {
        await residentialScheduleAction.getHome();
        navigation.goBack();
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const validName = () => name !== undefined && name.trim() !== '';

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'TemperatureScheduleRename',
      buttonColor: 'dark-teal',
      onPressBack: () =>
        navigation.navigate('TemperatureScheduleRename', {schedules, schedule}),
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
          title={t('Residential__Home_Automation__Rename', 'Rename')}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <View className="bg-[#ffffff] flex-1 w-full">
          <View className="bg-[#ffffff] w-full pt-10">
            <InputTextWithClearButton
              title={t('Residential__Home_Automation__Name', 'Name')}
              initialValue={name}
              onValueChange={setName}
              disabled={isLoading}
              error={isError}
              onPressIn={() => {
                setIsError(false);
              }}
            />
          </View>
        </View>
      </ScreenContainer>

      {validName() && (
        <StickyButton
          title={t('General__Change_Name', 'Change name')}
          rightIcon="next"
          iconHeight={20}
          color="dark-teal"
          onPress={onPress}
          disabled={isLoading}
        />
      )}
    </>
  );
};

export default TemperatureScheduleRename;
