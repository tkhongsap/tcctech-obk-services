import React, {useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Spacing, Text} from '../atoms';
import {Pill} from '../atoms/Pill';
import clsx from 'clsx';
import getTheme from '~/utils/themes/themeUtils';
import {FlatList} from 'react-native-gesture-handler';
export interface tabData {
  id?: string;
  name: string;
  description: string;
  text: string;
  badge: number;
}
interface TabSliderProps {
  tabList: Array<tabData>;
  onPress: Function;
  activeIndex: number;
}

const MAX_BADGE = 99;

const badgeNumberToString = (value: number) => {
  if (value > MAX_BADGE) {
    return MAX_BADGE + '+';
  }
  return value === 0 || !value ? '' : value.toString();
};
const Tab = ({isActive, onPress, pill, children}: any) => {
  const weight = isActive ? 'medium' : 'regular';
  const color = isActive ? 'default' : 'muted';
  const bgColor = isActive ? 'navy' : 'muted';

  const mergeClassName = clsx(
    'flex flex-row justify-center items-center px-5 border-b h-[32px]',
    getTheme(isActive ? 'border-default' : 'border-inactive'),
  );

  const pillClassName =
    Platform.OS === 'ios' ? 'h-5 px-[10px]' : 'h-[24px] px-[10px]';

  return (
    <TouchableOpacity className={mergeClassName} onPress={onPress}>
      <Text weight={weight} color={color}>
        {children}
      </Text>
      {pill && (
        <>
          <Spacing width={8} />
          <Pill variant={bgColor} text={pill} className={pillClassName} />
        </>
      )}
    </TouchableOpacity>
  );
};
const TabSlider = ({tabList, onPress, activeIndex}: TabSliderProps) => {
  const [tabIndex, setTabIndex] = useState(activeIndex);

  const handleOnPress = (index: number) => {
    onPress(index);
    setTabIndex(index);
  };

  const getItemLayout = (data, index) => {
    if (
      tabList.length - 1 == activeIndex ||
      tabList.length - 2 == activeIndex
    ) {
      return {
        length: 100 * index,
        offset: 100 * index,
        index,
      };
    } else {
      return {
        length: 110 * index,
        offset: 110 * index,
        index,
      };
    }
  };
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={tabList}
      initialScrollIndex={activeIndex}
      getItemLayout={getItemLayout}
      renderItem={tab => {
        return (
          <Tab
            onPress={() => handleOnPress(tab.index)}
            key={`tab-item-${tab.item.name}`}
            pill={badgeNumberToString(tab.item.badge)}
            isActive={activeIndex === tab.index}>
            {tab.item.text}
          </Tab>
        );
      }}
    />
  );
};

export default TabSlider;
