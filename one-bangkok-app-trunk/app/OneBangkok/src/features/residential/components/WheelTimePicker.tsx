import React, {useMemo, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import WheelPicker from './WheePicker';

type Time = {
  hour: number;
  minute: number;
};

type Props = {
  title: string;
  time: Time;
  setTime?: (timeOption: any) => void;
};

const timeOptions = (time: Time, title: string) => [
  {label: '2 hour before', offset: -120},
  {label: '1:45 hour before', offset: -105},
  {label: '1:30 hour before', offset: -90},
  {label: '1:15 hour before', offset: -75},
  {label: '1 hour before', offset: -60},
  {label: '45 min before', offset: -45},
  {label: '30 min before', offset: -30},
  {label: '15 min before', offset: -15},
  
  {
    label: title,
    offset: 0,
  },
  
  {label: '15 min after', offset: 15},
  {label: '30 min after', offset: 30},
  {label: '45 min after', offset: 45},
  {label: '1 hour after', offset: 60},
  {label: '1:15 hour after', offset: 75},
  {label: '1:30 hour after', offset: 90},
  {label: '1:45 hour after', offset: 105},
  {label: '2 hour after', offset: 120}
];

const WheelTimePickerModal = ({
  title,
  time,
  setTime = (time: Time) => {},
}: Props) => {
  const [_, modalAction] = useModal();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const findIndexByLabel = (
    arr: ReturnType<typeof timeOptions>,
    label: string,
  ) => {
    const index = arr.findIndex(e => e.label === label);
    return index !== -1 ? index : 0;
  };

  const findValueByIndex = (
    arr: ReturnType<typeof timeOptions>,
    index: number,
  ) => arr[index];

  useMemo(() => {
    const options = timeOptions(time, title);
    const initialIndex = findIndexByLabel(options, title);
    setSelectedOptionIndex(initialIndex);
  }, [time, title]);

  const done = () => {
    const selectedOption = findValueByIndex(
      timeOptions(time, title),
      selectedOptionIndex,
    );
    const newHour =
      (time.hour + Math.floor((time.minute + selectedOption.offset) / 60)) % 24;
    const newMinute = (time.minute + selectedOption.offset) % 60;

    setTime({
      timeOptions: selectedOption
    });

    modalAction.hide();
  };

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between h-fit ">
        <TouchableOpacity onPress={() => modalAction.hide()}>
         <Text  style={styles.actionText}>{t('General__Cancel', 'Cancel')}</Text> 
        </TouchableOpacity>
        <Text style={styles.selectedLabel}>
          {String(time.hour).padStart(2, '0')} :{' '}
          {String(time.minute).padStart(2, '0')}
        </Text>
        <Text onPress={done} color="primary" weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>

      <View style={styles.pickerContainer}>
        <View style={styles.selectedIndicator}></View>
        <WheelPicker
          options={timeOptions(time, title).map(option => option.label)}
          selectedIndex={selectedOptionIndex}
          onChange={setSelectedOptionIndex}
          selectedIndicatorStyle={styles.indicator}
          containerStyle={styles.container}
          itemStyle={styles.item}
          itemTextStyle={styles.itemText}
          currentIndexItemTextStyle={styles.currentIndexItemTextStyle}
          itemHeight={43}
        />
      </View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // White background for the modal
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    height:30,
    backgroundColor:"red"
  },
  actionText: {
    color: '#007aff', // Blue color for actions (Cancel, Done)
    fontWeight: '500',
    fontSize: 16,
  },
  selectedLabel: {
    color: '#000', // Black text color for the selected time display
    fontWeight: '600',
    fontSize:16, // Larger font size for the selected time
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 210, // Adjusted to make enough space for the picker and indicator
  },
  selectedIndicator: {
    position: 'absolute',
    width: '100%',
    height: 43, // Match the item height
    backgroundColor: '#E4E4E4', // Slight background highlight for the selected item
    borderColor: '#B0B0B0', // Subtle border color for the indicator
    borderWidth: 1,
    top: '65%',
    transform: [{translateY: -55.5}], // Center the indicator vertically
    zIndex:1,
    opacity:0.5
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000', // Black text color for items
    alignSelf: 'center',
    marginVertical: 10,
  },
  currentIndexItemTextStyle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#162C51',
    marginVertical: 10,
  },
  item: {
    width: '100%',
    height: '100%',
  },
  indicator: {
    backgroundColor: '#E4E4E400',
    borderRadius: 1,
    borderColor: '#FFFFFF',
  }
});

export default WheelTimePickerModal;