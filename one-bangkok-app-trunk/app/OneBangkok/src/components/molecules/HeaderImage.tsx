import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {horizontalScale} from '~/utils/metrics';

export interface HeadTextProps {
  defaultImage?: number;
  children?: any;
}

const defaultProps: HeadTextProps = {
  defaultImage: 0,
};

export const HeaderImage = (props: HeadTextProps) => {
  const {defaultImage, children} = props;
  const hasHeader = children[0]?.type?.name === 'Header';

  return (
    <FastImage
      source={defaultImage}
      defaultSource={defaultImage}
      style={[
        {
          width: '100%',
          height: 250,
        },
        hasHeader && styles.header,
      ]}>
      {children}
    </FastImage>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    paddingBottom: horizontalScale(32),
  },
});

HeaderImage.defaultProps = defaultProps;
