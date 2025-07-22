import {ScrollView, View, TextInput} from 'react-native';
import t from '~/utils/text';
import React, {useCallback, useEffect, useState} from 'react';
import {ScreenContainer} from '../components/ScreenContainer';
import {Text} from '~/components/atoms';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {Header} from '../components/Header';
import {
  Module,
  Room,
  Scenario,
  TimetableSunsetSunrise,
  Zone,
} from '~/states/residentialSchedule/residentialScheduleState';
import netatmoService from '~/services/residentialService/NetatmoService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {ShortDay} from '../components/FacilitiesList';
import {SelectedDay} from '../components/ActionScheduleDaySelection';
import ActionScheduleScenarioSelection, {
  SelectScenario,
} from '../components/ActionScheduleScenarioSelection';
import ActionScheduleTimeOptions, {
  ActionScheduleTimeOption,
  TimingTitle,
} from '../components/ActionScheduleTimeOptions';
import ActionScheduleRooms, {
  ActionScheduleRoom,
} from '../components/ActionScheduleRooms';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import {
  EventScheduleDetail,
  Timetable,
} from './ResidentialSchedulesScreen_Action';
import {useModal} from '../components/ResidentialModal';
import ActionScheduleDaySelectionModal from '../components/ActionScheduleDaySelectionModal';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialEditActionScheduleScreen'
>;

const fullDayKeys: {[key: string]: number} = {
  Sunday: 7,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const days: {[key: string]: string} = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

const defaultSelectedDays: SelectedDay[] = [
  {
    key: 'Sun',
    value: 'S',
    selected: false,
  },
  {
    key: 'Mon',
    value: 'M',
    selected: false,
  },
  {
    key: 'Tue',
    value: 'T',
    selected: false,
  },
  {
    key: 'Wed',
    value: 'W',
    selected: false,
  },
  {
    key: 'Thu',
    value: 'T',
    selected: false,
  },
  {
    key: 'Fri',
    value: 'F',
    selected: false,
  },
  {
    key: 'Sat',
    value: 'S',
    selected: false,
  },
];

const mappingLanguageDay = (key: string | null) => {
  switch (key) {
    case 'Sunday':
      return t('Residential__Home_Automation__full_Sunday', 'Sunday');

    case 'Monday':
      return t('Residential__Home_Automation__full_Monday', 'Monday');

    case 'Tuesday':
      return t('Residential__Home_Automation__full_Tuesday', 'Tuesday');

    case 'Wednesday':
      return t('Residential__Home_Automation__full_Wednesday', 'Wednesday');

    case 'Thursday':
      return t('Residential__Home_Automation__full_Thursday', 'Thursday');

    case 'Friday':
      return t('Residential__Home_Automation__full_Friday', 'Friday');

    case 'Saturday':
      return t('Residential__Home_Automation__full_Saturday', 'Saturday');

    default:
      return key;
  }
};

const sunsetTimeOptions = [
  {label: '2 hour before', offset: -120},
  {label: '1:45 hour before', offset: -105},
  {label: '1:30 hour before', offset: -90},
  {label: '1:15 hour before', offset: -75},
  {label: '1 hour before', offset: -60},
  {label: '45 min before', offset: -45},
  {label: '30 min before', offset: -30},
  {label: '15 min before', offset: -15},
  {
    label: t('Residential__Home_Automation__Sunset_nocut', 'Sunset'),
    offset: 0,
  },
  {label: '15 min after', offset: 15},
  {label: '30 min after', offset: 30},
  {label: '45 min after', offset: 45},
  {label: '1 hour after', offset: 60},
  {label: '1:15 hour after', offset: 75},
  {label: '1:30 hour after', offset: 90},
  {label: '1:45 hour after', offset: 105},
  {label: '2 hour after', offset: 120},
];

const sunriseTimeOptions = [
  {label: '2 hour before', offset: -120},
  {label: '1:45 hour before', offset: -105},
  {label: '1:30 hour before', offset: -90},
  {label: '1:15 hour before', offset: -75},
  {label: '1 hour before', offset: -60},
  {label: '45 min before', offset: -45},
  {label: '30 min before', offset: -30},
  {label: '15 min before', offset: -15},
  {
    label: t('Residential__Home_Automation__Sunrise_nocut', 'Sunrise'),
    offset: 0,
  },
  {label: '15 min after', offset: 15},
  {label: '30 min after', offset: 30},
  {label: '45 min after', offset: 45},
  {label: '1 hour after', offset: 60},
  {label: '1:15 hour after', offset: 75},
  {label: '1:30 hour after', offset: 90},
  {label: '1:45 hour after', offset: 105},
  {label: '2 hour after', offset: 120},
];

const ResidentialEditActionScheduleScreen = ({route: {params}}: Props) => {
  const defaultTimeOptions: ActionScheduleTimeOption[] = [
    {
      title: 'Timing',
      times: {
        hour: 10,
        minute: 0,
      },
      twilightOffset: 0,
      display: '10:00',
      selected: false,
    },
    {
      title: 'Sunrise',
      times: {
        hour: 0,
        minute: 0,
      },
      twilightOffset: 0,
      display: t('Residential__Home_Automation__Sunrise_nocut', 'Sunrise'),
      selected: false,
    },
    {
      title: 'Sunset',
      times: {
        hour: 0,
        minute: 0,
      },
      twilightOffset: 0,
      display: t('Residential__Home_Automation__Sunset_nocut', 'Sunset'),
      selected: false,
    },
  ];
  const schedule = params.schedule;
  const zoneId = params.selectedZoneId;
  const selectedDay = params.selectedDay;
  const selectedIndex = params.selectedIndex;
  const selectedZone = schedule.zones.find(e => e.id === zoneId);
  const [initTimeOptionTitle, setInitTimeOptionTitle] =
    useState<TimingTitle>('Timing');

  const [selectedScenarios, setSelectedScenarios] = useState<SelectScenario[]>(
    [],
  );
  const [selectedDays, setSelectedDays] =
    useState<SelectedDay[]>(defaultSelectedDays);
  const [selectedTimeOptions, setSelectedTimeOptions] =
    useState<ActionScheduleTimeOption[]>(defaultTimeOptions);
  const [selectedRooms, setSelectedRooms] = useState<ActionScheduleRoom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectedModuleOrScene, setIsSelectedModuleOrScene] = useState(false);
  const [name, setName] = useState<string | undefined>(selectedZone?.name);
  const navigation = useNavigation();
  const [_, modalAction] = useModal();

  useEffect(() => {
    initialTiming(schedule, zoneId, selectedDay, selectedIndex);
    fetchData();
  }, []);

  useEffect(() => {
    const selectedModules = getSelectedModules(selectedRooms);
    const selectedScenarioIds = getSelectedScenarios(selectedScenarios);
    setIsSelectedModuleOrScene(
      selectedModules.length > 0 || selectedScenarioIds.length > 0,
    );
  }, [selectedScenarios, selectedRooms]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const initialScenarioIds = selectedZone?.scenarios ?? [];
      const initialModulesIds = selectedZone?.modules ?? [];
      setSelectedScenarios(
        mapToSelectedScenarios(params.scenarios, initialScenarioIds),
      );
      setSelectedRooms(mapToSelectedRooms(params.rooms, initialModulesIds));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const mapToSelectedRooms = (
    rooms: Room[],
    selectedModules: Module[],
  ): any[] => {
    const removeBNTHModules = rooms.map(room => ({
      ...room,
      module: room.module.filter(e => e.type !== 'BNTH'),
    }));
    return removeBNTHModules.map(room => ({
      ...room,
      modules: room.module.map(e => {
        const selectedModule = selectedModules.find(m => m.id === e.id);
        if (selectedModule && selectedModule.type !== 'BNTH') {
          return {
            ...e,
            on: selectedModule.type !== 'BNAS' && selectedModule.on,
            selected: true,
            brightness:
              selectedModule.type === 'BNLD' ? selectedModule.brightness : 0,
            target_position:
              selectedModule.type === 'BNAS'
                ? selectedModule.target_position
                : 0,
          };
        }
        return {
          ...e,
          on: false,
          selected: false,
          brightness: 0,
          target_position: 0,
        };
      }),
    }));
  };

  const mapToSelectedScenarios = (
    scenarios: Scenario[],
    selectedScenarioIds: string[],
  ) => {
    return scenarios.map(e => ({
      ...e,
      selected: selectedScenarioIds.some(id => id === e.id),
    }));
  };

  const initialSelectedDays = (
    schedule: EventScheduleDetail,
    zoneId: number,
    timeOptionTitle: TimingTitle,
  ) => {
    const days: ShortDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let selectedDays: ShortDay[] = [];
    // update all selected days in zone
    if (timeOptionTitle === 'Sunrise') {
      const selectedDaysInSunrise = schedule.timetable_sunrise
        .filter(e => e.zone_id === zoneId)
        .map(e => e.day);
      selectedDays = selectedDaysInSunrise.map(num => days[num - 1]);
    } else if (timeOptionTitle === 'Sunset') {
      const selectedDaysInSunset = schedule.timetable_sunset
        .filter(e => e.zone_id === zoneId)
        .map(e => e.day);
      selectedDays = selectedDaysInSunset.map(num => days[num - 1]);
    } else {
      // flat map all readable timetable days
      selectedDays = days
        .filter(day =>
          schedule.readable_timetable[day].some(e => e.zoneId === zoneId),
        )
        .map(day => day);
    }

    setSelectedDays(
      defaultSelectedDays.map(e => ({
        ...e,
        selected: selectedDays.some(day => day === e.key),
      })),
    );
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const initialTiming = (
    schedule: EventScheduleDetail,
    zoneId: number,
    day: ShortDay,
    index: number,
  ) => {
    const sunrises = schedule.timetable_sunrise;
    const sunsets = schedule.timetable_sunset;
    const now = new Date();
    const selectedTimetable = schedule.readable_timetable[day][index];
    let hour = now.getHours();
    let minute = calculateTimingMinute(now.getMinutes());
    minute = minute === 60 ? 55 : minute;
    let display = '';

    // Check if some zoneId is in timetable_sunrise or timetable_sunset
    // then update selectedTimeOptions
    const someSunrise = sunrises.find(
      e =>
        e.zone_id === zoneId && e.twilight_offset === selectedTimetable.mOffset,
    );
    const someSunset = sunsets.find(
      e =>
        e.zone_id === zoneId && e.twilight_offset === selectedTimetable.mOffset,
    );

    let _initTimeOptionTitle: TimingTitle = 'Timing';
    if (someSunrise) {
      _initTimeOptionTitle = 'Sunrise';
      setInitTimeOptionTitle('Sunrise');
      display =
        sunriseTimeOptions.find(e => e.offset === someSunrise.twilight_offset)
          ?.label ?? '';
    } else if (someSunset) {
      _initTimeOptionTitle = 'Sunset';
      setInitTimeOptionTitle('Sunset');
      display =
        sunsetTimeOptions.find(e => e.offset === someSunset.twilight_offset)
          ?.label ?? '';
    } else {
      display = selectedTimetable.timeReadable;
      hour = parseInt(selectedTimetable.timeReadable.split(':')[0]);
      minute = parseInt(selectedTimetable.timeReadable.split(':')[1]);
    }

    setSelectedTimeOptions(prev =>
      prev.map(e => {
        e.selected = e.title === _initTimeOptionTitle;
        e.display = e.title === _initTimeOptionTitle ? display : e.display;

        if (e.title === 'Timing') {
          e.times = {
            hour,
            minute,
          };
          e.display = `${paddingWith2Zero(hour.toString())}:${paddingWith2Zero(
            minute.toString(),
          )}`;
        } else if (e.title === 'Sunrise' && someSunrise) {
          e.twilightOffset = someSunrise.twilight_offset;
        } else if (e.title === 'Sunset' && someSunset) {
          e.twilightOffset = someSunset.twilight_offset;
        }

        return e;
      }),
    );

    initialSelectedDays(schedule, zoneId, initTimeOptionTitle);
  };

  const calculateTimingMinute = (minute: number) => {
    const step = 5;
    const epsilon = 3;
    const remain = minute % step;
    const gap = step - remain;
    // If remain > epsilon mean it's close to next five minute
    return remain > epsilon ? minute + gap : minute - remain;
  };

  const onSelectedScene = (id: string) => {
    setSelectedScenarios(prev =>
      prev.map(e => ({...e, selected: e.id === id ? !e.selected : e.selected})),
    );
  };

  const onSelectedDay = (key: ShortDay) => {
    setSelectedDays(prev =>
      prev.map(e => ({
        ...e,
        selected: e.key === key ? !e.selected : e.selected,
      })),
    );
  };

  const onSelectedTimeOptions = (option: ActionScheduleTimeOption) => {
    setSelectedTimeOptions(prev =>
      prev.map(e => (e.title === option.title ? option : e)),
    );
  };

  const onSelectedTimeOptionTitle = (title: TimingTitle) => {
    setSelectedTimeOptions(prev =>
      prev.map(e => ({
        ...e,
        selected: e.title === title,
      })),
    );
  };

  const onSelectedRooms = (room: ActionScheduleRoom) => {
    setSelectedRooms(prev => prev.map(e => (e.id === room.id ? room : e)));
  };

  const getSelectedTimetableSunsetSunrise = (
    zoneId: number,
    dayKeys: number[],
    selectedTimeOption: ActionScheduleTimeOption,
  ) => {
    return dayKeys.map(day => ({
      zone_id: zoneId,
      day,
      twilight_offset: selectedTimeOption.twilightOffset,
    }));
  };

  const getSelectedModules = (selectedRooms: ActionScheduleRoom[]) => {
    return selectedRooms
      .map(room => room.modules.filter(module => module.selected)) // get only selected module
      .flatMap(e => e) // map all modules in one array
      .map(({selected, ...rest}) => rest); // remove selected key
  };

  const getSelectedScenarios = (selectedScenarios: SelectScenario[]) => {
    return selectedScenarios
      .filter(scene => scene.selected)
      .map(selected => selected.id);
  };

  const getActionData = (
    zoneId: number,
    selectedTimeOption: ActionScheduleTimeOption,
    days: string[],
  ) => {
    let timeOfDay = '';
    if (selectedTimeOption.title === 'Timing') {
      timeOfDay = selectedTimeOption.display;
    }
    return {
      days,
      timeOfDay,
      zoneId,
    };
  };

  const getUpdatedZones = (
    zoneId: number,
    schedule: EventScheduleDetail,
    selectedModules: any[],
    selectedScenarioIds: string[],
    name?: string,
  ) => {
    return schedule.zones.map(zone =>
      zone.id === zoneId
        ? {
            ...zone,
            modules: selectedModules,
            scenarios: selectedScenarioIds,
            name: name ?? null,
          }
        : zone,
    ) as Zone[];
  };

  const sortTimeByDayTimeOffset = (data: TimetableSunsetSunrise[]) => {
    return data.sort((a, b) => {
      if (a.day !== b.day) {
        return a.day - b.day; // Sort by day
      }
      return a.twilight_offset - b.twilight_offset; // Sort by twilight_offset if days are equal
    });
  };

  const onPressValidate = () => {
    modalAction.setContent(
      <ActionScheduleDaySelectionModal
        selectedDays={selectedDays}
        onSelect={onSelectedDay}
        onConfirm={onEdit}
      />,
    );
    modalAction.show();
  };

  const onEdit = useCallback(
    async (days: string[]) => {
      try {
        setIsLoading(true);
        const homeId = await residentialTenantAction.getHomeId();
        if (!homeId) return;

        // update zones
        const selectedModules = getSelectedModules(selectedRooms);
        const selectedScenarioIds = getSelectedScenarios(selectedScenarios);
        let zones = getUpdatedZones(
          zoneId,
          schedule,
          selectedModules,
          selectedScenarioIds,
          name,
        );

        const selectedTimeOption =
          selectedTimeOptions.find(e => e.selected) || selectedTimeOptions[0];
        const actionData = getActionData(zoneId, selectedTimeOption, days);

        // remove unselected day in timetable
        const selectedDayNumbers = days.map(day => fullDayKeys[day]);
        let timetable = getSelectedTimetable(schedule.timetable);
        let timetableSunrise = getSelectedTimetableSunriseSunset(
          selectedDayNumbers,
          schedule.timetable_sunrise,
        );
        let timetableSunset = getSelectedTimetableSunriseSunset(
          selectedDayNumbers,
          schedule.timetable_sunset,
        );

        /**
         * If user changed time option title we need to delete this zone in time option
         */
        const oldTimeOffset =
          schedule.readable_timetable[selectedDay][selectedIndex].mOffset;
        const newTimeOffset = selectedTimeOption.twilightOffset;
        if (
          initTimeOptionTitle !== selectedTimeOption.title ||
          oldTimeOffset !== newTimeOffset
        ) {
          if (initTimeOptionTitle === 'Timing') {
            timetable = removeTimetableByZoneId(timetable, zoneId);
          }
          if (initTimeOptionTitle === 'Sunrise') {
            timetableSunrise = removeTimetableSunriseSunsetByZoneId(
              timetableSunrise,
              zoneId,
            );
          }
          if (initTimeOptionTitle === 'Sunset') {
            timetableSunset = removeTimetableSunriseSunsetByZoneId(
              timetableSunset,
              zoneId,
            );
          }
        }

        /**
         * If user selected time option is 'Sunrise' or 'Sunset'
         * we need to add new selected time offset to `timetable_sunrise` or `timetable_sunset`
         */
        if (selectedTimeOption.title === 'Sunrise') {
          timetableSunrise = mergeNewTimetableSunriseSunset(
            selectedDayNumbers,
            timetableSunrise,
            selectedTimeOption,
          );
        }
        if (selectedTimeOption.title === 'Sunset') {
          timetableSunset = mergeNewTimetableSunriseSunset(
            selectedDayNumbers,
            timetableSunset,
            selectedTimeOption,
          );
        }
        timetableSunrise =
          removeOffsetZeroTimetableSunriseSunset(timetableSunrise);
        timetableSunset =
          removeOffsetZeroTimetableSunriseSunset(timetableSunset);
        let body: object = {
          home_id: homeId,
          schedule_id: schedule.id,
          name: schedule.name,
          operation: 'event',
          schedule_type: 'event',
          timetable,
          zones,
          default: schedule.default,
          away_temp: 0,
          hg_temp: 0,
          type: 'event',
          timetable_sunrise: timetableSunrise,
          timetable_sunset: timetableSunset,
          selected: schedule.selected,
        };
        if (selectedTimeOption.title === 'Timing') {
          body = {
            ...body,
            actionData,
            actionType: 'edit',
          };
        }
        const {status} = await netatmoService.syncHomeSchedule(body);
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
    },
    [selectedTimeOptions, selectedRooms, selectedScenarios, name],
  );

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'ResidentialEditActionScheduleScreen',
      buttonColor: 'dark-teal',
      onPressBack: () =>
        navigation.navigate('ResidentialEditActionScheduleScreen', {...params}),
    });
  };

  const mergeNewTimetableSunriseSunset = (
    selectedDayNumbers: number[],
    timetable: TimetableSunsetSunrise[],
    selectedTimeOption: ActionScheduleTimeOption,
  ) => {
    const newTimetable = getSelectedTimetableSunsetSunrise(
      zoneId,
      selectedDayNumbers,
      selectedTimeOption,
    );
    const filteredDuplicateDayTime =
      removeDuplicatedDayTwilightOffsetOfPrevTimetable(
        fillZeroTwilightOffset(timetable),
        newTimetable,
      );
    const updated = [...filteredDuplicateDayTime, ...newTimetable];
    return sortTimeByDayTimeOffset(updated);
  };

  const fillZeroTwilightOffset = (timetable: TimetableSunsetSunrise[]) => {
    return timetable.map(e => ({
      ...e,
      twilight_offset: e?.twilight_offset || 0,
    }));
  };

  const removeDuplicatedDayTwilightOffsetOfPrevTimetable = (
    prevTable: TimetableSunsetSunrise[],
    currTable: TimetableSunsetSunrise[],
  ) => {
    return prevTable.filter(
      prev =>
        !currTable.some(
          now =>
            now.day === prev.day &&
            now.twilight_offset === prev.twilight_offset,
        ),
    );
  };

  const removeOffsetZeroTimetableSunriseSunset = (
    timetable: TimetableSunsetSunrise[],
  ) => {
    return timetable.map(e =>
      e.twilight_offset === 0 ? {zone_id: e.zone_id, day: e.day} : e,
    ) as TimetableSunsetSunrise[];
  };

  const removeTimetableByZoneId = (timetable: Timetable[], zoneId: number) => {
    return timetable.filter(e => e.zone_id !== zoneId);
  };

  const removeTimetableSunriseSunsetByZoneId = (
    timetable: TimetableSunsetSunrise[],
    zoneId: number,
  ) => {
    return timetable.filter(e => e.zone_id !== zoneId);
  };

  const getSelectedTimetableSunriseSunset = (
    selectedDayIndexes: number[],
    timetable: TimetableSunsetSunrise[],
  ) => {
    const selectedDayMapped = timetable.map(e => {
      const isUnselectedDay =
        e.zone_id === zoneId && !selectedDayIndexes.some(day => day === e.day);
      return isUnselectedDay ? undefined : e;
    });
    return selectedDayMapped.filter(e => e !== undefined);
  };

  const getSelectedTimetable = (timetable: Timetable[]) => {
    const readableTimetable = schedule.readable_timetable;
    const selectedShortDays = selectedDays
      .filter(e => e.selected)
      .map(e => e.key);

    const selectedTimeOffset: number[] = selectedShortDays
      .map(
        day => readableTimetable[day].find(e => e.zoneId === zoneId)?.mOffset,
      )
      .filter(e => e !== undefined);

    // remove unselected mOffset in this zone
    const selectedTimetable = timetable.map(e => {
      const isUnselectedMOffset =
        e.zone_id === zoneId &&
        !selectedTimeOffset.some(selected => selected === e.m_offset);

      return isUnselectedMOffset ? undefined : e;
    });
    return selectedTimetable.filter(e => e !== undefined);
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={mappingLanguageDay(days[selectedDay]) ?? ''}
          titleColor="dark-gray"
          bgColor="bg-white"
        />

        <ScrollView
          className="w-full bg-white"
          style={[
            {backgroundColor: 'white', paddingBottom: 16, paddingTop: 40},
          ]}>
          <View className="px-4">
            <Text className="text-2xl color-black font-obMedium mb-3">
              {t(
                'Residential__Home_Automation__My_Actions_Schedule',
                'My Actions Schedule',
              )}
            </Text>
            <TextInput
              className="color-black font-obRegular flex flex-col px-4 py-4 border border-line-light"
              placeholder={t(
                'Residential__Home_Automation__Event_name',
                'Event name',
              )}
              placeholderTextColor="grey"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />

            <ActionScheduleTimeOptions
              options={selectedTimeOptions}
              onChanged={onSelectedTimeOptions}
              onSelectedTimeTitle={onSelectedTimeOptionTitle}
              disabled={isLoading}
            />
            <Text className="text-2xl color-black font-obMedium mt-12 mb-2">
              {t('Residential__Home_Automation__Scenes', 'Scenes')}
            </Text>
            <ActionScheduleScenarioSelection
              data={selectedScenarios}
              onSelected={onSelectedScene}
              disabled={isLoading}
            />
          </View>
          <View className="m-6" />
          <ActionScheduleRooms
            rooms={selectedRooms}
            disabled={isLoading}
            onChanged={onSelectedRooms}
          />

          <View style={{marginBottom: 170}} />
        </ScrollView>
      </ScreenContainer>

      {isSelectedModuleOrScene && (
        <StickyButton
          title={t('Residential__Home_Automation__Validate', 'Validate')}
          rightIcon="next"
          iconHeight={20}
          color="dark-teal"
          onPress={onPressValidate}
          disabled={isLoading}
        />
      )}
    </>
  );
};

export default ResidentialEditActionScheduleScreen;
