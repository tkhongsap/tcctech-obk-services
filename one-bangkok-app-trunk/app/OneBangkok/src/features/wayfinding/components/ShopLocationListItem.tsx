import {ImmutableObject} from '@hookstate/core';
import React, {memo, useContext, useMemo} from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';
import {Icon} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import SvgUri from 'react-native-svg-uri';
import {MappedinCategory} from '@mappedin/react-native-sdk';
import {first} from 'lodash';
import {District, Floors} from '../constants/Constants';

type Props = {
  item: ImmutableObject<LocationNode>;
  selectedCategory?: MappedinCategory;
  callback: (item: ImmutableObject<LocationNode>) => void;
};

const ShopLocationListItem = (props: Props) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    action: {getZoneLocation, getZoneColor},
  } = wayFindingContext;

  const {item, selectedCategory, callback} = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Zone = useMemo(() => getZoneLocation(item), [item]);

  const categories: string[] =
    item?.location?.categories
      ?.map(cat => cat.externalId)
      .filter((id): id is string => typeof id === 'string') || [];

  const renderZoneIcon = (
    location: ImmutableObject<LocationNode>,
    externalIdCategories: string[],
    zoneExternalId: string,
  ) => {
    const isDistrict = location?.node?.map?.id === District.id;

    if (isDistrict && externalIdCategories.includes('CAT-SFOVUFSB')) {
      return (
        <Icon
          type="wfBuilding"
          width={20}
          height={20}
          className="border border-[#FDFDFD] rounded-full w-[35px] h-[35px]"
        />
      );
    }

    if (isDistrict && externalIdCategories.includes('CAT-1808RPRA')) {
      return (
        <Icon
          type="wfGrass"
          width={20}
          height={20}
          className="border border-[#FDFDFD] rounded-full w-[35px] h-[35px]"
        />
      );
    }

    return (
      <View
        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{
          backgroundColor: getZoneColor(zoneExternalId).base,
        }}>
        <Text>
          {Floors.find(x => x.id === location?.node?.map.id)?.label ?? ''}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={() => callback(item)}>
      <View
        className="px-3 py-2 flex flex-row justify-between items-center align-middle"
        style={styles.borderListItemBottom}>
        <View className="flex flex-row" style={componentStyle.textOverflow}>
          <View className="ml-3 mr-2">
            {item?.location?.logo?.xsmall ? (
              <Image
                source={{uri: item?.location?.logo?.xsmall}}
                style={styles.image}
              />
            ) : selectedCategory?.icon ? (
              <View className="align-middle" style={styles.image}>
                <SvgUri
                  width={20}
                  source={{uri: selectedCategory.icon?.original}}
                />
              </View>
            ) : first(item?.location?.categories)?.icon?.original ? (
              <SvgUri
                width={20}
                source={{uri: item?.location?.categories[0].icon?.original}}
              />
            ) : (
              <Icon
                type="obNewIcon"
                width={20}
                height={20}
                className="border border-[#FDFDFD] rounded-full bg-[#111] w-[35px] h-[35px]"
              />
            )}
          </View>
          <View className="text-slate-950 flex items-center justify-center">
            <Text
              className="font-medium text-sm text-slate-950 w-[200px]"
              numberOfLines={1}>
              {item?.location.name}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center">
            {renderZoneIcon(item, categories, Zone?.externalId ?? '')}

            <View className="h-8">
              {Zone?.logo?.original?.endsWith('.svg') ? (
                <></>
              ) : Zone?.logo?.xsmall ? (
                <Image
                  className="flex-1 w-16"
                  style={styles.reSizeCover}
                  source={{uri: Zone.logo.xsmall}}
                />
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const componentStyle = StyleSheet.create({
  textOverflow: {
    maxWidth: 250,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

export default memo(ShopLocationListItem);
