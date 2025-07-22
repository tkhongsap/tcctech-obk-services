import {useFocusEffect} from '@react-navigation/native';
import clsx from 'clsx';
import React, {useEffect, useState, forwardRef, useCallback} from 'react';
import {View} from 'react-native';

import {
  Label,
  HelperText,
  Spacing,
  IconType,
  Icon,
} from '~/components/atoms';
import { TextInput,TextInputProps } from './TextInput';
import getTheme from '~/utils/themes/themeUtils';

export interface TextFieldProps extends TextInputProps {
  labelText?: string;
  helperText?: string;
  error?: boolean;
  rightIcon?: IconType;
  className?: string;
  IconColor?: string;
}

export const TextField = forwardRef((props: TextFieldProps, ref: any) => {
  const {
    labelText,
    helperText: _helperText,
    error,
    onFocus,
    onEndEditing,
    onChangeText,
    className,
    rightIcon,
    IconColor,
    ...restProps
  } = props;
  const [helperText, setHelperText] = useState(_helperText);

  useEffect(() => {
    setHelperText(_helperText);
  }, [_helperText]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!restProps.persistentValue) {
          setHelperText('');
        }
      };
    }, [restProps.persistentValue]),
  );

  const handleOnChangeText = (text: string) => {
    setHelperText('');
    onChangeText && onChangeText(text);
  };

  const handleOnFocus = (e: any) => {
    setHelperText('');
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleOnEndEditing = (e: any) => {
    if (onEndEditing) {
      onEndEditing(e);
    }
  };
  const mergedClassName = clsx(getTheme('font-obRegular'), className);

  return (
    <>
      {labelText && (
        <>
          <Label text={labelText} />
          <Spacing height={8} />
        </>
      )}
      <View className="">
        <TextInput
          {...restProps}
          ref={ref}
          error={error}
          onFocus={handleOnFocus}
          onEndEditing={handleOnEndEditing}
          onChangeText={handleOnChangeText}
          className={mergedClassName}
        />
        <View className="absolute right-3 inset-y-2">
          {rightIcon && <Icon type={rightIcon} color={IconColor} height={24} width={24} />}
        </View>
      </View>

      {helperText && (
        <>
          <Spacing height={2} />
          <HelperText text={helperText} error={error} />
        </>
      )}
    </>
  );
});
