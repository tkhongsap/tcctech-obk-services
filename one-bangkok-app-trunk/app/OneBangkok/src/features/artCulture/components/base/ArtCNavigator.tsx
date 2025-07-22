import {DrawerActions} from '@react-navigation/native';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Text} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';

const ArtCNavigator = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View className="w-full bg-jet-black-light py-4 px-4">
      <View className="flex flex-row w-full max-w-[320px] items-center justify-between">
        <Pressable className="flex flex-row justify-center bg-white py-1 px-2 rounded-3xl">
          <Icon type="homeIcon" width={16} height={16} color="#000000" />
          <Text className="text-jet-black-light pl-2 pr-1 font-obMedium">
            Home
          </Text>
        </Pressable>

        <IconButton
          type="qrCode"
          width={24}
          height={24}
          color="#767575"
          onPress={() => {
            navigation.navigate('BuildingAccessQrScreen');
          }}
        />

        <IconButton
          type="bell"
          className="pl-2"
          width={24}
          height={24}
          color="#767575"
          onPress={() => {
            navigation.navigate('AllNotificationsScreen');
          }}
        />

        <IconButton
          type="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          color="#767575"
          width={27}
          height={27}
        />
      </View>
      <View style={{height: insets.bottom}} />
    </View>
  );
};

export default ArtCNavigator;
