import {View, StyleSheet} from 'react-native';
import React from 'react';

type Props = {
  width?: number | string;
  height?: number | string;
  flex?: number | null;
};

export default function OBSpacing({width = 0, height = 0, flex}: Props) {
  const styles = StyleSheet.create({
    root: {
      width: width,
      height: height,
    },
  });
  return <View style={[styles.root, flex != null ? {flex} : null]} />;
}
