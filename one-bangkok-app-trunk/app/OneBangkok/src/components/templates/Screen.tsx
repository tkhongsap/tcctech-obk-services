import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import Loading from '~/components/organisms/Loading';

export const Screen = (props: any) => {
  props = {
    isTheme: false,
    bgColor: 'bg-default',
    ...props,
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View
        className={getTheme(
          `flex-1 justify-start items-center h-screen w-screen ${props.bgColor}`,
        )}>
        {props.children}
        <Loading isLoading={props.isLoading} />
      </View>
    </TouchableWithoutFeedback>
  );
};
