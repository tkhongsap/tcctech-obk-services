import React from 'react';
import {
  ButtonProps as RNButtonProps,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import clsx from 'clsx';
import * as Sentry from '@sentry/react-native';

import getTheme from '~/utils/themes/themeUtils';
import {activeOpacity} from '~/constants';

import {Icon, IconProps, Text} from '../atoms';
import {logButtonClick} from '~/utils/logGA';
import {SentryCaptureException} from '~/utils/sentry';

export interface ButtonProps extends RNButtonProps {
  leftIcon?: IconProps['type'];
  rightIcon?: IconProps['type'];
  color: keyof typeof buttonColorVariant;
  outlined: boolean;
  className?: string;
  border: boolean;
  rounded?: boolean;
  safeArea?: number;
  ghost?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  iconColor?: string;
  rightIconColor?: string;
  buttonHeight?: number;
  subTitle?: string;
  gapRestrictedArea?: string;
  textContainerStyle?: string;
  truncateTitle?: boolean;
  borderWidth?: keyof typeof buttonBorderSizeVariant;
}

const defaultProps: Omit<ButtonProps, 'title'> = {
  color: 'light-gray',
  outlined: false,
  border: true,
  rounded: false,
  safeArea: 0,
  ghost: false,
  iconHeight: 20,
  iconWidth: 20,
  buttonHeight: 48,
  iconColor: '#162C51',
  rightIconColor: '#162C51',
  borderWidth: 'thick',
};

export const buttonBorderSizeVariant = {
  none: 'border-[0px]',
  hairline: 'border-[0.5px]',
  thin: 'border-[1px]',
  thick: 'border-[2px]',
  heavier: 'border-[3px]',
  bold: 'border-[4px]',
  extraBold: 'border-[6px]',
  ultraBold: 'border-[8px]',
};

export const buttonColorVariant = {
  default: {
    regular: getTheme('bg-default'),
    outlined: getTheme('bg-white border-default'),
  },
  primary: {
    regular: getTheme('bg-primary'),
    outlined: getTheme('bg-white border-primary'),
  },
  error: {
    regular: getTheme('bg-error'),
    outlined: getTheme('bg-white border-error'),
  },
  danger: {
    regular: getTheme('bg-error'),
    outlined: getTheme('bg-error border-danger'),
  },
  forest: {
    regular: getTheme('bg-forest'),
    outlined: getTheme('bg-forest border-vp-button'),
  },
  'greenish-blue': {
    regular: getTheme('bg-white'),
    outlined: getTheme('bg-white border-primary'),
  },
  transparent: {
    regular: getTheme('bg-transparent'),
    outlined: getTheme('bg-transparent border-white'),
  },
  'jet-black': {
    regular: getTheme('bg-jet-black'),
    outlined: getTheme('bg-white border-jet-black'),
  },
  'fire-engine-red': {
    regular: getTheme('bg-white'),
    outlined: getTheme('bg-white border-fire-engine-red'),
  },
  stroke: {
    regular: getTheme('bg-default'),
    outlined: getTheme('bg-white border-line'),
  },
  'light-gray': {
    regular: getTheme('bg-light-gray'),
    outlined: getTheme('bg-white border-light-silver'),
  },
  navy: {
    regular: getTheme('bg-navy'),
    outlined: getTheme('bg-white border-navy'),
  },
  'dark-teal': {
    regular: getTheme('bg-dark-teal-light'),
    outlined: getTheme('bg-white border-dark-teal-light'),
  },
  'light-teal': {
    regular: getTheme('bg-light-gray'),
    outlined: getTheme('bg-white border-light-silver'),
  },
};

export const textColorVariant = {
  default: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-default'),
  },
  primary: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-primary'),
  },
  error: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-error'),
  },
  danger: {
    regular: getTheme('text-danger'),
    outlined: getTheme('text-danger'),
  },
  forest: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-default'),
  },
  'greenish-blue': {
    regular: getTheme('text-greenish-blue'),
    outlined: getTheme('text-greenish-blue'),
  },
  transparent: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-white'),
  },
  'jet-black': {
    regular: getTheme('text-white'),
    outlined: getTheme('text-jet-black'),
  },
  'fire-engine-red': {
    regular: getTheme('text-fire-engine-red'),
    outlined: getTheme('text-fire-engine-red'),
  },
  stroke: {
    regular: getTheme('text-white'),
    outlined: getTheme('text-default'),
  },
  'light-gray': {
    regular: getTheme('text-navy'),
    outlined: getTheme('text-navy'),
  },
  navy: {
    regular: getTheme('text-light-gray'),
    outlined: getTheme('text-light-gray'),
  },
  'dark-teal': {
    regular: getTheme('text-light-gray'),
    outlined: getTheme('text-light-gray'),
  },
  'light-teal': {
    regular: getTheme('text-dark-teal-light'),
    outlined: getTheme('text-dark-teal-light'),
  },
};

export const Button = (props: ButtonProps) => {
  const {
    title,
    leftIcon,
    rightIcon,
    color,
    outlined,
    border,
    className,
    onPress,
    rounded,
    safeArea,
    ghost,
    iconHeight,
    iconWidth,
    iconColor,
    rightIconColor,
    buttonHeight,
    subTitle,
    borderWidth,
    gapRestrictedArea,
    textContainerStyle,
    truncateTitle = false,
    ...restProps
  } = props;

  const style = outlined ? 'outlined' : 'regular';
  const mergedSafeAreaClassName = clsx(
    buttonColorVariant[color][style],
    rounded && 'rounded',
    ghost && 'border-0 bg-transparent',
  );

  const mergedContainerClassName = clsx(
    `flex flex-row justify-center items-center w-full px-6`,
    buttonColorVariant[color][style],
    style == 'outlined' && buttonBorderSizeVariant[borderWidth!],
    leftIcon && 'justify-start',
    rightIcon && 'justify-between',
    !border && buttonBorderSizeVariant['none'],
    rounded && 'rounded',
    ghost && 'border-0 bg-transparent',
    className,
  );

  const mergedTextClassName = clsx(
    textColorVariant[color][style],
    leftIcon && `ml-${gapRestrictedArea ?? 4} `,
    className,
  );

  const mergedSubTitleTextClassName = clsx(leftIcon && 'ml-4');

  const handleOnPress = (e: any) => {
    Keyboard.dismiss();
    try {
      logButtonClick(title);
      onPress && onPress(e);
    } catch (error) {
      SentryCaptureException(error);
    }
  };

  return (
    <TouchableOpacity
      {...restProps}
      activeOpacity={activeOpacity}
      onPress={handleOnPress}>
      <View
        style={{paddingBottom: safeArea}}
        className={mergedSafeAreaClassName}>
        <View
          className={mergedContainerClassName}
          style={{height: buttonHeight}}>
          <View className={`flex-row`}>
            {leftIcon && (
              <Icon
                type={leftIcon}
                width={iconWidth}
                height={iconHeight}
                color={iconColor}
              />
            )}
            <View className={textContainerStyle || 'flex-column'}>
              <Text
                weight={'medium'}
                className={mergedTextClassName}
                numberOfLines={truncateTitle ? 1 : undefined}
                ellipsizeMode={truncateTitle ? 'tail' : undefined}>
                {title}
              </Text>
              {subTitle && (
                <Text
                  weight={'regular'}
                  size="C1"
                  className={mergedSubTitleTextClassName}
                  color="subtitle-muted">
                  {subTitle}
                </Text>
              )}
            </View>
          </View>
          {rightIcon && (
            <Icon
              type={rightIcon}
              width={iconWidth}
              height={iconHeight}
              color={rightIconColor}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

Button.defaultProps = defaultProps;
