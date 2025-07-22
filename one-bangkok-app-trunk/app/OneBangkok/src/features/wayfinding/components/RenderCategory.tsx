import React from 'react';
import {MappedinCategory} from '@mappedin/react-native-sdk';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../styles/WayFindingStyle';
import SvgUri from 'react-native-svg-uri';
import Config from 'react-native-config';
import {logEvent} from '~/utils/logGA';

type Props = {
  item: MappedinCategory;
  callBack: (item: MappedinCategory) => void;
};

const RenderCategories = ({item, callBack}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        logEvent('button_click', {
          screen_name: 'Wayfinding',
          feature_name: 'Categories Icon',
          action_type: 'click',
          bu: 'LBS',
        });
        callBack(item);
      }}>
      <View className="flex text-slate-950" style={styles.locationCategoryItem}>
        <View className="rounded-full bg-gray-100 w-14 h-14 content-start mx-auto mb-2">
          <View className="m-auto">
            {item.icon?.original?.endsWith('.svg') ? (
              <SvgUri width={28} source={{uri: item.icon.original}} />
            ) : item.icon?.original ? (
              <Image width={28} source={{uri: item.icon.original}} />
            ) : item.iconFromDefaultList ? (
              <SvgUri
                width={28}
                source={{
                  uri: `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/GetDefaultIcon/${
                    item.iconFromDefaultList
                  }`,
                }}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
        <Text style={styles.wordSpecing} className="text-center text-slate-950">
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default RenderCategories;
