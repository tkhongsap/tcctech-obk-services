import React from 'react';

import {TextField, TextFieldProps} from '~/components/molecules';
import t from '~/utils/text';

export interface EmailFieldProps extends TextFieldProps {}

export const EmailField = (props: EmailFieldProps) => {
  const {onChangeText} = props;

  const handleOnChangeText = (text: string) => {
    onChangeText && onChangeText(text);
  };

  return (
    <TextField
      {...props}
      autoCorrect={false}
      autoCapitalize="none"
      keyboardType="email-address"
      placeholder={t('General__Your_email_domain', 'youremail@domain')}
      onChangeText={handleOnChangeText}
    />
  );
};
