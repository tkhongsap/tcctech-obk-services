import {View} from 'react-native';
import {Text, Icon} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import React from 'react';

const LocationDisable = () => {
  return (
    <View
      style={{flex: 1, flexGrow: 1}}
      className={getTheme('z-10 pb-10')}>
      <View className="h-full items-center pt-[25vh]">
        <Icon
          type="elevatorLocation"
          width={80}
          height={80}
          color={'#1C1B1F'}
        />
        <Text className="text-center mt-2" weight="medium" size="H3">
          {t('Residential__Elevator__Enable_Location', 'Enable Location')}
        </Text>
        <Text className="text-center" color="subtitle-muted">
          {t(
            'Residential__Elevator__Disable_Description',
            'Location is disabled.\nPlease enable it before calling the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

export default LocationDisable;
