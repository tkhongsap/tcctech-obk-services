import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';

export interface ListSelect {
  name: string;
  value: string;
  description?: string;
}
export interface SelectListProps {
  data: ListSelect[];
  onPress?: Function;
  selected: string;
  disabled?: boolean;
  hasError?: boolean;
}
const SelectList = ({
  data,
  selected,
  onPress,
  disabled,
  hasError,
}: SelectListProps) => {
  const [selectValue, setSelectValue] = useState('');
  const handleOnPress = (radioValue: string) => {
    setSelectValue(radioValue);
    onPress && onPress(radioValue);
  };

  useEffect(() => {
    if (disabled) {
      setSelectValue('');
    } else {
      selected && setSelectValue(selected);
    }
  }, [selected, disabled]);

  return (
    <View className={getTheme('flex flex-col')}>
      {data.map(({name, value, description}, index) => (
        <TouchableOpacity
          disabled={disabled}
          key={index + '-checkList-' + value}
          activeOpacity={activeOpacity}
          onPress={() => {
            handleOnPress(value);
          }}>
          <View
            className={`min-h-[48px] px-5 py-3 flex flex-row justify-between items-center ${getTheme(
              `border-[1px] ${
                selectValue === value ? 'bg-light-gray' : 'border-line'
              } ${
                disabled
                  ? 'bg-light-gray'
                  : hasError && 'bg-error border-fire-engine-red'
              }`,
            )} `}>
            <View>
            <Text
                weight={selectValue === value ? 'medium' : 'regular'}
                size="B1"
                className={`${disabled && getTheme('text-muted-400')} ${
                  selectValue === value && 'text-[#014541]'
                }`}>
                {name}
              </Text>
              {description && <Text size="B2">{description}</Text>}
            </View>
            {selectValue === value ? (
              <Icon
                type={'checkedIcon'}
                width={20}
                height={20}
                color={'#1A1919'}
              />
            ) : null}
          </View>
          <Spacing height={12} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectList;
