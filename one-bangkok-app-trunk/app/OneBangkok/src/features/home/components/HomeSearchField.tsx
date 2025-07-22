import React from 'react';
import {View} from 'react-native';

import {TextField, TextFieldProps} from '~/components/molecules';
import T from '~/utils/text';
import {Icon} from '~/components/atoms';

export interface HomeSearchFieldProps extends TextFieldProps {}

export const HomeSearchField = (props: HomeSearchFieldProps) => {
  const {onChangeText} = props;

  const handleOnChangeText = (text: string) => {
    onChangeText && onChangeText(text);
  };

  return (
    <View className="justify-center">
      <TextField
        {...props}
        className="h-[52px] pl-[52px]"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="default"
        placeholder={T(
          'HomeScreen__search_placeholder',
          'What would you like to do?',
        )}
        onChangeText={handleOnChangeText}
      />
      <View className="absolute pl-6">
        <Icon type={'search'} width={20} height={20} color={'#000000'} />
      </View>
    </View>
  );
};
