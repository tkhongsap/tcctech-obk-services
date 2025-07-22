import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useLoadingState} from '~/states/loadingState';
import {LottieComponent, lottieTypes} from '../atoms/Lottie';

const Loading = ({
  isLoading,
  type,
}: {
  isLoading: boolean;
  type?: keyof typeof lottieTypes;
}) => {
  const {isShowing} = useLoadingState();

  return (
    <>
      {(isShowing.value || isLoading) && (
        <View className="w-12 h-full absolute">
          <LottieComponent styles={styles.loading} type={type} />
        </View>
      )}
    </>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
