import {View, StyleSheet} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import WheelPickerInFinite from './WheePicker/WheelPickerInFinite';

type Time = {
  hour: number;
  minute: number;
};
type Props = {
  time: Time;
  setTime?: (time: Time) => void;
  minuteStep?: number;
  defaultHours?: string[];
  defaultMinutes?: string[];
};
const DEFAULT_HOUR_INDEX = 0;
const DEFAULT_MINUTE_INDEX = 0;

const TimePickerModal = ({
  time,
  setTime,
  minuteStep = 5,
  defaultHours,
  defaultMinutes,
}: Props) => {
  const [_, modalAction] = useModal();
  const paddingWith2Zero = (value: string) => value.padStart(2, '0');
  if (!defaultHours) {
    defaultHours = Array.from({length: 24}, (_, i) => paddingWith2Zero(`${i}`));
  }
  if (!defaultMinutes) {
    defaultMinutes = [...Array(12).keys()].map(i =>
      paddingWith2Zero(`${i * minuteStep}`),
    );
  }

  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState('');

  const findIndexByValue = (arr: string[], value: string) => {
    const index = arr.findIndex(e => e === value);
    return index !== -1 ? index : 0;
  };

  const findValueByIndex = (arr: string[], index: number) => arr[index];

  useMemo(() => {
    const hour = paddingWith2Zero(time.hour.toString());
    const minute = paddingWith2Zero(time.minute.toString());
    setSelectedHourIndex(
      findIndexByValue(defaultHours, hour) ?? DEFAULT_HOUR_INDEX,
    );
    setSelectedMinuteIndex(
      findIndexByValue(defaultMinutes, minute) ?? DEFAULT_MINUTE_INDEX,
    );
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [time]);

  const done = () => {
    const hour = findValueByIndex(defaultHours, selectedHourIndex);
    const minute = findValueByIndex(defaultMinutes, selectedMinuteIndex);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setTime &&
      setTime({
        hour: parseInt(hour),
        minute: parseInt(minute),
      });
    modalAction.hide();
  };

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {selectedHour} : {selectedMinute}
        </Text>
        <Text onPress={done} color="primary" weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>

      <View className="relative w-full box-border flex-1 flex-row justify-center">
        <View className="absolute w-full h-9 border border-[#292929] bg-[#E4E4E4] top-[42%]"></View>
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

export default TimePickerModal;
