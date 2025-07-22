import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LottieComponent} from '~/components/atoms/Lottie';
import {bookingState} from '../state/booking';
import {useHookstate} from '@hookstate/core';

const Loading = () => {
  const {loading} = useHookstate(bookingState);
  return loading?.value ? (
    <View style={styles.container}>
      <LottieComponent styles={styles.loading} type="loading" />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff97',
  },
  loading: {
    height: 50,
  },
});

export default Loading;
