import React, {useState, useRef, createRef} from 'react';
import {View, Animated, ImageStyle, ImageSourcePropType} from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';

type Props = {
  uri?: string;
  source?: ImageSourcePropType;
  styles: ImageStyle;
  imgClass?: string;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

const ImageZoom = ({
  uri,
  source,
  styles,
  imgClass = '',
  onLoadStart = () => {},
  onLoadEnd = () => {},
}: Props) => {
  const [panEnabled, setPanEnabled] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale},
      },
    ],
    {useNativeDriver: true},
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const handlePinchStateChange = ({
    nativeEvent,
  }: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setPanEnabled(false);
      }
    }
  };

  return (
    <View>
      {(uri || source) && (
        <PanGestureHandler
          onGestureEvent={onPanEvent}
          ref={panRef}
          simultaneousHandlers={[pinchRef]}
          enabled={panEnabled}
          failOffsetX={[-1000, 1000]}
          shouldCancelWhenOutside>
          <Animated.View>
            <PinchGestureHandler
              ref={pinchRef}
              onGestureEvent={onPinchEvent}
              simultaneousHandlers={[panRef]}
              onHandlerStateChange={handlePinchStateChange}>
              <Animated.Image
                className={imgClass}
                source={uri ? {uri} : source!}
                style={{
                  transform: [{scale}, {translateX}, {translateY}],
                  ...styles,
                }}
                resizeMode="contain"
                onLoadStart={onLoadStart}
                onLoadEnd={onLoadEnd}
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

export default ImageZoom;
