import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text, Icon} from '~/components/atoms';
import t from '~/utils/text';
import FacilitiesBar, {
  SDReadableTimetableObject,
} from '../components/FacilitiesBar';
import {Zone} from '~/states/residentialSchedule/residentialScheduleState';

export type ShortDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
// SD stand for ScheduleDetail
export type SDTimetable = {
  zone_id: number;
  m_offset: number;
  m_offset_start: number;
  m_offset_end: number;
};

export type SDReadableTimetable = {
  [key in ShortDay]: SDReadableTimetableObject[];
};
export type CoolingScheduleDetail = {
  timetable: SDTimetable[];
  readable_timetable: SDReadableTimetable;
  zones: Zone[];
  name: string;
  default: boolean;
  away_temp: number;
  hg_temp: number;
  id: string;
  type: string;
  selected: boolean;
};

type Props = {
  scheduleDetail: CoolingScheduleDetail;
  onPress: (selectedDay: ShortDay) => void;
  disabled: boolean;
};

const days: {[key in ShortDay]: string} = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

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

const FacilitiesList = ({scheduleDetail, onPress, disabled}: Props) => {
  const readableTimetableKeys = Object.keys(
    scheduleDetail.readable_timetable,
  ) as ShortDay[];
  const readableTimetable = readableTimetableKeys.map(key => ({
    key,
    fullDay: days[key],
    value: scheduleDetail.readable_timetable[key],
  }));

  return readableTimetable.map(({key, fullDay, value}) => (
    <TouchableOpacity
      key={key}
      className="w-full flex flex-col p-4 border-b border-line-light"
      style={{gap: 12}}
      onPress={() => onPress(key)}
      disabled={disabled}>
      <View className="flex flex-row items-center justify-between">
        <Text size="B2" color="jet-black" weight="medium">
          {mappingLanguageDay(fullDay)}
        </Text>
        <Icon type="right" width={24} height={24} color="#7C7C7C" />
      </View>
      <FacilitiesBar timetables={value} />
    </TouchableOpacity>
  ));
};

export default FacilitiesList;
