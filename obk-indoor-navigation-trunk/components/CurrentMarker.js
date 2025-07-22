import { useRef, useEffect } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  markerWrap: {
    width: 100,
    height: 100,
  },
  marker: {
    position: "absolute",
    left: 40,
    top: 40,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0, 102, 204,0.9)",
  },
  ring: {
    width: 100,
    height: 100,
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 100,
    backgroundColor: "rgba(0, 102, 204,0.3)",
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204,0.5)",
    opacity: 1,
  },
});

export const CurrentMarker = () => {
  const scaleAnimationRef = useRef(new Animated.Value(0)).current;
  const opacityAnimationRef = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scaleAnimationRef, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [scaleAnimationRef]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(opacityAnimationRef, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [opacityAnimationRef]);

  return (
    <View style={styles.markerWrap}>
      <Animated.View
        style={[
          styles.ring,
          { opacity: opacityAnimationRef },
          { transform: [{ scale: scaleAnimationRef }] },
        ]}
      />
      <View style={styles.marker} />
    </View>
  );
};

