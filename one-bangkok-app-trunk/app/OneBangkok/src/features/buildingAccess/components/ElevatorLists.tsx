import React from 'react';
import {ImmutableObject} from '@hookstate/core';
import {get, map} from 'lodash';
import {FloorData} from 'ob-bms-sdk/dist/api';
import ControlledSelectList from '~/components/molecules/buildingAccess/ControlledSelectList';
import {Diverder} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {View} from 'react-native';

const ElevatorList = ({
  name,
  currentFloor,
  destinationFloors,
}: {
  name: string;
  currentFloor: string;
  destinationFloors: ImmutableObject<FloorData>[];
}) => {
  const radioData = map(destinationFloors, floor => {
    const currentLanguage = appLanguageActions.getLanguage();
    const displayName = get(
      floor,
      ['display_name', currentLanguage],
      get(floor, ['name']),
    );
    return {
      value: floor.id,
      name: displayName,
    };
  });
  return (
    // [RE-FACTOR] Wait for confirm color code
    <View>
      <View className="py-2">
        <Text size="B1" weight="medium">
          {t('General__Destination_floor', 'Destination Floor')}
        </Text>
        <Spacing height={12} />
        <View className="px-5 py-2 flex-row justify-between">
          <Text>{currentFloor || 'Loading...'}</Text>
          <Text size="B2" color="subtitle-muted">
            {t('General__Current_floor', 'Current Floor')}
          </Text>
        </View>
        <Spacing height={12} />
        <ControlledSelectList data={radioData} name={name} />
      </View>
    </View>
  );
};

export default ElevatorList;
