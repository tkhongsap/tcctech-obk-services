import React from 'react';
import {
  ACTION_TYPE,
  BEARING_TYPE,
  MappedinDirections,
  MappedinMap,
} from '@mappedin/react-native-sdk';
import {View} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {IAction} from '@mappedin/react-native-sdk/sdks/packages/get-venue/MappedinDirections';
import {ImmutableObject, State} from '@hookstate/core';
import {DirectionState} from '../store/wayfinding';
import WfEscalor from '~/assets/icons/wf-escalor.svg';
import WfLift from '~/assets/icons/wf-lift.svg';

type Props = {
  currentMap: State<MappedinMap | undefined>;
  direction: State<DirectionState>;
  directions: State<MappedinDirections | undefined, {}>;
};
const DirectionStep = (props: Props) => {
  const {currentMap, directions, direction} = props;
  const icon = (action: ImmutableObject<IAction | undefined>) => {
    if (!action) {
      return <></>;
    }
    switch (action.type) {
      case ACTION_TYPE.TURN:
        switch (action.bearing) {
          case BEARING_TYPE.LEFT:
            return <Icon type="wfLeft" />;
          case BEARING_TYPE.RIGHT:
            return <Icon type="wfRight" />;
          case BEARING_TYPE.SLIGHTLEFT:
            return <Icon type="wfSlightLeft" width={18} />;
          case BEARING_TYPE.SLIGHTRIGHT:
            return <Icon type="wfSlightRight" width={18} />;
          case BEARING_TYPE.STRAIGHT:
            return <Icon type="wfStraight" width={18} />;
        }
      // eslint-disable-next-line no-fallthrough
      case ACTION_TYPE.TAKEVORTEX:
      case ACTION_TYPE.EXITVORTEX:
        return direction.isAccessible.value ? (
          <WfLift color="black" />
        ) : (
          <WfEscalor color="black" />
        );
      default:
        return <></>;
    }
  };

  const calETA = (distance: number) => {
    const time = Math.round(distance / 85);
    return time;
  };

  return (
    directions.value && (
      <>
        <View className="p-3 text-slate-950">
          <Text className="text-lg text-gray-500 pb-2 font-bold">
            {currentMap.value &&
              currentMap.value.mapGroup?.name?.concat(
                ' | ',
                currentMap.value.name,
              )}
          </Text>
          <Text>Time to destination</Text>
          <View className="flex flex-row w-full" style={styles.dividerLast}>
            <View className="flex flex-row justify-between p-3">
              <Icon type="wfWalk" height={14} />
              <Text>{calETA(directions.value.distance!)} minutes</Text>
            </View>
          </View>
          <View className="flex flex-wrap flex-row overflow-hidden pl-8">
            <View className="absolute left-4 pt-3 h">
              <Icon type="dot" height={10} />
              {directions.value.instructions.map((instruction, i) => (
                <React.Fragment key={instruction?.node?.id ?? '' + i}>
                  <Icon height={32} type="lineDot" />
                  <Icon height={32} type="lineDot" />
                  <Icon height={32} type="lineDot" />
                  <Icon height={32} type="lineDot" />
                </React.Fragment>
              ))}
            </View>
            <View className="pt-2 ml-6">
              <Text className="text-xl font-bold">
                {direction.departure.value?.location.name ?? ''}
              </Text>
              {directions.value.instructions.map((item, i) => (
                <View
                  key={item?.node?.id ?? '' + i}
                  className="flex flex-row w-full my-3 list-disc">
                  <View className="flex flex-row gap-1">
                    {icon(item.action)}
                    <View>
                      <Text className="text-ellipsis font-bold">
                        {item.instruction}
                      </Text>
                      <Text style={styles.description}>
                        {Math.round(item.distance)} meters
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className="flex flex-row gap-1 ml-4 mt-2">
            <Text className="text-xl font-bold">
              <Icon type="ObLocationIcon" />
            </Text>
            <Text className="text-xl font-bold">
              {direction.destinations[0].value?.location.name ?? ''}
            </Text>
          </View>
        </View>
      </>
    )
  );
};

export default DirectionStep;
