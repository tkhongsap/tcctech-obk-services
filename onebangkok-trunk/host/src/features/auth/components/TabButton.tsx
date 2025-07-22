import React from 'react';
import {Text, View} from 'react-native';

import {CustomButton} from '~/components';
import getTheme from '~/utils/themes/themeUtils';

export const TabButton = (props: any) => {
  const {title, isActive, onPress} = props;

  return (
    <View
      className={getTheme(
        isActive
          ? 'w-1/2 h-[32px] border-b-[1px] border-default'
          : ' w-1/2 h-[32px] border-b-[1px] border-muted',
      )}>
      <CustomButton onPress={onPress} {...props}>
        <Text
          className={getTheme(
            isActive
              ? 'text-[16px] text-center text-default'
              : 'text-[16px] text-center text-muted',
          )}>
          {title}
        </Text>
      </CustomButton>
    </View>
  );
};
