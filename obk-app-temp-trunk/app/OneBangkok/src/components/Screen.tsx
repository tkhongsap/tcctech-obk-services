import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import Loading from './organisms/Loading';

const Screen = (props: any) => {
  props = {
    isTheme: false,
    ...props,
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View
        className={getTheme(
          'flex-1 justify-start items-center h-screen w-screen bg-default',
        )}>
        {props.children}
        <Loading />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Screen;
