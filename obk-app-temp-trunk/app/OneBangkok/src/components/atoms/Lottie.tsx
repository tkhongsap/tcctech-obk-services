import React from 'react';
import Lottie from 'lottie-react-native';

import Loading from '~/assets/animations/ob-loading-spinner.json';
import LoadingWhite from '~/assets/animations/ob-loading-spinner-white.json';
import {StyleProp, ViewStyle} from 'react-native';

export const lottieTypes = {
  loading: Loading,
  loadingWhite: LoadingWhite,
};

export type LottieTypes = keyof typeof lottieTypes;

export interface LottieProps {
  type: LottieTypes;
  autoPlay?: boolean;
  loop?: boolean;
  styles?: StyleProp<ViewStyle> | null;
}

const defaultProps: LottieProps = {
  type: 'loading',
  autoPlay: true,
  loop: true,
  styles: null,
};

export const LottieComponent = (props: LottieProps) => {
  const {type, autoPlay, loop, styles} = props;
  const LottieType = lottieTypes[type];

  return (
    <Lottie
      source={LottieType}
      autoPlay={autoPlay}
      loop={loop}
      style={styles}
    />
  );
};

LottieComponent.defaultProps = defaultProps;
