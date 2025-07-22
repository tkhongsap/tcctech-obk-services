import React from 'react';
import {ImmutableObject} from '@hookstate/core';
import {get, map} from 'lodash';
import {FloorData} from 'ob-bms-sdk/dist/api';
import ControlledSelectList from '~/components/molecules/buildingAccess/ControlledSelectList';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {View} from 'react-native';

const FloorList = ({
  name,
  destinationFloors,
  defaultFloor,
}: {
  name: string;
  destinationFloors: ImmutableObject<FloorData>[];
  defaultFloor: string;
}) => {
  const selectListData = map(destinationFloors, floor => {
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
      <ControlledSelectList
        data={selectListData}
        name={name}
        defaultValue={defaultFloor}
      />
    </View>
  );
};

export default FloorList;
