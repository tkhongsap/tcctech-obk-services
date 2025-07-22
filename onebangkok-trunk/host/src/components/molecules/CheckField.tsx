import React from 'react';

import {View} from 'react-native';
import {Checkbox} from '../atoms/Checkbox';

export const CheckField = (props: any) => {
  const {onPress, children, value, error, testID, ...restProps} = props;
  return (
    <View className="flex flex-row gap-2 items-center">
      <Checkbox
        value={value}
        onPress={onPress}
        width={22}
        height={22}
        error={error}
        testID={testID}
        {...restProps}
      />
      {children}
    </View>
  );
};
