import React, {useState, useEffect, forwardRef, useCallback} from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RnTextInputProps,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {clsx} from 'clsx';
import {useFocusEffect} from '@react-navigation/native';
import {Icon, IconProps} from './Icon';

export interface TextInputProps extends RnTextInputProps {
  variant?: 'default' | 'active' | 'inactive' | 'error' | undefined;
  error?: boolean;
  persistentValue?: boolean;
  leftIcon?: {name: IconProps['type']; className?: string};
  rightIcon?: IconProps['type'];
  disabled?: boolean;
}
const defaultProps: TextInputProps = {
  variant: 'default',
  error: false,
  persistentValue: false,
};

export const TextInput = forwardRef((props: TextInputProps, ref: any) => {
  const {
    className,
    error = false,
    onFocus,
    onEndEditing,
    onChangeText,
    persistentValue,
    style,
    leftIcon,
    rightIcon,
    disabled,
    ...restProps
  } = props;

  const [isActive, setIsActive] = useState(false);
  const [hasError, setHasError] = useState(error);
  const [fontFamily, setFontFamily] = useState('OneBangkok-Italic');
  const [value, setValue] = useState(
    restProps.value || restProps.defaultValue || '',
  );

  useEffect(() => {
    setValue(restProps.value || restProps.defaultValue || '');
  }, [restProps.value, restProps.defaultValue]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!persistentValue) {
          setValue('');
          setHasError(false);
        }
      };
    }, [persistentValue]),
  );

  useEffect(() => {
    setFontFamily(
      value && value.length > 0 ? 'OneBangkok-Regular' : 'OneBangkok-Italic',
    );
  }, [value]);

  useEffect(() => {
    setHasError(error);
  }, [error]);

  const handleOnFocus = (e: any) => {
    setIsActive(true);
    setHasError(false);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleOnEndEditing = (e: any) => {
    setIsActive(false);
    if (onEndEditing) {
      onEndEditing(e);
    }
  };

  const handleOnChangeText = (text: string) => {
    setValue(text);
    onChangeText && onChangeText(text);
  };

  const variants = {
    default: getTheme('border px-4 py-3 text-base leading-5 bg-white'),
    active: getTheme('border-jet-black bg-white'),
    inactive: getTheme('border-inactive bg-white'),
    error: getTheme('border-error bg-error'),
    filled: getTheme('border-black bg-white'),
  };

  const mergedClassName = clsx(
    getTheme('font-obRegular'),
    variants.default,
    className,
    leftIcon ? 'pl-[48px]' : null,
    rightIcon ? 'pr-[48px]' : null,
    !disabled && (isActive ? variants.active : variants.inactive),
    !disabled && (!isActive && value.length > 0 ? variants.filled : null),
    hasError ? variants.error : null,
  );

  return (
    <View className="relative">
      {leftIcon && (
        <Pressable
          onPress={handleOnFocus}
          className="absolute left-[12px] flex justify-center h-full z-[1]">
          <Icon
            type={leftIcon.name}
            color="#BDBDBD"
            className={leftIcon.className}
          />
        </Pressable>
      )}
      <RNTextInput
        {...restProps}
        style={[
          {fontFamily: fontFamily as TextStyle['fontFamily']},
          style,
          disabled && styles.disable,
          hasError && styles.error,
        ]}
        ref={ref}
        className={mergedClassName}
        onFocus={handleOnFocus}
        onEndEditing={handleOnEndEditing}
        onChangeText={handleOnChangeText}
        placeholderTextColor={'#BDBDBD'}
        value={value}
      />
      {rightIcon && (
        <Pressable
          onPress={handleOnFocus}
          className="absolute right-[12px] flex justify-center h-full">
          <Icon type={rightIcon} color="#BDBDBD" />
        </Pressable>
      )}
    </View>
  );
});

TextInput.defaultProps = defaultProps;

const styles = StyleSheet.create({
  disable: {
    borderColor: '#EFEFEF',
    borderWidth: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    textAlign: 'left',
  },
  error: {
    borderTopColor: '#ED2015',
    borderLeftColor: '#ED2015',
    borderRightColor: '#ED2015',
    borderBottomColor: '#ED2015',
    backgroundColor: '#FFF2F1',
    borderRadius: 0,
  },
});
