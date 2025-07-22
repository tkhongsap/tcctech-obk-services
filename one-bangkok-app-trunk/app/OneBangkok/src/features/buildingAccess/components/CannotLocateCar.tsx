import React from 'react';
import {View} from 'react-native';

import {Icon, Text} from '~/components/atoms';
import {Colors} from '~/constants';
import T from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';

const CannotLocateCar = () => {
  return (
    <View className={`p-4 ${getTheme('bg-light-gray')} space-y-2`}>
      <View className="flex-row items-center space-x-2.5">
        <Icon
          type="infoCirIcon"
          width={18}
          height={18}
          color={Colors.lightGray}
        />
        <Text weight="bold" className={getTheme('text-navy')}>
          {T(
            'General__Parking_car_location_unavaliable',
            'Car location unavailable',
          )}
        </Text>
      </View>
      <Text size="B2">
        {T(
          'General__Parking_car_location_unavaliable_description',
          'Once you park your car and we can detect your license plate, your car location will be displayed.',
        )}
      </Text>
    </View>
  );
};

export default CannotLocateCar;
