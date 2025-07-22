import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import React, {useState} from 'react';
import t from '~/utils/text';

const InputTextDate = () => {
  const [text, setText] = useState('');
  return (
    <View className="w-full flex flex-row justify-between">
        <View className="flex flex-col items-start">
          <Text className="mb-[8px]">{t('Residential__Amenity_Booking__Start', 'Start')}</Text>
          <TextInput
            style={[
              styles.input,
              text === '' ? styles.placeholderText : styles.normalText,
            ]}
            placeholder="10:00"
            placeholderTextColor={'#989898'}
            value={text}
            onChangeText={setText}
            multiline={true}
          />
        </View>

        <View className="flex flex-col items-start">
          <Text className="mb-[8px]">{t('Residential__Amenity_Booking__End', 'End')}</Text>
          <TextInput
            style={[
              styles.input,
              text === '' ? styles.placeholderText : styles.normalText,
            ]}
            placeholder="11:00"
            placeholderTextColor={'#989898'}
            value={text}
            onChangeText={setText}
            multiline={true}
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 148,
    height: 48,
    borderColor: '#777777',
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
  },
  placeholderText: {
    fontStyle: 'normal',
  },
  normalText: {
    fontStyle: 'normal',
  },
});

export default InputTextDate;
