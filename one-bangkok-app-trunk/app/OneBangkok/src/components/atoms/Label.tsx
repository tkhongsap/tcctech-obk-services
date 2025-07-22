import React from 'react';
import {
  Text as OriginalText,
  TextProps as OrginalTextProps,
} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

export interface LabelProps extends OrginalTextProps {
  variant?: 'default' | 'error' | undefined;
  text: string;
}

export const Label = (props: LabelProps) => {
  const {className, text, ...restProps} = props;
  const variant = {
    default: getTheme('text-default text-base text-black font-obRegular'),
    error: getTheme('text-error font-obRegular'),
  };

  const mergedClassName = `${variant.default} ${className} ${
    variant[props.variant ?? 'default']
  }`;

  return (
    <OriginalText {...restProps} className={mergedClassName}>
      {text}
    </OriginalText>
  );
};
