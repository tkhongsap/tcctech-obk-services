import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';

const YesNoSelection = () => {
  const [displayTime, setDisplayTime] = useState('');
  const renderDaytimeButton = (text: string, time: string) => {
    const onPress = () => {
      setDisplayTime(time);
    };
    return (
      <TouchableOpacity
        className="flex flex-row items-center justify-center"
        onPress={onPress}>
        <Text
          style={[
            {
              textAlign: 'center',
              paddingVertical: 5,
            },
            displayTime === time
              ? styles.buttonTimeOnActive
              : styles.buttonTimeInActive,
          ]}
          className="font-obMedium min-w-[104px] px-4 border border-line-light">
          {text}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      className="flex flex-row items-center justify-center"
      style={{gap: 10}}>
      {renderDaytimeButton('No', 'no')}
      {renderDaytimeButton('Yes', 'yes')}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonTimeInActive: {
    backgroundColor: 'white',
    color: '#292929',
  },
  buttonTimeOnActive: {
    backgroundColor: '#014541',
    color: 'white',
  },
});
export default YesNoSelection;
