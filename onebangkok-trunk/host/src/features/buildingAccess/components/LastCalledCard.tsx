import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';

const LastCalledCard = ({
  destinationFloor,
  onClose,
  lastElevator,
}: {
  destinationFloor: string;
  onClose: Function;
  lastElevator: string;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-max flex items-center"
      style={{paddingBottom: insets.bottom}}>
      {/* [RE-FACTOR] Wait for confirm color code */}
      <View
        className={`w-full transform justify-center ${getTheme('bg-navy')}`}>
        <Spacing height={20} />
        <View className="justify-between flex-row px-5">
          <Text color="default-inverse" weight="medium">
            {t('General__Last_called', 'Last called')}
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Icon type="close" width={20} height={20} color="white" />
          </TouchableOpacity>
        </View>
        <Spacing height={20} />
        <View className="flex-row">
          <View className="px-5 w-6/12">
            <View className=" flex-column">
              <Text color="sky-blue" size="B1" weight="medium">
                {t('General__Elevator', 'Elevator')}
              </Text>
              <Text color="default-inverse" size="H1">
                {lastElevator}
              </Text>
            </View>
          </View>
          <View className="px-5">
            <View className=" flex-column">
              <Text color="sky-blue" size="B1" weight="medium">
                {t('General__Destination_floor', 'Destination floor')}
              </Text>
              <Text color="default-inverse" size="H1">
                {destinationFloor}
              </Text>
            </View>
          </View>
        </View>
        <Spacing height={20} />
      </View>
    </View>
  );
};

export default LastCalledCard;
