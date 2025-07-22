import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import t from '~/utils/text';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '~/navigations/AppNavigation';
import { ScreenContainer } from '../components/ScreenContainer';
import { Icon, Text } from '~/components/atoms';
import { StickyButton } from '~/features/residential/components/StickyButton';
import { Header } from '../components/Header';
import DaysTabSelection, {
  DayTabList,
  DayTabType,
} from '../components/DaysTabSelection';
import ScenesHorizontal, {
  Scene,
  SceneItemProps,
} from '../components/ScenesHorizontal';
import TimePickerModal from '../components/TimePickerModal';
import { modalActions } from '../components/ResidentialModal';
import netatmoService from '~/services/residentialService/NetatmoService';
import Room, { Module } from '../components/Room';
import OptionActinoScheduleValidateModal, {
  ModalEvent,
} from '../components/OptionActionScheduleValidateModal';
import WheelTimePickerModal from '../components/WheelTimePicker';
import { useRoute } from '@react-navigation/native';
type TimingTitle = undefined | 'Timing' | 'Sunrise' | 'Sunset';
type Times = {
  hour: number;
  minute: number;
};
type ScheduleTiming = {
  title: TimingTitle;
  times: Times;
  selected: boolean;
  twilight_offset: number;
  type: number;
};

enum ScheduleType {
  'Timing' = 0,
  'Sunrise' = 1,
  'Sunset' = 2,
}
const initialScheduleTiming: ScheduleTiming[] = [
  {
    title: 'Timing',
    times: {
      hour: 10,
      minute: 0,
    },
    twilight_offset: 0,
    type: ScheduleType['Timing'],
    selected: true,
  },
  {
    title: 'Sunrise',
    times: {
      hour: 0,
      minute: 0,
    },
    twilight_offset: 0,
    type: ScheduleType['Sunrise'],
    selected: false,
  },
  {
    title: 'Sunset',
    times: {
      hour: 0,
      minute: 0,
    },
    twilight_offset: 0,
    type: ScheduleType['Sunset'],
    selected: false,
  },
];

type ActionData = {
  days: string[];
  timeOfDay: string;
  zoneId: number;
};

type ReadableTimetableItem = {
  "timeReadable": string,
  "zoneId": number,
  "mOffset": number
}
type SchedulePayload = {
  home_id: string | null;
  name: string | null;
  schedule_id: string;

  schedule_type: 'event';
  operation: 'event';
  actionType: 'add' | 'edit';

  actionData: ActionData | null;

  zones: ZoneState[];
  timetable: [];
  timetable_sunrise: [];
  timetable_sunset: [];
  readable_timetable: {
    "Mon": [ReadableTimetableItem],
    "Tue": [ReadableTimetableItem],
    "Wed": [ReadableTimetableItem],
    "Thu": [ReadableTimetableItem],
    "Fri": [ReadableTimetableItem],
    "Sat": [ReadableTimetableItem],
    "Sun": [ReadableTimetableItem]
  },

  default: false;
  away_temp: 0;
  hg_temp: 0;
  type: 'event';
  selected: true;
};

type TimeTableProps = {
  key: string; // Don't forget this field before sending to the Request
  day: string;

  zone_id: number;
  m_offset: number;
};

type ZoneState = {
  id: number /** Default zone id */;
  rooms: any[];
  modules: any[] /** module's payload each type */;
  scenarios: string[] /** scenarios id as string */;
};

type ExistSchedule = {
  timetable: [];
  readable_timetable: {
    Mon: [];
    Tue: [];
    Wed: [];
    Thu: [];
    Fri: [];
    Sat: [];
    Sun: [];
  };
  zones: ZoneState[];
  name: '';
  default: false;
  away_temp: 0;
  hg_temp: 0;
  id: '';
  type: '';
  timetable_sunrise: [];
  timetable_sunset: [];
};

export enum Intent {
  Update = 0,
  Add = 1,
}

const IntentBody = {
  '0': {
    message: 'Going to update scheule.',
  },
  '1': {
    message: 'Going to add new schedule.',
  },
};

const ResidentialSchedulesScreen_AddSchedule = ({ }) => {
  const params = useRoute().params ?? -1;
  const { intent, scheduleId, selectedDay } = params;
  const defaultTiming = new Date();
  const navigation = useNavigation();
  const [schedulePayload, setSchedulePayload] = useState<SchedulePayload>({
    home_id: null, // HomeId from "homeData"
    name: null,
    schedule_id: scheduleId,
    operation: 'event',
    actionType: intent === Intent.Add ? "add" : "edit",
    schedule_type: 'event',

    actionData: null,

    zones: [] as ZoneState[],
    timetable: [],
    timetable_sunrise: [],
    timetable_sunset: [],

    default: false,
    away_temp: 0,
    hg_temp: 0,
    type: 'event',
    selected: true,
  });
  const [scheduleTimings, setScheduleTimings] = useState<ScheduleTiming[]>(
    initialScheduleTiming,
  );
  const [onTimeChanged, setOnTimeChanged] = useState<TimeTableProps | null>(
    null,
  );
  const [homeData, setHomeData] = useState(null);
  const [scenariosData, setScenariosData] = useState<[] | null>(null);
  const [scenariosProps, setScenariosProps] = useState<SceneItemProps[]>([]);
  const [selectAllDays, setSelectAllDays] = useState(false);
  const [pressedValidation, setPressedValidation] = useState({
    lock: true,
    timestamp: 0,
  });
  const [apiStateLock, setAPIStateLock] = useState({ lock: false });
  const [displayTimeSunset, setDisplayTimeSunset] = useState('');
  const [displayTimeSunrise, setDisplayTimeSunrise] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showValidateBtn, setShowValidateBtn] = useState(false);
  /** Exist Schedule */
  const [existActionName, setExistActionName] = useState('');
  const [existSchedule, setExistSchedule] = useState<ExistSchedule | null>(
    null,
  );
  /** Schedule Payload params */
  const [dataScheduleTypes, setDataScheduleTypes] = useState<{
    sunrise: 0 | null;
    sunset: 0 | null;
  }>({
    sunrise: null,
    sunset: null,
  });
  const [selectedSenarios, setSelectedScenarios] = useState<SceneItemProps[]>(
    [],
  );
  const [initZone, setInitZone] = useState<ZoneState>({
    id: 0 /** Default zone id */,
    rooms: [],
    modules: [
      /** module's payload each type */
    ],
    scenarios: [
      /** scenarios id as string */
    ],
  });
  const [onSelectedModulesChanged, SetOnSelectedModulesChanged] = useState(0);
  const [selectedModules, setSelectedModules] = useState<any>({});
  const [daySelection, setDaySelection] = useState<{
    days: DayTabType[];
    pressedDay: DayTabType | null;
    allDaysSelected: boolean;
  } | null>(null);
  const [daySelection_Confirm, setDaySelection_Confirm] = useState<{
    days: DayTabType[];
    pressedDay: DayTabType | null;
    allDaysSelected: boolean;
  } | null>(null);
  const [displayTime, setDisplayTime] = useState<Times>({
    hour: defaultTiming.getHours(),
    minute: defaultTiming.getMinutes(),
  });
  const [timetableList, setTimetableList] = useState<TimeTableProps[]>([]);
  const [initialSelectedDay, setInitialSelectedDay] = useState<DayTabType[]>(
    [],
  );

  /** Render methods */
  const Rooms = () => {
    // There is nothing to render.
    if (!homeData) {
      console.log("homeData doesn't exist.");
      return <View />;
    }

    const rooms = homeData?.rooms ?? [];
    /** Room Components */
    const renderItems = ({ room, index }: { room: any; index: number }) => (
      <Room
        room={room}
        homeId={homeData.id}
        hideModuleTypes={['BNTH']}
        onModuleChanged={({ module, isSelected }) => {
          if (!module) return;
          if (!isSelected) delete selectedModules[module.id + ''];
          else selectedModules[module.id + ''] = module;

          SetOnSelectedModulesChanged(Date.now() + 1);
          console.log('selectedModules, ', JSON.stringify({
            selectedModules,
            isSelected,
            module
          }, null, 2))
        }}
      />
    );
    return (
      <View style={{ display: 'flex' }}>
        {rooms.map((room, index) => {
          return renderItems({ room, index });
        })}
      </View>
    );
  };
  const DaytimeButton = ({ type, title, times, selected }: ScheduleTiming) => {
    const onPress = () => {
      setScheduleTimings(prev =>
        prev.map(item => ({
          ...item,
          selected: title === item.title ? !item.selected : false,
        })),
      );

      setDisplayTime(times);
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 0.3 }}
        activeOpacity={0.8}>
        <View
          style={[
            {
              paddingVertical: 4,
            },
            selected ? styles.buttonTimeOnActive : styles.buttonTimeInActive,
          ]}
          className="flex justify-center items-center px-4 border h-full border-line-light">
          <Text
            weight="bold"
            className="text-center"
            style={[
              selected ? styles.textTimeOnActive : styles.textTimeInActive,
            ]}>
            {mappingTimingLanguage(title)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const ModalTimesSelection = () => {
    const selectedTime = scheduleTimings.find(e => e.selected);
    if (!selectedTime) return;
    if (selectedTime.title === 'Sunrise' || selectedTime.title === 'Sunset') {
      modalActions.setContent(
        <WheelTimePickerModal
          title={selectedTime.title}
          time={selectedTime.times}
          setTime={({ timeOptions }) => {
            console.log(
              ' WheelTimePickerModal => ',
              JSON.stringify(timeOptions, null, 2),
            );
            if (selectedTime.title === 'Sunrise') {
              setDataScheduleTypes({
                sunrise: timeOptions.offset,
                sunset: dataScheduleTypes.sunset,
              });
              setDisplayTimeSunrise(timeOptions.label);
            } else if (selectedTime.title === 'Sunset') {
              setDataScheduleTypes({
                sunrise: dataScheduleTypes.sunrise,
                sunset: timeOptions.offset,
              });
              setDisplayTimeSunset(timeOptions.label);
            }
          }}
        />,
      );
      modalActions.show();
    } else
      modalActions.setContent(
        <TimePickerModal
          time={selectedTime.times}
          setTime={time => {
            const type = selectedTime.type;

            setScheduleTimings(prev =>
              prev.map(e => ({ ...e, times: e.selected ? time : e.times })),
            );

            if (type === ScheduleType['Sunrise']) {
            } else if (type === ScheduleType['Sunset']) {
            } else if (type === ScheduleType['Timing']) {
              //--> pressedDay process
              // after confirming the time
              if (!daySelection) return;
              OnPressedDayActive({ hour: time.hour, minute: time.minute });
            }
            //--> display hour&min on the TextBox
            setDisplayTime(time);

            //--> clear ScheduleType buttons state
            // clearInitialScheduleTiming();
          }}
        />,
      );
    modalActions.show();
  };
  const ScheduleTypeLabel = () => {
    const selectedTime = scheduleTimings.find(e => e.selected);
    const time =
      paddingWith2Zero(displayTime.hour.toString()) +
      ':' +
      paddingWith2Zero(displayTime.minute.toString()).toString();
    if (!selectedTime || selectedTime['type'] === ScheduleType['Timing']) return time;

    const display = selectedTime.type === ScheduleType['Sunrise']
      ? displayTimeSunrise
      : displayTimeSunset;
    let defaultDisplay = null;

    // Display Sunrise/Sunset as label
    // if Hour&Min equal "0"
    if (
      (selectedTime.type === ScheduleType['Sunrise'] && (dataScheduleTypes?.['sunrise'] === 0 || dataScheduleTypes?.['sunrise'] === null)) ||
      (selectedTime.type === ScheduleType['Sunset'] && (dataScheduleTypes?.['sunset'] === 0 || dataScheduleTypes?.['sunset'] === null)))
      defaultDisplay = selectedTime.title

    return defaultDisplay === null
      ? display
      : initialScheduleTiming[selectedTime.type]['title'];
  };

  /** Feature methods */
  const log = (item: any) =>
    console.log(
      'ResidentialSchedulesScreen_AddSchedule, ',
      JSON.stringify(item, null, 2),
    );
  const twoDigit = (i: number) => {
    return i < 10 ? '0' + i : i + '';
  };
  const timetableSunrise = (days, twilightOffset: number | null) => {
    const table: any = [];
    if (!days || twilightOffset === null) return table;

    for (let a = 0; a < days.length; a++) {
      table.push({
        zone_id: initZone.id,
        day: days[a].number,
        twilight_offset: twilightOffset,
      });
    }

    return table;
  };
  const timetableSunset = timetableSunrise;
  const toArray = (objects: any) => {
    if (!objects) return null;

    const keys: string[] = Object.keys(objects);
    const arr: any = [];
    for (let a = 0; a < keys.length; a++) {
      arr.push(objects[keys[a] + '']);
    }

    return arr;
  };
  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const toSceneProps = ({ }) => {
    if (!(scenariosData && Array.isArray(scenariosData))) return;
    const sceneListProps: SceneItemProps[] = [];
    for (let a = 0; a < scenariosData.length; a++) {
      const scene = scenariosData[a];
      sceneListProps.push({
        id: scene.id + '',
        name: scene?.name ?? '-',
        icon: 'scHomeIcon',
        type: scene.type,
        selected: false,
        scenarios: scene,
      } as SceneItemProps);
    }

    setScenariosProps(sceneListProps);
  };
  const OnPressedDayActive = ({
    hour,
    minute,
  }: {
    hour: number;
    minute: number;
  }) => {
    if (!(daySelection && daySelection?.pressedDay?.active)) return;

    const pressedDay = daySelection?.pressedDay;
    if (!pressedDay) return;
    removeIfExist({ fromTimeChanged: true });
    setOnTimeChanged({
      key: pressedDay.key,
      day: pressedDay.display,

      zone_id: 0,
      m_offset: daySelection?.pressedDay.offset + hour * 60 + minute,
    });
  };
  const OnSelectAllDaysPressed = () => {
    setSelectAllDays(!selectAllDays);
  };
  const clearInitialScheduleTiming = () => {
    setScheduleTimings(prev =>
      prev.map(item => ({
        ...item,
        selected: false,
      })),
    );
  };
  const SortTimetable = (timetable: TimeTableProps[]) => {
    for (let a = 0; a < timetable.length; a++) {
      const ta = timetable[a];
      for (let b = a + 1; b < timetable.length; b++) {
        const tb = timetable[b];
        if (ta.m_offset < tb.m_offset) continue;
        const _ta = ta;
        timetable[a] = tb;
        timetable[b] = _ta;
        a--;
        break;
      }
    }

    return timetable;
  };
  const ActionDataFromTimeTable = (timetableList: TimeTableProps[]) => {
    const actionData: ActionData = {
      days: [],
      timeOfDay:
        twoDigit(displayTime.hour) + ':' + twoDigit(displayTime.minute),
      zoneId: initZone.id,
    };

    for (let a = 0; a < timetableList.length; a++) {
      const tt = timetableList[a];
      actionData['days'].push(tt.day as string);
    }

    return actionData;
  };
  const TimetableFromDaySelection = ({ days }: { days: DayTabType[] | null }) => {
    if (!days) return [];

    const timetableList: TimeTableProps[] = [];
    for (let a = 0; a < days.length; a++) {
      const d = days[a];

      timetableList.push({
        key: d.key,
        day: d.display,

        m_offset:
          d.offset + /** TIME */ (displayTime.hour * 60 + displayTime.minute),
        zone_id: initZone.id,
      });
    }

    return timetableList;
  };
  const removeIfExist = ({ fromTimeChanged }: { fromTimeChanged: boolean }) => {
    if (!daySelection) return;

    const pressedDay = daySelection.pressedDay;
    if (!pressedDay) return;
    // when pressedDay is active
    // Removing the item is unncessary
    if (pressedDay.active && !fromTimeChanged) return;
    const pressedDayKey = pressedDay.key;
    const theRest = [];
    for (let a = 0; a < timetableList.length; a++) {
      const tt = timetableList[a];
      if (tt.key === pressedDayKey) continue;
      theRest.push(tt);
    }
    setTimetableList(theRest);
  };
  const getExistSchedule = (home: any) => {
    return home?.schedules ?? null;
  };
  const getExistZones = () => {
    const rs = {
      message: '',
      ready: false,
      maxZoneId: -1,
      existZones: [] as ZoneState[],
    };
    if (!(existSchedule && existSchedule?.zones?.length > 0)) {
      rs['message'] = "Zones isn't ready.";
      return rs;
    }
    for (let a = 0; a < existSchedule.zones.length; a++) {
      const z = existSchedule.zones[a];
      if (rs.maxZoneId < z.id) rs.maxZoneId = z.id;
      rs.existZones.push(z);
    }
    rs.ready = true;
    return rs;
  };
  const getExistDays = (existSchedule: SchedulePayload) => {
    if (!existSchedule || !existSchedule['readable_timetable']) return null;

    const keys = Object.keys(existSchedule['readable_timetable'])
    const daysReadable = existSchedule['readable_timetable']
    for (let a = 0; a < keys.length; a++) {
      const existDayReadable = daysReadable[keys[a] + ""]
      if (!(Array.isArray(existDayReadable) && existDayReadable.length > 0)) continue;
      
    }
  }
  const initialDays = () => {
    const days = DayTabList.filter(day => day.key === selectedDay);
    console.log(
      'selectedDay',
      selectedDay,
      days,
    );
    setInitialSelectedDay(days);
  };

  /** API methods */
  const API_SyncHomeSchedule = async () => {
    return await netatmoService.syncHomeSchedule(schedulePayload);
  };
  const API_GetScenarios = async () => {
    const resp = await netatmoService.getScenario();
    return resp.status === 200 ? resp.data : null;
  };
  const API_GetHomeData = async () => {
    const resp = await netatmoService.getHomeData();
    return resp.status === 200 ? resp.data : null;
  };
  const API_GetScheduleById = async () => {
    const resp = await netatmoService.getHomeSchedule(scheduleId);
    return resp.status === 200 ? resp.data : null;
  };

  /** Life Cycle */
  useEffect(() => {
    (async () => {
      //--> If intent to update the schedule
      const scheduleData = await API_GetScheduleById();
      if (!scheduleData) {
      } else {
        const eSchedule = getExistSchedule(
          scheduleData?.body?.homes?.[0] ?? null,
        );
        setExistSchedule(eSchedule);
        setExistActionName(eSchedule.name);
        schedulePayload.name = eSchedule.name;

        if (intent === Intent.Update) {
          console.log('Updating, ', JSON.stringify(eSchedule, null, 2))

          const days = DayTabList.filter(day => day.key === selectedDay);

          // days.push(DayTabList[0])
          // days.push(DayTabList[3])
          // days.push(DayTabList[6])
          // setInitialSelectedDay(days)
        }
      }

      const homeData = await API_GetHomeData();
      if (!homeData) {
        log('Resident NO HOME!');
      } else setHomeData(homeData?.body?.homes?.[0] ?? null);

      const scenariosData = await API_GetScenarios();
      if (!scenariosData) {
        log('Resident NO SCENARIO!');
      } else setScenariosData(scenariosData?.body?.home?.scenarios ?? null);


      // INIT FROM SELECTED DAY
      // initialDays();
      // ชื่อ วัน ซัีนหรือรูม
      setIsLoading(false);
    })();
  }, []);
  useEffect(() => {
    //--> This happens when user pressed "Select All"
    if (daySelection?.allDaysSelected) return;

    //--> Focus on pressedDay.active === false
    removeIfExist({ fromTimeChanged: false });

    if (!(daySelection && daySelection.pressedDay)) return;
    //--> Default value
    // This step happens when the user just clicks the Days tab
    // Even before clicking the time selection
    const pressedDay = daySelection.pressedDay;
    if (!pressedDay.active) return;
    setTimetableList([
      ...timetableList,
      {
        key: pressedDay.key,
        day: pressedDay.display,

        zone_id: 0,
        m_offset: pressedDay.offset,
      },
    ]);
  }, [daySelection]);
  useEffect(() => {
    console.log(
      'dataScheduleTypes, ',
      JSON.stringify(dataScheduleTypes, null, 2),
    );
  }, [dataScheduleTypes]);
  useEffect(() => {
    if (!schedulePayload.home_id) return;
    if (apiStateLock.lock) return;
    //--> Lock!
    apiStateLock.lock = true;
    (async () => {
      if (intent === Intent.Update) {
        // console.log('Update Existing, ', existSchedule)
        // apply existing timetable 
        schedulePayload['timetable'] = schedulePayload['timetable'].concat(Array.isArray(existSchedule?.timetable) ? existSchedule?.timetable : []) as []
      }

      console.log(
        'SyncHome Payload, ',
        JSON.stringify(schedulePayload, null, 2),
      );

      let resp = null;
      try {
        resp = await API_SyncHomeSchedule();
      } catch (e) {
      } finally {
        if (!resp) {
          //--> clear api state
          apiStateLock.lock = false;
          return;
        }

        if (!(intent === Intent.Add)) modalActions.hide();
        navigation.goBack();
      }
    })();
  }, [pressedValidation]);
  useEffect(() => {
    //--> Prevent from entering an infinite loop
    if (!onTimeChanged) return;
    setTimetableList([...timetableList, onTimeChanged]);
    setOnTimeChanged(null);
  }, [onTimeChanged, timetableList]);
  useEffect(() => toSceneProps({}), [scenariosData]);
  useEffect(() => {
    /** Assign payload value  */
    //--> Home
    schedulePayload.home_id = (homeData?.id as any) ?? null;
    //--> Time Table
    const days =
      daySelection_Confirm?.days.length ?? -1 > 0
        ? daySelection_Confirm?.days
        : daySelection?.days;
    schedulePayload['timetable'] = SortTimetable(
      TimetableFromDaySelection({ days: days }) as [],
    ) as unknown as [];
    //--> Zone
    initZone.scenarios = selectedSenarios.map(item => item.id + '');
    initZone.modules = toArray(selectedModules) as any[];

    schedulePayload['timetable_sunrise'] = timetableSunrise(
      days,
      dataScheduleTypes.sunrise,
    );
    schedulePayload['timetable_sunset'] = timetableSunset(
      days,
      dataScheduleTypes.sunset,
    );

    /** [Intent=Update] with exist-schedules */
    const zonesProps = getExistZones();
    if (zonesProps.ready) initZone['id'] = zonesProps.maxZoneId + 1;

    /** Assign to Payload */
    schedulePayload['zones'] = [initZone].concat(
      zonesProps.existZones,
    ) as ZoneState[];
    schedulePayload['actionData'] = ActionDataFromTimeTable(
      schedulePayload['timetable'],
    );
  }, [daySelection, daySelection_Confirm]);
  /** Control Validate Button State */
  useEffect(() => {
    const validActionName = (existActionName + '').length > 0;
    const validDaySelection =
      Array.isArray(daySelection?.days) && daySelection.days.length > 0;
    //--> Either one
    const validSelectedScenes =
      Array.isArray(selectedSenarios) && selectedSenarios.length > 0;
    const validSelectedModules =
      typeof selectedModules === 'object' &&
      Object.keys(selectedModules).length > 0;
    const validSelectedTimings =
      scheduleTimings.filter(item => item.selected).length > 0;

    // console.log('showButtn, ', JSON.stringify({
    //   valid: {
    //     validActionName,
    //     validDaySelection
    //   },
    //   eitherOne: {
    //     validSelectedScenes,
    //     validSelectedModules
    //   },
    //   selectedModules, existActionName, daySelection
    // }, null, 2))
    setShowValidateBtn(
      validActionName &&
      validDaySelection &&
      (validSelectedScenes || validSelectedModules),
    );
    console.log('scheduleTimings', scheduleTimings);
  }, [
    existActionName,
    daySelection,
    selectedSenarios,
    onSelectedModulesChanged,
    scheduleTimings,
  ]);

  const mappingTimingLanguage = (timing: TimingTitle) => {
    switch (timing) {
      case 'Sunrise':
        return t('Residential__Home_Automation__Sunrise', 'Sunrise');
      case 'Sunset':
        return t('Residential__Home_Automation__Sunset', 'Sunset');
      case 'Timing':
        return t('Residential__Home_Automation__Timing', 'Timing');

      default:
        return timing;
    }
  };
  return (
    <>
      <ScreenContainer
        isLoading={isLoading}
        bgColor="#ffffff"
        barStyle="dark-content">
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Home_Automation__Add_Actions_Schedule',
            'Add Actions Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />

        {/* Loading white-screen */}
        {isLoading ? (
          <View style={{ zIndex: 999 }} className="w-full bg-white" />
        ) : (
          <View />
        )}

        {/* className="w-full bg-white p-4 py-10 " */}
        <ScrollView
          className="w-full bg-white"
          style={[
            { backgroundColor: 'white', paddingBottom: 16, paddingTop: 40 },
            isLoading ? { opacity: 0 } : { opacity: 1 },
          ]}>
          <View className="px-4">
            {/* TOPIC: My actions schedule */}
            <Text className="text-2xl color-black font-obMedium mb-3">
              {t(
                'Residential__Home_Automation__My_Actions_Schedule',
                'My Actions Schedule',
              )}
            </Text>

            {/* Action Name */}
            <TextInput
              className="color-black font-obRegular flex flex-col px-4 py-4 border border-line-light"
              placeholder={t(
                'Residential__Home_Automation__Event_Name',
                'Event name',
              )}
              placeholderTextColor="grey"
              value={existActionName}
              onChangeText={text => {
                schedulePayload.name = text;
                setExistActionName(text);
              }}
            />

            {/* Daytime  */}
            <View
              style={{
                flex: 3,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              className="mt-4">
              {scheduleTimings.map(
                item => item.title !== undefined && DaytimeButton({ ...item }),
              )}
            </View>

            {/* Input Time */}
            <TouchableOpacity onPress={ModalTimesSelection}>
              <Text
                style={{
                  paddingVertical: 38,
                  display: 'flex',
                  textAlign: 'center',
                }}
                className="mt-4 font-obRegular flex flex-col px-4 !border border-[#DCDCDC]">
                {ScheduleTypeLabel()}
              </Text>
            </TouchableOpacity>

            {/* TOPIC: Select one or several days */}
            <View
              style={{ alignContent: 'flex-end' }}
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
                onPress={() => OnSelectAllDaysPressed()}>
                <Text style={{ color: '#014541' }} className="font-obMedium">
                  {t('Residential__Home_Automation__Select_All', 'Select All')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Days Tab Selection */}
            <View className="mt-6">
              {!isLoading && (
                <DaysTabSelection
                  initialValue={initialSelectedDay}
                  multiSelection={true}
                  selectAll={selectAllDays}
                  onDayChanged={(days, pressedDay, allDaysSelected) => {
                    setDaySelection({ days, pressedDay, allDaysSelected });
                  }}
                  moveTo={null} />
              )}
            </View>

            {/* TOPIC: Scenes */}
            <Text className="text-2xl color-black font-obMedium mt-12 mb-2">
              {t('Residential__Home_Automation__Scenes', 'Scenes')}
            </Text>

            {/* Scenes Items */}
            <ScenesHorizontal
              onItemChanged={(scenes: SceneItemProps[]) =>
                setSelectedScenarios(scenes)
              }
              data={scenariosProps}
            />
          </View>
          {/* White Space */}
          <View className="m-6" />

          {/* Rendering rooms */}
          {Rooms()}

          <View style={{ marginBottom: 120 }} />
        </ScrollView>
      </ScreenContainer>

      {/* Validate Button */}

      {showValidateBtn ? (
        <StickyButton
          title={t('Residential__Home_Automation__Validate', 'Validate')}
          rightIcon="next"
          iconHeight={20}
          color="dark-teal"
          onPress={() => {
            if (intent === Intent.Add) {
              setPressedValidation({ lock: false, timestamp: Date.now() });
              return;
            }

            /** Show validation modal */
            modalActions.setContent(
              <OptionActinoScheduleValidateModal
                onModalEvent={(event: ModalEvent) =>
                  setDaySelection_Confirm(null)
                }
                selectedDays={daySelection?.days}
                onValidatePressed={() => {
                  setPressedValidation({ lock: false, timestamp: Date.now() });
                }}
                onDayChanged={(days, pressedDay, allDaysSelected) =>
                  setDaySelection_Confirm({ days, pressedDay, allDaysSelected })
                }
              />,
            );
            modalActions.show();
          }}>
          <Text size="B1" weight="medium" color="default-inverse">
            Validate
          </Text>
          <Icon type={'next'} width={20} height={20} color={'#fff'} />
        </StickyButton>
      ) : (
        <View />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },

  buttonTimeInActive: {
    backgroundColor: 'white',
  },
  buttonTimeOnActive: {
    backgroundColor: '#014541',
  },
  textTimeInActive: {
    color: 'black',
  },
  textTimeOnActive: {
    color: 'white',
  },
});

export default ResidentialSchedulesScreen_AddSchedule;
