import {View, FlatList, Pressable} from 'react-native';
import React from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {isEmpty} from 'lodash';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {TouchableOpacity} from 'react-native';
import firebaseConfigState from '~/states/firebase';

const ParkingList = ({item}: {item: any}) => {
  const iconName = {
    Reserved: 'reservedIcon',
    Handicap: 'carHandicapIcon',
    VIP: 'carVipIcon',
    'Luxury Car': 'carLuxuryIcon',
    'Big bike': 'bigBikeIcon',
  };
  const nameSpotType =
    item.display_name[appLanguageActions.getLanguage()] ?? item.name;

  return (
    <View className="px-3">
      <View className="flex-row justify-between py-3 items-center">
        <View className="flex-row items-center">
          <Icon type={iconName[nameSpotType] ?? 'reservedIcon'} color="white" />
          <Spacing width={12} />
          <Text size="B1">{nameSpotType}</Text>
        </View>
        <Text size="B1" weight="medium">
          {item?.available_spots}
        </Text>
      </View>
    </View>
  );
};

const ParkingInfo = ({
  itemParkingInfo,
  spotType,
  isByFloor,
  floor,
}: {
  itemParkingInfo: any;
  spotType: string;
  isByFloor: boolean;
  floor: string;
}) => {
  const clone = {...itemParkingInfo};
  if (spotType !== 'All') {
    const filterSpotType = clone?.spot_types?.filter(
      itemSpotType => itemSpotType.name === spotType,
    );
    clone['spot_types'] = filterSpotType;
  }
  if (isEmpty(clone?.spot_types)) {
    return null;
  }
  const nameArea =
    clone.display_name[appLanguageActions.getLanguage()] ?? clone.name;

  const smartParkingColor = firebaseConfigState.smart_parking_color.value;

  const areaColor = smartParkingColor?.find(item => item.name === nameArea);

  return (
    <View className="flex w-full mt-6">
      <View className="flex-row justify-between">
        <Text size="B1" weight="medium">
          {nameArea}
        </Text>
        {isByFloor && (
          <TouchableOpacity
            style={{
              backgroundColor: areaColor?.color ?? '#0B692C',
              width: 6,
              height: 22,
            }}
          />
        )}
      </View>
      <Spacing height={6} />
      <View className={getTheme('border-line border-[1px]')}>
        <Pressable>
          <FlatList
            data={clone.spot_types}
            ItemSeparatorComponent={() => (
              <View className={getTheme('border-b border-line mx-3')} />
            )}
            renderItem={({item}) => {
              return <ParkingList item={item} />;
            }}
            extraData={itemParkingInfo.spot_types}
          />
        </Pressable>
      </View>
    </View>
  );
};

const SmartParkingInfo = ({
  data,
  spotType,
  isByFloor,
  floor,
}: {
  data: any;
  spotType: string;
  isByFloor: boolean;
  floor: string;
}) => {
  return (
    <View className="px-4">
      <FlatList
        keyExtractor={(item: any, index: number) => `${item.id}_${index}`}
        data={data[0].parking_lots}
        renderItem={({item}) => {
          return (
            <ParkingInfo
              itemParkingInfo={item}
              spotType={spotType}
              isByFloor={isByFloor}
              floor={floor}
            />
          );
        }}
      />
    </View>
  );
};

export default SmartParkingInfo;
