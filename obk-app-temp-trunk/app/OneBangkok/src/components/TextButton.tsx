import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React, {ReactElement} from 'react';
import IconButton from '../components/IconButton';
import OBSpacing from '../components/OBSpacing';
import s from '../constants/Styles';
import CustomButton from './CustomButton';
import {Colors} from '../constants/Colors';

type Props = {
  text: string;
  width: number;
  height: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  textColor?: string;
  onPress?: Function;
};

const TextButton = ({
  text,
  width,
  height,
  backgroundColor,
  borderColor,
  textColor,
  borderWidth,
  onPress,
}: Props) => {
  textColor = textColor ?? Colors.white100;
  borderWidth = borderWidth ?? 0;

  return (
    <CustomButton onPress={onPress}>
      <View
        style={{
          width,
          height,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[s.textB1Medium, {color: textColor}]}>{text}</Text>
      </View>
    </CustomButton>
  );
};

const styles = StyleSheet.create({});

export default TextButton;
