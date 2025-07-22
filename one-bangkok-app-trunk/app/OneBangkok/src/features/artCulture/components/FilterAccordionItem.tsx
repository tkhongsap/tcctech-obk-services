import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Icon, Text} from '~/components/atoms';
import clsx from 'clsx';

export interface IFilterChoice {
  value: string;
  label: string;
}

interface IFilterAccordionItem {
  type: string;
  label: string;
  items: IFilterChoice[];
  selectedItem: string[];
  onOptionPress: (type: string, value: string) => void;
}

const FilterAccordionItem = ({
  type,
  label,
  items,
  selectedItem,
  onOptionPress,
}: IFilterAccordionItem) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(0);
  const derivedHeight = useDerivedValue(() =>
    withTiming(isExpanded ? height.value * Number(isExpanded) : 68, {
      duration: 50,
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View className="px-4" style={[bodyStyle]}>
      <View
        className="w-full border-b border-line-light"
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}>
        <Pressable
          className="flex flex-row w-full items-center justify-between py-4"
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="font-obMedium">{label || ''}</Text>
          <Icon
            type="arrowDownIcon"
            width={16}
            height={16}
            rotation={isExpanded ? 180 : 0}
            color="#000000"
          />
        </Pressable>

        <View className={clsx([isExpanded ? 'pb-2' : 'hidden'])}>
          {items.map(item => (
            <Pressable
              key={`filter-item-${item.value}`}
              className={clsx([
                'flex flex-row justify-between border py-3 px-4 mb-3',
                selectedItem.includes(item.value) ||
                (selectedItem.length === 0 && item.value === '')
                  ? 'bg-light-gray-light border-jet-black-light'
                  : 'border-line-light',
              ])}
              onPress={() => onOptionPress(type, item.value)}>
              <Text>{item.label}</Text>
              <View
                className={clsx(
                  selectedItem.includes(item.value) ||
                    (selectedItem.length === 0 && item.value === '')
                    ? 'block'
                    : 'hidden',
                )}>
                <Icon
                  type={'checkedIcon'}
                  width={16}
                  height={16}
                  color={'#1A1919'}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default FilterAccordionItem;
