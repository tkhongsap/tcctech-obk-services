import React, {useMemo} from 'react';
import {StyleProp, TextStyle, Animated, ViewStyle} from 'react-native';
import styles from './WheelPicker.styles';
import {Text} from '~/components/atoms';

interface ItemProps {
  textStyle: StyleProp<TextStyle>;
  style: StyleProp<ViewStyle>;
  option: string | null;
  height: number;
  index: number;
  currentScrollIndex: Animated.AnimatedAddition;
  visibleRest: number;
  rotationFunction: (x: number) => number;
  opacityFunction: (x: number) => number;
  scaleFunction: (x: number) => number;
}

const WheelPickerItem: React.FC<ItemProps> = ({
  textStyle,
  style,
  height,
  option,
  index,
  visibleRest,
  currentScrollIndex,
  opacityFunction,
  rotationFunction,
  scaleFunction,
}) => {
  const relativeScrollIndex = Animated.subtract(index, currentScrollIndex);

  const translateY = useMemo(
    () =>
      relativeScrollIndex.interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            let y =
              (height / 2) * (1 - Math.sin(Math.PI / 2 - rotationFunction(i)));
            for (let j = 1; j < i; j++) {
              y += height * (1 - Math.sin(Math.PI / 2 - rotationFunction(j)));
            }
            range.unshift(y);
            range.push(-y);
          }
          return range;
        })(),
      }),
    [],
  );

  const opacity = useMemo(
    () =>
      relativeScrollIndex.interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = [1];
          for (let x = 1; x <= visibleRest + 1; x++) {
            const y = opacityFunction(x);
            range.unshift(y);
            range.push(y);
          }
          return range;
        })(),
      }),
    [],
  );

  const scale = useMemo(
    () =>
      relativeScrollIndex.interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = [1.0];
          for (let x = 1; x <= visibleRest + 1; x++) {
            const y = scaleFunction(x);
            range.unshift(y);
            range.push(y);
          }
          return range;
        })(),
      }),
    [],
  );

  const rotateX = useMemo(
    () =>
      relativeScrollIndex.interpolate({
        inputRange: (() => {
          const range = [0];
          for (let i = 1; i <= visibleRest + 1; i++) {
            range.unshift(-i);
            range.push(i);
          }
          return range;
        })(),
        outputRange: (() => {
          const range = ['0deg'];
          for (let x = 1; x <= visibleRest + 1; x++) {
            const y = rotationFunction(x);
            range.unshift(`${y}deg`);
            range.push(`${y}deg`);
          }
          return range;
        })(),
      }),
    [],
  );

  return (
    <Animated.View
      style={[
        styles.option,
        style,
        {height, opacity, transform: [{translateY}, {rotateX}, {scale}]},
      ]}>
      <Text color='dark-gray' style={textStyle}>{option}</Text>
    </Animated.View>
  );
};

export default WheelPickerItem;
