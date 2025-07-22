import React, {useState} from 'react';
import {DimensionValue, StyleSheet} from 'react-native';
import FastImage, {ResizeMode} from 'react-native-fast-image';
import {horizontalScale} from '~/utils/metrics';

export interface ImageBackgroundProps {
  url?: string;
  children?: any;
  defaultImage?: number;
  width?: DimensionValue | undefined;
  height?: DimensionValue | undefined;
  resizeMode: ResizeMode | undefined;
}

const defaultProps: ImageBackgroundProps = {
  defaultImage: 0,
  width: '100%',
  height: '100%',
  resizeMode: FastImage.resizeMode.cover,
};

export const ImageBackground = (props: ImageBackgroundProps) => {
  const {children, url, defaultImage, resizeMode} = props;
  const [isError, setIsError] = useState(false);

  const onError = () => setIsError(true);

  return (
    <FastImage
      style={[
        {
          width: '100%',
          height: '100%',
        },
      ]}
      source={url && !isError ? {uri: url} : defaultImage}
      resizeMode={resizeMode}
      onError={onError}>
      {children}
    </FastImage>
  );
};

ImageBackground.defaultProps = defaultProps;
