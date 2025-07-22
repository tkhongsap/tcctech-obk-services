import {View, Text} from 'react-native';
import React from 'react';

export type ResidentUnitData = {
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

type ResidentUnitProps = {
  residentunits: ResidentUnitData[] | undefined;
};

const ResidentUnit = ({residentunits}: ResidentUnitProps) => {
  return (
    <View>
      <Text>ResidentUnit</Text>
    </View>
  );
};

export default ResidentUnit;
