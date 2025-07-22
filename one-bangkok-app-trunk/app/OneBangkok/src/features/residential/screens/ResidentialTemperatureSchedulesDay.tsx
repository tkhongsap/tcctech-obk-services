import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon, Text, Spacing} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {modalActions} from '../components/ResidentialModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import netatmoService from '~/services/residentialService/NetatmoService';
import {
  CoolingSchedule,
  Room,
  Zone,
} from '~/states/residentialSchedule/residentialScheduleState';
import OptionTemperatureModal from '../components/OptionTemperatureModal';
import OptionTemperatureScheduleModal from '../components/OptionTemperatureScheduleModal';
import {Header} from '../components/Header';
import {
  CoolingScheduleDetail,
  SDReadableTimetable,
  ShortDay,
} from '../components/FacilitiesList';
import {SDReadableTimetableObject} from '../components/FacilitiesBar';
import {useFocusEffect} from '@react-navigation/native';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import DaySelection from '../components/DaySelection';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialTemperatureSchedulesDay'
>;

const ResidentialTemperatureSchedulesDay = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState<CoolingSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<CoolingSchedule>(
    params.selectedSchedule,
  );
  const [selectedDay, setSelectedDay] = useState<ShortDay>(params.selectedDay);
  const [scheduleDetail, setScheduleDetail] = useState<CoolingScheduleDetail>();
  const [timetable, setTimetable] = useState<SDReadableTimetableObject[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    // prevent call first time
    if (
      JSON.stringify(params.selectedSchedule) !==
      JSON.stringify(selectedSchedule)
    ) {
      getSchedule(selectedSchedule.id);
    }
  }, [selectedSchedule]);

  useEffect(() => {
    scheduleDetail && onSetTimetable(scheduleDetail, selectedDay);
  }, [scheduleDetail, selectedDay]);

  useFocusEffect(
    useCallback(() => {
      loadAfterBack(selectedSchedule.id);
    }, []),
  );

  const preload = async () => {
    try {
      setIsLoading(true);
      const coolingSchedules =
        await residentialScheduleAction.getCoolingSchedules();
      setSchedules(coolingSchedules);
      await getSchedule(selectedSchedule.id);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const loadAfterBack = async (selectedScheduleId: string) => {
    try {
      setIsLoading(true);
      const coolingSchedules =
        await residentialScheduleAction.getCoolingSchedules();
      setSchedules(coolingSchedules);
      setSelectedSchedule(
        coolingSchedules.find(e => e.id === selectedScheduleId) ??
          coolingSchedules[0],
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectSchedule = (schedule: CoolingSchedule) => {
    if (schedule.id !== selectedSchedule.id) setSelectedSchedule(schedule);
  };

  const getSchedule = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await netatmoService.getHomeSchedule(id);
      const schedule = data.body.homes[0].schedules as CoolingScheduleDetail;
      schedule.readable_timetable = shiftTimetableSundayToFirst(
        schedule.readable_timetable,
      );
      setScheduleDetail(schedule);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const shiftTimetableSundayToFirst = (timetable: SDReadableTimetable) => {
    const {Sun, ...days} = timetable;
    return {Sun, ...days};
  };

  const onPressConfigModal = () => {
    modalActions.setContent(
      <OptionTemperatureModal
        schedules={schedules}
        schedule={selectedSchedule}
        onEnabledSchedule={updateEnabledSchedule}
      />,
    );
    modalActions.show();
  };

  const updateEnabledSchedule = (enabledScheduleId: string) => {
    setSchedules(prev =>
      prev.map(schedule => ({
        ...schedule,
        selected: schedule.id === enabledScheduleId,
      })),
    );
    setSelectedSchedule(prev => ({...prev, selected: true}));

    // update home state
    residentialScheduleAction.getHome();
  };

  const onPressOptionScheduleModal = () => {
    modalActions.setContent(
      <OptionTemperatureScheduleModal
        initialSelectedSchedule={selectedSchedule}
        schedules={schedules}
        onChanged={onSelectSchedule}
      />,
    );
    modalActions.show();
  };

  const onSetTimetable = (
    scheduleDetail: CoolingScheduleDetail,
    day: ShortDay,
  ) => {
    setTimetable(scheduleDetail.readable_timetable[day] ?? []);
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
            'Home_Automation__Temperature_Schedule',
            'Temperature Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />

        <View
          style={{height: '100%', display: 'flex', flex: 1}}
          className="w-full bg-white pt-10">
          <View className="mb-4 px-4 flex-row justify-between">
            <TouchableOpacity
              onPress={onPressOptionScheduleModal}
              className="flex-row grow"
              style={{gap: 4}}>
              <Text
                size="H4"
                weight="medium"
                numberOfLines={1}
                className="max-w-[85%] break-all">
                {selectedSchedule?.name}
              </Text>
              <View className="rotate-90 ml-[-4px]">
                <Icon type="right" width={14} height={14} color="#292929" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressConfigModal}>
              <Icon type={'horizontal'} width={20} height={20} color={'#000'} />
            </TouchableOpacity>
          </View>
          {/* Days Tab Selection */}
          <View className="w-full px-4">
            <DaySelection initialDay={selectedDay} onSelect={setSelectedDay} />
          </View>
          {/** Action List */}
          {scheduleDetail && timetable && (
            <View style={{flex: 1, marginTop: 12}}>
              {TimeSlotList({
                zones: scheduleDetail.zones,
                timetable,
                onPress: (selectedIndex: number) =>
                  navigation.navigate('ModifyTimeSlot', {
                    scheduleDetail,
                    selectedDay,
                    selectedIndex,
                  }),
              })}
            </View>
          )}
          <Spacing height={80} />
        </View>
      </ScreenContainer>

      <StickyButton
        title={t(
          'Residential__Home_Automation__Add_A_Time_Slot',
          'Add a time slot',
        )}
        rightIcon="plusIcon"
        iconHeight={20}
        color="dark-teal"
        onPress={() =>
          scheduleDetail &&
          navigation.navigate('AddTimeSlot', {
            scheduleDetail,
            selectedDay,
          })
        }
        disabled={isLoading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // Day Buttons
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#014541',
  },
  dayText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },

  // Action Items
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  actionContainer: {
    marginBottom: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'medium',
    marginBottom: 8,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
});
export default ResidentialTemperatureSchedulesDay;

type TimeSlotListProps = {
  zones: Zone[];
  timetable: SDReadableTimetableObject[];
  onPress: (selectedIndex: number) => void;
};
const TimeSlotList = ({zones, timetable, onPress}: TimeSlotListProps) => {
  const getRoomTemperature = (room: Room) => {
    return room.cooling_setpoint_temperature
      ? `${room.cooling_setpoint_temperature} °C`
      : null;
  };

  const getRoomsByZoneId = (id: number) => {
    try {
      const zone = zones.find(z => z.id === id);
      if (zone === undefined || zone?.rooms?.length === 0) return [];
      return zone.rooms;
    } catch (error) {
      return [];
    }
  };

  const getIconByZone = (zoneName: string) => {
    switch (zoneName) {
      case 'Night':
        return (
          <Icon
            type="scheduleNightColor"
            width={16}
            height={16}
            color="#ffffff00"
          />
        );
      case 'Comfort':
        return (
          <Icon
            type="scheduleComfortColor"
            width={16}
            height={16}
            color="#ffffff00"
          />
        );

      case 'Eco':
        return (
          <Icon
            type="scheduleEcoColor"
            width={16}
            height={16}
            color="#ffffff00"
          />
        );

      default:
        break;
    }
  };

  const mappingLanguageName = (key: string) => {
    switch (key) {
      case 'Comfort':
        return t('Residential__Home_Automation__Comfort', 'Comfort');
      case 'Eco':
        return t('Residential__Home_Automation__Eco', 'Eco');
      case 'Night':
        return t('Residential__Home_Automation__Night', 'Night');
      default:
        break;
    }
  };

  return (
    <FlatList
      data={timetable}
      contentContainerStyle={styles.listContainer}
      renderItem={({item, index}) => (
        <View key={`${index}_zone_${item.zoneId}`}>
          <View className="flex flex-row items-center mb-[12px]">
            <Icon
              type="scTimeBlackIcon"
              width={20}
              height={20}
              color={'#000'}
              className="mr-[10px]"
            />
            <Text size="B1" weight="medium" color="dark-gray">
              {index === 0 ? '00:00' : item.timeReadable}
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <View className="flex flex-col px-4 border border-line-light">
              <TouchableOpacity
                className="py-4 flex flex-col justify-start items-start border-line-light"
                onPress={() => onPress(index)}>
                <View
                  className={'flex flex-col justify-start'}
                  style={{gap: 4}}>
                  <View
                    className={'flex flex-row items-center'}
                    style={{gap: 8}}>
                    {getIconByZone(item.zoneName)}
                    <Text
                      className={getTheme(
                        'text-base font-medium text-default mt-1',
                      )}>
                      {mappingLanguageName(item.zoneName)}
                    </Text>
                  </View>
                </View>
                {getRoomsByZoneId(item.zoneId).map(room => (
                  <View
                    className="flex flex-row justify-between w-full"
                    key={room.id}>
                    <Text size="B1" style={{color: 'grey'}}>
                      {room.name}
                    </Text>
                    <Text size="B1" weight="medium" color="dark-gray">
                      {getRoomTemperature(room) ??
                        t(
                          'Residential__Home_Automation__Off_lower_case',
                          'off',
                        )}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
};
