import {ScrollView, View, TouchableOpacity, TextInput} from 'react-native';
import t from '~/utils/text';
import React, {useEffect, useState} from 'react';
import {ScreenContainer} from '../components/ScreenContainer';
import {Text, Spacing} from '~/components/atoms';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {Header} from '../components/Header';
import {
  actionScheduleSelectedDay,
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
import ActionScheduleDaysTabSelection, {
  SelectedDay,
} from '../components/ActionScheduleDaySelection';
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
import {Timetable} from './ResidentialSchedulesScreen_Action';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialAddActionScheduleScreen'
>;

const dayKeys: {[key: string]: number} = {
  Sun: 7,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
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

const ResidentialAddActionScheduleScreen = ({route: {params}}: Props) => {
  const defaultTimeOptions: ActionScheduleTimeOption[] = [
    {
      title: 'Timing',
      times: {
        hour: 10,
        minute: 0,
      },
      twilightOffset: 0,
      display: '10:00',
      selected: true,
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
  const [name, setName] = useState<string>();
  const navigation = useNavigation();

  useEffect(() => {
    initialTiming();
    fetchData(params.selectedDay);
  }, []);

  useEffect(() => {
    const selectedModules = getSelectedModules();
    const selectedScenarioIds = getSelectedScenarios();
    setIsSelectedModuleOrScene(
      selectedModules.length > 0 || selectedScenarioIds.length > 0,
    );
  }, [selectedScenarios, selectedRooms]);

  const fetchData = async (selectedDay: ShortDay) => {
    try {
      setIsLoading(true);
      initialSelectedDays(selectedDay);
      setSelectedScenarios(mapToSelectedScenarios(params.scenarios));
      setSelectedRooms(mapToSelectedRooms(params.rooms));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const mapToSelectedRooms = (rooms: Room[]): any[] => {
    const removeBNTHModules = rooms.map(room => ({
      ...room,
      module: room.module.filter(e => e.type !== 'BNTH'),
    }));
    return removeBNTHModules.map(room => ({
      ...room,
      modules: room.module.map(e => ({
        ...e,
        on: true,
        selected: false,
        brightness: 0,
        target_position: 100,
      })),
    }));
  };

  const mapToSelectedScenarios = (scenarios: Scenario[]) => {
    return scenarios.map(e => ({
      ...e,
      selected: false,
    }));
  };

  const initialSelectedDays = (selectedDay: ShortDay) => {
    onSelectedDay(selectedDay);
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const initialTiming = () => {
    const now = new Date();
    const hour = now.getHours();
    let minute = calculateTimingMinute(now.getMinutes());
    minute = minute === 60 ? 55 : minute;
    setSelectedTimeOptions(prev =>
      prev.map(e =>
        e.title === 'Timing'
          ? {
              ...e,
              times: {
                hour,
                minute,
              },
              display: `${paddingWith2Zero(hour.toString())}:${paddingWith2Zero(
                minute.toString(),
              )}`,
            }
          : e,
      ),
    );
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

  const onSelectedAllDays = () => {
    const isSomeDayNotSelected = selectedDays.some(e => !e.selected);
    if (isSomeDayNotSelected) {
      setSelectedDays(prev => prev.map(e => ({...e, selected: true})));
    }
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

  const getSelectedDays = () => {
    return selectedDays.filter(e => e.selected).map(e => days[e.key]);
  };

  const getSelectedDayNumbers = () => {
    return selectedDays.filter(e => e.selected).map(e => dayKeys[e.key]);
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

  const getSelectedModules = () => {
    return selectedRooms
      .map(room => room.modules.filter(module => module.selected)) // get only selected module
      .flatMap(e => e) // map all modules in one array
      .map(({selected, ...rest}) => rest); // remove selected key
  };

  const createNewZone = (
    zoneId: number,
    modules: Module[],
    scenarios: string[],
  ) => {
    return {
      name: name ?? null,
      id: zoneId,
      type: zoneId,
      rooms_temp: null,
      rooms: null,
      modules: modules.length > 0 ? modules : null,
      scenarios: scenarios.length > 0 ? scenarios : null,
    } as unknown as Zone;
  };

  const getSelectedScenarios = () => {
    return selectedScenarios
      .filter(scene => scene.selected)
      .map(selected => selected.id);
  };

  const calculateSunsetSunriseTimeOfDay = (
    times: string,
    twilightOffset: number,
  ) => {
    const initHour = parseInt(times.split(':')[0]) * 60;
    const initMinute = parseInt(times.split(':')[1]);
    const timeOffset = initHour + initMinute + twilightOffset;

    const result = timeOffset / 60;
    const hour = Math.floor(result);
    const minute = Math.ceil((result - hour) * 60);
    return `${paddingWith2Zero(hour.toString())}:${paddingWith2Zero(
      minute.toString(),
    )}`;
  };

  const getActionData = (
    zoneId: number,
    selectedTimeOption: ActionScheduleTimeOption,
  ) => {
    let timeOfDay = '';
    if (selectedTimeOption.title === 'Timing') {
      timeOfDay = selectedTimeOption.display;
    }
    return {
      days: getSelectedDays(),
      timeOfDay,
      zoneId,
    };
  };

  const getLatestZoneId = (zones: Zone[]) => {
    if (zones.length === 0) return -1;
    return Math.max(...zones.map(e => e.id));
  };

  const getUpdatedZones = (
    selectedModules: ReturnType<typeof getSelectedModules>,
    selectedScenarioIds: string[],
    zones: Zone[],
    zoneId: number,
  ) => {
    zones = zones.filter(e => e.id !== zoneId); // filter out zoneId before update
    const newZone = createNewZone(zoneId, selectedModules, selectedScenarioIds);
    return [...zones, newZone];
  };

  const sortTimeByDayTimeOffset = (data: TimetableSunsetSunrise[]) => {
    return fillZeroTwilightOffset(data).sort((a, b) => {
      if (a.day !== b.day) {
        return a.day - b.day; // Sort by day
      }
      return a.twilight_offset - b.twilight_offset; // Sort by twilight_offset if days are equal
    });
  };

  const getUpdatedTiming = (
    newZoneId: number,
    selectedDayNumbers: number[],
    timetableSunrise: TimetableSunsetSunrise[],
    timetableSunset: TimetableSunsetSunrise[],
  ) => {
    const selectedTimeOption =
      selectedTimeOptions.find(e => e.selected) || selectedTimeOptions[0];
    const actionData = getActionData(newZoneId, selectedTimeOption);
    if (selectedTimeOption.title === 'Sunrise') {
      const newSunrise = getSelectedTimetableSunsetSunrise(
        newZoneId,
        selectedDayNumbers,
        selectedTimeOption,
      );
      const filteredDuplicateDayTime =
        removeDuplicatedDayTwilightOffsetOfPrevTimetable(
          fillZeroTwilightOffset(timetableSunrise),
          newSunrise,
        );
      timetableSunrise = sortTimeByDayTimeOffset([
        ...filteredDuplicateDayTime,
        ...newSunrise,
      ]);
    } else if (selectedTimeOption.title === 'Sunset') {
      const newSunset = getSelectedTimetableSunsetSunrise(
        newZoneId,
        selectedDayNumbers,
        selectedTimeOption,
      );
      const filteredDuplicateDayTime =
        removeDuplicatedDayTwilightOffsetOfPrevTimetable(
          fillZeroTwilightOffset(timetableSunset),
          newSunset,
        );
      timetableSunset = sortTimeByDayTimeOffset([
        ...filteredDuplicateDayTime,
        ...newSunset,
      ]);
    }

    return {actionData, timetableSunrise, timetableSunset};
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

  const validateTimetableSunsetSunrise = (
    selectedTimeOption: ActionScheduleTimeOption,
    timetable: TimetableSunsetSunrise[],
  ) => {
    // check selected twilightOffset is exists
    const existByTwilightOffset = timetable.find(
      e => e.twilight_offset === selectedTimeOption.twilightOffset,
    );
    if (existByTwilightOffset) {
      // filter old timetable out by zoneId
      return {
        timetable: timetable.filter(
          e => e.zone_id !== existByTwilightOffset.zone_id,
        ),
        isExists: true,
        zoneId: existByTwilightOffset.zone_id,
      };
    }
    return {timetable, isExists: false, zoneId: -1};
  };

  const removeUnusedZones = (
    zones: Zone[],
    timetable: Timetable[],
    sunrise: TimetableSunsetSunrise[],
    sunset: TimetableSunsetSunrise[],
  ) => {
    return zones.filter(
      zone =>
        timetable.some(e => e.zone_id === zone.id) ||
        sunrise.some(e => e.zone_id === zone.id) ||
        sunset.some(e => e.zone_id === zone.id),
    );
  };

  const onPressValidate = async () => {
    try {
      setIsLoading(true);
      const selectedModules = getSelectedModules();
      const selectedScenarioIds = getSelectedScenarios();
      // initial update data
      let zones = schedule?.zones ?? [];
      let zoneId = getLatestZoneId(zones) + 1;
      zones = getUpdatedZones(
        selectedModules,
        selectedScenarioIds,
        zones,
        zoneId,
      );
      let timetableSunrise = schedule?.timetable_sunrise ?? [];
      let timetableSunset = schedule?.timetable_sunset ?? [];

      // Check if the selected time is 'sunrise' or 'sunset'
      // If TwilightOffset exists:
      //    - Update zones with the newly selected modules and scenes
      //    - Retain the existing zoneId
      //    - Update the timetable with the newly selected days
      // Otherwise, continue using the initial data
      const selectedTimeOption =
        selectedTimeOptions.find(e => e.selected) || selectedTimeOptions[0];
      if (selectedTimeOption.title !== 'Timing') {
        const updatedTimeSunrise = validateTimetableSunsetSunrise(
          selectedTimeOption,
          timetableSunrise,
        );
        if (updatedTimeSunrise.isExists) {
          timetableSunrise = updatedTimeSunrise.timetable;
          zoneId = updatedTimeSunrise.zoneId;
        }
        const updatedTimeSunset = validateTimetableSunsetSunrise(
          selectedTimeOption,
          timetableSunset,
        );
        if (updatedTimeSunset.isExists) {
          timetableSunset = updatedTimeSunset.timetable;
          zoneId = updatedTimeSunset.zoneId;
        }
      }

      zones = getUpdatedZones(
        selectedModules,
        selectedScenarioIds,
        zones,
        zoneId,
      );
      const selectedDayNumbers = getSelectedDayNumbers();
      const {actionData, ...updatedTiming} = getUpdatedTiming(
        zoneId,
        selectedDayNumbers,
        timetableSunrise,
        timetableSunset,
      );
      if (selectedTimeOption.title !== 'Timing') {
        zones = removeUnusedZones(
          zones,
          schedule?.timetable,
          updatedTiming.timetableSunrise,
          updatedTiming.timetableSunset,
        );
      }
      const homeId = await residentialTenantAction.getHomeId();
      let body: object = {
        home_id: homeId,
        schedule_id: params.id,
        name: schedule.name,
        operation: 'event',
        schedule_type: 'event',
        timetable: schedule?.timetable,
        zones,
        default: schedule.default,
        away_temp: 0,
        hg_temp: 0,
        type: 'event',
        timetable_sunrise: removeOffsetZeroTimetableSunriseSunset(
          updatedTiming.timetableSunrise,
        ),
        timetable_sunset: removeOffsetZeroTimetableSunriseSunset(
          updatedTiming.timetableSunset,
        ),
        selected: schedule?.selected,
      };
      if (selectedTimeOption.title === 'Timing') {
        body = {
          ...body,
          actionData,
          actionType: 'add',
        };
      }
      const {status} = await netatmoService.syncHomeSchedule(body);
      if (status === 200) {
        await residentialScheduleAction.getHome();
        const addedDays = actionData.days.map(day => day.slice(0, 3));
        actionScheduleSelectedDay.set(getDayToNavigate(addedDays));
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
      screenHook: 'ResidentialAddActionScheduleScreen',
      buttonColor: 'dark-teal',
      onPressBack: () =>
        navigation.navigate('ResidentialAddActionScheduleScreen', {...params}),
    });
  };

  const getDayToNavigate = (addedDays: string[]) => {
    if (addedDays.some(day => day === params.selectedDay)) {
      return params.selectedDay;
    }
    return addedDays[0] as ShortDay;
  };

  const removeOffsetZeroTimetableSunriseSunset = (
    timetable: TimetableSunsetSunrise[],
  ) => {
    return timetable.map(e =>
      e.twilight_offset === 0 ? {zone_id: e.zone_id, day: e.day} : e,
    ) as TimetableSunsetSunrise[];
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
            'Residential__Home_Automation__Add_Actions_Schedule',
            'Add Actions Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />

        <ScrollView
          className="w-full bg-white"
          style={[{backgroundColor: 'white'}]}>
          <Spacing height={40} />
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
            <View
              style={{alignContent: 'flex-end'}}
              className="flex flex-row justify-between mt-12">
              <Text
                style={{
                  display: 'flex',
                  alignSelf: 'flex-end',
                }}
                className="text-2xl color-black font-obMedium">
                {t(
                  'Residential__Home_Automation__Select_One_Or_Several_Days',
                  'Select one or\nseveral days',
                )}
              </Text>
              <TouchableOpacity
                className="mb-1"
                style={{
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  display: 'flex',
                }}
                onPress={onSelectedAllDays}
                disabled={isLoading}>
                <Text style={{color: '#014541'}} className="font-obMedium">
                  {t('Residential__Home_Automation__Select_All', 'Select All')}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-6">
              <ActionScheduleDaysTabSelection
                selectedDays={selectedDays}
                onSelect={onSelectedDay}
                disabled={isLoading}
              />
            </View>

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
          <View>
            <ActionScheduleRooms
              rooms={selectedRooms}
              disabled={isLoading}
              onChanged={onSelectedRooms}
            />
            <Spacing height={120} />
          </View>
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

export default ResidentialAddActionScheduleScreen;
