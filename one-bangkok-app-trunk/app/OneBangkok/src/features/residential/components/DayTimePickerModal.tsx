import {View, StyleSheet} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useModal} from './ResidentialModal';
import {Text, textWeightVariant} from '~/components/atoms';
import t from '~/utils/text';
import WheelPicker from './WheePicker';
import WheelPickerInFinite from './WheePicker/WheelPickerInFinite';

export type DayPicker =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

type Time = {
  day: DayPicker;
  hour: number;
  minute: number;
};

type Props = {
  time: Time;
  onConfirm?: (time: Time) => void;
};

const DEFAULT_DAY_INDEX = 0;
const DEFAULT_HOUR_INDEX = 0;
const DEFAULT_MINUTE_INDEX = 0;

const paddingWith2Zero = (value: string) => value.padStart(2, '0');

const DayTimePickerModal = ({time, onConfirm}: Props) => {
  const minuteStep = 5;
  const [_, modalAction] = useModal();
  const defaultDays: DayPicker[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const defaultHours: string[] = Array.from({length: 24}, (_, i) =>
    paddingWith2Zero(`${i}`),
  );
  const defaultMinutes: string[] = [...Array(12).keys()].map(i =>
    paddingWith2Zero(`${i * minuteStep}`),
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(DEFAULT_DAY_INDEX);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHourIndex, setSelectedHourIndex] =
    useState(DEFAULT_HOUR_INDEX);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinuteIndex, setSelectedMinuteIndex] =
    useState(DEFAULT_MINUTE_INDEX);
  const [selectedMinute, setSelectedMinute] = useState('');

  const findIndexByValue = (arr: string[], value: string) => {
    const index = arr.findIndex(e => e === value);
    return index !== -1 ? index : 0;
  };
  const findValueByIndex = (arr: string[], index: number) => arr[index];

  useMemo(() => {
    setSelectedDayIndex(
      findIndexByValue(defaultDays, time.day) ?? DEFAULT_DAY_INDEX,
    );
    const hour = paddingWith2Zero(time.hour.toString());
    const minute = paddingWith2Zero(time.minute.toString());
    setSelectedHourIndex(
      findIndexByValue(defaultHours, hour) ?? DEFAULT_HOUR_INDEX,
    );
    setSelectedMinuteIndex(
      findIndexByValue(defaultMinutes, minute) ?? DEFAULT_MINUTE_INDEX,
    );

    setSelectedDay(time.day);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [time]);

  const done = () => {
    const day = findValueByIndex(defaultDays, selectedDayIndex) as DayPicker;
    const hour = findValueByIndex(defaultHours, selectedHourIndex);
    const minute = findValueByIndex(defaultMinutes, selectedMinuteIndex);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onConfirm &&
      onConfirm({
        day,
        hour: parseInt(hour),
        minute: parseInt(minute),
      });
    modalAction.hide();
  };

  const mappingLanguageDay = (key: string) => {
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

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {mappingLanguageDay(selectedDay)} {selectedHour}:{selectedMinute}
        </Text>
        <Text onPress={done} color="primary" weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      <View className="relative w-full box-border flex-1 flex-row justify-center">
        <View className="absolute w-full h-9 border border-[#292929] bg-[#E4E4E4] top-[42%]"></View>
        <WheelPickerInFinite
          selectedIndex={selectedDayIndex}
          options={defaultDays}
          onChange={setSelectedDayIndex}
          selectedIndicatorStyle={style.indicator}
          containerStyle={style.container}
          opacityFunction={index => (index > 2 ? 0 : 1)}
          itemStyle={style.item}
          itemTextStyle={style.itemText}
          currentIndexItemTextStyle={style.currentIndexItemTextStyle}
          itemHeight={43}
        />
        <WheelPickerInFinite
          options={defaultHours}
          selectedIndex={selectedHourIndex}
          onChange={setSelectedHourIndex}
          selectedIndicatorStyle={style.indicator}
          containerStyle={style.container}
          opacityFunction={index => (index > 2 ? 0 : 1)}
          itemStyle={style.item}
          itemTextStyle={style.itemText}
          currentIndexItemTextStyle={style.currentIndexItemTextStyle}
          itemHeight={43}
        />
        <WheelPickerInFinite
          options={defaultMinutes}
          selectedIndex={selectedMinuteIndex}
          onChange={setSelectedMinuteIndex}
          selectedIndicatorStyle={style.indicator}
          containerStyle={style.container}
          opacityFunction={index => (index > 2 ? 0 : 1)}
          itemStyle={style.item}
          itemTextStyle={style.itemText}
          currentIndexItemTextStyle={style.currentIndexItemTextStyle}
          itemHeight={43}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    gap: 5,
  },
  indicator: {
    backgroundColor: '#E4E4E400',
    borderRadius: 1,
    borderColor: '#FFFFFF',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#292929',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  currentIndexItemTextStyle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#162C51',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },

  item: {
    width: '100%',
    height: '100%',
  },
  3: {
    fontSize: 16,
    color: '#162C51',
    fontWeight: '400',
  },
});

export default DayTimePickerModal;
