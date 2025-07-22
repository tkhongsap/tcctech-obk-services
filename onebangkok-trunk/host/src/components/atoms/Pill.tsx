import React from 'react';
import {
  Text as OriginalText,
  TextProps as OrginalTextProps,
  View,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

export interface PillProps extends OrginalTextProps {
  variant?: 'default' | 'muted' | 'navy' | undefined;
  text: string;
}

export const Pill = (props: PillProps) => {
  const {className, text, ...restProps} = props;
  const variant = {
    default: getTheme('bg-muted-800'),
    muted: getTheme('bg-muted-400'),
    navy: getTheme('bg-navy'),
  };

  const mergedClassName = `px-[12px] py-[2px] flex flex-col items-center justify-center ${
    variant.default
  } ${className} ${variant[props.variant ?? 'default']}`;

  return (
    <View {...restProps} className={mergedClassName}>
      <OriginalText className="pb-[2px] text-white">{text}</OriginalText>
    </View>
  );
};
