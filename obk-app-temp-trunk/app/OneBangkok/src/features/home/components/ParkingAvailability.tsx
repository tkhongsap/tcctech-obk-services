import {FlatList, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {find, isEmpty} from 'lodash';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {Button} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {ParkingResponse} from '~/features/buildingAccess/store/parking';
import {ImmutableArray} from '@hookstate/core';

export interface AreaCardInterface {
  name: string;
  total: number;
  floor: string[];
}

const RenderAreas = ({item}: {item: AreaCardInterface}) => {
  return (
    <>
      <View style={{minWidth: 60}}>
        <View>
          <Text weight="medium" size="H4">
            {item.total.toLocaleString()}
          </Text>
        </View>
        <View>
          <Text color="subtitle-muted" size="B2" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>
    </>
  );
};

const ParkingAvailability = ({
  parkingLot,
}: {
  parkingLot: ImmutableArray<ParkingResponse>;
}) => {
  const [areas, setAreas] = useState<AreaCardInterface[]>();
  const navigation = useNavigation();

  const mapParkingLots = async () => {
    if (isEmpty(parkingLot)) {
      return <View />;
    }
    if (parkingLot) {
      const areaCards: AreaCardInterface[] = [];
      parkingLot.forEach(floor => {
        floor.parking_lots.forEach(lot => {
          const existingCard = find(areaCards, {name: lot.name});
          if (existingCard) {
            // If the card already exists, update the total and add the floor if not already present
            existingCard.total += lot.total_available_spots;

            if (!existingCard.floor.includes(floor.name)) {
              existingCard.floor.push(floor.name);
            }
          } else {
            // If the card doesn't

            areaCards.push({
              name: lot.name,
              total: lot.total_available_spots,
              floor: [floor.name],
              id: lot.id,
            });
          }
        });
      });
      setAreas(areaCards);
    }
  };
  useEffect(() => {
    mapParkingLots();
  }, [parkingLot]);

  return (
    <>
      {areas && (
        <View className="pt-7 pb-4">
          <View className="px-5">
            <Text color="dark-teal" weight="medium">
              {t('General__Parking_availability', 'Parking Availability')}
            </Text>
            <Text size="B2" color="subtitle-muted">
              {t('General__Find_parking_spot_and_view_ticket', 'Find parking spot and view ticket')}
            </Text>
            <Spacing height={32} />
            <FlatList
              data={areas}
              renderItem={item => <RenderAreas item={item.item} />}
              numColumns={3}
              horizontal={false}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: 24,
                justifyContent: 'space-between',
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
            />
          </View>
          <Spacing height={24} />
          <Button
            title={t('General__View_more_details', 'View more details')}
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
      )}
    </>
  );
};

export default ParkingAvailability;
