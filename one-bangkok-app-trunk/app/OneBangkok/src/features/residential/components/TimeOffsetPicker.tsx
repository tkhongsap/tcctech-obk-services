import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import WheelPicker from './WheePicker';

type Props = {
  options: string[];
  selectedIndex: number;
  onSelected: (index: number) => void;
};

const TimeOffsetPicker = ({options, selectedIndex, onSelected}: Props) => {
  const [_, modalAction] = useModal();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(selectedIndex);

  const done = () => {
    if (selectedOptionIndex !== selectedIndex) {
      onSelected(selectedOptionIndex);
    }
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
        <Text weight="medium">{options[selectedIndex]}</Text>
        <Text onPress={done} color="primary" weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>

      <View className="relative w-full box-border flex-1 flex-row justify-center items-center">
        <View className="absolute w-full h-9 border border-[#292929] bg-[#E4E4E4] top-[42%]"></View>
        <WheelPicker
          options={options}
          selectedIndex={selectedOptionIndex}
          onChange={setSelectedOptionIndex}
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
    alignSelf: 'center',
    marginVertical: 10,
  },
  currentIndexItemTextStyle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#162C51',
    alignSelf: 'center',
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

export default TimeOffsetPicker;
