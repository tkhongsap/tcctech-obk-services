import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '../atoms';
import {activeOpacity} from '~/constants';
import {ListSelect} from './SelectList';

export interface SelectMultipleListProps {
  data: ListSelect[];
  onPress?: Function;
  selected: string[];
  disabled?: boolean;
  hasError?: boolean;
}
const SelectMultipleList = ({
  data,
  selected,
  onPress,
  disabled,
  hasError,
}: SelectMultipleListProps) => {
  const [selectValue, setSelectValue] = useState<string[]>();
  const handleOnPress = (radioValue: string) => {
    const index =
      selectValue?.findIndex(selectValue => selectValue === radioValue) ?? -1;
    const copy = [...(selectValue ?? [])];

    if (index >= 0) {
      copy.splice(index, 1);
    } else {
      copy.push(radioValue);
    }

    setSelectValue(copy);
    onPress && onPress(copy);
  };

  useEffect(() => {
    if (disabled) {
      setSelectValue([]);
    } else {
      selected && setSelectValue(selected);
    }
  }, [selected, disabled]);

  const checkSelected = (value: string) => {
    const index =
      selectValue?.findIndex(selectValue => selectValue === value) ?? -1;

    return index >= 0;
  };

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
                checkSelected(value) ? 'bg-light-gray' : 'border-line'
              } ${
                disabled
                  ? 'bg-light-gray'
                  : hasError && 'bg-error border-fire-engine-red'
              }`,
            )} `}>
            <View>
              <Text
                weight={checkSelected(value) ? 'medium' : 'regular'}
                size="B1"
                className={`${disabled && getTheme('text-muted-400')} `}>
                {name}
              </Text>
              {description && <Text size="B2">{description}</Text>}
            </View>
            {checkSelected(value) ? (
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

export default SelectMultipleList;
