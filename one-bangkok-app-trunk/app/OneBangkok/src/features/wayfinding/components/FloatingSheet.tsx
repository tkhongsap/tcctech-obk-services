import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  Pressable,
  PanResponder,
} from 'react-native';
import {Text} from 'react-native';
import {WayFindingContext} from '../store/wayfinding';
import {ImmutableObject} from '@hookstate/core';
import {IAction} from '@mappedin/react-native-sdk/sdks/packages/get-venue/MappedinDirections';
import {
  ACTION_TYPE,
  BEARING_TYPE,
  MappedinLocation,
  TMappedinDirective,
} from '@mappedin/react-native-sdk';
import WfEscalor from '~/assets/icons/wf-escalor.svg';
import WfLift from '~/assets/icons/wf-lift.svg';
import {Icon} from '~/components/atoms';
import InstructionStep from './InstructionStep';
import * as turf from '@turf/turf';
import {first} from 'lodash';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const FloatingSheet = () => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    action: {findNearestLocation},
    state: {currentLocation, direction, activeDirections},
  } = wayFindingContext;
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(120))[0];

  const [currentInstruction, setCurrentInstruction] =
    useState<ImmutableObject<TMappedinDirective>>();
  const [currentInstructionIndex, setCurrentInstructionIndex] =
    useState<number>(0);
  const [nearestLocation, setNearestLocation] = useState<MappedinLocation>();
  const scrollViewRef = createRef<ScrollView>();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30 && !expanded) {
          toggleExpand();
        }
      },
    }),
  ).current;

  const icon = (action: ImmutableObject<IAction | undefined>) => {
    if (!action) {
      return <></>;
    }
    switch (action.type) {
      case ACTION_TYPE.TURN:
        switch (action.bearing) {
          case BEARING_TYPE.LEFT:
            return <Icon type="wfLeft" width={32} height={32} />;
          case BEARING_TYPE.RIGHT:
            return <Icon type="wfRight" width={32} height={32} />;
          case BEARING_TYPE.SLIGHTLEFT:
            return <Icon type="wfSlightLeft" width={28} height={28} />;
          case BEARING_TYPE.SLIGHTRIGHT:
            return <Icon type="wfSlightRight" width={28} height={28} />;
          case BEARING_TYPE.STRAIGHT:
            return <Icon type="wfStraight" width={28} height={28} />;
        }
      // eslint-disable-next-line no-fallthrough
      case ACTION_TYPE.TAKEVORTEX:
      case ACTION_TYPE.EXITVORTEX:
        return direction.isAccessible.value ? (
          <WfLift color="black" width={32} height={32} />
        ) : (
          <WfEscalor color="black" width={32} height={32} />
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    try {
      const coordinate = currentLocation.value?.map.createCoordinate(
        currentLocation.value?.lat, // latitude
        currentLocation.value?.lon, // longitude);
      );

      if (
        coordinate?.nearestNode &&
        activeDirections.value &&
        activeDirections.value.instructions.length &&
        currentLocation.value
      ) {
        const instructions = activeDirections.value.instructions;
        const targetPoint = turf.point([
          currentLocation.value.lat,
          currentLocation.value.lon,
        ]);
        const points = turf.featureCollection([
          ...instructions
            .filter(x => x.node.map.id === coordinate.nearestNode.map.id)
            .map(x => turf.point([x.node.lat, x.node.lon], {id: x.node.id})),
        ]);
        const nearest = turf.nearestPoint(targetPoint, points);
        const nearestNodeOnPathIndex = instructions.findIndex(
          x => x.node.id === nearest.properties.id,
        );

        if (nearestNodeOnPathIndex === -1) {
          return;
        }

        if (nearestNodeOnPathIndex === instructions.length - 1) {
          setCurrentInstruction(instructions[nearestNodeOnPathIndex]);
          return;
        }
        if (nearestNodeOnPathIndex === 0 && instructions.length > 1) {
          setCurrentInstruction(instructions[nearestNodeOnPathIndex + 1]);
          return;
        }
        const targetNearestPointOnPath = turf.point([
          instructions[nearestNodeOnPathIndex].node.lat,
          instructions[nearestNodeOnPathIndex].node.lon,
        ]);
        const nearestPointsOnPath = turf.featureCollection([
          turf.point(
            [
              instructions[nearestNodeOnPathIndex - 1].node.lat,
              instructions[nearestNodeOnPathIndex - 1].node.lon,
            ],
            {
              id: instructions[nearestNodeOnPathIndex - 1].node.id,
            },
          ),
          turf.point(
            [
              instructions[nearestNodeOnPathIndex + 1].node.lat,
              instructions[nearestNodeOnPathIndex + 1].node.lon,
            ],
            {
              id: instructions[nearestNodeOnPathIndex + 1].node.id,
            },
          ),
        ]);
        const nearestCurrentPointOnPath = turf.nearestPoint(
          targetNearestPointOnPath,
          nearestPointsOnPath,
        );
        const index = instructions.findIndex(
          x => x.node.id === nearestCurrentPointOnPath.properties.id,
        );
        if (nearestNodeOnPathIndex > index) {
          setCurrentInstruction(instructions[nearestNodeOnPathIndex]);
        } else {
          setCurrentInstruction(instructions[nearestNodeOnPathIndex + 1]);
        }
      }
    } catch {}
  }, [currentLocation, activeDirections]);

  useEffect(() => {
    try {
      if (!currentInstruction) {
        setCurrentInstruction(first(activeDirections.value?.instructions));
      }
      const currentIndex =
        activeDirections.value?.instructions.findIndex(
          x => x.node.id === currentInstruction?.node.id,
        ) ?? 0;
      setCurrentInstructionIndex(currentIndex > -1 ? currentIndex : 0);
      const location = findNearestLocation(currentInstruction?.node);
      setNearestLocation(location);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInstruction, activeDirections]);

  const toggleExpand = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 120 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  return !expanded ? (
    <View style={style.wrapper}>
      <View style={style.header} {...panResponder.panHandlers}>
        <View className="flex flex-row gap-1">
          {icon(currentInstruction?.action)}
          <View style={{width: 278}}>
            <Text className="text-2xl font-semibold ml-2">
              {currentInstruction?.instruction}
            </Text>
            <Text className="text-base text-gray-400 ml-2">
              At {nearestLocation?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleExpand}>
          <View style={style.handle} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <Animated.View style={[style.fullscreenPanel, {height: animatedHeight}]}>
      <View style={style.topSection}>
        <View className="flex flex-row gap-1">
          {icon(currentInstruction?.action)}
          <View>
            <Text className="text-2xl font-semibold ml-2">
              {currentInstruction?.instruction}
            </Text>
            <Text className="text-base ml-2">At {nearestLocation?.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={style.scrollSection}>
        <InstructionStep
          findNearestLocation={findNearestLocation}
          instructions={
            activeDirections.value?.instructions.slice(
              currentInstructionIndex + 1,
            ) ?? []
          }
          icon={icon}
        />
      </ScrollView>

      <View style={style.bottomSection}>
        <Pressable onPress={toggleExpand} style={style.expandButton}>
          <Icon type="scArrowUpIcon" width={16} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default FloatingSheet;

const style = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  header: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    padding: 16,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginTop: 10,
    alignSelf: 'center',
  },
  fullscreenPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  topSection: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  scrollSection: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  bottomSection: {
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  expandButton: {
    backgroundColor: '#eee',
    width: 70,
    alignItems: 'center',
  },
});
