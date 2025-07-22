import React from 'react';
import {Animated} from 'react-native';

export const AnimtedAppBar = (props: any) => {
  props = {
    translateY: 0,
    height: 120,
    ...props,
  };

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        width: '100%',
        //for animation
        height: props.height,
        transform: [{translateY: props.translateY}],
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        elevation: 4,
        zIndex: 1,
      }}>
      {props.children}
    </Animated.View>
  );
};
