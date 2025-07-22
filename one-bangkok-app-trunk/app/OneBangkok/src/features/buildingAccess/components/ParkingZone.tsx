import React from 'react';
import {View} from 'react-native';

import {Text} from '~/components/atoms';

interface IProps {
  nameArea: string;
  areaColor: any;
}

const ParkingZone = ({nameArea, areaColor}: IProps) => {
  return (
    <View className="flex-col justify-center" style={{width: '60%'}}>
      <View
        style={{
          backgroundColor: areaColor ?? '#0B692C',
        }}
        className="h-[32px] px-4 justify-center">
        <Text color="default-inverse" weight="bold" numberOfLines={1}>
          {nameArea}
        </Text>
      </View>
      {/* <Spacing height={6} /> */}
      {/* <View className="items-center">
            <Text color="muted">
              {t('no_key', 'Capacity: {{capacity}} spots', {
                capacity: clone.total_spots,
              })}
            </Text>
          </View> */}
    </View>
  );
};

export default ParkingZone;
