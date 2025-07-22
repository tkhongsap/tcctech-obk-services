import {View, ScrollView} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Text, Spacing} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import ModifyTime, {TimeSlot} from '../components/ModifyTime';
import TemperatureModeList, {
  TemperatureMode,
  TemperatureRoom,
} from '../components/TemperatureModeList';
import React, {useEffect, useState} from 'react';
import {modalActions} from '../components/ResidentialModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {
  CoolingScheduleDetail,
  SDTimetable,
  ShortDay,
} from '../components/FacilitiesList';
import {SDReadableTimetableObject} from '../components/FacilitiesBar';
import {DayPicker} from '../components/DayTimePickerModal';
import {MIN_TEMPERATURE} from '../components/CustomTemperatureMode';
import netatmoService from '~/services/residentialService/NetatmoService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import {
  ModuleBNTH,
  useResidentialHomeState,
  Zone,
} from '~/states/residentialSchedule/residentialScheduleState';

type EditTimeSlot = {
  scheduleDetail: CoolingScheduleDetail;
  homeId: string;
  actionData: {
    zoneId: number;
    mOffset: number;
    dateTimeStart: string;
    dateTimeEnd: string;
  };
  zones: any[];
  timetable: SDTimetable[];
};

type ParseTime = {
  day: string;
  hour: number;
  minute: number;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ModifyTimeSlot'>;

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
    name: 'Starts',
    times: {
      day: 'Wednesday',
      hour: 20,
      minute: 45,
    },
    expanded: false,
  },
  {
    name: 'Ends',
    times: {
      day: 'Tuesday',
      hour: 7,
      minute: 0,
    },
    expanded: false,
  },
];

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ModifyTimeSlot = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const [timeSlotList, setTimeSlotList] =
    useState<TimeSlot[]>(defaultTimeSlots);
  const [temperatures, setTemperatures] =
    useState<TemperatureMode[]>(initialTemperatures);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timetable, setTimetable] = useState<SDReadableTimetableObject>();
  const [scheduleDetail, setScheduleDetail] = useState<CoolingScheduleDetail>();
  const homeAutoSate = useResidentialHomeState();

  useEffect(() => {
    try {
      setScheduleDetail(params.scheduleDetail);
      const selectedTimetable = getSelectedReadableTimetable(
        params.scheduleDetail,
        params.selectedDay,
        params.selectedIndex,
      );

      if (selectedTimetable) {
        setTimetable(selectedTimetable);
        initTimeSlots(selectedTimetable);
        initTemperature(params.scheduleDetail, selectedTimetable);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSelectedReadableTimetable = (
    scheduleDetail: CoolingScheduleDetail,
    selectedDay: ShortDay,
    selectedIndex: number,
  ) => {
    try {
      return scheduleDetail.readable_timetable[selectedDay][selectedIndex];
    } catch (error) {
      return null;
    }
  };

  const initTimeSlots = (timetable: SDReadableTimetableObject) => {
    const timeStarts = timetable.timeStart.split(':');
    const timeEnds = timetable.timeEnd.split(':');
    setTimeSlotList([
      {
        name: 'Starts',
        times: {
          day: timetable.dateStart as DayPicker,
          hour: parseInt(timeStarts[0]),
          minute: parseInt(timeStarts[1]),
        },
        expanded: false,
      },
      {
        name: 'Ends',
        times: {
          day: timetable.dateEnd as DayPicker,
          hour: parseInt(timeEnds[0]),
          minute: parseInt(timeEnds[1]),
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

  const initTemperature = (
    scheduleDetail: CoolingScheduleDetail,
    selectedTimetable: SDReadableTimetableObject,
  ) => {
    try {
      const selectedZone = scheduleDetail.zones.find(
        e => e.id === selectedTimetable.zoneId,
      );
      const comfortZoneRooms = getRoomsByZoneName(scheduleDetail, 'Comfort');
      const nightZoneRooms = getRoomsByZoneName(scheduleDetail, 'Night');
      const ecoZoneRooms = getRoomsByZoneName(scheduleDetail, 'Eco');

      const initTemp: TemperatureMode[] = [
        {
          id: 0,
          icon: 'scheduleComfortColor',
          name: 'Comfort',
          checked: selectedZone?.name === 'Comfort',
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
          checked: selectedZone?.name === 'Eco',
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
          checked: selectedZone?.name === 'Night',
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
        !endTime ||
        !timetable
      ) {
        return;
      }

      // it's mean delete
      if (selectedTemperature.name !== timetable.zoneName) {
        await deleteTimeSlot();
      }

      const zones = scheduleDetail.zones;
      const mappedZones = mapZone(scheduleDetail.zones, selectedTemperature);
      const dateTimeEnd = timeFormat(
        endTime.times.day,
        paddingWith2Zero(endTime.times.hour.toString()),
        paddingWith2Zero(endTime.times.minute.toString()),
      );
      const dateTimeStart = timeFormat(
        startTime.times.day,
        paddingWith2Zero(startTime.times.hour.toString()),
        paddingWith2Zero(startTime.times.minute.toString()),
      );

      const initialTimeStarts = timetable.timeStart.split(':');
      const initialTimeEnds = timetable.timeEnd.split(':');
      const initialDateTimeStart = {
        day: timetable?.dateStart,
        hour: parseInt(initialTimeStarts[0]),
        minute: parseInt(initialTimeStarts[1]),
      };
      const initialDateTimeEnd = {
        day: timetable?.dateEnd,
        hour: parseInt(initialTimeEnds[0]),
        minute: parseInt(initialTimeEnds[1]),
      };
      const initialStartTimestamp = parseTime(initialDateTimeStart);
      const initialEndTimestamp = parseTime(initialDateTimeEnd);
      const newStartTimestamp = parseTime(startTime.times);
      const newEndTimestamp = parseTime(endTime.times);
      const isDateTimeStartIncreased =
        newStartTimestamp > initialStartTimestamp;
      const isDateTimeEndDecreased = newEndTimestamp < initialEndTimestamp;

      let timetableList = Object.values(
        scheduleDetail.readable_timetable,
      ).flatMap(e => e);
      let currentIndex = timetableList.findIndex(
        e => e.mOffset === timetable.mOffset && e.zoneId === timetable.zoneId,
      );
      let currentTimetable = scheduleDetail.timetable;

      // Handle decrease date time end
      // set new dateTimeEnd to dateTimeStart on next time slot
      if (isDateTimeEndDecreased) {
        const nextTimeSlot = getNextTimeSlot({
          timetableList,
          currentIndex,
          zoneId: timetable.zoneId,
        });

        const {status} = await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData: {
            zoneId: nextTimeSlot.zoneId,
            mOffset: nextTimeSlot.mOffset,
            dateTimeStart: dateTimeEnd,
            dateTimeEnd: `${nextTimeSlot.dateEnd} ${nextTimeSlot.timeEnd}`,
          },
          zones: mappedZones,
          timetable: currentTimetable,
        });

        if (status === 200) {
          const {timetable} = await getSchedule();
          currentTimetable = timetable;
        }
      } else {
        const actionData = {
          zoneId: zones.find(e => e.name === selectedTemperature.name)?.id ?? 0,
          mOffset: timetable.mOffset,
          dateTimeStart,
          dateTimeEnd,
        };
        const {status} = await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData,
          zones: mappedZones,
          timetable: currentTimetable,
        });

        if (status === 200) {
          const {timetable, readable_timetable} = await getSchedule();
          currentTimetable = timetable;
          const readableTimetable =
            readable_timetable[params.selectedDay][params.selectedIndex];
          timetableList = Object.values(readable_timetable).flatMap(e => e);
          currentIndex = timetableList.findIndex(
            e =>
              e.mOffset === readableTimetable.mOffset &&
              e.zoneId === readableTimetable.zoneId,
          );
        }
      }

      // Handle increase date time start
      // set new dateTimeStart to dateTimeEnd on prev time slot
      if (isDateTimeStartIncreased) {
        const prevTimeSlot = getPrevTimeSlot({
          timetableList,
          currentIndex,
          zoneId: timetable.zoneId,
        });

        const {status} = await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData: {
            zoneId: prevTimeSlot.zoneId,
            mOffset: prevTimeSlot.mOffset,
            dateTimeStart: `${prevTimeSlot.dateStart} ${prevTimeSlot.timeStart}`,
            dateTimeEnd: dateTimeStart,
          },
          zones: mappedZones,
          timetable: currentTimetable,
        });
        if (status === 200) {
          const {timetable, readable_timetable} = await getSchedule();
          currentTimetable = timetable;
          const readableTimetable =
            readable_timetable[params.selectedDay][params.selectedIndex];
          timetableList = Object.values(readable_timetable).flatMap(e => e);
          currentIndex = timetableList.findIndex(
            e =>
              e.mOffset === readableTimetable.mOffset &&
              e.zoneId === readableTimetable.zoneId,
          );
        }
      } else {
        const actionData = {
          zoneId: zones.find(e => e.name === selectedTemperature.name)?.id ?? 0,
          mOffset: timetable.mOffset,
          dateTimeStart,
          dateTimeEnd,
        };
        const {status} = await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData,
          zones: mappedZones,
          timetable: currentTimetable,
        });

        if (status === 200) {
          const {timetable, readable_timetable} = await getSchedule();
          currentTimetable = timetable;
          const readableTimetable =
            readable_timetable[params.selectedDay][params.selectedIndex];
          timetableList = Object.values(readable_timetable).flatMap(e => e);
          currentIndex = timetableList.findIndex(
            e =>
              e.mOffset === readableTimetable.mOffset &&
              e.zoneId === readableTimetable.zoneId,
          );
        }
      }

      if (!isDateTimeEndDecreased && !isDateTimeStartIncreased) {
        const actionData = {
          zoneId: zones.find(e => e.name === selectedTemperature.name)?.id ?? 0,
          mOffset: timetable.mOffset,
          dateTimeStart,
          dateTimeEnd,
        };

        await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData,
          zones: mappedZones,
          timetable: currentTimetable,
        });
      }
      await residentialScheduleAction.getHome();
      navigation.goBack();
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
      screenHook: 'ModifyTimeSlot',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ModifyTimeSlot', {...params}),
    });
  };

  const getSchedule = async () => {
    const {data} = await netatmoService.getHomeSchedule(
      params.scheduleDetail.id,
    );
    return data.body.homes[0].schedules as CoolingScheduleDetail;
  };

  type GetNextTimeSlot = {
    timetableList: SDReadableTimetableObject[];
    zoneId: number;
    currentIndex: number;
  };

  const getNextTimeSlot = ({
    timetableList,
    currentIndex,
    zoneId,
  }: GetNextTimeSlot) => {
    const nextIndex =
      currentIndex + 1 >= timetableList.length ? 0 : currentIndex + 1;
    const currentTimetable = timetableList[nextIndex];
    if (currentTimetable.zoneId !== zoneId) return currentTimetable;
    return getNextTimeSlot({timetableList, currentIndex: nextIndex, zoneId});
  };

  const getPrevTimeSlot = ({
    timetableList,
    currentIndex,
    zoneId,
  }: GetNextTimeSlot) => {
    const prevIndex =
      currentIndex - 1 < 0 ? timetableList.length - 1 : currentIndex - 1;
    const currentTimetable = timetableList[prevIndex];
    if (currentTimetable.zoneId !== zoneId) return currentTimetable;
    return getPrevTimeSlot({timetableList, currentIndex: prevIndex, zoneId});
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

  const parseTime = ({day, hour, minute}: ParseTime): number => {
    // Get the day index (0 for Sunday, 1 for Monday, etc.)
    const dayIndex = daysOfWeek.indexOf(day);

    // Create a date object for the current week
    const now = new Date();
    const currentDayIndex = now.getDay();
    const diffDays = dayIndex - currentDayIndex;

    // Set the date to the current week, adjusting for the difference in days
    const date = new Date(now);
    date.setDate(now.getDate() + diffDays);
    date.setHours(hour, minute, 0, 0); // Set hour and minute

    return date.getTime();
  };

  const editTimeSlot = async ({
    scheduleDetail,
    homeId,
    actionData,
    zones,
    timetable,
  }: EditTimeSlot) => {
    const payload = {
      schedule_id: scheduleDetail.id,
      operation: 'cooling',
      home_id: homeId,
      temperature_control_mode: 'cooling',
      therm_mode: 'schedule',
      therm_setpoint_default_duration: 180,
      cooling_away_temp: 30,
      cooling_mode: 'schedule',
      schedule_type: 'cooling',
      actionType: 'edit',
      actionData,
      timetable,
      zones,
      name: scheduleDetail.name,
      default: scheduleDetail.default,
      away_temp: scheduleDetail.away_temp,
      hg_temp: scheduleDetail.hg_temp,
      type: 'cooling',
      away_temperature_mode: 'on',
    };
    return await netatmoService.syncHomeSchedule(payload);
  };

  const onPressDelete = () => {
    modalActions.setContent(
      <ConfirmDeleteModal
        title={t(
          'Residential__Home_Automation__Timeslot_Deletion',
          'Timeslot deletion',
        )}
        description={t(
          'Residential__Home_Automation__Timeslot_Deletion_Description',
          'Are you sure want to delete this timeslot?',
        )}
        onPressDelete={onConfirmDelete}
      />,
    );
    modalActions.show();
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);

      const homeId = await residentialTenantAction.getHomeId();
      const selectedTemperature = temperatures.find(e => e.checked);
      if (
        scheduleDetail === undefined ||
        !homeId ||
        !selectedTemperature ||
        !timetable
      ) {
        return;
      }

      const readableTimetableLength =
        scheduleDetail?.readable_timetable[params.selectedDay].length;
      const selectedIndex = params.selectedIndex;
      const isCurrentLatestIndex =
        readableTimetableLength >= 2 &&
        selectedIndex === readableTimetableLength - 1;
      if (selectedIndex === 0 || isCurrentLatestIndex) {
        // If delete first index or latest index
        // set this time slot dateTimeStart to dateTimeStart of next time slot
        const timetableList = Object.values(
          scheduleDetail.readable_timetable,
        ).flatMap(e => e);
        const currentIndex = timetableList.findIndex(
          e => e.mOffset === timetable.mOffset && e.zoneId === timetable.zoneId,
        );
        const dateTimeStart = `${timetable.dateStart} ${timetable.timeStart}`;
        const nextTimeSlot = getNextTimeSlot({
          timetableList,
          currentIndex,
          zoneId: timetable.zoneId,
        });

        await editTimeSlot({
          scheduleDetail,
          homeId,
          actionData: {
            zoneId: nextTimeSlot.zoneId,
            mOffset: nextTimeSlot.mOffset,
            dateTimeStart,
            dateTimeEnd: `${nextTimeSlot.dateEnd} ${nextTimeSlot.timeEnd}`,
          },
          zones: scheduleDetail.zones,
          timetable: scheduleDetail.timetable,
        });
      } else {
        await deleteTimeSlot();
      }
    } catch (error) {
    } finally {
      await residentialScheduleAction.getHome();
      setIsLoading(false);
      navigation.goBack();
    }
  };

  const deleteTimeSlot = async () => {
    const homeId = await residentialTenantAction.getHomeId();
    const selectedTemperature = temperatures.find(e => e.checked);
    if (scheduleDetail === undefined || !homeId || !selectedTemperature) {
      return;
    }
    const zones = scheduleDetail.zones;

    await netatmoService.syncHomeSchedule({
      schedule_id: scheduleDetail.id,
      operation: 'cooling',
      home_id: homeId,
      temperature_control_mode: 'cooling',
      therm_mode: 'schedule',
      therm_setpoint_default_duration: 180,
      cooling_away_temp: 30,
      cooling_mode: 'schedule',
      schedule_type: 'cooling',
      actionType: 'delete',
      actionData: {
        zoneId: zones.find(e => e.name === selectedTemperature.name)?.id,
        mOffset: timetable?.mOffset,
      },
      timetable: scheduleDetail.timetable,
      zones: scheduleDetail.zones,
      name: scheduleDetail.name,
      default: scheduleDetail.default,
      away_temp: scheduleDetail.away_temp,
      hg_temp: scheduleDetail.hg_temp,
      type: 'cooling',
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
          rightAction="delete"
          onPressRightAction={() => {
            !isLoading && onPressDelete();
          }}
          title={t(
            'Residential__Home_Automation__Modify_A_Time_Slot',
            'Modify a time slot',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />

        <ScrollView className="w-full bg-white">
          <View className="">
            <ModifyTime
              timeSlotList={timeSlotList}
              onSetTimeSlotList={setTimeSlotList}
              disabled={isLoading}
            />
            <View className="flex flex-col mt-10 px-4" style={{gap: 12}}>
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
            <Spacing height={180} />
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

export default ModifyTimeSlot;
