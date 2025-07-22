import React from 'react';
import {Platform, Text as RNText, TextProps as RNTextProps} from 'react-native';
import clsx from 'clsx';

import getTheme from '~/utils/themes/themeUtils';

export const textSizeVariant = {
  H1: getTheme('text-[32px]'),
  H2: getTheme('text-[28px]'),
  H3: getTheme('text-2xl'),
  H4: getTheme('text-xl'),
  H5: getTheme('text-[40px]'),
  B1: getTheme('text-base'),
  B2: getTheme('text-sm'),
  C1: getTheme('text-xs'),
  N1: getTheme('text-2xl'),
};

export const textWeightVariant = {
  regular: getTheme('font-obRegular'),
  medium: getTheme('font-obMedium'),
  bold: getTheme('font-obBold'),
};

export const textColorVariant = {
  default: getTheme('text-default'),
  'default-inverse': getTheme('text-default-inverse'),
  primary: getTheme('text-primary'),
  muted: getTheme('text-muted'),
  success: getTheme('text-success'),
  error: getTheme('text-error'),
  subtitle: getTheme('text-subtitle'),
  'subtitle-muted': getTheme('text-subtitle-muted'),
  cascade: getTheme('text-cascade'),
  'mist-gray-700': getTheme('text-mist-gray-700'),
  'vp-pass-desc': getTheme('text-vp-pass-desc'),
  'vp-pass-date': getTheme('text-vp-pass-date'),
  'muted-400': getTheme('text-muted-400'),
  'puerto-rico-700': getTheme('text-puerto-rico-700'),
  danger: getTheme('text-danger'),
  'pizazz-600': getTheme('text-pizazz-600'),
  'sky-blue': getTheme('text-sky-blue'),
  'dark-red': getTheme('text-dark-red'),
  'dark-gray': getTheme('text-dark-gray'),
  'jet-black': getTheme('text-jet-black'),
  'fire-engine-red': getTheme('text-fire-engine-red'),
  'dark-teal': getTheme('text-dark-teal'),
  orange: getTheme('text-orange'),
  line: getTheme('text-line'),
};

export interface TextProps extends RNTextProps {
  size: keyof typeof textSizeVariant;
  weight: keyof typeof textWeightVariant;
  color: keyof typeof textColorVariant;
}

const defaultProps: TextProps = {
  size: 'B1',
  weight: 'regular',
  color: 'jet-black',
};

export const Text = (props: TextProps) => {
  const {className, children, size, weight, color, ...restProps} = props;
  const mergedClassName = clsx(
    textSizeVariant[size],
    textWeightVariant[weight],
    textColorVariant[color],
    className,
  );

  return (
    <RNText {...restProps} className={mergedClassName}>
      {children}
    </RNText>
  );
};

Text.defaultProps = defaultProps;
