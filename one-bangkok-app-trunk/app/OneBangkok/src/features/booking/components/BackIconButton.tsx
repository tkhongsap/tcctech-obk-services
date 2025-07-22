import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Icon} from '~/components/atoms/Icon';

type BackIconButtonProps = {
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
};

const BackIconButton = (props: BackIconButtonProps) => {
  const {style, size = 25, color = 'white'} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => navigation.goBack()}>
      <View>
        <Icon
          width={size}
          height={size}
          type="back"
          color={color}
          rotation={0}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackIconButton;
