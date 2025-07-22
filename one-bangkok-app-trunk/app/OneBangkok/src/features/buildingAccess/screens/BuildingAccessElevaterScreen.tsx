import React, {useCallback, useEffect, useRef} from 'react';
import {Header, modalActions} from '~/components/molecules';
import {Animated, Easing, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import t from '~/utils/text';
import {logScreenView} from '~/utils/logGA';

interface BuildingAccessElevaterScreenProps {
  floor: string;
  lift: string;
}

const BuildingAccessElevaterScreen = (
  props: BuildingAccessElevaterScreenProps,
) => {
  const {floor, lift} = props;
  const insets = useSafeAreaInsets();

  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotation = useCallback(() => {
    rotateValue.setValue(3); // Set the initial value to 3 degrees
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: -4, // Animate to -3 degrees
        duration: 1000, // Adjust the duration as needed
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(rotateValue, {
        toValue: 4, // Animate back to 3 degrees
        duration: 1000, // Adjust the duration as needed
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => startRotation());
  }, [rotateValue]);

  useEffect(() => {
    startRotation();
  }, [startRotation]);

  const rotation = rotateValue.interpolate({
    inputRange: [-4, 4],
    outputRange: ['-3deg', '3deg'],
  });
  useEffect(() => {
    logScreenView('BuildAccessElevaterScreen');
  }, []);
  return (
    <View
      className="w-max flex items-center"
      style={{paddingBottom: insets.bottom}}>
      <Header
        leftAction="close"
        onPressLeftAction={() => {
          modalActions.hide();
        }}
        withPadding={false}
      />
      <Spacing height={30} />
      <Animated.View style={[{transform: [{rotate: rotation}]}]}>
        <View className="w-72 h-40  bg-[#394c46] transform items-center justify-center rounded-md flex flex-row  space-x-4">
          <View className=" flex-column">
            <Text
              className="text-center"
              color="default-inverse"
              size="B1"
              weight="medium">
              {t('General__Wait_for_elevator', 'Wait for elevator')}
            </Text>
            <Text className="text-center" color="default-inverse" size="H1">
              {lift}
            </Text>
          </View>
          <View className=" flex-column">
            <Text
              className="text-center"
              color="default-inverse"
              size="B1"
              weight="medium">
              {t('General__Destination_floor', 'Destination floor')}
            </Text>
            <Text className="text-center" color="default-inverse" size="H1">
              {floor}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default BuildingAccessElevaterScreen;
