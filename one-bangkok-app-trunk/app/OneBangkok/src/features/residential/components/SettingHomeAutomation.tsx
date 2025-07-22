import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {
  RootStackParamList,
  useNavigation,
  StackNavigation,
} from '~/navigations/AppNavigation';
type Menu = {
  key: string;
  screen: keyof Pick<
    RootStackParamList,
    'ResidentialManageMyHomeScreen' | 'ScenesScreen' | 'SettingSceneScreen'
  >;
};

const SettingHomeAutomation = () => {
  const navigation = useNavigation<StackNavigation>();

  const menus: Menu[] = [
    {
      key: 'Manage my home',
      screen: 'ResidentialManageMyHomeScreen',
    },
    {key: 'Scenes', screen: 'SettingSceneScreen'},
    {key: 'Schedules', screen: 'ScenesScreen'}, // TODO: change this screen to SchedulesScreen
  ];

  return (
    <ScrollView className="w-full bg-white">
      <Spacing height={40} />
      <View className="flex flex-col">
        <Text className={getTheme('text-default font-medium')}>C3A-32001</Text>
        <Spacing height={16} />
        <View
          className="flex flex-col px-4 border border-line-light"
          style={{gap: 16}}>
          {menus.map(({key, screen}, index) => (
            <TouchableOpacity
              key={key}
              className={`py-4 flex flex-row justify-between items-center border-line-light ${
                index !== menus.length - 1 ? 'border-b' : ''
              }`}
              onPress={() => navigation.navigate(screen)}>
              <Text className={getTheme('text-sm text-default mt-1')}>
                {key}
              </Text>
              <Icon
                type={'arrowRightIcon'}
                height={16}
                width={16}
                color={'#292929'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingHomeAutomation;
