import React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import CustomButton from './CustomButton';

type Props = {
  imageSource: ImageSourcePropType;
  width?: number;
  height?: number;
  onPress?: (event: GestureResponderEvent) => void;
  color?: string;
};

const IconButtonWithImage = ({
  color,
  width,
  height,
  imageSource,
  onPress,
}: Props) => {
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
      <Image
        source={imageSource}
        style={[
          styles.icon,
          {
            width: width ?? 24,
            height: height ?? 24,
          },
          color != null ? {tintColor: color} : null,
        ]}
      />
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

export default IconButtonWithImage;
