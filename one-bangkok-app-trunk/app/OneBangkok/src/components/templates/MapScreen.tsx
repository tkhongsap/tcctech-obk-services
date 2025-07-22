import React from 'react';
import {View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import Loading from '~/components/organisms/Loading';

export const MapScreen = (props: any) => {
  props = {
    isTheme: false,
    bgColor: 'bg-default',
    ...props,
  };

  return (
    <View
      className={getTheme(
        `flex-1 justify-start items-center h-screen w-screen ${props.bgColor}`,
      )}>
      {props.children}
      <Loading isLoading={props.isLoading} />
    </View>
  );
};
