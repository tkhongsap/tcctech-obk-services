import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '~/navigations/AppNavigation';
import {Icon, Spacing} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import {OBSpacing} from '~/components';
import {DrawerActions} from '@react-navigation/native';

export const HomeHeader = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`w-full`}
      style={{
        paddingTop: insets.top,
      }}>
      <View className={`flex h-[120px] px-4 flex-row flex-shrink items-center`}>
        <IconButton
          type="menu"
          testID={'home-menu-id'}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          color="#FFFFFF"
          width={27}
          height={27}
        />
        <OBSpacing width={8} />
        <Icon type="obLogoIcon" width={180} height={24} color="#FFFFFF" />
        <Spacing flex={1} />
        <IconButton
          width={30}
          height={30}
          color="#FFFFFF"
          type="qrCode"
          onPress={() => {
            navigation.navigate('BuildingAccessQrScreen');
          }}
        />
        <Spacing width={9} />
        <IconButton
          color="#FFFFFF"
          type="bell"
          width={30}
          height={30}
          onPress={() => {
            navigation.navigate('AllNotificationsScreen');
          }}
        />
      </View>
    </View>
  );
};
