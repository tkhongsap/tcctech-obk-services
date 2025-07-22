import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '~/navigations/AppNavigation';
import {Icon, Spacing} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import {OBSpacing} from '~/components';
import {DrawerActions} from '@react-navigation/native';
import {notificationActiveTabState} from '~/states/notification/notificationState';
import {NotificationBadge} from '~/features/notification/components/NotificationBadge';

export const NavbarResidentialHome = ({
  isRefreshing,
}: {
  isRefreshing?: boolean;
}) => {
  const navigation = useNavigation();
  const onPressHamburger = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onPressNotification = () => {
    notificationActiveTabState.set('Residences');
    navigation.navigate('AllNotificationsScreen');
  };

  return (
    <View className={'w-full'}>
      <View className={'flex h-[63px] px-4 flex-row flex-shrink items-center'}>
        <IconButton
          type="menu"
          testID={'home-menu-id'}
          onPress={onPressHamburger}
          color="#000000"
          width={27}
          height={27}
          rotation={0}
        />
        <OBSpacing width={12} />
        <Icon type="obLogoIcon" width={150} height={24} color="#000000" />
        <Spacing flex={1} />
        <IconButton
          width={24}
          height={24}
          color="#000000"
          type="qrCode"
          onPress={() => {
            navigation.navigate('BuildingAccessQrScreen');
          }}
          rotation={0}
        />
        <NotificationBadge
          isDark
          isRefreshing={isRefreshing}
          onPress={() => onPressNotification()}
        />
      </View>
    </View>
  );
};
