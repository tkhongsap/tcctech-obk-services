import clsx from 'clsx';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import getTheme from '~/utils/themes/themeUtils';

import {Spacing, Text} from '~/components/atoms';
import {Pill} from '../atoms/Pill';

export const TabHeader = ({tabItems, activeTab, setActiveTab, style}: any) => {
  const tabs = tabItems.map((item: any, index: number) => {
    const {onPress} = item.props;
    return React.cloneElement(item, {
      key: index,
      isActive: index === activeTab,
      onPress: () => {
        onPress && onPress();
        setActiveTab(index);
      },
      className: 'flex flex-col items-center justify-center flex-1',
    });
  });

  return (
    <View className="flex flex-row justify-around w-full" style={style}>
      {tabs}
    </View>
  );
};

export const TabItem = ({isActive, onPress, pill, children, testID}: any) => {
  const weight = isActive ? 'medium' : 'regular';
  const color = isActive ? 'default' : 'muted';

  const mergeClassName = clsx(
    'flex flex-1 flex-row justify-center items-center h-[32px] px-5 border-b w-full',
    getTheme(isActive ? 'border-default' : 'border-inactive'),
  );

  return (
    <View className={mergeClassName}>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        activeOpacity={1}
        className="flex-1 flex flex-row justify-center">
        <Text weight={weight} color={color}>
          {children}
        </Text>
        {pill && (
          <>
            <Spacing width={4} />
            <Pill variant={color} text={pill} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const TabBody = ({children, style}: any) => {
  return (
    <View className="flex flex-col" style={style}>
      {children}
    </View>
  );
};

export const TabContent = ({children, style}: any) => {
  return (
    <View className="flex flex-col" style={style}>
      {children}
    </View>
  );
};

export const Tab = ({children, style, bodyStyle, headerStyle}: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabHeader = children.find(
    (child: any) => child.type.name === 'TabHeader',
  );

  const tabItems = tabHeader.props.children;
  const tabBody = children.find((child: any) => child.type.name === 'TabBody');
  const tabContents = tabBody.props.children;
  return (
    <View className="flex flex-col w-full" style={style}>
      <TabHeader
        tabItems={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        style={headerStyle}
      />
      <TabBody style={bodyStyle}>{tabContents[activeTab]}</TabBody>
    </View>
  );
};
