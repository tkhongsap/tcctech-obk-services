import React, { useEffect, useMemo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import clsx from 'clsx';

interface PaginationProps {
  numberOfIndicators: number;
  activeIndex: number;
}

const Pagination = ({ numberOfIndicators, activeIndex }: PaginationProps) => {
  const animations = useMemo(() => {
    return Array.from({ length: numberOfIndicators }, () => new Animated.Value(0));
  }, [numberOfIndicators]);

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: activeIndex === index ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [activeIndex, animations]);

  return (
    <View className={getTheme('flex flex-row justify-center items-center mt-2')}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.indicator,
            {
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1], // Smooth transition for opacity
              }),
              backgroundColor: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ccc', '#014541'],
              }),
            },
          ]}
          className={clsx('mx-1.5 rounded-full',
            getTheme(activeIndex === index ? 'w-2 h-2' : 'w-1.5 h-1.5')
          )}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderRadius: 9999,
    marginHorizontal: 4,
  },
});

export default Pagination;