import {View, ScrollView} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import StatusSlider from '../components/StatusSlider';
import React, {useState} from 'react';
import {
  defaultCoolingCreationStepState,
  useCoolingCreationState,
} from '~/services/residentialService/NetamoScheduleService';
import netatmoService from '~/services/residentialService/NetatmoService';
import {
  coolingScheduleSelectedId,
  useResidentialHomeState,
} from '~/states/residentialSchedule/residentialScheduleState';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MIN_TEMPERATURE} from '../components/CustomTemperatureMode';

const mockData = {
  temperatureMin: 16,
  temperatureMax: 39.5,
  temperature: 24,
};

type ScheduleCoolingZone = {
  name: string;
  id: number;
  type: number;
  rooms: any[];
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CreateScheduleCooling'
>;

const CreateScheduleCooling = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const scheduleCreateState = useCoolingCreationState();
  const homeState = useResidentialHomeState();
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(
    scheduleCreateState.temperature.value,
  );

  const getAllThermoRooms = () => {
    const home = homeState.get({noproxy: true});
    const modules = home.rooms.flatMap((room: any) => room.module);
    const bnths = modules.filter((module: any) => module.type === 'BNTH');
    return bnths.map(e => ({
      roomId: e.room_id,
      isTemperatureOn: e.cooler_status,
      temperature:
        home.rooms.find(room => room.id === e.room_id)
          ?.cooling_setpoint_temperature ?? MIN_TEMPERATURE,
    }));
  };

  const onPressNext = async () => {
    try {
      setIsLoading(true);
      const thermoStatRooms = getAllThermoRooms();
      let zones: ScheduleCoolingZone[] = [
        {
          name: 'Comfort',
          id: 0,
          type: 0,
          rooms: [
            {
              id: '',
              cooling_setpoint_temperature: temperature,
              cooling_setpoint_mode: null,
            },
          ],
        },
        {
          name: 'Night',
          id: 1,
          type: 1,
          rooms: [
            {
              id: '',
              cooling_setpoint_temperature: temperature,
              cooling_setpoint_mode: 'off',
            },
          ],
        },
        {
          name: 'Eco',
          id: 2,
          type: 5,
          rooms: [
            {
              id: '',
              cooling_setpoint_temperature: temperature,
              cooling_setpoint_mode: 'off',
            },
          ],
        },
      ];

      zones = zones.map(zone => ({
        ...zone,
        rooms: thermoStatRooms.map(room => {
          return {
            ...room,
            id: room.roomId,
            cooling_setpoint_mode: zone.name === 'Comfort' ? null : 'off',
            cooling_setpoint_temperature:
              zone.name === 'Comfort' ? temperature : null,
          };
        }),
      }));

      const {status, data} = await netatmoService.createHomeSchedule({
        name: scheduleCreateState.name.value,
        operation: 'cooling',
        cooling_away_temp: temperature,
        schedule_type: 'cooling',
        selected: true,
        timetable: params.timetable,
        zones,
      });
      if (status == 200) {
        await residentialScheduleAction.getHome();
        scheduleCreateState.set(
          JSON.parse(JSON.stringify(defaultCoolingCreationStepState)),
        );
        coolingScheduleSelectedId.set(data.body.schedule_id);
        navigation.navigate('CreateCoolingScheduleSuccessful');
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const onPressBack = () => {
    scheduleCreateState.temperature.set(temperature);
    navigation.goBack();
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
      screenHook: 'CreateScheduleCooling',
      buttonColor: 'dark-teal',
      onPressBack: () =>
        navigation.navigate('CreateScheduleCooling', {
          timetable: params.timetable,
        }),
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
          onPressLeftAction={onPressBack}
          title={t(
            'Residential__Home_Automation__Create_A_Schedule',
            'Create a schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <ScrollView className="w-full bg-white pt-10 pb-20" style={{gap: 12}}>
          <View className="mb-4 px-4 flex flex-col" style={{gap: 12}}>
            <View className="flex flex-row items-center" style={{gap: 4}}>
              <Icon
                type={'aqTempIcon'}
                width={20}
                height={20}
                color={'#000000'}
              />
              <Text size="H3" color="default" weight="medium">
                {t(
                  'Residential__Home_Automation__Cooling_Temperature',
                  'Cooling temperature',
                )}
              </Text>
            </View>
            <View className="flex flex-col" style={{gap: 4}}>
              <Text size="B1" color="default" weight="medium">
                {t(
                  'Residential__Home_Automation__Cooling_Temperature_Description',
                  'What would be your ideal comfort\ntemperature at home during the day?',
                )}
              </Text>
              <View style={{gap: 0}}>
                <View className="w-full flex-row items-center justify-between mt-2">
                  <Text size="C1" weight="regular">
                    {mockData.temperatureMin} °C
                  </Text>
                  <Text size="C1" weight="bold">
                    {temperature} °C
                  </Text>
                  <Text size="C1" weight="regular">
                    {mockData.temperatureMax} °C
                  </Text>
                </View>
                <StatusSlider
                  step={0.5}
                  minimumValue={mockData.temperatureMin}
                  maximumValue={mockData.temperatureMax}
                  initialValue={temperature}
                  onValueChange={setTemperature}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
      <StickyButton
        title={t('Residential__Home_Automation__Next', 'Next')}
        rightIcon="next"
        iconHeight={20}
        color="dark-teal"
        onPress={onPressNext}
        disabled={isLoading}
      />
    </>
  );
};

export default CreateScheduleCooling;
