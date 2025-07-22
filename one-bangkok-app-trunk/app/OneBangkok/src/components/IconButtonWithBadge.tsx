import React from 'react';
import {View} from 'react-native';
import {Icon, IconProps, Text} from './atoms';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {activeOpacity} from '~/constants';
import getTheme from '~/utils/themes/themeUtils';
import clsx from 'clsx';

export interface IconButtonWithBadgeProps
  extends Omit<IconProps, 'width' | 'height'> {
  onPress: () => void;
  badgeCount: number;
  badgeColor?: string;
  testID?: string;
  width?: number;
  height?: number;
  limitCount?: number;
}

export const IconButtonWithBadge = (props: IconButtonWithBadgeProps) => {
  const {
    testID,
    onPress,
    badgeCount,
    badgeColor,
    limitCount = 99,
    ...restProps
  } = props;
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <View className=" flex flex-row">
        <Icon {...restProps} />
        {badgeCount > 0 && (
          <View className="relative">
            <View
              className={clsx(
                'absolute -top-1 -left-4 min-w-[20px] px-[6px] h-5 rounded-full flex items-center justify-center ',
                badgeColor
                  ? getTheme(badgeColor)
                  : getTheme('bg-dark-red-light'),
              )}>
              <Text className="text-xs text-white">
                {badgeCount > limitCount ? `${limitCount}+` : badgeCount}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
