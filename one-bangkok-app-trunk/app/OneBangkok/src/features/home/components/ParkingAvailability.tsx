import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {find, isEmpty} from 'lodash';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {Button} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {useParkingState} from '~/features/buildingAccess/store/parking';
import TotalAvailable from '~/features/buildingAccess/components/TotalAvailable';
import dayjs from 'dayjs';
import {logScreenView} from '~/utils/logGA';

export interface AreaCardInterface {
  name: string;
  total: number;
  floor: string[];
}

const ParkingAvailability = ({onPress}: {onPress?: () => void}) => {
  const [totalAvailable, setTotalAvailable] = useState<number>();
  const navigation = useNavigation();
  const {parkingLot} = useParkingState();
  const parkingLots = parkingLot.value;

  const mapParkingLots = useCallback(async () => {
    if (isEmpty(parkingLots)) {
      return <View />;
    }
    if (parkingLots) {
      const areaCards: AreaCardInterface[] = [];
      parkingLots.forEach(floor => {
        floor.parking_lots.forEach(lot => {
          const existingCard = find(areaCards, {name: lot.name});
          if (existingCard) {
            // If the card already exists, update the total and add the floor if not already present
            existingCard.total += lot.total_available_spots;

            if (!existingCard.floor.includes(floor.name)) {
              existingCard.floor.push(floor.name);
            }
          } else {
            // If the card doesn't exist, create a new one
            areaCards.push({
              name: lot.name,
              total: lot.total_available_spots,
              floor: [floor.name],
            });
          }
        });
      });

      const reducedData = areaCards.reduce(
        (acc, lot) => {
          // Accumulate the total available spots
          acc.total += lot.total;
          return acc;
        },
        {total: 0},
      );

      setTotalAvailable(reducedData.total);
    }
  }, [parkingLots, setTotalAvailable]);
  useEffect(() => {
    logScreenView('ParkingAvailability');
  }, []);

  useEffect(() => {
    mapParkingLots();
  }, [mapParkingLots]);

  return (
    <>
      <View className="pt-7 pb-4">
        <View className="px-5">
          <Text color="dark-teal" weight="medium">
            {t('General__Parking_availability', 'Parking Availability')}
          </Text>
          <Text size="B2" color="subtitle-muted">
            {t(
              'General__Find_parking_spot_and_view_ticket',
              'Find parking spot and view ticket',
            )}
          </Text>
          <Spacing height={2} />
          <Text size="C1" color="muted">
            {t('no_key', 'Last Update {{date}}', {
              date:
                parkingLots &&
                dayjs(parkingLots[0]?.updated_at).format(
                  'D MMM YYYY [at] h:mma',
                ),
            })}
          </Text>
          <Spacing height={32} />
          <TouchableOpacity
            onPress={() => {
              onPress && onPress();
            }}
            activeOpacity={1}>
            <TotalAvailable total={totalAvailable ?? 0} />
          </TouchableOpacity>
        </View>
        <Spacing height={24} />
        <Button
          title={t('General__View_parking', 'View all parking availability')}
          ghost
          color="default"
          outlined
          rightIcon="arrowRightIcon"
          rightIconColor="#292929"
          iconWidth={16}
          iconHeight={16}
          onPress={() => navigation.navigate('SmartParkingScreen')}
        />
      </View>
    </>
  );
};

export default ParkingAvailability;
