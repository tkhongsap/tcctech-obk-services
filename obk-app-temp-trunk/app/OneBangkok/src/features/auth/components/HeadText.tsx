import React from 'react';
import {Text, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
interface HeadTextProps {
  title: string;
  head: string;
}

export const HeadText = ({title, head}: HeadTextProps) => {
  return (
    <View className={'flex- flex-col gap-2'}>
      <Text className={getTheme('text-subtitle-muted text-sm font-bold')}>
        {head}
      </Text>
      <Text className={getTheme('text-default text-3xl font-medium')}>
        {title}
      </Text>
    </View>
  );
};
