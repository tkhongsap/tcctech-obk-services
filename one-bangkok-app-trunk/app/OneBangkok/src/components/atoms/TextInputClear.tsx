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

export interface TextInputClearProps extends RnTextInputProps {
  variant?: 'default' | 'active' | 'inactive' | 'error' | undefined;
  error?: boolean;
  persistentValue?: boolean;
  rightIcon?: IconProps['type'];
  disabled?: boolean;
  onClear?: () => void;
}
const defaultProps: TextInputClearProps = {
  variant: 'default',
  error: false,
  persistentValue: false,
};

export const TextInputClear = forwardRef(
  (props: TextInputClearProps, ref: any) => {
    const {
      className,
      error = false,
      onFocus,
      onEndEditing,
      onChangeText,
      onClear,
      persistentValue,
      style,
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
      rightIcon ? 'pr-[48px]' : null,
      !disabled && (isActive ? variants.active : variants.inactive),
      !disabled && (!isActive && value.length > 0 ? variants.filled : null),
      hasError ? variants.error : null,
    );

    return (
      <View className="relative">
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
            onPress={e => {
              if (value) {
                setValue('');
                onClear && onClear();
              } else {
                handleOnFocus && handleOnFocus(e);
              }
            }}
            className="absolute right-[12px] flex justify-center h-full">
            <Icon
              type={value ? 'close' : rightIcon}
              color={value ? '#000000' : '#BDBDBD'}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

TextInputClear.defaultProps = defaultProps;

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
