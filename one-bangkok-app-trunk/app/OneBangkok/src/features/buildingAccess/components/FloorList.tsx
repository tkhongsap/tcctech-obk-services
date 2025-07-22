import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';

const FloorList = ({
  data,
}: {
  data: WrappedResponseParkingLotsIndexResponseData[];
}) => {
  const navigation = useNavigation<StackNavigation>();

  const floorCard = ({item}: {item: any}) => {
    const nameFloor =
      item.display_name[appLanguageActions.getLanguage()] ?? item.name;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('SmartParkingInfoScreen', {
            parkingLots: data,
            floorId: item?.id,
            nameZoneOrFloor: nameFloor,
          })
        }>
        <View
          className={getTheme(
            'px-3 py-[18px] rounded border-line border-[1px] mt-4',
          )}>
          <View className="flex-row justify-between">
            <Text size="H2" weight="medium">
              {nameFloor}
            </Text>
            <Icon type="arrowRightIcon" width={16} height={16} />
          </View>
          <Spacing height={17} />
          <Text size="H2" weight="medium">
            {item.total_available_spots}
          </Text>
          <Text size="C1" color="subtitle-muted">
            {t('General__Available_parking_spots', 'Available Parking Spots')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView>
      <FlatList data={data} renderItem={floorCard} scrollEnabled={false} />
      <Spacing height={10} />
    </ScrollView>
  );
};

export default FloorList;
