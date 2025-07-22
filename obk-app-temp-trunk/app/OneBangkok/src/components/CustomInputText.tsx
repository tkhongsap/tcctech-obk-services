import {useHookstate} from '@hookstate/core';
import React from 'react';
import {TextInput} from 'react-native';
import {Colors} from '../constants/Colors';
import getTheme from '~/utils/themes/themeUtils';

const CustomInputText = (props: any) => {
  const state = useHookstate({
    isFocusing: false,
  });

  const onFocus = () => {
    state.set(p => {
      p.isFocusing = true;
      return p;
    });
  };

  const onBlur = () => {
    state.set(p => {
      p.isFocusing = false;
      return p;
    });
  };

  return (
    <TextInput
      className={`${getTheme(
        'rounded-md border border-gray-300 h-12 px-4 bg-default text-default',
      )} ${getTheme(
        props.isError
          ? 'border-error bg-error'
          : state.isFocusing.value
          ? 'border-active'
          : 'border-default',
      )}`}
      {...props}
      style={[props.style]}
      placeholderTextColor={Colors.black40}
      onFocus={() => {
        if (props.onFocus != null) {
          props.onFocus();
        }
        onFocus();
      }}
      onBlur={() => {
        if (props.onBlur != null) {
          props.onBlur();
        }
        onBlur();
      }}
    />
  );
};

export default CustomInputText;
