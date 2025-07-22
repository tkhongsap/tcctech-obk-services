import {ImmutableObject} from '@hookstate/core';
import React, {memo, useContext, useMemo} from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {Icon} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import SvgUri from 'react-native-svg-uri';
import {MappedinCategory} from '@mappedin/react-native-sdk';
import {first} from 'lodash';

type Props = {
  item: ImmutableObject<LocationNode>;
  selectedCategory?: MappedinCategory;
  callback: (item: ImmutableObject<LocationNode>) => void;
};

const RenderShopItem = (props: Props) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    action: {getZoneLocation},
  } = wayFindingContext;
  const GetZoneLocation = (data: ImmutableObject<LocationNode> | undefined) =>
    useMemo(() => getZoneLocation(data), [data]);
  const {item, selectedCategory, callback} = props;

  return (
    <TouchableOpacity onPress={() => callback(item)}>
      <View className="px-3" style={styles.listItem}>
        <View className="ml-3">
          {item.location.logo?.xsmall ? (
            <Image
              source={{uri: item.location.logo?.xsmall}}
              style={styles.image}
            />
          ) : selectedCategory?.icon ? (
            <View className="align-middle" style={styles.image}>
              <SvgUri
                width={25}
                source={{uri: selectedCategory.icon?.original}}
              />
            </View>
          ) : first(item.location.categories)?.icon?.original ? (
            <SvgUri
              width={25}
              source={{uri: item.location.categories[0].icon?.original}}
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
        <View style={styles.info} className="text-slate-950">
          <Text className="font-medium text-sm text-slate-950">
            {item.location.name}
          </Text>
          <Text style={styles.description}>{GetZoneLocation(item)?.name}</Text>
        </View>
        <View style={styles.item}>
          <Text>View</Text>
          <Icon type="arrowRightIcon" height={14} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderShopItem);
