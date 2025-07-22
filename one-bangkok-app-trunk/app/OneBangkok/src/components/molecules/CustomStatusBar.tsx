import React from 'react';
import {View, StatusBar, StatusBarProps, StyleSheet} from 'react-native';

interface CustomStatusBarProps extends StatusBarProps {
  backgroundColor?: string;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  backgroundColor,
  ...props
}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const styles = StyleSheet.create({
  statusBar: {
    height: StatusBar.currentHeight,
  },
});

export default CustomStatusBar;