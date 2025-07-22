import {Switch, View} from 'react-native';
import React from 'react';

type Props = {
  enabled: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
};

export function OBSwitch({enabled, onValueChange, disabled}: Props) {
  return (
    <View className="border border-zinc-800 bg-neutral-700 rounded-[100px] w-[32px] h-[21px] justify-center items-center">
      <Switch
        disabled={disabled}
        ios_backgroundColor={'#00000000'}
        value={enabled}
        style={{transform: [{scaleX: 0.55}, {scaleY: 0.55}]}}
        thumbColor={'#FFFFFF'}
        trackColor={{true: '#1E8DF2', false: '#3F3F3F'}}
        onValueChange={onValueChange}
      />
    </View>
  );
}
