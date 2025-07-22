import {View, ScrollView} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Text} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import ModifyTime from '../components/ModifyTime';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TemperatureModeList, {
  TemperatureMode,
  TemperatureRoom,
} from '../components/TemperatureModeList';
import {DayPicker} from '../components/DayTimePickerModal';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {CoolingScheduleDetail, ShortDay} from '../components/FacilitiesList';
import {MIN_TEMPERATURE} from '../components/CustomTemperatureMode';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import netatmoService from '~/services/residentialService/NetatmoService';
import {
  ModuleBNTH,
  useResidentialHomeState,
  Zone,
} from '~/states/residentialSchedule/residentialScheduleState';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';

type Time = {
  day: DayPicker;
  hour: number;
  minute: number;
};
type TimeSlot = {
  name: string;
  times: Time;
  expanded: boolean;
};

const initialTemperatures: TemperatureMode[] = [
  {
    id: 0,
    icon: 'scheduleComfortColor',
    name: 'Comfort',
    checked: false,
    rooms: [
      {
        roomId: '',
        roomName: 'Livingroom',
        deviceName: 'Samsung Aircon',
        isOn: false,
        temperature: 0,
        fanSpeed: '1',
      },
    ],
  },
  {
    id: 1,
    icon: 'scheduleEcoColor',
    name: 'Eco',
    checked: false,
    rooms: [
      {
        roomId: '',
        roomName: 'Livingroom',
        deviceName: 'Samsung Aircon',
        isOn: false,
        temperature: 0,
        fanSpeed: '1',
      },
    ],
  },
  {
    id: 2,
    icon: 'scheduleNightColor',
    name: 'Night',
    checked: false,
    rooms: [
      {
        roomId: '',
        roomName: 'Livingroom',
        deviceName: 'Samsung Aircon',
        isOn: false,
        temperature: 0,
        fanSpeed: '1',
      },
    ],
  },
];

const defaultTimeSlots: TimeSlot[] = [
  {
    name: t('Residential__Home_Automation__Starts', 'Starts'),
    times: {
      day: 'Wednesday',
      hour: 20,
      minute: 45,
    },
    expanded: false,
  },
  {
    name: t('Residential__Home_Automation__Ends', 'Ends'),
    times: {
      day: 'Tuesday',
      hour: 7,
      minute: 0,
    },
    expanded: false,
  },
];
const days: {[key in ShortDay]: string} = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddTimeSlot'>;

const AddTimeSlot = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const [timeSlotList, setTimeSlotList] =
    useState<TimeSlot[]>(defaultTimeSlots);
  const [temperatures, setTemperatures] =
    useState<TemperatureMode[]>(initialTemperatures);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduleDetail, setScheduleDetail] = useState<CoolingScheduleDetail>();
  const homeAutoSate = useResidentialHomeState();

  useEffect(() => {
    try {
      setScheduleDetail(params.scheduleDetail);
      initTimeSlots(params.selectedDay);
      initTemperature(params.scheduleDetail);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initTimeSlots = (selectedDay: ShortDay) => {
    const day = days[selectedDay] as DayPicker;
    setTimeSlotList([
      {
        name: 'Starts',
        times: {
          day,
          hour: 12,
          minute: 0,
        },
        expanded: false,
      },
      {
        name: 'Ends',
        times: {
          day,
          hour: 13,
          minute: 0,
        },
        expanded: false,
      },
    ]);
  };

  const parseToFanSpeed = (fanSpeed: number) => {
    try {
      if (fanSpeed <= 0) return 0;
      return fanSpeed >= 3 ? 3 : fanSpeed;
    } catch (error) {
      return 0;
    }
  };

  const initTemperature = (scheduleDetail: CoolingScheduleDetail) => {
    try {
      const comfortZoneRooms = getRoomsByZoneName(scheduleDetail, 'Comfort');
      const nightZoneRooms = getRoomsByZoneName(scheduleDetail, 'Night');
      const ecoZoneRooms = getRoomsByZoneName(scheduleDetail, 'Eco');

      const initTemp: TemperatureMode[] = [
        {
          id: 0,
          icon: 'scheduleComfortColor',
          name: 'Comfort',
          checked: true,
          rooms:
            comfortZoneRooms?.map(room => {
              const bnthModule = getBNTHModule(
                scheduleDetail,
                'Comfort',
                room?.id,
              );
              return {
                roomId: room.id,
                roomName: room.name,
                deviceName: bnthModule?.name ?? '-',
                isOn: room?.cooling_setpoint_mode !== 'off',
                temperature:
                  room?.cooling_setpoint_temperature ?? MIN_TEMPERATURE,
                fanSpeed:
                  parseToFanSpeed(bnthModule!.fan_speed)?.toString() ?? '0',
              };
            }) ?? [],
        },
        {
          id: 1,
          icon: 'scheduleEcoColor',
          name: 'Eco',
          checked: false,
          rooms:
            ecoZoneRooms?.map(room => {
              const bnthModule = getBNTHModule(scheduleDetail, 'Eco', room.id);
              return {
                roomId: room.id,
                roomName: room.name,
                deviceName: bnthModule?.name ?? '-',
                isOn: room?.cooling_setpoint_mode !== 'off',
                temperature:
                  room?.cooling_setpoint_temperature ?? MIN_TEMPERATURE,
                fanSpeed:
                  parseToFanSpeed(bnthModule!.fan_speed)?.toString() ?? '0',
              };
            }) ?? [],
        },
        {
          id: 2,
          icon: 'scheduleNightColor',
          name: 'Night',
          checked: false,
          rooms:
            nightZoneRooms?.map(room => {
              const bnthModule = getBNTHModule(
                scheduleDetail,
                'Night',
                room.id,
              );
              return {
                roomId: room.id,
                roomName: room.name,
                deviceName: bnthModule?.name ?? '-',
                isOn: room?.cooling_setpoint_mode !== 'off',
                temperature:
                  room?.cooling_setpoint_temperature ?? MIN_TEMPERATURE,
                fanSpeed:
                  parseToFanSpeed(bnthModule!.fan_speed)?.toString() ?? '0',
              };
            }) ?? [],
        },
      ];
      setTemperatures(initTemp);
    } catch (error) {
      console.log('initTemperature error -> ', error);
    }
  };

  const getRoomsByZoneName = (
    scheduleDetail: CoolingScheduleDetail,
    zoneName: string,
  ) => scheduleDetail.zones.find(e => e.name === zoneName)?.rooms;

  const getBNTHModule = (
    scheduleDetail: CoolingScheduleDetail,
    zoneName: string,
    roomId: string,
  ): ModuleBNTH | undefined => {
    const zone = scheduleDetail.zones.find(e => e.name === zoneName);
    if (!zone) return undefined;

    const modulesInHomeRoom = homeAutoSate.rooms.value
      .find(room => room.id === roomId)
      ?.module?.find(e => e.type === 'BNTH');
    if (!modulesInHomeRoom) return undefined;

    const moduleInZone = zone?.modules?.find(
      module => module.id === modulesInHomeRoom.id,
    );
    if (moduleInZone) return moduleInZone as ModuleBNTH;
    return modulesInHomeRoom;
  };

  const onChecked = (id: number) => {
    setTemperatures(prev => prev.map(e => ({...e, checked: e.id === id})));
  };

  const onValueChange = (mode: TemperatureMode) => {
    setTemperatures(prev => prev.map(e => (e.id === mode.id ? mode : e)));
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const onPressValidate = async () => {
    try {
      setIsLoading(true);

      const homeId = await residentialTenantAction.getHomeId();
      const selectedTemperature = temperatures.find(e => e.checked);
      const startTime = timeSlotList.find(e => e.name === 'Starts');
      const endTime = timeSlotList.find(e => e.name === 'Ends');
      if (
        scheduleDetail === undefined ||
        !homeId ||
        !selectedTemperature ||
        !startTime ||
        !endTime
      ) {
        return;
      }

      const zones = scheduleDetail.zones;
      const {status} = await netatmoService.syncHomeSchedule({
        schedule_id: scheduleDetail.id,
        operation: 'cooling',
        home_id: homeId,
        temperature_control_mode: 'cooling',
        therm_mode: 'schedule',
        therm_setpoint_default_duration: 180,
        cooling_away_temp: 30,
        cooling_mode: 'schedule',
        schedule_type: 'cooling',
        actionType: 'add',
        actionData: {
          zoneId: zones.find(e => e.name === selectedTemperature.name)?.id,
          dateTimeStart: timeFormat(
            startTime.times.day,
            paddingWith2Zero(startTime.times.hour.toString()),
            paddingWith2Zero(startTime.times.minute.toString()),
          ),
          dateTimeEnd: timeFormat(
            endTime.times.day,
            paddingWith2Zero(endTime.times.hour.toString()),
            paddingWith2Zero(endTime.times.minute.toString()),
          ),
        },
        timetable: scheduleDetail.timetable,
        zones: mapZone(scheduleDetail.zones, selectedTemperature),
        name: scheduleDetail.name,
        default: scheduleDetail.default,
        away_temp: scheduleDetail.away_temp,
        hg_temp: scheduleDetail.hg_temp,
        type: 'cooling',
        away_temperature_mode: 'on',
      });
      if (status === 200) {
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

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'AddTimeSlot',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('AddTimeSlot', {...params}),
    });
  };

  const timeFormat = (day: string, hour: string, minute: string) =>
    `${day} ${hour}:${minute}`;

  const mapZone = (zones: Zone[], selectedTemperature: TemperatureMode) => {
    const rooms = selectedTemperature.rooms;
    return zones.map(zone => {
      if (zone.name === selectedTemperature.name) {
        return {
          ...zone,
          rooms: zone.rooms.map((room, index) => {
            return {
              ...room,
              cooling_setpoint_temperature: rooms[index].isOn
                ? rooms[index].temperature
                : null,
              cooling_setpoint_mode: rooms[index].isOn ? null : 'off',
            };
          }),
          modules: zone.rooms.map((_, index) =>
            mapBNTHModule(rooms[index], zone.name),
          ),
        };
      } else {
        return zone;
      }
    });
  };

  const mapBNTHModule = (tempModeRoom: TemperatureRoom, zoneName: string) => {
    if (!scheduleDetail) return null;
    const module = getBNTHModule(scheduleDetail, zoneName, tempModeRoom.roomId);
    if (module) {
      const {fan_speed, ...data} = module;
      if (tempModeRoom.fanSpeed === '0') {
        return {
          ...data,
          on: tempModeRoom.isOn,
          fan_mode: 'auto',
        };
      }
      return {
        ...data,
        on: tempModeRoom.isOn,
        fan_speed: parseInt(tempModeRoom.fanSpeed),
        fan_mode: 'manual',
      };
    }
    return null;
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
            'Residential__Home_Automation__Add_A_Time_Slot',
            'Add a time slot',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <ScrollView className="w-full bg-white pb-20">
          <View className="pb-[100px]">
            <ModifyTime
              timeSlotList={timeSlotList}
              onSetTimeSlotList={setTimeSlotList}
              disabled={isLoading}
            />
            <View
              className="h-full flex flex-col mt-10 px-4 pb-20"
              style={{gap: 12}}>
              <Text color="jet-black" weight="medium">
                {t(
                  'Residential__Home_Automation__Set_Of_Temperatures',
                  'Set of temperatures',
                )}
              </Text>
              <View className="flex flex-col" style={{gap: 12}}>
                {temperatures.map(item => (
                  <TemperatureModeList
                    key={item.id}
                    temperatureMode={item}
                    onValueChange={onValueChange}
                    onChecked={onChecked}
                    disabled={isLoading}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
      <StickyButton
        title={t('Residential__Home_Automation__Validate', 'Validate')}
        rightIcon="next"
        iconHeight={20}
        color="dark-teal"
        onPress={onPressValidate}
        disabled={isLoading}
      />
    </>
  );
};

export default AddTimeSlot;
