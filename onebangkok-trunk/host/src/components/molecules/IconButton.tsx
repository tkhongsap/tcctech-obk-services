import React from 'react';
import {DimensionValue, TouchableOpacity} from 'react-native';

import {activeOpacity} from '~/constants';

import {Icon, IconProps} from '../atoms';

export interface IconButtonProps extends Omit<IconProps, 'width' | 'height'> {
  onPress: () => void;
  testID?: string;
  width?: DimensionValue;
  height?: DimensionValue;
}

export const IconButton = (props: IconButtonProps) => {
  const {onPress, testID, ...restProps} = props;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <Icon {...restProps} />
    </TouchableOpacity>
  );
};

IconButton.defaultProps = {
  onPress: () => null,
};
