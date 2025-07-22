import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconButton} from '~/components/molecules';
import {DrawerActions, StackActions} from '@react-navigation/native';
import {useNavigation} from '~/navigations/AppNavigation';
import authenState from '~/states/authen/authenState';

const ArtCultureHeader = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="pt-2 pb-5 flex flex-row w-full px-4 justify-between items-center"
      style={{
        marginTop: insets.top,
      }}>
      <View className="flex flex-row items-center">
        <IconButton
          type="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          color="#000000"
          width={27}
          height={27}
          rotation={0}
        />
        <IconButton
          type="obLogoIcon"
          className="pl-2"
          width={150}
          height={24}
          color="#000000"
          rotation={0}
          onPress={() => {
            navigation.dispatch(StackActions.replace('HomeScreen'));
          }}
        />
      </View>

      {authenState.token.value ? (
        <View className="flex flex-row items-center">
          <IconButton
            type="qrCode"
            width={24}
            height={24}
            color="#000000"
            onPress={() => {
              navigation.navigate('BuildingAccessQrScreen');
            }}
            rotation={0}
          />
          <IconButton
            type="bell"
            className="pl-2"
            width={24}
            height={24}
            color="#000000"
            onPress={() => {
              navigation.navigate('AllNotificationsScreen');
            }}
            rotation={0}
          />
        </View>
      ) : null}
    </View>
  );
};

export default ArtCultureHeader;
