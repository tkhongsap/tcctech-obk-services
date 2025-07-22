import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {activeOpacity} from '~/constants';
import {Icon, IconProps} from '../atoms';
import authenState from '~/states/authen/authenState';
import {isEmpty} from 'lodash';

export interface IconButtonProps extends IconProps {
  onPress: () => void;
}

export const CircleStickyButton = (props: IconButtonProps) => {
  if (isEmpty(authenState.token.value)) {
    return null;
  }

  const {onPress, ...restProps} = props;
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      className="absolute bottom-7 right-7">
      <View className="w-[72] h-[72] rounded-full bg-[#000000] flex items-center justify-center shadow-md">
        <View className="text-white text-24">
          <Icon {...restProps} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
