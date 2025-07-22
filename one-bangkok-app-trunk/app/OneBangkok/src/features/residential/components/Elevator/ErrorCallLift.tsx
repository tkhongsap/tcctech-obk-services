import {Platform, View} from 'react-native';
import {Text, Icon} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import React from 'react';

const ErrorCallLift = () => {
  return (
    <View style={{flex: 1, flexGrow: 1}} className={getTheme('z-10 pb-10')}>
      <View
        className={`h-full items-center ${
          Platform.OS === 'ios' ? 'pt-[28vh]' : 'pt-[35vh]'
        }`}>
        <Icon type="CannotIcon" width={48} height={48} color={'#1C1B1F'} />
        <Text className="text-center mt-2" weight="medium" size="H3">
          {t(
            'Residential__Elevator__Error__Lift',
            'Unable to call the elevator at this moment',
          )}
        </Text>
        <Text className="text-center" color="subtitle-muted">
          {t(
            'Residential__Elevator__Error__Lift__Sub',
            'Please click “Try Again” or use your My QR Code or facial recognition at the elevator panel',
          )}
        </Text>
      </View>
    </View>
  );
};

export default ErrorCallLift;
