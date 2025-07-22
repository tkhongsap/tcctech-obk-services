import {View} from 'react-native';
import {Text, Icon} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import React from 'react';

const ErrorOutOfRange = () => {
  return (
    <View
      style={{flex: 1, flexGrow: 1}}
      className={getTheme('z-10 pb-10')}>
      <View className="h-full items-center pt-[25vh]">
        <Icon type="CannotIcon" width={48} height={48} color={'#1C1B1F'} />
        <Text className="text-center mt-2" weight="medium" size="H3">
          {t(
            'Residential__Elevator__We_Can_Not_Locate_You',
            'We can not locate you',
          )}
        </Text>
        <Text className="text-center" color="subtitle-muted">
          {t(
            'Residential__Elevator__Error_Locate_Description',
            'Please move closer to the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

export default ErrorOutOfRange;
