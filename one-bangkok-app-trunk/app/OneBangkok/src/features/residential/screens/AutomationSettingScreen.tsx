import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Icon} from '~/components/atoms';

type Menu = {
  key: string;
  screen: keyof Pick<
    RootStackParamList,
    'ResidentialManageMyHomeScreen' | 'ScenesScreen' | 'SettingSceneScreen'
  >;
};

const AutomationSettingScreen = () => {
  const navigation = useNavigation();

  const menus: Menu[] = [
    {
      key: 'Manage my homesss',
      screen: 'ResidentialManageMyHomeScreen',
    },
    {key: 'Scenes', screen: 'SettingSceneScreen'},
    {key: 'Schedules', screen: 'ScenesScreen'}, // TODO: change this screen to SchedulesScreen
  ];

  return (
    <ScreenContainer bgColor={'#FFFFFF'} barStyle={'dark-content'}>
      <Header
        leftAction="goBack"
        title="Home Automation"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <ScrollView className="w-full bg-white">
        <View className={'flex flex-col px-4 mt-6'}>
          <Text className={getTheme('text-default text-3xl font-medium')}>
            Unit C3A - 32001
          </Text>
          <View className={'flex flex-row justify-between gap-2'}>
            <Text className={getTheme('text-subtitle-muted text-sm')}>
              Tower X
            </Text>
          </View>
        </View>
        <View className={'flex flex-row px-4 mt-4'}>
          <View
            className={
              'flex-1 flex-row justify-center py-3 border-b border-line-light'
            }>
            <Text
              className={getTheme('text-subtitle-muted')}
              onPress={() => navigation.navigate('AutomationHomeScreen')}>
              Home
            </Text>
          </View>
          <View
            className={
              'flex-1 flex-row justify-center py-3 border-b border-dark-teal-light'
            }>
            <Text className={getTheme('text-dark-teal font-medium')}>
              Settings
            </Text>
          </View>
        </View>
        <View className="flex flex-col p-4 mt-3" style={{gap: 12}}>
          <Text className={getTheme('text-default font-medium')}>
            C3A-32001
          </Text>
          <View className="flex flex-col px-4 border border-line-light">
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
    </ScreenContainer>
  );
};

export default AutomationSettingScreen;
