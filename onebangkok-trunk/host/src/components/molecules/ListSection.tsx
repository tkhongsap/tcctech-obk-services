import React from 'react';
import {View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, IconProps, Spacing, Text} from '../atoms';

export interface ListSectionProps {
  icon?: IconProps['type'];
  title: string;
  children: any;
}
export const ListSection = ({children, title, icon}: ListSectionProps) => {
  return (
    <View key={`section-${title}`}>
      <View className="flex flex-row items-center">
        {icon && <Icon type={icon} width={16} height={16} />}
        <Text weight="medium" size="B1">
          {title}
        </Text>
      </View>
      <Spacing height={8} />
      <View className={getTheme('px-[16px] border border-line')}>
        {children}
      </View>
    </View>
  );
};
