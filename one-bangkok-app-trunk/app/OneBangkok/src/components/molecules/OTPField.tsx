import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {TextField, TextFieldProps} from '~/components/molecules';
import t from '~/utils/text';

export interface OTPFieldProps extends TextFieldProps {}

export const OTPField = (props: OTPFieldProps) => {
  const {
    onChangeText,
    onFocus,
    error: _error,
    helperText: _helperText,
    ...restProps
  } = props;
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [otp, setOtp] = useState('');
  useEffect(() => {
    setError(_error || false);
    setHelperText(_helperText || '');
  }, [_error, _helperText]);

  const removeNonNumeric = (text: string) => {
    return text.replace(/\D/g, '');
  };
  const handleOnChangeText = (text: string) => {
    const number = removeNonNumeric(text);
    setOtp(number);
    onChangeText && onChangeText(number);
  };

  const handleOnFocus = (e: any) => {
    setError(false);
    onFocus && onFocus(e);
  };

  return (
    <>
      <View className="flex flex-col">
        <TextField
          {...restProps}
          autoCorrect={false}
          keyboardType="number-pad"
          placeholder={t('ConfirmIdentifierForm__otp_placeholder', '123456')}
          onChangeText={handleOnChangeText}
          error={error}
          className="tracking-[10px] h-[48px] justify-center text-center items-center text-2xl leading-8"
          style={{paddingTop: 0, paddingBottom: 0}}
          onFocus={handleOnFocus}
          value={otp}
          helperText={helperText}
          maxLength={6}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
        />
      </View>
    </>
  );
};
