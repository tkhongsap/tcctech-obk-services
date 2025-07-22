import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import {modalActions} from '../components/ResidentialModal';
import TimePickerModal from './TimePickerModal';
import TimeOffsetPicker from './TimeOffsetPicker';

export type TimingTitle = 'Timing' | 'Sunrise' | 'Sunset';
type Times = {
  hour: number;
  minute: number;
};
export type ActionScheduleTimeOption = {
  title: TimingTitle;
  times: Times;
  selected: boolean;
  twilightOffset: number;
  display: string;
};

type Props = {
  options: ActionScheduleTimeOption[];
  onChanged: (option: ActionScheduleTimeOption) => void;
  onSelectedTimeTitle: (title: TimingTitle) => void;
  disabled?: boolean;
};

const ActionScheduleTimeOptions = React.memo(
  ({options, onChanged, onSelectedTimeTitle, disabled = false}: Props) => {
    const sunsetTimeOptions = [
      {label: '2 hour before', offset: -120},
      {label: '1:45 hour before', offset: -105},
      {label: '1:30 hour before', offset: -90},
      {label: '1:15 hour before', offset: -75},
      {label: '1 hour before', offset: -60},
      {label: '45 min before', offset: -45},
      {label: '30 min before', offset: -30},
      {label: '15 min before', offset: -15},
      {
        label: t('Residential__Home_Automation__Sunset_nocut', 'Sunset'),
        offset: 0,
      },
      {label: '15 min after', offset: 15},
      {label: '30 min after', offset: 30},
      {label: '45 min after', offset: 45},
      {label: '1 hour after', offset: 60},
      {label: '1:15 hour after', offset: 75},
      {label: '1:30 hour after', offset: 90},
      {label: '1:45 hour after', offset: 105},
      {label: '2 hour after', offset: 120},
    ];

    const sunriseTimeOptions = [
      {label: '2 hour before', offset: -120},
      {label: '1:45 hour before', offset: -105},
      {label: '1:30 hour before', offset: -90},
      {label: '1:15 hour before', offset: -75},
      {label: '1 hour before', offset: -60},
      {label: '45 min before', offset: -45},
      {label: '30 min before', offset: -30},
      {label: '15 min before', offset: -15},
      {
        label: t('Residential__Home_Automation__Sunrise_nocut', 'Sunrise'),
        offset: 0,
      },
      {label: '15 min after', offset: 15},
      {label: '30 min after', offset: 30},
      {label: '45 min after', offset: 45},
      {label: '1 hour after', offset: 60},
      {label: '1:15 hour after', offset: 75},
      {label: '1:30 hour after', offset: 90},
      {label: '1:45 hour after', offset: 105},
      {label: '2 hour after', offset: 120},
    ];

    const displayTime = useMemo(
      () => options.find(e => e.selected)?.display,
      [options],
    );

    const onOpenModal = () => {
      const selectedTime = options.find(e => e.selected);
      if (!selectedTime) return;

      if (selectedTime.title === 'Timing') {
        modalActions.setContent(
          <TimePickerModal
            time={selectedTime.times}
            setTime={times => {
              const display = `${paddingWith2Zero(
                times.hour.toString(),
              )}:${paddingWith2Zero(times.minute.toString())}`;
              onChanged({...selectedTime, times, display});
            }}
          />,
        );
      } else if (selectedTime.title === 'Sunrise') {
        const selectedIndex = sunriseTimeOptions.findIndex(
          e => e.offset === selectedTime.twilightOffset,
        );
        modalActions.setContent(
          <TimeOffsetPicker
            options={sunriseTimeOptions.map(e => e.label)}
            selectedIndex={selectedIndex}
            onSelected={index => {
              const newSelected = sunriseTimeOptions[index];
              onChanged({
                ...selectedTime,
                twilightOffset: newSelected.offset,
                display: newSelected.label,
              });
            }}
          />,
        );
      } else {
        const selectedIndex = sunsetTimeOptions.findIndex(
          e => e.offset === selectedTime.twilightOffset,
        );
        modalActions.setContent(
          <TimeOffsetPicker
            options={sunsetTimeOptions.map(e => e.label)}
            selectedIndex={selectedIndex}
            onSelected={index => {
              const newSelected = sunsetTimeOptions[index];
              onChanged({
                ...selectedTime,
                twilightOffset: newSelected.offset,
                display: newSelected.label,
              });
            }}
          />,
        );
      }
      modalActions.show();
    };

    const paddingWith2Zero = (value: string) => value.padStart(2, '0');

    return (
      <>
        <View
          style={{
            flex: 3,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          className="mt-4">
          {options.map(({selected, title}) => (
            <TouchableOpacity
              style={{flex: 0.3}}
              activeOpacity={0.8}
              key={title}
              onPress={() => onSelectedTimeTitle(title)}
              disabled={disabled}>
              <View
                style={[
                  {
                    paddingVertical: 4,
                  },
                  selected
                    ? styles.buttonTimeOnActive
                    : styles.buttonTimeInActive,
                ]}
                className="flex justify-center items-center px-1 border h-full border-line-light">
                <Text
                  weight="bold"
                  className="text-center"
                  style={[
                    selected
                      ? styles.textTimeOnActive
                      : styles.textTimeInActive,
                  ]}>
                  {mappingTimingLanguage(title)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          disabled={disabled}
          onPress={onOpenModal}
          className="border border-line-light mt-4">
          <Text
            style={{
              paddingVertical: 38,
              display: 'flex',
              textAlign: 'center',
            }}
            className="font-obRegular flex flex-col px-4">
            {displayTime}
          </Text>
        </TouchableOpacity>
      </>
    );
  },
);

export default ActionScheduleTimeOptions;

const mappingTimingLanguage = (timing: TimingTitle) => {
  switch (timing) {
    case 'Sunrise':
      return t('Residential__Home_Automation__Sunrise', 'Sunrise');
    case 'Sunset':
      return t('Residential__Home_Automation__Sunset', 'Sunset');
    case 'Timing':
      return t('Residential__Home_Automation__Timing', 'Timing');

    default:
      return timing;
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },

  buttonTimeInActive: {
    backgroundColor: 'white',
  },
  buttonTimeOnActive: {
    backgroundColor: '#014541',
  },
  textTimeInActive: {
    color: 'black',
  },
  textTimeOnActive: {
    color: 'white',
  },
});
