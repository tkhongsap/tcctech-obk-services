import {View, TouchableOpacity} from 'react-native';
import {HelperText, Icon, Spacing, Text} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';

type Props = {
  specificDays: DaySelect[];
  setSpecificDays: (days: DaySelect[]) => void;
  disabled?: boolean;
  hasError?: boolean;
};
export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Weekend'
  | 'Weekday';
export type DaySelect = {day: Day; selected: boolean; name: string};
export const defaultDays: DaySelect[] = [
  {
    day: 'Monday',
    name: t('Residential__Monday', 'Monday') as Day,
    selected: false,
  },
  {
    day: 'Tuesday',
    name: t('Residential__Tuesday', 'Tuesday') as Day,
    selected: false,
  },
  {
    day: 'Wednesday',
    name: t('Residential__Wednesday', 'Wednesday') as Day,
    selected: false,
  },
  {
    day: 'Thursday',
    name: t('Residential__Thursday', 'Thursday') as Day,
    selected: false,
  },
  {
    day: 'Friday',
    name: t('Residential__Friday', 'Friday') as Day,
    selected: false,
  },
  {
    day: 'Saturday',
    name: t('Residential__Saturday', 'Saturday') as Day,
    selected: false,
  },
  {
    day: 'Sunday',
    name: t('Residential__Sunday', 'Sunday') as Day,
    selected: false,
  },
  {
    day: 'Weekend',
    name: t('Residential__Weekend', 'Weekend') as Day,
    selected: false,
  },
  {
    day: 'Weekday',
    name: t('Residential__Weekday', 'Weekday') as Day,
    selected: false,
  },
];

const SelectSpecificDay = ({
  specificDays,
  setSpecificDays,
  disabled = false,
  hasError = false,
}: Props) => {
  const [days, setDays] = useState<DaySelect[]>(specificDays);
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  useEffect(() => {
    disabled && setDays([...defaultDays]);
  }, [disabled]);

  useEffect(() => {
    setSpecificDays(days);
  }, [days]);

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
          prev.map(({day, selected, name}) => ({
            day,
            name,
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
      prev.map(({day, name}) => ({
        day,
        name,
        selected: isSelect && isWeekend(day),
      })),
    );
  };

  const selectWeekend = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day, selected, name}) => ({
        day,
        name,
        selected: day === 'Weekend' ? isSelect : selected,
      })),
    );
  };

  const selectWeekdayDays = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day, name}) => ({
        day,
        name,
        selected: isSelect && isWeekday(day),
      })),
    );
  };

  const selectWeekday = (isSelect: boolean) => {
    setDays(prev =>
      prev.map(({day, selected, name}) => ({
        day,
        name,
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

  const mappingLanguage = (day: Day) => {
    switch (day) {
      case 'Monday':
        return t('Residential__Monday', 'Monday');
      case 'Tuesday':
        return t('Residential__Tuesday', 'Tuesday');
      case 'Wednesday':
        return t('Residential__Wednesday', 'Wednesday');
      case 'Thursday':
        return t('Residential__Thursday', 'Thursday');
      case 'Friday':
        return t('Residential__Friday', 'Friday');
      case 'Saturday':
        return t('Residential__Saturday', 'Saturday');
      case 'Sunday':
        return t('Residential__Sunday', 'Sunday');
      case 'Weekend':
        return t('Residential__Weekend', 'Weekend');
      case 'Weekday':
        return t('Residential__Weekday', 'Weekday');
      default:
        break;
    }
  };

  const someDaySelected = days.some(e => e.selected);

  return (
    <View
      className={`flex flex-row flex-wrap space-y-1 px-2 py-3 ${getTheme(
        ` ${disabled ? 'bg-light-gray' : 'bg-white'}`,
      )} `}>
      {days.map(({day, selected}) => (
        <TouchableOpacity
          className={`w-1/3 flex flex-row items-center space-x-1 ${
            hasError ? 'border-fire-engine-red-light' : ''
          }`}
          key={day}
          onPress={() => onPress(day, !selected)}
          disabled={disabled}>
          <Icon
            type={
              selected
                ? 'checkedBox'
                : hasError && !someDaySelected
                ? 'errorCheckBox'
                : 'unCheckedBox'
            }
            width={20}
            height={20}
            color={selected ? '#014541' : '#ffffff00'}
          />
          <Text
            weight="regular"
            size="C1"
            color={disabled ? 'muted-400' : 'dark-gray'}
            className={language === 'th' ? 'w-[75px]' : ''}>
            {mappingLanguage(day)}
          </Text>
        </TouchableOpacity>
      ))}
      {hasError && !someDaySelected && (
        <>
          <Spacing height={2} />
          <HelperText
            text={t(
              'Residential__Please_select_specific_day',
              'Please Select Day',
            )}
            error={hasError && !someDaySelected}
          />
        </>
      )}
    </View>
  );
};

export default SelectSpecificDay;
