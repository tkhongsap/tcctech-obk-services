import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import InputTimeModify from '../components/InputTimeModify';
import React, {useMemo, useState} from 'react';
import {DayPicker} from './DayTimePickerModal';
import t from '~/utils/text';

type Time = {
  day: DayPicker;
  hour: number;
  minute: number;
};
export type TimeSlot = {
  name: string;
  times: Time;
  expanded: boolean;
};

type Props = {
  timeSlotList: TimeSlot[];
  onSetTimeSlotList?: (timeSlot: TimeSlot[]) => void;
  disabled?: boolean;
};

const ModifyTime = ({timeSlotList, onSetTimeSlotList, disabled}: Props) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(timeSlotList);

  useMemo(() => {
    setTimeSlots(timeSlotList);
  }, [timeSlotList]);

  const onPress = (name: string) => {
    setTimeSlots(prev =>
      prev.map(timeSlot => ({
        ...timeSlot,
        expanded: timeSlot.name === name ? !timeSlot.expanded : false,
      })),
    );
  };

  const onConfirm = (name: string, time: Time) => {
    setTimeSlots(prev =>
      prev.map(timeSlot => ({
        ...timeSlot,
        times: timeSlot.name === name ? time : timeSlot.times,
      })),
    );

    // update child component
    onSetTimeSlotList &&
      onSetTimeSlotList(
        timeSlots.map(timeSlot => ({
          ...timeSlot,
          times: timeSlot.name === name ? time : timeSlot.times,
        })),
      );
  };

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');

  const mappingLanguageName = (name: string) => {
    return name === 'Starts'
      ? t('Residential__Home_Automation__Starts', 'Starts')
      : t('Residential__Home_Automation__Ends', 'Ends');
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
    <View className="">
      {timeSlots.map(({name, times, expanded}) => (
        <View
          key={name}
          className="px-4 pt-5 flex flex-col border-b border-line-light">
          <View className="pb-5 flex flex-row items-center justify-between">
            <Text color="jet-black" weight="medium">
              {mappingLanguageName(name)}
            </Text>
            <TouchableOpacity
              className="flex flex-row items-center"
              style={{gap: 12}}
              onPress={() => onPress(name)}
              disabled={disabled}>
              <Text color="subtitle-muted" size="B2" weight="regular">
                {mappingLanguageDay(times.day)}{' '}
                {paddingWith2Zero(times.hour.toString())}:
                {paddingWith2Zero(times.minute.toString())}
              </Text>
              <Icon
                type="arrowRightIcon"
                height={16}
                width={16}
                color="#292929"
              />
            </TouchableOpacity>
          </View>
          {expanded && (
            <View className="pb-3">
              <InputTimeModify
                time={times}
                onConfirm={time => onConfirm(name, time)}
                disabled={disabled}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default ModifyTime;
