import {omit} from 'lodash';
import React, {useEffect, useState} from 'react';

import {View, TextInput} from 'react-native';

import {Colors} from '~/constants';
import getTheme from '~/utils/themes/themeUtils';

const validators: Record<string, any> = {
  isNotEmpty: (value: string) => value.length > 0,
  isEmail: (value: string) => value.isEmail(),
};

export const CustomTextInput = (props: any) => {
  const [isValid, setIsValid] = useState(false);

  const {onChange, onValidate, rules, containerClass, inputClass, isError} =
    props;
  const textInputProps = omit(props, ['containerClass', 'inputClass', 'rules']);

  const handleOnChangeText = (text: string) => {
    onChange ? onChange(text) : null;
    if (text) {
      rules
        ? setIsValid(
            rules.reduce((acc: boolean, rule: string) => {
              return acc && validators[rule](text);
            }, true),
          )
        : null;
    }
  };

  useEffect(() => {
    onValidate ? onValidate(isValid) : null;
  }, [isValid, onValidate]);

  return (
    <View>
      <View
        className={getTheme(
          `w-full p-4 border rounded border-zinc-600 bg-default ${containerClass} ${
            isError ? 'border-red-500' : ''
          }`,
        )}>
        <TextInput
          {...textInputProps}
          className={getTheme(`text-[16px] text-default ${inputClass}`)}
          placeholderTextColor={Colors.black40}
          onChangeText={handleOnChangeText}
        />
      </View>
    </View>
  );
};
