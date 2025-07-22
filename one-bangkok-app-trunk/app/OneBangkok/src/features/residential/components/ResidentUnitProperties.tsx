import {View, Text} from 'react-native';
import React from 'react';

export type ResidentUnitPropertiesData = {
  companyName: string;
  projectName: string;
  buildingPhase: string;
  floorZone: string;
  unitNumber: string;
  customer: string;
  isAllocated: boolean;
  setMapping: boolean;
  isDefault: boolean;
};

type ResidentUnitPropertiesProp = {
  residentunitsproperties: ResidentUnitPropertiesData[] | undefined;
};

const ResidentUnitProperties = ({
  residentunitsproperties,
}: ResidentUnitPropertiesProp) => {
  return (
    <View>
      <Text>ResidentUnit Properties</Text>
    </View>
  );
};

export default ResidentUnitProperties;
