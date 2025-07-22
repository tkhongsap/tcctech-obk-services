import React, {useCallback, useEffect, useState} from 'react';
import {View, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import WheelPicker from 'react-native-wheely';

import {dayjs, Dayjs, DateTimeFormat} from '~/utils/dayjs';
import {isEmpty, times} from 'lodash';
import clsx from 'clsx';

import t from '~/utils/text';
import {activeOpacity} from '~/constants';

import {IconType, Text} from '~/components/atoms';
import {TextField, TextFieldProps} from './TextField';
import {useModal} from './Modal';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';

export interface DatepickerOptions {
  minDate?: Date;
  maxDate?: Date;
}
export interface DatePickerProps extends DatepickerOptions {
  value?: Dayjs;
  onChange: (date: Dayjs) => void;
  maxDate?: Date;
  defaultYear?: number;
}

const DatePicker = (props: DatePickerProps) => {
  const PAST_YEARS = 100;

  const {onChange, value, maxDate, minDate, defaultYear} = props;
  const [_modalState, modalActions] = useModal();
  const currentMonth = dayjs(undefined).get('month');
  const currentYear = dayjs(undefined).get('year');
  const [days, setDays] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();
  const [selectedMonthName, setSelectedMonthName] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<number>();
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [dateString, setDateString] = useState<string>('');
  const locale = appLanguageActions.getLanguage() || 'en';

  // Set selected date
  useEffect(() => {
    if (value) {
      const minYear = dayjs(minDate).get('year');
      const valueYear = value.get('year');

      setSelectedDay(value.get('date'));
      setSelectedMonth(value.get('month'));
      setSelectedMonthName(getMonthName(value.get('month')));
      if (defaultYear) {
        setSelectedYear(defaultYear);
      } else {
        setSelectedYear(valueYear > minYear ? minYear : valueYear);
      }
    }
  }, [value, minDate, defaultYear]);

  const getMonthName = useCallback(
    (monthIndex: number): string => {
      return dayjs().set('month', monthIndex).locale(locale).format('MMMM');
    },
    [locale],
  );
  const getMonthIndex = useCallback(
    (monthString: string): number => {
      return dayjs.months().indexOf(monthString);
    },
    [locale],
  );

  const getYears = useCallback(() => {
    const maxYear = maxDate ? dayjs(maxDate).year() : currentYear;
    const minYear = minDate ? dayjs(minDate).year() : currentYear - PAST_YEARS;
    const _years: string[] = [];

    for (let year = minYear; year <= maxYear; year++) {
      _years.push(`${year}`);
    }

    return _years;
  }, [currentYear, maxDate, minDate]);

  const getMonths = useCallback(() => {
    dayjs.locale(locale);
    const maxYear = maxDate ? dayjs(maxDate).year() : currentYear;
    const minYear = minDate ? dayjs(minDate).year() : currentYear - PAST_YEARS;
    const maxMonthIndex = maxDate
      ? dayjs(maxDate).month()
      : dayjs().get('month');
    const minMonthIndex = minDate
      ? dayjs(minDate).month()
      : dayjs().get('month');

    if (minYear === maxYear) {
      return times(maxMonthIndex - minMonthIndex + 1, index =>
        dayjs()
          .month(minMonthIndex + index)
          .locale(locale)
          .format('MMMM'),
      );
    }

    if (selectedYear === maxYear) {
      return times(maxMonthIndex + 1, index =>
        dayjs().month(index).locale(locale).format('MMMM'),
      );
    }

    if (selectedYear === minYear) {
      return times(12 - minMonthIndex, index =>
        dayjs()
          .month(minMonthIndex + index)
          .locale(locale)
          .format('MMMM'),
      );
    }

    return times(12, index =>
      dayjs().month(index).locale(locale).format('MMMM'),
    );
  }, [currentYear, selectedYear, locale, maxDate, minDate]);

  const getDays = useCallback(() => {
    const _days: string[] = [];
    const maxYear = maxDate ? dayjs(maxDate).year() : currentYear;
    const maxMonth = maxDate ? dayjs(maxDate).month() : currentMonth;
    const minYear = minDate ? dayjs(minDate).year() : currentYear;
    const minMonth = minDate ? dayjs(minDate).month() : currentMonth;

    if (selectedMonth === maxMonth && selectedYear === maxYear) {
      const daysInMonth = maxDate
        ? dayjs(maxDate).get('date')
        : dayjs().get('date');
      for (let i = 0; i < daysInMonth; i++) {
        _days.push(i + 1 + '');
      }
      return _days;
    }

    if (selectedMonth === minMonth && selectedYear === minYear) {
      const firstDay = minDate
        ? dayjs(minDate).get('date')
        : dayjs().get('date');
      const daysInMonth = dayjs(
        `${selectedYear}-${selectedMonth + 1}-01`,
      ).daysInMonth();
      for (let day = firstDay; day <= daysInMonth; day++) {
        _days.push(`${day}`);
      }
      return _days;
    }

    const daysInMonth = dayjs(
      `${selectedYear}-${selectedMonth! + 1}-01`,
    ).daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
      _days.push(i + 1 + '');
    }
    return _days;
  }, [
    selectedYear,
    selectedMonth,
    currentMonth,
    currentYear,
    maxDate,
    minDate,
  ]);

  // Update date string
  useEffect(() => {
    // if (selectedDay && selectedMonth && selectedYear) {
    const date = dayjs()
      .set('year', selectedYear ?? 0)
      .set('month', selectedMonth ? selectedMonth : 0)
      .set('date', selectedDay ?? 0);
    const _dateString = date.locale(locale).format(DateTimeFormat.default);
    setDateString(_dateString);
    // }
  }, [selectedDay, selectedMonth, selectedYear, locale]);

  // Get days, months, years
  useEffect(() => {
    (async () => {
      setYears(getYears());
      await setForceRerender(true);
      setMonths(await getMonths());
      setDays(await getDays());
      await setForceRerender(false);
    })();
  }, [getYears, getMonths, getDays]);

  // Check if all data is ready
  useEffect(() => {
    if (!isEmpty(days) && !isEmpty(years) && !isEmpty(months)) {
      setIsReady(true);
    }
  }, [days, months, years]);

  // Check if month out of range
  useEffect(() => {
    if (selectedMonth && months.length > 0) {
      const monthName = getMonthName(selectedMonth);
      const monthIndex = months.indexOf(monthName);

      if (monthIndex < 0) {
        const newMonthIndex = dayjs.localeData().months().indexOf(months[0]);
        setSelectedMonth(newMonthIndex);
      }
    }
  }, [selectedMonth, selectedYear, months, getMonthName]);

  // Check if day is out of range
  useEffect(() => {
    if (selectedDay && days.length > 0) {
      const dayIndex = days.indexOf(`${selectedDay}`);
      if (dayIndex === -1) {
        setSelectedDay(parseInt(days[0], 10));
      }
    }
  }, [selectedDay, selectedMonth, days]);

  const onPressCancel = () => {
    if (value) {
      setSelectedDay(value.get('date'));
      setSelectedMonth(value.get('month'));
      setSelectedYear(value.get('year'));
    }
    modalActions.hide();
  };

  const onPressDone = () => {
    const date = dayjs(`${selectedYear}-${selectedMonth! + 1}-${selectedDay}`);
    onChange(date);
    modalActions.hide();
  };

  // TODO: this lib doesn't support className, use get theme to get colors
  const style = {
    container: {width: '40%'},
    container2: {width: '30%'},
    indicator: {
      backgroundColor: '#EFEFEF',
      borderRadius: 0,
    },
    itemText: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: '#292929',
      fontFamily: 'OneBangkok-Regular',
    },
    item: {},
  };

  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="date-picker-cancel-id"
          color="primary"
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {dateString}
        </Text>
        <Text
          testID="date-picker-done-id"
          color="primary"
          weight="medium"
          className="text-right"
          onPress={onPressDone}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      {isReady && (
        <View className="flex-row">
          {!forceRerender && (
            <WheelPicker
              selectedIndex={(() => {
                if (!selectedDay) {
                  return 0;
                }
                const dayIndex = days.indexOf(`${selectedDay}`);
                return dayIndex < 0 ? 0 : dayIndex;
              })()}
              options={days}
              onChange={index => {
                return setSelectedDay(parseInt(days[index], 10));
              }}
              selectedIndicatorStyle={style.indicator}
              containerStyle={style.container2 as ViewStyle}
              opacityFunction={index => (index > 2 ? 0 : 1)}
              itemStyle={style.item}
              itemTextStyle={style.itemText}
              itemHeight={32}
            />
          )}
          {!forceRerender && (
            <WheelPicker
              // selectedIndex={selectedMonth ? selectedMonth - 1 : 0}
              selectedIndex={(() => {
                const index = months.indexOf(selectedMonthName!);
                return index < 0 ? 0 : index;
              })()}
              options={months}
              onChange={index => {
                setSelectedMonthName(months[index]);
                setSelectedMonth(getMonthIndex(months[index]));
              }}
              selectedIndicatorStyle={style.indicator}
              containerStyle={style.container as ViewStyle}
              opacityFunction={index => (index > 2 ? 0 : 1)}
              itemStyle={style.item}
              itemTextStyle={style.itemText}
              itemHeight={32}
            />
          )}
          <WheelPicker
            selectedIndex={years.indexOf(selectedYear + '')}
            options={years}
            onChange={index => {
              return setSelectedYear(parseInt(years[index], 10));
            }}
            selectedIndicatorStyle={style.indicator}
            containerStyle={style.container2 as ViewStyle}
            opacityFunction={index => (index > 2 ? 0 : 1)}
            itemStyle={style.item}
            itemTextStyle={style.itemText}
            itemHeight={32}
          />
        </View>
      )}
    </>
  );
};

export interface DatePickerFieldProps
  extends DatepickerOptions,
    Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: Dayjs | null;
  onChange?: (date: Dayjs, dateString: string) => void;
  onPress?: () => void;
  icon?: IconType;
  maxDate?: Date;
  disabled?: boolean;
  Iconcolor?: string;
  defaultYear?: number;
}

export const DatePickerField = (props: DatePickerFieldProps) => {
  const {
    placeholder,
    className: _className,
    value,
    onChange,
    onPress,
    icon,
    maxDate,
    minDate,
    disabled,
    Iconcolor,
    defaultYear,
    ...restProps
  } = props;
  const [_modalState, modalActions] = useModal();

  const [date, setDate] = useState<Dayjs>(dayjs());
  const [dateString, setDateString] = useState<string>('');
  const locale = appLanguageActions.getLanguage() || 'en';

  useEffect(() => {
    if (minDate) {
      setDate(dayjs(minDate));
    }
    if (value) {
      setDate(value);
      const _dateString = dayjs(value)
        .locale(locale)
        .format(DateTimeFormat.default);
      setDateString(_dateString);
    }
  }, [value, locale, minDate]);

  useEffect(() => {
    if (!disabled) {
      return;
    }
    setDateString('');
  }, [disabled]);

  const handleOnChange = (_date: Dayjs) => {
    setDate(_date);
    const _dateString = dayjs(_date)
      .locale(locale)
      .format(DateTimeFormat.default);
    setDateString(_dateString);

    onChange && onChange(_date, _dateString);
  };

  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
    modalActions.setContent(
      <DatePicker
        value={date}
        onChange={handleOnChange}
        maxDate={maxDate}
        minDate={minDate}
        defaultYear={defaultYear}
      />,
    );
    modalActions.show();
  };

  const className = clsx(_className, 'text-center');

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      activeOpacity={activeOpacity}
      disabled={disabled}>
      <View pointerEvents="none">
        <TextField
          rightIcon={icon}
          IconColor={Iconcolor}
          pointerEvents="none"
          placeholder={placeholder}
          className={className}
          value={dateString}
          {...restProps}
        />
      </View>
    </TouchableOpacity>
  );
};

DatePickerField.defaultProps = {
  placeholder: 'DD / MM / YYYY',
};
