import {useHookstate} from '@hookstate/core';
import React from 'react';
import {TextInput} from 'react-native';
import getTheme, {GetPureColorCode} from '~/utils/themes/themeUtils';

export const OBInputText = (props: any) => {
  const state = useHookstate({
    isFocusing: false,
  });
  const onFocus = () => state.isFocusing.set(true);
  const onBlur = () => state.isFocusing.set(false);

  return (
    <TextInput
      {...props}
      className={`${getTheme(
        'h-[56px] px-[10px] bg-default rounded-[4px] border text-default text-[20px] text-font-medium text-center tracking-[10px] ',
      )}${getTheme(
        props.isError
          ? 'border-error'
          : state.isFocusing.value
          ? 'border-active'
          : 'border-fade',
      )}`}
      placeholderTextColor={GetPureColorCode('fade')}
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
