import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import t from '~/utils/text';
import {Text, Icon} from '~/components/atoms';
import IconArrow from '../../../assets/icons/icon_arrow-right.svg';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface ElevatorSlideButtonProps {
  onActive?: (isActive: boolean) => void;
  unlockedStatus?: boolean;
}

const ElevatorSlideButton: React.FC<ElevatorSlideButtonProps> = ({
  onActive,
  unlockedStatus,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const arrowOpacity = useRef(new Animated.Value(1)).current; // Add Animated value for opacity
  const [isActivated, setIsActivated] = useState(unlockedStatus);

  useEffect(() => {
    if (unlockedStatus) {
      setIsActivated(true);
      pan.setValue({x: SCREEN_WIDTH - 70, y: 0});
      arrowOpacity.setValue(0);
    } else {
      setIsActivated(false);
      pan.setValue({x: 0, y: 0});
      arrowOpacity.setValue(1);
    }
  }, [unlockedStatus]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(
          e,
          gestureState,
        );
        if (gestureState.dx > SCREEN_WIDTH * 0.7) {
          Animated.timing(arrowOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.7) {
          Animated.timing(pan, {
            toValue: {x: SCREEN_WIDTH - 70, y: 0},
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setIsActivated(true);
            onActive && onActive(true);
          });
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(arrowOpacity, {
              toValue: 1,
              // duration: 200,
              useNativeDriver: false,
            }).start();
            setIsActivated(false);
          });
        }
      },
    }),
  ).current;

  const trackFillWidth = pan.x.interpolate({
    inputRange: [0, SCREEN_WIDTH - 70],
    outputRange: [0, SCREEN_WIDTH - 40],
    extrapolate: 'clamp',
  });

  return (
    <View className="p-0">
      <View style={styles.track} className="p-0">
        <Animated.View style={[styles.trackFill, {width: trackFillWidth}]} />
        <Text style={styles.text} weight="bold">
          {t(
            'Residential__Elevator__General__Slide_to_call_elevator',
            'Slide to Call Elevator',
          )}
        </Text>
        <Animated.View
          style={[styles.slider, {transform: [{translateX: pan.x}]}]}
          {...panResponder.panHandlers}>
          <Animated.View style={{opacity: arrowOpacity}}>
            <IconArrow />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  track: {
    width: SCREEN_WIDTH - 32,
    height: 56,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    backgroundColor: '#DCDCDC',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#014541',
    position: 'absolute',
    left: 0,
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 16,
    color: '#014541',
  },
  slider: {
    width: 56,
    height: 56,
    backgroundColor: '#014541',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#014541',
    fontSize: 18,
  },
});

export default ElevatorSlideButton;
