import {View, FlatList} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import {isEmpty} from 'lodash';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import firebaseConfigState from '~/states/firebase';
import dayjs from 'dayjs';
import t from '~/utils/text';
import TotalAvailable from './TotalAvailable';
import ParkingZone from './ParkingZone';

const ParkingInfo = ({itemParkingInfo}: {itemParkingInfo: any}) => {
  const clone = {...itemParkingInfo};
  if (isEmpty(clone)) {
    return null;
  }

  const nameArea =
    clone.display_name[appLanguageActions.getLanguage()] ?? clone.name;

  const smartParkingColor = firebaseConfigState.smart_parking_color.value;

  const areaColor = smartParkingColor?.find(item => item.name === nameArea);

  return (
    <View className="py-3 pr-4 border border-gray-300 justify-center">
      <View className="flex-row justify-between items-center">
        <ParkingZone nameArea={nameArea} areaColor={areaColor?.color} />
        <View className="flex-col justify-cente items-center">
          <Text weight="bold" size="N1">
            {clone.total_available_spots}
          </Text>
          <Text size="B2" color="muted">
            {t('General__Smart_parking_available_sport', 'Available spots')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SmartParkingInfoHeader = ({
  date,
  totalAvailableSpots,
}: {
  date: string;
  totalAvailableSpots: number;
}) => {
  return (
    <>
      <Text size="C1" color="muted">
        {t('no_key', 'Last Update {{date}}', {
          date: date,
        })}
      </Text>
      <Spacing height={6} />
      <TotalAvailable total={totalAvailableSpots} />
    </>
  );
};

const SmartParkingInfo = ({data}: {data: any}) => {
  const formattedSpecificDate = dayjs(data.updated_at).format(
    'D MMM YYYY [at] h:mma',
  );
  return (
    <View className="flex-1 px-4">
      <FlatList
        keyExtractor={(item: any, index: number) => `${item.id}_${index}`}
        data={data.parking_lots}
        ListHeaderComponent={
          <SmartParkingInfoHeader
            date={formattedSpecificDate}
            totalAvailableSpots={data.total_available_spots}
          />
        }
        ListHeaderComponentStyle={{paddingVertical: 18}}
        extraData={data}
        ItemSeparatorComponent={() => <View style={{margin: 6}} />}
        renderItem={({item}) => {
          return <ParkingInfo itemParkingInfo={item} />;
        }}
      />
    </View>
  );
};

export default SmartParkingInfo;
