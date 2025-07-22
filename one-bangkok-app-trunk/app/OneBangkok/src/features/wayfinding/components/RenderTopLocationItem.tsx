import {ImmutableObject} from '@hookstate/core';
import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {TImage} from '@mappedin/mappedin-js';

export type TopLocationModel = {
  code: string;
  id: string;
  image: TImage | undefined;
  name: string;
  toMap?: string;
  group?: string;
};

type Props = {
  item: ImmutableObject<TopLocationModel>;
  currentMapGroup: string | undefined;
  callback: (item: ImmutableObject<TopLocationModel>) => void;
};

const RenderTopLocationItem = (props: Props) => {
  const {item, currentMapGroup, callback} = props;
  return (
    <TouchableOpacity onPress={() => callback(item)}>
      <View
        style={[
          styles.listItemTopLocaiton,
          item.group === currentMapGroup && styles.darkNavy,
        ]}>
        <View style={styles.infoTopLocation}>
          {item.image?.small ? (
            <Image
              source={{uri: item.image?.small}}
              style={styles.imageTopLocation}
            />
          ) : (
            <Icon
              type="obNewIcon"
              width={20}
              height={20}
              className="border border-[#FDFDFD] rounded-full bg-[#111] w-[40px] h-[40px]"
            />
          )}
          <View>
            <Text
              style={styles.titleTopLocation}
              size="H6"
              className="font-semibold">
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderTopLocationItem;
