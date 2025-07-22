/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

export default function FastImageScale(
  props: Readonly<{
    sUri?: string;
    nHeight?: number;
    nWidth?: number;
    nMargin: number;
    chlidren?: any;
  }>,
) {
  const [nHeight, setNHeight] = useState(0);
  let nWidth = Dimensions.get('window').width - props.nMargin;

  useEffect(() => {
    if (props.sUri && nWidth) {
      Image.getSize(
        props.sUri,
        (width, height) => {
          setNHeight(height * (nWidth / width));
        },
        err => console.log('err', err),
      );
    }
  }, [nWidth, props.sUri]);

  return nHeight ? (
    <FastImage
      source={{
        uri: props.sUri,
        priority: FastImage.priority.low,
      }}
      resizeMode="stretch"
      style={{
        width: props.nWidth ?? nWidth,
        height: props.nHeight ?? nHeight,
      }}>
      {props.chlidren}
    </FastImage>
  ) : (
    <FastImage
      source={{
        uri: '',
        priority: FastImage.priority.low,
      }}
      resizeMode="stretch"
      style={{
        width: nWidth,
        height: 400,
      }}>
      <View className="absolute bottom-[0] w-full" style={{height: 400}}>
        <LinearGradient
          colors={['rgba(255,255,255, 0.5)', 'rgba(0,0,0, 0.5)']}
          style={{flex: 1}}
        />
      </View>
    </FastImage>
  );
}
