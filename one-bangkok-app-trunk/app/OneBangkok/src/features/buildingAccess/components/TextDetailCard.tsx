import {View} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';

const TextDetailCard = ({label, text}: {label?: string; text: string}) => {
  return (
    <View>
      {label && (
        <Text size="C1" color="muted-400">
          {label}
        </Text>
      )}
      <Text>{text}</Text>
    </View>
  );
};

export default TextDetailCard;
