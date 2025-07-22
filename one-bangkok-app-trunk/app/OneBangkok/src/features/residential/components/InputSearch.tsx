import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon, Spacing, Text, TextInput} from '~/components/atoms';

const InputSearch = () => {
  return (
    <View
      className="bg-[#ffffff] w-full px-4 flex flex-col"
      style={{gap: 4}}>
      <Text size="B1" weight="regular" color="dark-gray">
        Name
      </Text>
      <View className="relative w-full">
        <TextInput className="h-[48px]" />
        <TouchableOpacity className="absolute top-[14px] right-3">
          <Icon type={'close'} width={12} height={12} color={'#7C7C7C'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputSearch;
