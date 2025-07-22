import React from 'react';
import {View} from 'react-native';

import getTheme from '~/utils/themes/themeUtils';

import {Text} from '../atoms';

export const Diverder = (props: any) => {
  const {text} = props;

  return (
    <View className="flex flex-row items-center h-[18px]">
      <View className={getTheme('flex-1 h-[1px] bg-[#DCDCDC]')} />
      {text && (
        <Text size="B2" color="jet-black" className="mx-[20px] leading-[18px]">
          {text}
        </Text>
      )}
      {text && <View className={getTheme('flex-1 h-[1px] bg-[#DCDCDC]')} />}
    </View>
  );
};
