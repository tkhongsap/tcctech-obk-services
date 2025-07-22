import {useNavigation} from '~/navigations/AppNavigation';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import getTheme from '~/utils/themes/themeUtils';
import {WhatHappeningProps} from '../../../services/whatHappeningService';
import DateTime from '~/utils/datetime';
import React from 'react';

export const WhatHappeningEvents = ({data}: {data: WhatHappeningProps[]}) => {
  const navigation = useNavigation();

  return (
    <View className="space-y-3 flex items-stretch">
      {data.map((item, index) => (
        <TouchableOpacity
          key={`event-${index}`}
          activeOpacity={activeOpacity}
          onPress={() =>
            navigation.navigate('EventDetail', {
              ...item,
            })
          }>
          <View
            className={`flex flex-row space-x-2 rounded-md border ${getTheme(
              'border-line',
            )}`}>
            {item.thumbnailImage ? (
              <FastImage
                source={{uri: item.thumbnailImage}}
                className="w-[35%] object-cover object-center rounded-l-md"
              />
            ) : (
              <View className="w-[35%] rounded-l-md bg-black-dark/5" />
            )}
            <View className="flex-1 flex justify-between py-4">
              <View className="space-y-1">
                <Text size="C1" color="subtitle-muted">
                  {item.category}
                </Text>
                <Text
                  size="B1"
                  color="default"
                  weight="medium"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  className="leading-5">
                  {item.title}
                </Text>
              </View>
              <Spacing height={8} />
              <View>
                <Text size="C1" color="subtitle-muted">
                  {item.location}
                </Text>
                <Text size="B1" color="default" weight="medium">
                  {DateTime.formatDateRange(
                    item.eventStartDate,
                    item.eventEndDate,
                  )}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
