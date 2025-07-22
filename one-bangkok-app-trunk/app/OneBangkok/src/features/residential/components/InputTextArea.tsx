import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import React, {useState} from 'react';
import t from '~/utils/text';

const InputTextArea = () => {
    const [text, setText] = useState('');
  return (
    <View className="item flex flex-col space-y-1">
    <Text color="dark-gray" size="B1" weight="regular">
    {t('Residential__Maintenance__Description', 'Description')}
    </Text>
    <TextInput
      style={[
        styles.input,
        text === '' ? styles.placeholderText : styles.normalText,
      ]}
      placeholder={t('Residential__Maintenance__Maintenance_Description_Example', 'Example: Add more details and specify date and time')}
      placeholderTextColor={'#989898'}
      value={text}
      onChangeText={setText}
      multiline={true}
    />
  </View>
  )
}


const styles = StyleSheet.create({
    input: {
      height: 205,
      borderColor: '#777777',
      borderWidth: 1,
      fontSize: 16,
      padding: 16,
      textAlignVertical: 'top',
    },
    placeholderText: {
      fontStyle: 'italic',
    },
    normalText: {
      fontStyle: 'normal',
    },
  });

export default InputTextArea