import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import getTheme from '~/utils/themes/themeUtils';

type Props = {
  disabled?: boolean;
};
type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Weekend'
  | 'Weekday';
export type DaySelect = {day: Day; selected: boolean};
const defaultDays: DaySelect[] = [
  {day: 'Monday', selected: false},
  {day: 'Tuesday', selected: false},
  {day: 'Wednesday', selected: false},
  {day: 'Thursday', selected: false},
  {day: 'Friday', selected: false},
  {day: 'Saturday', selected: false},
  {day: 'Sunday', selected: false},
  {day: 'Weekend', selected: false},
  {day: 'Weekday', selected: false},
];

const SelectSpecificDay = ({disabled = false} : Props) => {
  const [days, setDays] = useState<DaySelect[]>([]);

  useEffect(() => {
    setDays([...defaultDays]);
  }, [disabled]);

  const onPress = (selectDay: Day, isSelected: boolean) => {
    switch (selectDay) {
      case 'Weekend':
        selectWeekendDays(isSelected);
        break;
      case 'Weekday':
        selectWeekdayDays(isSelected);
        break;
      default:
        setDays(prev =>
          prev.map(({day, selected}) => ({
            day,
            selected: day === selectDay ? !selected : selected,
          })),
        );

        if (selectDay === 'Saturday' || selectDay === 'Sunday') {
          handleWeekend(selectDay, isSelected);
        } else {
          handleWeekday(selectDay, isSelected);
        }
        break;
    }
  };

  const selectWeekendDays = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day}) => ({
        day,
        selected: isSelect && isWeekend(day),
      })),
    );
  };

  const selectWeekend = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day, selected}) => ({
        day,
        selected: day === 'Weekend' ? isSelect : selected,
      })),
    );
  };

  const selectWeekdayDays = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day}) => ({
        day,
        selected: isSelect && isWeekday(day),
      })),
    );
  };

  const selectWeekday = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day, selected}) => ({
        day,
        selected: day === 'Weekday' ? isSelect : selected,
      })),
    );
  };

  const handleWeekend = (selectDay: Day, isSelected: boolean) => {
    if (!isSelected && isSelectedWeekend()) {
      selectWeekend(false); // unchecked 'Weekend'
    }
    if (isSelected) {
      selectWeekday(false); // unchecked 'Weekday'

      // Checked 'Weekend' if all selected days fall on the weekend and none are weekdays.
      if (
        isSelectedWeekendDays(
          days.map(e => ({
            ...e,
            selected: e.day === selectDay ? isSelected : e.selected,
          })),
        ) &&
        !isSelectedSomeWeekdayDays()
      ) {
        selectWeekendDays(true);
      }
    }
  };
  const handleWeekday = (selectDay: Day, isSelected: boolean) => {
    if (!isSelected && isSelectedWeekday()) {
      selectWeekday(false); // unchecked 'Weekday'
    }
    if (isSelected) {
      selectWeekend(false); // unchecked 'Weekend'

      // Checked 'Weekday' if all selected days fall on the weekday and none are weekends.
      if (
        isSelectedWeekdayDays(
          days.map(e => ({
            ...e,
            selected: e.day === selectDay ? isSelected : e.selected,
          })),
        ) &&
        !isSelectedSomeWeekendDays()
      ) {
        selectWeekdayDays(true);
      }
    }
  };

  const isSelectedWeekend = () => {
    return days.findIndex(e => e.day === 'Weekend' && e.selected) !== -1;
  };

  const isSelectedWeekday = () => {
    return days.findIndex(e => e.day === 'Weekday' && e.selected) !== -1;
  };

  const isSelectedWeekendDays = (days: DaySelect[]) => {
    const weekends = days.filter(e => isWeekendDays(e.day));
    return !weekends.some(e => !e.selected);
  };

  const isSelectedSomeWeekendDays = () => {
    const weekends = days.filter(e => isWeekendDays(e.day));
    return weekends.some(e => e.selected);
  };

  const isSelectedWeekdayDays = (days: DaySelect[]) => {
    const weekdays = days.filter(e => isWeekdayDays(e.day));
    return !weekdays.some(e => !e.selected);
  };

  const isSelectedSomeWeekdayDays = () => {
    const weekdays = days.filter(e => isWeekdayDays(e.day));
    return weekdays.some(e => e.selected);
  };

  const isWeekend = (day: Day) => {
    return day === 'Weekend' || day === 'Saturday' || day === 'Sunday';
  };

  const isWeekendDays = (day: Day) => {
    return day === 'Saturday' || day === 'Sunday';
  };

  const isWeekday = (day: Day) => {
    return day !== 'Weekend' && day !== 'Saturday' && day !== 'Sunday';
  };

  const isWeekdayDays = (day: Day) => {
    return (
      day !== 'Saturday' &&
      day !== 'Sunday' &&
      day !== 'Weekday' &&
      day !== 'Weekend'
    );
  };

  return (

    <View className={`flex flex-row flex-wrap space-y-1 px-2 py-3 ${getTheme(
              ` ${
                disabled
                  ? 'bg-light-gray'
                  : 'bg-white'
              }`,
            )} `}>
      {days.map(({day, selected}) => (
        <TouchableOpacity
          className="w-1/3 flex flex-row items-center space-x-1"
          key={day}
          onPress={() => onPress(day, !selected)}
          disabled={disabled}>
          <Icon
            type={selected ? 'checkedBox' : 'unCheckedBox'}
            width={20}
            height={20}
            color={selected ? '#014541' : '#ffffff00'}
          />
          <Text weight="regular" size="C1" 
          color={disabled ? 'muted-400' : 'dark-gray'}>
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectSpecificDay;
