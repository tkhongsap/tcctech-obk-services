import {hookstate, useHookstate} from '@hookstate/core';
import {ShortDay} from '~/features/residential/components/FacilitiesList';

export type Timetable = {
  zone_id: number;
  day: number;
  twilight_offset: number;
};

export type TimetableSunsetSunrise = {
  zone_id: number;
  day: number;
  twilight_offset: number;
};

export type ModuleBNLD = {
  id: string;
  type: 'BNLD';
  name: string;
  setup_date: number;
  room_id: string;
  room_name?: string;
  bridge: string;
  on: boolean;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
  brightness: number;
};

export type ModuleBNTH = {
  id: string;
  type: 'BNTH';
  name: string;
  setup_date: number;
  room_id: string;
  room_name?: string;
  bridge: string;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
  cooler_status: boolean;
  fan_speed: number;
  fan_mode: string;
  humidity: number;
};

export type ModuleBNIL = {
  id: string;
  type: 'BNIL';
  name: string;
  setup_date: number;
  room_id: string;
  room_name?: string;
  bridge: string;
  on: boolean;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
};

export type ModuleBNAS = {
  id: string;
  type: 'BNAS';
  name: string;
  setup_date: number;
  room_id: string;
  room_name?: string;
  bridge: string;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
  current_position: number;
  target_position: number;
};

export type Module = ModuleBNLD | ModuleBNIL | ModuleBNTH | ModuleBNAS;

export type Room = {
  id: string;
  name: string;
  type: string;
  module_ids: string[];
  module: Module[];
  therm_measured_temperature: number;
  cooling_setpoint_temperature: number;
  cooling_setpoint_end_time: number;
  cooling_setpoint_mode: string;
};

export type TimeSlot = {
  schedule_id: string;
  operation: string;
  home_id: string;
  temperature_control_mode: string;
  therm_mode: string;
  therm_setpoint_default_duration: number;
  cooling_away_temp: number;
  cooling_mode: string;
  schedule_type: string;
  actionType: string;
  actionData: {
    zoneId: number;
    mOffset: number;
    dateTimeStart: string;
    dateTimeEnd: string;
  };
  timetable: [];
  zones: any;
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  type: string;
};

type ZoneRoomTemp = {
  room_id: string;
  temp: number;
};
export type Zone = {
  name: string;
  id: number;
  type: number;
  room_temp: ZoneRoomTemp[];
  rooms: Room[];
  modules: Module[];
  scenarios: string[];
};

export type CoolingSchedule = {
  timetable: Timetable[];
  zones: Zone[];
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  id: string;
  type: 'cooling';
  selected: boolean;
};

export type EventSchedule = {
  timetable: Timetable[];
  zones: Zone[];
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  id: string;
  type: 'event';
  timetable_sunrise: TimetableSunsetSunrise[];
  timetable_sunset: TimetableSunsetSunrise[];
  selected: boolean;
};

export type Schedule = CoolingSchedule | EventSchedule;

export type Home = {
  id: string;
  name: string;
  altitude: number;
  coordinates: number[];
  country: string;
  timezone: string;
  rooms: Room[];
  temperature_control_mode: string;
  therm_mode: string;
  therm_setpoint_default_duration: number;
  cooling_mode: string;
  schedules: Schedule[];
};

export type ScheduleSelected = {
  timetable: any;
  zones: any;
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  id: string;
  type: string;
  timetable_sunrise: any;
  timetable_sunset: any;
  selected: any;
};

export type CreateZoneTimetable = {
  name: string;
  rooms: Room[];
};

export type TimeSlotActionData = {
  zoneId: number;
  mOffset: number;
  dateTimeStart: string;
  dateTimeEnd: string;
};

export type Scenario = {
  type: string;
  id: string;
  category: string;
  customizable: boolean;
  editable: boolean;
  deletable: boolean;
  name: string | null;
};

const DefaultTimeSlotActionData: TimeSlotActionData = {
  zoneId: 2,
  mOffset: 60,
  dateTimeStart: 'Monday 01:00',
  dateTimeEnd: 'Monday 02:00',
};

const initialCreateZone: CreateZoneTimetable = {
  name: '',
  rooms: [],
};

const initialScheduleHomeState: Home = {
  id: '',
  name: '',
  altitude: 0,
  coordinates: [],
  country: '',
  timezone: '',
  rooms: [],
  temperature_control_mode: '',
  therm_mode: '',
  therm_setpoint_default_duration: 0,
  cooling_mode: '',
  schedules: [],
};

const initialTimeSlotState: TimeSlot = {
  schedule_id: '',
  operation: '',
  home_id: '',
  temperature_control_mode: '',
  therm_mode: '',
  therm_setpoint_default_duration: 180,
  cooling_away_temp: 30,
  cooling_mode: '',
  schedule_type: '',
  actionType: '',
  actionData: {
    zoneId: 0,
    mOffset: 0,
    dateTimeStart: '',
    dateTimeEnd: '',
  },
  timetable: [],
  zones: [],
  name: '',
  default: false,
  away_temp: 0,
  hg_temp: 0,
  type: '',
};

const initialScheduleSelectedState: ScheduleSelected = {
  timetable: null,
  zones: null,
  name: '',
  default: false,
  away_temp: 0,
  hg_temp: 0,
  id: '',
  type: '',
  timetable_sunrise: null,
  timetable_sunset: null,
  selected: null,
};

const initialScheduleState: Schedule = {
  timetable: [],
  zones: [],
  name: '',
  default: false,
  away_temp: 0,
  hg_temp: 0,
  id: '',
  type: 'event',
  timetable_sunrise: [],
  timetable_sunset: [],
  selected: false,
};

const residentialScheduleState = hookstate<Schedule>(initialScheduleState);
const residentialScheduleSelectedState = hookstate<ScheduleSelected>(
  initialScheduleSelectedState,
);
export const residentialHomeState = hookstate<Home>(initialScheduleHomeState);
const residentialTimeSlotState = hookstate<TimeSlot>(initialTimeSlotState);
const residentialCreateZone = hookstate<CreateZoneTimetable>(initialCreateZone);
const residentialActionDataTimeSlot = hookstate<TimeSlotActionData>(
  DefaultTimeSlotActionData,
);

export const useResidentialScheduleState = () =>
  useHookstate(residentialScheduleState);
export const useResidentialScheduleSelectedState = () =>
  useHookstate(residentialScheduleSelectedState);
export const useResidentialHomeState = () => useHookstate(residentialHomeState);
export const useResidentialTimeSlotState = () =>
  useHookstate(residentialTimeSlotState);
export const useCreateZoneState = () => useHookstate(residentialCreateZone);
export const useActionDataTimeslot = () =>
  useHookstate(residentialActionDataTimeSlot);
export const homeAutomationBrideId = hookstate<string | null>(null);
export const actionScheduleSelectedId = hookstate<string | null>(null);
export const actionScheduleSelectedDay = hookstate<ShortDay | null>(null);
export const coolingScheduleSelectedId = hookstate<string | null>(null);
export default residentialScheduleState;
