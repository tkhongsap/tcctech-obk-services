import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '../atoms';
import {activeOpacity} from '~/constants';

export interface Radio {
  name: string;
  value: string;
  description?: string;
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
    <View className={getTheme('flex flex-col divide-y divide-line')}>
      {data.map(({name, value, description}, index) => (
        <TouchableOpacity
          key={index + '-radio-' + value}
          activeOpacity={activeOpacity}
          onPress={() => {
            handleOnPress(value);
          }}>
          <View className={'flex flex-row items-center justify-between'}>
            <View>
              <Spacing height={20} />
              <Text
                weight={selectValue === value ? 'medium' : 'regular'}
                size="B1">
                {name}
              </Text>
              {description && <Text size="B2">{description}</Text>}
            </View>
            <View className="pt-4">
              <Icon
                type={selectValue === value ? 'checkedRadio' : 'radio'}
                width={20}
                height={20}
                color={'none'}
              />
            </View>
          </View>
          <Spacing height={20} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioList;
