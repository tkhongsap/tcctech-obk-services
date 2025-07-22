import React from 'react';
import {Keyboard, TouchableOpacity, View, Text, Image} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

const ICON_MAPPER: Record<string, any> = {
  next: require('~/assets/images/icon_next.png'),
};

const BottomButton = (props: any) => {
  const {title, icon, onPress, disabled} = props;

  const handlePress = () => {
    if (!disabled) {
      if (onPress) {
        onPress();
      }

      Keyboard.dismiss();
    }
  };

  let containerStyle = getTheme(disabled ? 'bg-gray-400' : 'bg-primary');

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View
        className={`flex-row items-center flex px-6 py-4 h-[84px] items-start ${containerStyle}`}>
        <Text className="text-sm text-white capitalize font-semibold flex-1">
          {title}
        </Text>
        {icon ? (
          <View className="flex-grow-0">
            <Image source={ICON_MAPPER[icon]} className="aspect-square h-5" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default BottomButton;
