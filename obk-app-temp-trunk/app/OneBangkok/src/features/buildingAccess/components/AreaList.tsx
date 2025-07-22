import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {find} from 'lodash';
import firebaseConfigState from '~/states/firebase';

export interface areaCardInterface {
  name: string;
  total: number;
  floor: string[];
  id: string;
}

const AreaList = ({
  data,
}: {
  data: WrappedResponseParkingLotsIndexResponseData[];
}) => {
  const [areas, setAreas] =
    useState<WrappedResponseParkingLotsIndexResponseData[]>();
  const navigation = useNavigation<StackNavigation>();

  const renderFloorList = ({item}: {item: any}) => {
    const nameFloor = item;
    return (
      <View className="items-right items-end">
        <Text size="C1" color="subtitle-muted">
          {nameFloor}
        </Text>
      </View>
    );
  };

  useLayoutEffect(() => {
    const areaCards: areaCardInterface[] = [];

    data.forEach(floor => {
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
  }, [data]);

  const areaCard = ({item}: {item: any}) => {
    const nameArea = item.name;
    const sumAvailableSpot = item.total;
    const filterArea = item.floor;

    const smartParkingColor = firebaseConfigState.smart_parking_color.value;

    const areaColor = smartParkingColor?.find(item => item.name === nameArea);
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('SmartParkingInfoScreen', {
            parkingLots: data,
            areaId: item?.id,
            nameZoneOrFloor: nameArea,
          })
        }>
        <View
          className={getTheme(
            'px-3 py-[18px] rounded border-line border-[1px] mt-4',
          )}>
          <View className="flex-row justify-between">
            <View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  style={{
                    backgroundColor: areaColor?.color ?? '#0B692C',
                    width: 6,
                    height: 22,
                  }}
                />
                <Spacing width={12} />
                <Text size="H2" weight="medium">
                  {nameArea}
                </Text>
              </View>
              <Spacing height={17} />
              <Text size="H2" weight="medium">
                {sumAvailableSpot}
              </Text>
              <Text size="C1" color="subtitle-muted">
                {t('General__Available_parking_spots', 'Available Parking Spots')}
              </Text>
            </View>
            <View className="items-right justify-between">
              <Icon type="arrowRightIcon" width={16} height={16} />
              <FlatList data={filterArea} renderItem={renderFloorList} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <FlatList
        data={areas}
        renderItem={areaCard}
        extraData={areas}
        scrollEnabled={false}
      />
      <Spacing height={10} />
    </ScrollView>
  );
};

export default AreaList;
