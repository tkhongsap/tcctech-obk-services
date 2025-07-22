import React, {useMemo} from 'react';
import {
  MappedinLocation,
  MappedinNode,
  TMappedinDirective,
} from '@mappedin/react-native-sdk';
import {View} from 'react-native';
import {Text} from '~/components/atoms';
import {IAction} from '@mappedin/react-native-sdk/sdks/packages/get-venue/MappedinDirections';
import {ImmutableArray, ImmutableObject} from '@hookstate/core';

type Props = {
  instructions: ImmutableArray<TMappedinDirective>;
  icon: (action: ImmutableObject<IAction | undefined>) => React.JSX.Element;
  findNearestLocation: (
    node?: MappedinNode | ImmutableObject<MappedinNode>,
  ) => MappedinLocation | undefined;
};
const InstructionStep = (props: Props) => {
  const {instructions, icon, findNearestLocation} = props;

  if (instructions.length === 0) {
    return <></>;
  }

  return (
    <View className="p-3 text-slate-950">
      <View className="flex flex-wrap flex-row overflow-hidden">
        <View className="pt-2">
          {instructions.map((item, i) => (
            <View
              key={item?.node?.id ?? '' + i}
              className="flex flex-row w-full my-3 list-disc">
              <View className="flex flex-row gap-1">
                {icon(item.action)}
                <View className="pl-2">
                  <Text className="text-lg font-semibold">
                    {item.instruction}
                  </Text>
                  <Text className="text-base text-gray-400">
                    {findNearestLocation(item.node)?.name &&
                      `At ${findNearestLocation(item.node)?.name}`}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default InstructionStep;
