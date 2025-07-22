import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import WheelPicker from 'react-native-wheely';

import {dayjs, Dayjs} from '~/utils/dayjs';
import clsx from 'clsx';

import t from '~/utils/text';
import {activeOpacity} from '~/constants';

import {IconType, Text, textColorVariant} from '~/components/atoms';
import {TextField, TextFieldProps} from '../TextField';
import {useModal} from '../Modal';
import {HOUR, MINUTE} from './constants';
import {useFocusEffect} from '@react-navigation/native';
import WheelPickerInFinite from '~/features/residential/components/WheePicker/WheelPickerInFinite';

export enum DatePickerThemeEnum {
  primary = 'primary',
  forest = 'forest',
}

const IndicatorColor: {[key in DatePickerThemeEnum]: string} = {
  [DatePickerThemeEnum.primary]: '#EFEFEF',
  [DatePickerThemeEnum.forest]: '#F1F8F5',
};

const FontColor: {[key in DatePickerThemeEnum]: keyof typeof textColorVariant} =
  {
    [DatePickerThemeEnum.primary]: 'primary',
    [DatePickerThemeEnum.forest]: 'puerto-rico-700',
  };

export type DatePickerTheme = keyof typeof DatePickerThemeEnum;
interface DatePickerProps {
  value?: Dayjs | null;
  labelText?: string;
  onChange: (date: string) => void;
  minTime?: Dayjs | null;
  maxTime?: Dayjs | null;
  fixMinute?: string;
  fixMinutes?: string[];
  themeColor?: DatePickerTheme;
}

const TimePicker = (props: DatePickerProps) => {
  const {
    onChange,
    value,
    minTime,
    maxTime,
    labelText,
    fixMinute,
    fixMinutes,
    themeColor = DatePickerThemeEnum.primary,
  } = props;
  const [_modalState, modalActions] = useModal();
  const [hourList, setHourList] = useState<string[]>([...HOUR]);
  const [minuteList, setMinuteList] = useState<string[]>([...MINUTE]);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [forceRerender, setForceRerender] = useState<boolean>(true);

  const getMinute = useCallback(async () => {
    let _minHour, _minMinute, _maxHour, _maxMinute;

    if (fixMinute) {
      return [fixMinute];
    }

    if (fixMinutes) {
      return fixMinutes;
    }

    if (minTime) {
      const _minTime = dayjs(minTime).format('HH:m').split(':');
      _minHour = _minTime[0];
      _minMinute = Number(_minTime[1]);
      if (hourList[selectedHour] === _minHour) {
        return MINUTE.slice(
          _minMinute ?? 0,
          _maxMinute ?? minuteList.length + 1,
        );
      } else {
        if (MINUTE.length !== minuteList.length) {
          return [...MINUTE];
        }
      }
    }
    if (maxTime) {
      const _maxTime = dayjs(maxTime).format('HH:m').split(':');
      _maxHour = _maxTime[0];
      _maxMinute = Number(_maxTime[1]);
      if (hourList[selectedHour] === _maxHour) {
        if (_maxMinute === 0) {
          return ['00'];
        }
        return MINUTE.slice(0, _maxMinute);
      } else {
        if (MINUTE.length !== minuteList.length) {
          return [...MINUTE];
        }
      }
    }
    return [];
  }, [hourList, maxTime, minTime, minuteList.length, selectedHour]);

  useEffect(() => {
    (async () => {
      const _minute = await getMinute();
      if (_minute.length > 0) {
        const currentMinute = minuteList[selectedMinute];
        const _newIndex = _minute.findIndex(_value => _value === currentMinute);
        await setForceRerender(true);
        await setMinuteList(_minute);
        await setSelectedMinute(_newIndex < 0 ? 0 : _newIndex);
        await setForceRerender(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHour]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let _minHour,
          _minMinute,
          _valueTimeStr: string[] = [];

        var _cloneMinute = minuteList,
          _cloneHour = hourList;

        if (value) {
          _valueTimeStr = dayjs(`${dayjs().date()} ${value}`)
            .format('HH:mm')
            .split(':');
        }

        await setForceRerender(true);
        if (minTime) {
          const _minTime = dayjs(minTime).format('H:m').split(':');
          _minHour = Number(_minTime[0]);
          _minMinute = Number(_minTime[1]);
          if (_minHour) {
            const clone = hourList.slice(_minHour ?? 0, hourList.length + 1);
            await setHourList(clone);
            _cloneHour = clone;
          }

          if (
            _minMinute &&
            _valueTimeStr &&
            Number(_valueTimeStr[0]) === _minHour
          ) {
            const clone = minuteList.slice(
              _minMinute ?? 0,
              minuteList.length + 1,
            );
            await setMinuteList(clone);
            _cloneMinute = clone;
          }
        }

        if (maxTime) {
          const _maxTime = dayjs(maxTime).format('H:m').split(':');
          let _maxHour = Number(_maxTime[0]);
          let _maxMinute = Number(_maxTime[1]);
          if (_maxHour !== 0) {
            const clone = hourList.slice(0, _maxHour + 1);
            await setHourList(clone);
            _cloneHour = clone;
          } else {
            await setHourList(['00']);
            _cloneHour = ['00'];
          }
          if (
            _maxMinute &&
            _valueTimeStr &&
            Number(_valueTimeStr[0]) === _maxHour
          ) {
            const clone = minuteList.slice(_minMinute ?? 0, _maxMinute);
            await setMinuteList(clone);
            _cloneMinute = clone;
          }
        }

        if (fixMinute) {
          await setMinuteList([fixMinute]);
        }

        if (fixMinutes) {
          await setMinuteList(fixMinutes);
        }

        // default value
        if (_valueTimeStr) {
          // find from list that might have custom min/max lenght of hour and minute
          const _hour = _cloneHour.findIndex(
            _value => _value === _valueTimeStr[0],
          );
          const _minute = _cloneMinute.findIndex(
            _value => _value === _valueTimeStr[1],
          );

          if (_hour >= 0 && _minute >= 0) {
            await setSelectedMinute(_minute);
            await setSelectedHour(_hour);
          }
        }
        await setForceRerender(false);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onPressDone = () => {
    const submittedTimeStr = `${hourList[selectedHour]}:${minuteList[selectedMinute]}`;
    onChange(submittedTimeStr);
    modalActions.hide();
  };
  const onPressCancel = () => {
    modalActions.hide();
  };

  // TODO: this lib doesn't support className, use get theme to get colors
  const style = StyleSheet.create({
    container: {width: '50%', alignItems: 'flex-start'},
    container2: {width: '50%', alignItems: 'flex-end'},
    indicator: {
      backgroundColor: IndicatorColor[themeColor],
      borderRadius: 0,
    },
    itemText: {
      fontSize: 16,
      paddingHorizontal: 40,
      fontWeight: '400',
      color: '#292929',
    },
    item: {},
  });
  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="time-picker-cancel-id"
          color={FontColor[themeColor]}
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {labelText}
        </Text>
        <Text
          testID="time-picker-done-id"
          color={FontColor[themeColor]}
          weight="medium"
          className="text-right"
          onPress={onPressDone}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      {
        <View className="flex-row justify-center">
          {!forceRerender && (
            <WheelPickerInFinite
              selectedIndex={selectedHour >= 0 ? selectedHour : 0}
              options={hourList}
              onChange={index => {
                setSelectedHour(index);
              }}
              selectedIndicatorStyle={style.indicator}
              containerStyle={style.container2}
              opacityFunction={index => (index > 2 ? 0 : 1)}
              itemStyle={style.item}
              itemTextStyle={style.itemText}
              itemHeight={32}
            />
          )}
          {!forceRerender && (
            <WheelPickerInFinite
              selectedIndex={selectedMinute >= 0 ? selectedMinute : 0}
              options={minuteList}
              onChange={index => {
                setSelectedMinute(index);
              }}
              selectedIndicatorStyle={style.indicator}
              containerStyle={style.container}
              opacityFunction={index => (index > 2 ? 0 : 1)}
              itemStyle={style.item}
              itemTextStyle={style.itemText}
              itemHeight={32}
            />
          )}
        </View>
      }
    </>
  );
};

export interface TimePickerFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: Dayjs;
  onChange?: (timeString: string) => void;
  onPress?: () => void;
  icon?: IconType;
  minTime?: Dayjs | null;
  maxTime?: Dayjs | null;
  themeColor?: DatePickerTheme;
  disabled?: boolean;
  fixMinute?: string;
  fixMinutes?: string[];
}

export const TimePickerField = (props: TimePickerFieldProps) => {
  const {
    placeholder,
    className: _className,
    value,
    onChange,
    onPress,
    minTime,
    maxTime,
    labelText,
    icon,
    themeColor = DatePickerThemeEnum.primary,
    disabled,
    fixMinute,
    fixMinutes,
    ...restProps
  } = props;
  const [_modalState, modalActions] = useModal();

  const [timeString, setTimeString] = useState('  :   ');

  useEffect(() => {
    if (value !== undefined) {
      const _time = dayjs().format('HH:mm').toString();
      _time && setTimeString(value + '');
    }
  }, [value]);

  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
    const handleOnChange = (_value: string) => {
      setTimeString(_value);
      onChange && onChange(_value);
    };
    modalActions.setContent(
      <TimePicker
        labelText={labelText}
        minTime={minTime}
        maxTime={maxTime}
        value={value}
        onChange={handleOnChange}
        themeColor={themeColor}
        fixMinute={fixMinute}
        fixMinutes={fixMinutes}
      />,
    );
    modalActions.show();
  };

  const className = clsx(_className, 'text-center');

  const checkPlaceholder = () => {
    if (placeholder && timeString === '  :   ') {
      return undefined;
    }
    return timeString;
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      activeOpacity={activeOpacity}
      disabled={disabled}>
      <View pointerEvents="none">
        <TextField
          labelText={labelText}
          rightIcon={icon}
          pointerEvents="none"
          placeholder={placeholder}
          className={className}
          value={checkPlaceholder()}
          {...restProps}
        />
      </View>
    </TouchableOpacity>
  );
};
