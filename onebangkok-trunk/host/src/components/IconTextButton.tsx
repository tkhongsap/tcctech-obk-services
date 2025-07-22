import React from 'react';
import {Image, ImageSourcePropType, Text, View} from 'react-native';
import CustomButton from './CustomButton';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, IconType} from './atoms';

type Props = {
  title: string;
  iconType: IconType;
};

const IconTextButton = ({iconType, title}: Props) => {
  return (
    <CustomButton
      className={getTheme(
        'border-line h-[48px] pl-[23px] border-[1px] flex flex-row items-center',
      )}>
      <Icon type={iconType} />
      <View className="w-[16px]" />
      <Text className={getTheme('text-jet-black font-normal text-base')}>
        {title}
      </Text>
    </CustomButton>
  );
};

export default IconTextButton;
