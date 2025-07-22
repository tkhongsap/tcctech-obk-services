import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';

type Props = {
  callback: () => void;
};

const CurrentLocationButton = (props: Props) => {
  const {callback} = props;

  return (
    <TouchableOpacity onPress={() => callback()}>
      <View className="px-3" style={styles.listItem}>
        <View className="ml-3">
          <Icon
            type="location"
            width={20}
            height={20}
            className="border border-[#FDFDFD] rounded-full w-[35px] h-[35px]"
          />
        </View>
        <View style={styles.info} className="text-slate-950">
          <Text className="font-medium text-sm text-slate-950">
            Your location
          </Text>
        </View>
        <View style={styles.item}>
          <Text>View</Text>
          <Icon type="arrowRightIcon" height={14} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CurrentLocationButton);
