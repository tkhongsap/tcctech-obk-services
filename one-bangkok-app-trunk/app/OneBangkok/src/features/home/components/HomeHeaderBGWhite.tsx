/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '~/navigations/AppNavigation';
import {Icon, Spacing} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import {DrawerActions} from '@react-navigation/native';
import authenState, {useAuthenState} from '~/states/authen/authenState';
import {OBSpacing} from '~/components';
import {NotificationBadge} from '~/features/notification/components/NotificationBadge';

type Props = {
  isDark?: boolean;
  isRefreshing?: boolean;
};

export const HomeHeaderBGWhite = ({
  isDark = false,
  isRefreshing = false,
}: Props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {token} = useAuthenState();
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    setIsReload(true);
    setTimeout(() => {
      setIsReload(false);
    }, 200);
  }, [token]);

  return !isReload ? (
    <View
      className={'w-full py-5'}
      style={{
        paddingTop: Platform.OS === 'ios' ? insets.top + 10 : 20,
        backgroundColor: '#FFFFFF',
      }}>
      <View className={'flex h-[120px] flex-row flex-shrink items-center px-4'}>
        <IconButton
          type="menu"
          testID={'home-menu-id'}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          color={isDark ? '#000' : '#FFFFFF'}
          width={27}
          height={27}
          rotation={0}
        />
        <OBSpacing width={12} />
        <View style={{paddingTop: Platform.OS === 'ios' ? 0 : 2}}>
          <Icon
            type="obLogoIcon"
            width={150}
            height={24}
            color={isDark ? '#000' : '#FFFFFF'}
          />
        </View>

        <Spacing flex={1} />
        {authenState.token.value ? (
          <IconButton
            width={24}
            height={24}
            color={isDark ? '#000' : '#FFFFFF'}
            type="qrCode"
            onPress={() => {
              navigation.navigate('BuildingAccessQrScreen');
            }}
            rotation={0}
          />
        ) : null}

        {authenState.token.value ? (
          <View>
            <NotificationBadge isDark={isDark} isRefreshing={isRefreshing} />
          </View>
        ) : null}
      </View>
    </View>
  ) : null;
};
