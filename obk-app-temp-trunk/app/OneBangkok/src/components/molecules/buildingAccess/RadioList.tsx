import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Text} from '../../atoms';
import {activeOpacity} from '~/constants';

export interface Radio {
  name: string;
  value: string;
}
export interface RadioListProps {
  data: Radio[];
  onPress?: Function;
  selected: string;
}
const RadioList = ({data, selected, onPress}: RadioListProps) => {
  const [selectValue, setSelectValue] = useState('');
  const handleOnPress = (radioValue: string) => {
    setSelectValue(radioValue);
    onPress && onPress(radioValue);
  };

  useEffect(() => {
    selected && setSelectValue(selected);
  }, [selected]);

  return (
    <View className={getTheme('flex flex-col gap-[12px]')}>
      {data.map(({name, value}, index) => (
        <TouchableOpacity
          key={index + '-radio-' + value}
          activeOpacity={activeOpacity}
          onPress={() => {
            handleOnPress(value);
          }}>
          <View
            className={getTheme(
              `flex flex-row items-center justify-between px-[12px] py-[16px] border border-brown-400 ${
                selectValue === value && 'bg-forest'
              }`,
            )}>
            <View>
              <Text
                color={selectValue === value ? 'default-inverse' : 'default'}
                weight={selectValue === value ? 'medium' : 'regular'}
                size="B1">
                {name}
              </Text>
            </View>
            <View>
              <Icon
                type={
                  selectValue === value ? 'checkedOutlineRadioWhite' : 'radio'
                }
                width={20}
                height={20}
                color="none"
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioList;
