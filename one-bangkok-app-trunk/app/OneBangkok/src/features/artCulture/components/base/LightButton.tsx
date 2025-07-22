import React from 'react';
import {Pressable} from 'react-native';
import {Text} from '~/components/atoms';

interface ILightButton {
  children: React.ReactNode;
  onPress?: () => void;
}

const LightButton = ({children, onPress}: ILightButton) => {
  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      className="w-full bg-muted-50-light border border-line-light py-3 px-4"
      onPress={() => handleOnPress()}>
      <Text className="text-center font-obMedium">{children}</Text>
    </Pressable>
  );
};

export default LightButton;
