import React from 'react';
import {View, StyleSheet} from 'react-native';

export interface SpacingProps {
  width?: number | string;
  height?: number | string;
  flex?: number | null;
  className?: string;
}

const defaultProps = {
  width: 0,
  height: 0,
  flex: null,
};

export const Spacing = (props: SpacingProps) => {
  const {width, height, flex, className} = props;
  const styles = StyleSheet.create({
    root: {
      width: width,
      height: height,
    },
  });
  return (
    <View
      style={[styles.root, flex != null ? {flex} : null]}
      className={className}
    />
  );
};

Spacing.defaultProps = defaultProps;
