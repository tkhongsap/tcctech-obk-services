import React from 'react';
import {Keyboard, TouchableOpacity} from 'react-native';

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.5}
      onPress={() => {
        Keyboard.dismiss();
        if (props.onPress != null) {
          props.onPress();
        }
      }}
      disabled={props.disabled ?? false}>
      {props.children}
    </TouchableOpacity>
  );
};

export default CustomButton;
