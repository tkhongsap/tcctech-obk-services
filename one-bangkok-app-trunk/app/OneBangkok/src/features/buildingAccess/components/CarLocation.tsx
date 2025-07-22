import {t} from 'i18next';
import React from 'react';
import {View} from 'react-native';

import getTheme from '~/utils/themes/themeUtils';
import ParkingZone from './ParkingZone';
import {Text} from '~/components/atoms';
import firebaseConfigState from '~/states/firebase';

interface ICarLocationProps {
  floorName: string;
  zoneName: string;
  poleName: string;
}

const CarLocation = ({floorName, zoneName, poleName}: ICarLocationProps) => {
  const smartParkingColor = firebaseConfigState.smart_parking_color.value;
  const areaColor = smartParkingColor?.find(
    item => item.name === zoneName,
  )?.color;
  return (
    <View className={`${getTheme('border-[1px] border-line')} px-4 pb-5`}>
      <View
        className={`justify-between py-5 ${getTheme('border-b border-line')}`}>
        <Text weight="medium">
          {t('General__Parking_my_car_location', 'My car location')}
        </Text>
      </View>
      <View className="pt-5 space-y-1">
        <Text size="C1" color="greyscale-400">
          {t('General__Parking_floor', 'Floor')}
        </Text>
        <Text size="B1" color="dark-gray">
          {floorName}
        </Text>
      </View>
      <View className="pt-5 space-y-1">
        <Text size="C1" color="greyscale-400">
          {t('General__Parking_zone', 'Zone')}
        </Text>
        <View className="w-full">
          <ParkingZone nameArea={zoneName} areaColor={areaColor} />
        </View>
      </View>
      <View className="pt-5 space-y-1">
        <Text size="C1" color="greyscale-400">
          {t('General__Parking_pole', 'Pole')}
        </Text>
        <Text size="B1" color="dark-gray">
          {poleName}
        </Text>
      </View>
    </View>
  );
};

export default CarLocation;
