import React from 'react';
import {
  Text as OriginalText,
  TextProps as OrginalTextProps,
} from 'react-native';
import clsx from 'clsx';

import getTheme from '~/utils/themes/themeUtils';

export interface HelperTextProps extends OrginalTextProps {
  variant?: 'default' | 'error' | undefined;
  text: string;
  error?: boolean;
}

const defaultProps: HelperTextProps = {
  variant: 'default',
  text: '',
  error: false,
};

export const HelperText = (props: HelperTextProps) => {
  props = {...defaultProps, ...props};
  const {className, text, error, ...restProps} = props;
  const variants = {
    default: getTheme('text-default text-sm font-obRegular'),
    error: getTheme('text-error font-obRegular'),
  };

  const mergedClassName = clsx(
    variants.default,
    className,
    error ? variants.error : null,
  );

  return (
    <OriginalText {...restProps} className={mergedClassName}>
      {text}
    </OriginalText>
  );
};
