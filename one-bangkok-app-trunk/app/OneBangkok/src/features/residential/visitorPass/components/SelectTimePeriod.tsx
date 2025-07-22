import React, {useEffect, useRef, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
import {View, Pressable, StyleSheet} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import TimePickerModal from './TimePickerModal';
import DateTime from '~/utils/datetime';

type Props = {
  disabled?: boolean;
  selectedDate: Date;
  specificStart: string;
  setSpecificStart: (value: string) => void;
  specificEnd: string;
  setSpecificEnd: (value: string) => void;
  specificTimeError?: string | null;
  clearTimeError?: () => void
  isEdit: boolean;
  isChangeDate: boolean;
};

const SelectTimePeriod = (prop: Props) => {
  const {
    disabled = false,
    selectedDate,
    specificStart,
    setSpecificStart,
    specificEnd,
    setSpecificEnd,
    specificTimeError,
    clearTimeError,
    isEdit,
    isChangeDate,
  } = prop;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end' | null>(null);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);

  const formatValue = (value: string) => {
    return dayjs(
      `${DateTime.getCurrentDateTime().format('YYYY-MM-DD')} ${value}`,
      'YYYY-MM-DD HH:mm',
    );
  };

  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  const prevSelectedDateRef = useRef<Dayjs | null>(null);

  useEffect(() => {
    if (!isEdit) {
      const now = dayjs();
      const selected = dayjs(selectedDate);
      if (!selected.isValid()) {
        setStartTime('00:00');
        setSpecificStart('00:00');
        setEndTime('00:00');
        setSpecificEnd('00:00');
        return;
      }

      const isSameDate = prevSelectedDateRef.current?.isSame(selected, 'day');
      if (isSameDate) return;

      prevSelectedDateRef.current = selected;

      clearTimeError?.();

      const isToday = now.isSame(selected, 'day');

      if (isToday) {
        let minute = now.minute();
        let hour = now.hour();

        if (minute <= 30) {
          minute = 30;
        } else {
          minute = 0;
          hour += 1;
        }

        const start = dayjs().hour(hour).minute(minute).second(0);
        const end = start.add(4, 'hour');

        setStartTime(start.format('HH:mm'));
        setSpecificStart(start.format('HH:mm'));
        setEndTime(end.format('HH:mm'));
        setSpecificEnd(end.format('HH:mm'));
      } else {
        const start = dayjs().hour(0).minute(0).second(0);
        const end = start.add(4, 'hour');

        setStartTime('00:00');
        setSpecificStart('00:00');
        setEndTime(end.format('HH:mm'));
        setSpecificEnd(end.format('HH:mm'));
      }
    } else {
      setStartTime(specificStart || '00:00');
      setSpecificStart(specificStart || '00:00');
      setEndTime(specificEnd || '00:00');
      setSpecificEnd(specificEnd || '00:00');
    }
  }, [selectedDate]);

  const handleTimeConfirm = (hour: string, minute: string) => {
    const time = `${hour}:${minute}`;
    if (activeField === 'start') {
      setStartTime(time);
      setSpecificStart(time);

      const selected = dayjs(selectedDate);
      const newStart = dayjs(selected)
        .hour(Number(hour))
        .minute(Number(minute))
        .second(0);
      const newEnd = newStart.add(4, 'hour');
      const newEndStr = newEnd.format('HH:mm');

      setEndTime(newEndStr);
      setSpecificEnd(newEndStr);
    } else if (activeField === 'end') {
      setEndTime(time);
      setSpecificEnd(time);
    }
    setModalVisible(false);
    setActiveField(null);
  };

  const getInitialValues = () => {
    const [h, m] =
      activeField === 'start' ? startTime.split(':') : endTime.split(':');
    return {hour: h, minute: m};
  };

  const generateStartOptions = () => {
    const now = dayjs();
    const selected = dayjs(selectedDate);
    const isToday = now.isSame(selected, 'day');

    const options: string[] = [];

    if (isToday) {
      let hour = now.hour();
      let minute = now.minute();

      if (minute <= 30) {
        minute = 30;
      } else {
        minute = 0;
        hour += 1;
      }

      let pointer = dayjs(selected).hour(hour).minute(minute).second(0);
      const endOfDay = dayjs(selected).hour(23).minute(30);

      while (pointer.isSameOrBefore(endOfDay)) {
        options.push(pointer.format('HH:mm'));
        pointer = pointer.add(30, 'minute');
      }
    } else {
      let pointer = dayjs(selected).startOf('day');
      const endOfDay = dayjs(selected).hour(23).minute(30);

      while (pointer.isSameOrBefore(endOfDay)) {
        options.push(pointer.format('HH:mm'));
        pointer = pointer.add(30, 'minute');
      }
    }

    return options;
  };

  const generateEndOptions = () => {
    if (!specificStart) return [];

    const selectedStart = dayjs(
      `${dayjs(selectedDate).format('YYYY-MM-DD')} ${specificStart}`,
      'YYYY-MM-DD HH:mm',
    );

    const maxEnd = selectedStart.add(4, 'hour');

    const options: string[] = [];
    let pointer = selectedStart.add(30, 'minute');

    while (pointer.isBefore(maxEnd) || pointer.isSame(maxEnd)) {
      options.push(pointer.format('HH:mm'));
      pointer = pointer.add(30, 'minute');
    }

    return options;
  };

  const [modalInitialTime, setModalInitialTime] = useState('00:00');

  const onPressStart = () => {
    const options = generateStartOptions();
    if (options.length === 0) return;

    const validStart = options.includes(specificStart)
      ? specificStart
      : options[0];
    if (validStart !== specificStart) setSpecificStart(validStart);

    setPickerOptions(options);
    setModalInitialTime(validStart);
    setActiveField('start');
    setModalVisible(true);
  };

  const onPressEnd = () => {
    if (!specificStart) return;

    const options = generateEndOptions();

    if (options.length === 0) return;

    if (!options.includes(endTime)) {
      setEndTime(options[0]);
      setSpecificEnd(options[0]);
    }

    setModalVisible(false);
    setTimeout(() => {
      setPickerOptions(options);
      setActiveField('end');
      setModalVisible(true);
    }, 50);
  };

  const now = dayjs();
  const selected = dayjs(selectedDate);
  const isTomorrow = now.add(1, 'day').isSame(selected, 'day');

  return (
    <>
      <View className="p-4 border border-[#c4c4c4]">
        <Text className="text-base font-semibold">
          {t(
            'Residential__Visitor_management__Visitor_create_2__Specific_time_header',
            'Access Time',
          )}
        </Text>
        <Text className="text-muted-light text-sm mt-2 mb-4">
          {t(
            'Residential__Visitor_management__Visitor_create_2__Specific_time_body',
            'A Guest Pass can be granted for a maximum duration of 4 hours. For any requests exceeding this limit, please contact the Concierge.',
          )}
        </Text>
        <View className="flex flex-row justify-between">
          <View style={styles.container}>
            <Text className="mb-2 text-base">{t('Residential__Start', 'Start')}</Text>
            <Pressable
              style={[
                styles.input,
                disabled && styles.inputDisabled,
                specificTimeError ? styles.inputError : undefined,
              ]}
              onPress={onPressStart}
              disabled={disabled}>
              <Text style={[styles.inputText, disabled && styles.textDisabled]}>
                {startTime}
              </Text>
            </Pressable>
          </View>

          <View style={styles.container}>
            <Text className="mb-2 text-base">{t('Residential__End', 'End')}</Text>
            <Pressable
              style={[
                styles.input,
                (disabled || (isTomorrow && !specificStart)) &&
                  styles.inputDisabled,
                specificTimeError ? styles.inputError : undefined,
              ]}
              onPress={onPressEnd}
              disabled={disabled || (isTomorrow && !specificStart)}>
              <Text
                style={[
                  styles.inputText,
                  (disabled || (isTomorrow && !specificStart)) &&
                    styles.textDisabled,
                ]}>
                {endTime}
              </Text>
            </Pressable>
          </View>
        </View>

        {specificTimeError && (
          <Text style={{color: 'red', marginTop: 6, fontSize: 14}}>{specificTimeError}</Text>
        )}
      </View>

      <TimePickerModal
        visible={modalVisible}
        initialHour={modalInitialTime.split(':')[0]}
        initialMinute={modalInitialTime.split(':')[1]}
        availableTimes={pickerOptions}
        fixMinutes={['00', '30']}
        onConfirm={handleTimeConfirm}
        onCancel={() => {
          setModalVisible(false);
          setActiveField(null);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {width: '48%'},
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#c4c4c4',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textDisabled: {
    color: '#adadad',
  },
  inputDisabled: {
    borderColor: '#adadad',
    backgroundColor: '#efefef',
  },
  inputText: {
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
  },
});

export default SelectTimePeriod;
