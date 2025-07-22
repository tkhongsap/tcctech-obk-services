import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import OptionModal from '../components/OptionModal';
import OptionActionScheduleModal from '../components/OptionActionScheduleModal';
import {modalActions} from '../components/ResidentialModal';
import {
  EventSchedule,
  Zone,
  TimetableSunsetSunrise,
  Scenario,
  Module,
  Home,
  Room,
  actionScheduleSelectedId,
  actionScheduleSelectedDay,
} from '~/states/residentialSchedule/residentialScheduleState';
import netatmoService from '~/services/residentialService/NetatmoService';
import {ShortDay} from '../components/FacilitiesList';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import DaySelection from '../components/DaySelection';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import {Icon, Spacing, Text} from '~/components/atoms';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import appLanguageState from '~/states/appLanguage/appLanguageState';

export type Timetable = {
  zone_id: number;
  m_offset: number;
};
type ReadableTimetableItem = {
  timeReadable: string;
  zoneId: number;
  mOffset: number;
};
type ReadableTimetable = {
  [key in ShortDay]: ReadableTimetableItem[];
};
export type EventScheduleDetail = {
  timetable: Timetable[];
  readable_timetable: ReadableTimetable;
  zones: Zone[];
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  id: string;
  type: string;
  selected: boolean;
  timetable_sunrise: TimetableSunsetSunrise[];
  timetable_sunset: TimetableSunsetSunrise[];
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialSchedulesScreen_Action'
>;

const shortDayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ResidentialSchedulesScreen_Action = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState<EventSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<EventSchedule>();
  const [scheduleDetail, setScheduleDetail] = useState<EventScheduleDetail>();
  const [selectedDay, setSelectedDay] = useState<ShortDay>(params.selectedDay);
  const [timetable, setTimetable] = useState<ReadableTimetableItem[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const focused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    if (!focused || !actionScheduleSelectedId.value) return;

    const fetchScheduleById = async () => {
      try {
        const eventSchedules =
          await residentialScheduleAction.getEventSchedules();
        setSchedules(eventSchedules);
        setSelectedSchedule(
          eventSchedules.find(e => e.id === actionScheduleSelectedId.value),
        );
      } catch (e) {
      } finally {
        actionScheduleSelectedId.set(null);
      }
    };

    fetchScheduleById();
  }, [focused, actionScheduleSelectedId.value]);

  useEffect(() => {
    if (!focused || !actionScheduleSelectedDay.value) return;

    setSelectedDay(actionScheduleSelectedDay.value);
    actionScheduleSelectedDay.set(null);
  }, [focused, actionScheduleSelectedDay.value]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const eventSchedules =
            await residentialScheduleAction.getEventSchedules();
          setSchedules(eventSchedules);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (schedules.length === 0) return;

      setSelectedSchedule(prev => {
        if (!prev) {
          return schedules.find(e => e.selected) ?? schedules[0];
        }

        const match = schedules.find(e => e.id === prev.id);
        return match ?? schedules.find(e => e.selected) ?? schedules[0];
      });
    }, [schedules]),
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedSchedule) {
        getSchedule(selectedSchedule.id);
      }
    }, [selectedSchedule?.id]),
  );

  useEffect(() => {
    if (scheduleDetail) {
      onSetTimetable(scheduleDetail, selectedDay);
    }
  }, [scheduleDetail, selectedDay]);

  const preloadRooms = async () => {
    const {data} = await netatmoService.getHomeData();
    const home = data.body.homes[0] as Home;
    setRooms(home.rooms);
  };

  const preload = async () => {
    try {
      setIsLoading(true);
      const [eventSchedules] = await Promise.all([
        residentialScheduleAction.getEventSchedules(),
        getScenarios(),
        preloadRooms(),
      ]);

      setSchedules(eventSchedules);
      const defaultSelected =
        eventSchedules.find(e => e.selected) ?? eventSchedules[0];
      // Get Selected Schedule
      setSelectedSchedule(defaultSelected);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const loadAfterBack = useCallback(async () => {
    try {
      setIsLoading(true);
      const eventSchedules =
        await residentialScheduleAction.getEventSchedules();
      setSchedules(eventSchedules);
      if (eventSchedules[0].timetable.length === 0) {
        setSelectedSchedule(undefined);
      } else {
        const defaultSelected =
          eventSchedules.find(e => e.selected) ?? eventSchedules[0];
        setSelectedSchedule(
          eventSchedules.find(e => e.id === selectedSchedule?.id) ??
            defaultSelected,
        );
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchedule]);

  const getScenarios = async () => {
    const {data} = await netatmoService.getScenario();
    setScenarios(data.body.home.scenarios);
  };

  const getSchedule = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await netatmoService.getHomeSchedule(id);
      const schedule = data.body.homes[0].schedules as EventScheduleDetail;
      schedule.readable_timetable = shiftTimetableSundayToFirst(
        convertSunriseSunsetToReadableTimetable(schedule),
      );
      setScheduleDetail(schedule);
      setIsLoading(false);
    } catch (error) {}
  };

  const onSelectSchedule = async (schedule: EventSchedule) => {
    if (schedule.id !== selectedSchedule?.id) setSelectedSchedule(schedule);
  };

  const shiftTimetableSundayToFirst = (timetable: ReadableTimetable) => {
    const {Sun, ...days} = timetable;
    return {Sun, ...days};
  };

  const convertSunriseSunsetToReadableTimetable = (
    schedule: EventScheduleDetail,
  ) => {
    if (
      schedule.timetable_sunrise.length === 0 &&
      schedule.timetable_sunset.length === 0
    ) {
      return schedule.readable_timetable;
    }

    const sunrise = schedule.timetable_sunrise;
    const sunset = schedule.timetable_sunset;
    let readableTimetable = schedule.readable_timetable;
    for (let index = 0; index < shortDayList.length; index++) {
      const shortDay = shortDayList[index] as ShortDay;
      const day = index + 1;
      if (readableTimetable[shortDay] === undefined) {
        readableTimetable[shortDay] = [];
      }

      if (sunrise.length >= 1) {
        const todaySunrise = sunrise.filter(e => e.day === day);
        if (todaySunrise.length > 0) {
          readableTimetable[shortDay] = [
            ...readableTimetable[shortDay],
            ...todaySunrise.map(e => ({
              timeReadable: `${t(
                'Residential__Home_Automation__Sunrise_nocut',
                'Sunrise',
              )} ${twilightOffsetToTimeReadable(e.twilight_offset)}`,
              zoneId: e.zone_id,
              mOffset: e?.twilight_offset || 0,
            })),
          ];
        }
      }

      if (sunset.length >= 1) {
        const todaySunset = sunset.filter(e => e.day === day);
        if (todaySunset.length > 0) {
          readableTimetable[shortDay] = [
            ...readableTimetable[shortDay],
            ...todaySunset.map(e => ({
              timeReadable: `${t(
                'Residential__Home_Automation__Sunset_nocut',
                'Sunset',
              )} ${twilightOffsetToTimeReadable(e.twilight_offset)}`,
              zoneId: e.zone_id,
              mOffset: e?.twilight_offset || 0,
            })),
          ];
        }
      }
    }
    return readableTimetable;
  };

  const twilightOffsetToTimeReadable = (offset: number = 0) => {
    if (offset === 0) return '';
    const suffix = offset < 0 ? 'before' : 'after';
    offset = Math.abs(offset);
    const hour = Math.floor(offset / 60);
    const min = offset % 60;
    if (hour > 0 && min > 0) return `(${hour}:${min} hour ${suffix})`;
    if (hour > 0 && min === 0) return `(${hour} hour ${suffix})`;
    return `(${min} min ${suffix})`;
  };

  const onUpdateScheduleStatus = (id: string, selected: boolean) => {
    setSchedules(prev =>
      prev.map(schedule => ({
        ...schedule,
        selected: schedule.id === id ? selected : false,
      })),
    );
    setSelectedSchedule(prev => prev && {...prev, selected});

    // update home state
    residentialScheduleAction.getHome();
  };

  const onPressConfigModal = () => {
    if (selectedSchedule) {
      modalActions.setContent(
        <OptionModal
          schedules={schedules}
          schedule={selectedSchedule}
          onUpdateScheduleStatus={onUpdateScheduleStatus}
          isLoading={isLoading}
          onSetIsLoading={setIsLoading}
        />,
      );
      modalActions.show();
    }
  };

  const onPressOptionScheduleModal = () => {
    if (selectedSchedule) {
      modalActions.setContent(
        <OptionActionScheduleModal
          initialSelectedSchedule={selectedSchedule}
          schedules={schedules}
          onChanged={onSelectSchedule}
        />,
      );
      modalActions.show();
    }
  };

  const onSelectedDay = (day: ShortDay) => {
    setSelectedDay(day);
  };

  const onSetTimetable = (
    scheduleDetail: EventScheduleDetail,
    day: ShortDay,
  ) => {
    setTimetable(scheduleDetail.readable_timetable[day] ?? []);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const [eventSchedules] = await Promise.all([
        residentialScheduleAction.getEventSchedules(),
      ]);
      setSchedules(eventSchedules);

      if (selectedSchedule) {
        const {data} = await netatmoService.getHomeSchedule(
          selectedSchedule.id,
        );
        const schedule = data.body.homes[0].schedules as EventScheduleDetail;
        schedule.readable_timetable = shiftTimetableSundayToFirst(
          convertSunriseSunsetToReadableTimetable(schedule),
        );
        setScheduleDetail(schedule);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const fillZeroTwilightOffset = (timetable: TimetableSunsetSunrise[]) => {
    return timetable.map(e => ({
      ...e,
      twilight_offset: e?.twilight_offset || 0,
    }));
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

        <View
          style={[{height: '100%', display: 'flex', flex: 1}]}
          className="w-full bg-white py-10">
          <View className="w-full">
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              stickyHeaderIndices={[0]}>
              <View className="bg-white">
                {selectedSchedule && (
                  <View
                    className="mb-1 px-4 w-full flex-row justify-between"
                    style={{gap: 4}}>
                    <TouchableOpacity
                      onPress={onPressOptionScheduleModal}
                      className="flex-row grow"
                      style={{gap: 4}}
                      disabled={isLoading}>
                      <Text
                        size="H4"
                        weight="medium"
                        numberOfLines={1}
                        className="max-w-[85%] break-all">
                        {selectedSchedule.name}
                      </Text>
                      <View className="rotate-90 ml-[-4px] flex">
                        <Icon
                          type="right"
                          width={14}
                          height={14}
                          color="#292929"
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onPressConfigModal}
                      disabled={isLoading}
                      className="flex">
                      <Icon
                        type="horizontal"
                        width={20}
                        height={20}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                <Text
                  className="px-4"
                  color="subtitle-muted"
                  size="B1"
                  weight="regular">
                  {selectedSchedule?.selected
                    ? t('Residential__Home_Automation__Active', 'Active')
                    : t('Residential__Home_Automation__Disabled', 'Disabled')}
                </Text>

                <View className="w-full px-4 pt-8">
                  <DaySelection
                    initialDay={selectedDay}
                    onSelect={onSelectedDay}
                  />
                </View>
              </View>

              <View style={{flex: 1, marginTop: 12}}>
                {MyActionList({
                  isLoading,
                  zones: scheduleDetail?.zones ?? [],
                  scenarios,
                  timetable,
                  rooms,
                  onPress: index =>
                    selectedSchedule &&
                    scheduleDetail &&
                    navigation.navigate('ResidentialEditActionScheduleScreen', {
                      id: selectedSchedule.id,
                      selectedDay: selectedDay,
                      schedule: {
                        ...scheduleDetail,
                        timetable_sunrise: fillZeroTwilightOffset(
                          scheduleDetail.timetable_sunrise,
                        ),
                        timetable_sunset: fillZeroTwilightOffset(
                          scheduleDetail.timetable_sunset,
                        ),
                      },
                      selectedIndex: index,
                      selectedZoneId: timetable[index].zoneId,
                      rooms: rooms,
                      scenarios: scenarios,
                    }),
                })}
                <Spacing height={80} />
              </View>

              {Platform.OS === 'ios' && <Spacing height={100} />}
            </ScrollView>
          </View>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t('Residential__Home_Automation__Add_Event', 'Add Event')}
        rightIcon="plusIcon"
        iconHeight={20}
        color="dark-teal"
        onPress={() => {
          selectedSchedule &&
            scheduleDetail &&
            navigation.navigate('ResidentialAddActionScheduleScreen', {
              id: selectedSchedule.id,
              schedule: scheduleDetail,
              selectedDay,
              rooms: rooms,
              scenarios: scenarios,
            });
        }}
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
export default ResidentialSchedulesScreen_Action;

const emptySchedule = () => {
  return (
    <View className="px-[16px] flex flex-col items-center">
      <Icon
        type="calendarPlus"
        width={55}
        height={55}
        color="#292929"
        className="my-[47.5px]"
      />

      <Text size="B1" weight="medium" color="dark-gray" className="text-center">
        {t('Residential__Home_Automation__Create_An_Event', 'Create an event')}
      </Text>
      <Text
        size="B2"
        weight="regular"
        color="subtitle-muted"
        className="text-center">
        {t(
          'Residential__Home_Automation__Create_An_Event_Description',
          'To add an event to this action schedule, tap the "+"\nbutton at the bottom right',
        )}
      </Text>
    </View>
  );
};

type MyActionListProps = {
  isLoading: boolean;
  timetable: ReadableTimetableItem[];
  rooms: Room[];
  onPress: (index: number) => void;
  zones: Zone[];
  scenarios: Scenario[];
  refreshing?: boolean;
  onRefresh?: () => void;
};

type GroupModule = {
  title: Module & {on: boolean};
  desc: Module[];
};

const MyActionList = ({
  isLoading,
  timetable,
  rooms,
  onPress,
  zones,
  scenarios,
  refreshing = false,
}: MyActionListProps) => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

  const moduleTypeOrder: {[key: string]: number} = {
    BNIL: 0,
    BNLD: 1,
    BNAS: 2,
  };

  const getModulesByZoneId = (zoneId: number) => {
    const zone = zones.find(e => e.id === zoneId);
    if (!zone) return [];
    if (zone.modules && zone.modules?.length > 0) {
      const mappedRoomModules = zone.modules.map(module => ({
        ...module,
        roomId: getRoomByModuleId(module.id)?.id ?? null,
      }));
      return mappedRoomModules;
    }
    return [];
  };

  const getRoomByModuleId = (id: string) => {
    const roomsExitModule = rooms.filter(room =>
      room.module.some(e => e.id === id),
    );
    if (roomsExitModule.length >= 1) {
      return roomsExitModule[0];
    }
    return null;
  };

  const groupModulesByTypeAndStatus = (modules: any[]): GroupModule[] => {
    const group = modules.reduce((prev, curr) => {
      const key =
        curr.type === 'BNAS'
          ? `${curr.bridge}|${curr?.target_position}`
          : `${curr.bridge}|${curr?.on}`;
      if (!prev[key]) prev[key] = {title: curr, desc: []};
      if (!prev[key].desc.find((e: any) => e.roomId === curr.roomId)) {
        prev[key].desc.push(curr);
      }
      return prev;
    }, {});

    const grouped = Object.values(group) as GroupModule[];
    const sorted = grouped.sort(
      (a, b) => moduleTypeOrder[a.title.type] - moduleTypeOrder[b.title.type],
    );
    return sorted;
  };

  const getScenariosByZoneId = (zoneId: number) => {
    const zone = zones.find(e => e.id === zoneId);
    if (!zone) return [];
    if (zone.scenarios !== null && zone.scenarios?.length > 0) {
      return zone.scenarios;
    }
    return [];
  };

  const getZoneNameByZoneId = (zoneId: number) => {
    try {
      const zone = zones.find(e => e.id === zoneId);
      if (!zone) return null;
      return zone.name;
    } catch (error) {
      return null;
    }
  };

  const getScenarioName = (scenarioId: string) => {
    const scenario = scenarios.find(e => e.id === scenarioId);
    if (scenario) {
      return replaceUnderScoreWithSpacing(
        capitalizeFirstLetter(scenario.name ?? scenario.type),
      );
    }
    return null;
  };

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const replaceUnderScoreWithSpacing = (value: string) => {
    return value.replace('_', ' ');
  };

  const getTitleByRoomType = (
    roomType: string,
    isOn: boolean,
    targetPosition: number,
  ) => {
    switch (roomType) {
      case 'BNAS':
        return targetPosition === 100
          ? t(
              'Residential__Home_Automation__Actions_Schedule__Open_the_Curtains_and_Shutters',
              'Open the Curtains & Shutters',
            )
          : t(
              'Residential__Home_Automation__Actions_Schedule__Close_the_Curtains_and_Shutters',
              'Close the Curtains & Shutters',
            );

      case 'BNIL':
        return isOn
          ? t(
              'Residential__Home_Automation__Actions_Schedule__Turn_on_the_lights',
              'Turn on the Lights',
            )
          : t(
              'Residential__Home_Automation__Actions_Schedule__Turn_off_the_lights',
              'Turn off the Lights',
            );

      case 'BNLD':
        return isOn
          ? t(
              'Residential__Home_Automation__Actions_Schedule__Turn_on_the_lights',
              'Turn on the Lights',
            )
          : t(
              'Residential__Home_Automation__Actions_Schedule__Turn_off_the_lights',
              'Turn off the Lights',
            );

      default:
        return null;
    }
  };

  const actionsLength = (zoneId: number) => {
    return (
      getScenariosByZoneId(zoneId).length + getModulesByZoneId(zoneId).length
    );
  };

  const displayLaunchScenario = (scenarioLength: number) => {
    const launchScenarioText = t(
      'Residential__Home_Automation__Actions_Schedule__Launch_scenario',
      'Launch scenario',
    );
    if (language === 'en') {
      const suffix = scenarioLength > 1 ? 's' : '';
      return launchScenarioText + suffix;
    }
    return launchScenarioText;
  };

  return (
    <FlatList
      data={timetable}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={!isLoading ? emptySchedule() : null}
      scrollEnabled={false}
      renderItem={({item, index}) => {
        const zoneName = getZoneNameByZoneId(item.zoneId);
        const scenarios = getScenariosByZoneId(item.zoneId);

        return (
          <View key={`${index}_zone_${item.zoneId}`}>
            <View className="flex flex-row items-center mb-[10px]">
              <Icon
                type={'scTimeBlackIcon'}
                width={20}
                height={20}
                color={'#000'}
                className="mr-[10px]"
              />
              <Text size="B1" weight="medium" color="dark-gray">
                {item.timeReadable}
              </Text>
            </View>

            {zoneName && (
              <Text
                size="B1"
                weight="medium"
                color="dark-gray"
                className="pb-2">
                {zoneName}
              </Text>
            )}
            <View style={styles.actionContainer}>
              <View className="flex flex-col px-4 border border-line-light min-h-[75px] justify-center">
                <TouchableOpacity
                  className={`py-4 flex flex-row justify-between items-${
                    actionsLength(item.zoneId) > 1 ? 'start' : 'center'
                  } border-line-light`}
                  disabled={isLoading || refreshing}
                  onPress={() => onPress(index)}>
                  <View className="flex flex-col space-y-5">
                    {scenarios.length > 0 && (
                      <View>
                        <Text
                          className={getTheme(
                            'text-base font-medium text-default mb-1',
                          )}>
                          {displayLaunchScenario(scenarios.length)}
                        </Text>

                        {scenarios.map(scene => (
                          <Text
                            key={`scenario_${item.zoneId}_${scene}`}
                            style={{color: 'grey'}}
                            className={getTheme(
                              'text-sm font-obRegular leading-4',
                            )}>
                            {getScenarioName(scene) ?? ' '}
                          </Text>
                        ))}
                      </View>
                    )}

                    {groupModulesByTypeAndStatus(
                      getModulesByZoneId(item.zoneId),
                    ).map(({title, desc}, index) => (
                      <View
                        key={`module_${item.zoneId}_${title.type}_${index}`}>
                        <Text
                          className={getTheme(
                            'text-base font-medium text-default mb-1',
                          )}>
                          {getTitleByRoomType(
                            title.type,
                            title.on,
                            title.type === 'BNAS' ? title?.target_position : 0,
                          )}
                        </Text>

                        {desc.map(({room_name}) => (
                          <Text
                            key={`room_name_${room_name}`}
                            style={{color: 'grey'}}
                            className={getTheme(
                              'text-sm font-obRegular leading-4',
                            )}>
                            {room_name ?? ' '}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>

                  <Icon
                    type="arrowRightIcon"
                    height={16}
                    width={16}
                    color="#292929"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};
