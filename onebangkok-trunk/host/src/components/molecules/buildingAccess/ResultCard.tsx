import React from 'react';

import {Icon, IconType, Text} from '~/components/atoms';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

interface ResultCardProps {
  icon: IconType;
  text: string;
  onPress: Function;
}
const ResultCard = ({icon, text, onPress}: ResultCardProps) => {
  const handleOnPress = () => {
    onPress && onPress();
  };
  return (
    <TouchableOpacity
      onPress={handleOnPress}
      activeOpacity={1}
      className={getTheme(
        'w-full flex flex-row justify-between p-[16px] items-center',
      )}>
      <View className="flex flex-row gap-[12px]">
        <View
          className={getTheme(
            'flex items-center justify-center w-[45px] h-[45px] rounded-[20px] bg-section',
          )}>
          <Icon height={16} width={16} type={icon} />
        </View>
        <Text className={'self-center'} size="B1" weight="medium">
          {text}
        </Text>
      </View>
      <Icon height={12} width={12} type={'next'} />
    </TouchableOpacity>
  );
};

export default ResultCard;
