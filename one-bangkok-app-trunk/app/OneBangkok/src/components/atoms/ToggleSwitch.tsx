import {View} from 'react-native';
import React from 'react';
import {Switch as RNSwitch} from 'react-native-switch';
import t from '~/utils/text';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
}

export default function Switch({value, onValueChange, disabled}: SwitchProps) {
  return (
    <View>
      <RNSwitch
        value={value}
        disabled={disabled}
        activeText={t('General__On', 'ON')}
        inActiveText={t('General__Off', 'OFF')}
        backgroundActive={'#014541'}
        backgroundInactive={'#7C7C7C'}
        circleActiveColor={'#FDFDFD'}
        circleInActiveColor={'#FDFDFD'}
        onValueChange={onValueChange}
        activeTextStyle={{fontFamily: 'OneBangkok-Medium', fontSize: 10}}
        inactiveTextStyle={{fontFamily: 'OneBangkok-Medium', fontSize: 10}}
        circleSize={25}
        changeValueImmediately={true}
        switchLeftPx={5}
        switchRightPx={5}
      />
    </View>
  );
}
