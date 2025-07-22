import React, {useEffect, useState} from 'react';
import {Dimensions, Image} from 'react-native';

export default function ImageScale(props: {sUri: string; nMargin: number}) {
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

  return (
    nHeight > 0 && (
      <Image
        source={{
          uri: props.sUri,
        }}
        style={{width: nWidth, height: nHeight}}
      />
    )
  );
}
