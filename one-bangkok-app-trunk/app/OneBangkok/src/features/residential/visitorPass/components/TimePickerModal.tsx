import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TextStyle,
} from 'react-native';
import t from '~/utils/text';
import WheelPicker from 'react-native-wheely';
import { Text } from '~/components/atoms/Text';
const {height: screenHeight} = Dimensions.get('window');

type Props = {
  visible: boolean;
  initialHour: string;
  initialMinute: string;
  fixHours?: string[];
  fixMinutes?: string[];
  availableTimes?: string[];
  onConfirm: (hour: string, minute: string) => void;
  onCancel: () => void;
  itemTextStyle?: TextStyle;
};

const TimePickerModal = ({
  visible,
  initialHour,
  initialMinute,
  fixHours,
  fixMinutes,
  availableTimes,
  onConfirm,
  onCancel,
}: Props) => {
  const allHours = Array.from({length: 24}, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const allMinutes = Array.from({length: 60}, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const sortHoursCrossMidnight = (hours: string[]) => {
    return hours.sort((a, b) => {
      const ah = parseInt(a, 10);
      const bh = parseInt(b, 10);

      const aVal = ah < 6 ? ah + 24 : ah;
      const bVal = bh < 6 ? bh + 24 : bh;

      return aVal - bVal;
    });
  };

  const filteredHours = React.useMemo(() => {
    if (!availableTimes) return fixHours ?? allHours;

    const hourSet = new Set<string>();
    for (const time of availableTimes) {
      const h = time.split(':')[0];
      hourSet.add(h);
    }
    const baseHours = fixHours ?? allHours;
    const hoursArr = Array.from(hourSet).filter(h => baseHours.includes(h));
    return sortHoursCrossMidnight(hoursArr);
  }, [availableTimes, fixHours]);

  const filteredMinutes = React.useMemo(() => {
    if (!availableTimes) return fixMinutes ?? allMinutes;

    const minuteSet = new Set<string>();
    for (const time of availableTimes) {
      const m = time.split(':')[1];
      minuteSet.add(m);
    }
    const baseMinutes = fixMinutes ?? allMinutes;
    return Array.from(minuteSet)
      .filter(m => baseMinutes.includes(m))
      .sort();
  }, [availableTimes, fixMinutes]);

  const findInitialHourIndex = () => {
    const idx = filteredHours.indexOf(initialHour);
    return idx >= 0 ? idx : 0;
  };

  const findInitialMinuteIndex = () => {
    const idx = filteredMinutes.indexOf(initialMinute);
    return idx >= 0 ? idx : 0;
  };

  const [selectedHour, setSelectedHour] = useState(findInitialHourIndex());
  const [selectedMinute, setSelectedMinute] = useState(
    findInitialMinuteIndex(),
  );

  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      const hourIdx = findInitialHourIndex();
      const minuteIdx = findInitialMinuteIndex();
      setSelectedHour(hourIdx);
      setSelectedMinute(minuteIdx);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(screenHeight);
    }
  }, [visible, initialHour, initialMinute, filteredHours, filteredMinutes]);

  const handleDone = () => {
    let hour = filteredHours[selectedHour];
    let minute = filteredMinutes[selectedMinute];
    const selectedTime = `${hour}:${minute}`;

    if (availableTimes && !availableTimes.includes(selectedTime)) {
      let closest = availableTimes[0];
      let minDiff = Number.MAX_SAFE_INTEGER;
      const selMinutesTotal = parseInt(hour) * 60 + parseInt(minute);
      for (const t of availableTimes) {
        const [h, m] = t.split(':').map(Number);
        const total = h * 60 + m;
        const diff = Math.abs(total - selMinutesTotal);
        if (diff < minDiff) {
          minDiff = diff;
          closest = t;
        }
      }
      [hour, minute] = closest.split(':');
    }

    onConfirm(hour, minute);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.header}>
            <Text className='text-primary-light text-base font-semibold' onPress={onCancel}>
              {t('Residential__Cancel', 'Cancel')}
            </Text>
            <Text className='text-base font-semibold'>{t('Residential__Select_Time', 'Select Time')}</Text>
            <Text className='text-primary-light text-base font-semibold' onPress={handleDone}>
              {t('Residential__Done', 'Done')}
            </Text>
          </View>

          <View style={styles.pickerContainer}>
            <WheelPicker
              key={`hour-${visible ? initialHour : 'hidden'}`}
              selectedIndex={Math.max(filteredHours.indexOf(initialHour), 0)}
              options={filteredHours}
              onChange={index => setSelectedHour(index)}
              containerStyle={styles.picker}
              itemTextStyle={styles.itemTextStyle}
            />
            <WheelPicker
              key={`minute-${visible ? initialMinute : 'hidden'}`}
              selectedIndex={Math.max(
                filteredMinutes.indexOf(initialMinute),
                0,
              )}
              options={filteredMinutes}
              onChange={index => setSelectedMinute(index)}
              containerStyle={styles.picker}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
  },
  cancel: {color: '#007AFF', fontSize: 16},
  done: {color: '#007AFF', fontSize: 16},
  title: {fontSize: 16},
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: 200,
  },
  itemTextStyle: {
    fontSize: 16,
    fontFamily: 'One Bangkok BETA',
  },
});

export default TimePickerModal;
