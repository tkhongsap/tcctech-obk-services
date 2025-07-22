import React from 'react';
import {GestureResponderEvent, StyleSheet} from 'react-native';
import CustomButton from './CustomButton';

type Props = {
  SvgSource: any;
  width?: number;
  height?: number;
  onPress?: (event: GestureResponderEvent) => void;
  color?: string;
};

const SvgButton = ({width, height, onPress, color, SvgSource}: Props) => {
  return (
    <CustomButton
      style={[
        styles.button,
        {
          width: width ?? 24,
          height: height ?? 24,
        },
      ]}
      onPress={onPress}>
      <SvgSource width={width ?? 24} height={height ?? 24} fill={color} />
    </CustomButton>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
});

export default SvgButton;
