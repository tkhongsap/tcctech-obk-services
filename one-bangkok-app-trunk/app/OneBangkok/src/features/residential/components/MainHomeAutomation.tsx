import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import IconArrowRight from '../../../assets/icons/icon-ob-arrow-right.svg';
import IconLivingRoom from '../../../assets/icons/icon-ob-living-room.svg';
interface MainHomeAutomationProps {
  props: {
    menus: object;
    // Add other props here as needed
  };
}

const MainHomeAutomation: React.FC<MainHomeAutomationProps> = ({props}) => {
  const navigation = useNavigation<StackNavigation>();
  const {width} = useWindowDimensions();
  const gap = 12;
  const padding = 16;
  const totalHorizontalPadding = 2 * padding;
  const totalGaps = 2 * gap;
  const blockWidth = (width - totalHorizontalPadding - totalGaps) / 3;
  return (
    <ScrollView className="w-full bg-white">
      <View className="flex flex-col mt-4 mb-4">
        <View className="flex flex-row justify-between items-center">
          <Text className={getTheme('text-default text-xl font-medium')}>
            Scenes
          </Text>
          <Text
            className={getTheme('text-dark-teal text-sm font-medium')}
            onPress={() => navigation.navigate('ScenesScreen')}>
            View All
          </Text>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap}}>
        {props.menus.map(menu => (
          <TouchableOpacity
            key={menu.key}
            className="aspect-square p-3 flex flex-col justify-end bg-[#014541]"
            style={{width: blockWidth}}>
            <Icon
              className="flex-1 items-start justify-end"
              type={menu.icon}
              height={16}
              width={16}
              color={'#FDFDFD'}
            />
            <Text className={getTheme('text-sm text-[#FDFDFD] mt-1')}>
              {menu.key}
            </Text>
          </TouchableOpacity>
        ))}
         </View>
        <View className="flex flex-col mt-4">
          <Text className={getTheme('text-default text-xl font-medium')}>
            Rooms
          </Text>
          <View className={'flex flex-col'} style={{gap: 4}}>
            <TouchableOpacity className="flex flex-row justify-between items-center" onPress={() => navigation.navigate('ResidentialRoomScreen')}>
              <View
                className={'flex flex-col justify-start p-2'}
                style={{gap: 4}}>
                <View className={'flex flex-row items-center'} style={{gap: 8}}>
                  <IconLivingRoom color="#292929" width="16" height="17" />
                  <Text className={getTheme('text-jet-black font-medium')}>
                    Living Room
                  </Text>
                </View>
                <View className={'flex flex-row items-center'}>
                  <Icon
                    type={'aqTempIcon'}
                    width={8}
                    height={14}
                    color={'#7C7C7C'}
                  />
                  <Text className={getTheme('text-subtitle-muted mr-1')}>
                    25.5 °C
                  </Text>
                  <Icon
                    type={'scLightIcon'}
                    width={14}
                    height={14}
                    color={'#7C7C7C'}
                  />
                </View>
              </View>
              <IconArrowRight color="#292929" width="16" height="16" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row justify-between items-center">
              <View
                className={'flex flex-col justify-start p-2'}
                style={{gap: 4}}>
                <View className={'flex flex-row items-center'} style={{gap: 8}}>
                  <IconLivingRoom color="#292929" width="16" height="17" />
                  <Text className={getTheme('text-jet-black font-medium')}>
                    Bed Room 1
                  </Text>
                </View>
                <View className={'flex flex-row items-center'}>
                  <Icon
                    type={'aqTempIcon'}
                    width={8}
                    height={14}
                    color={'#7C7C7C'}
                  />
                  <Text className={getTheme('text-subtitle-muted mr-1')}>
                    20.0 °C
                  </Text>
                  <Icon
                    type={'scLightIcon'}
                    width={14}
                    height={14}
                    color={'#7C7C7C'}
                  />
                </View>
              </View>
              <IconArrowRight color="#292929" width="16" height="16" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row justify-between items-center">
              <View
                className={'flex flex-col justify-start p-2'}
                style={{gap: 4}}>
                <View className={'flex flex-row items-center'} style={{gap: 8}}>
                  <IconLivingRoom color="#292929" width="16" height="17" />
                  <Text className={getTheme('text-jet-black font-medium')}>
                    Bed Room 2
                  </Text>
                </View>
                <View className={'flex flex-row items-center'}>
                  <Icon
                    type={'aqTempIcon'}
                    width={8}
                    height={14}
                    color={'#7C7C7C'}
                  />
                  <Text className={getTheme('text-subtitle-muted mr-1')}>
                    17.0 °C
                  </Text>
                  <Icon
                    type={'scLightIcon'}
                    width={14}
                    height={14}
                    color={'#7C7C7C'}
                  />
                </View>
              </View>
              <IconArrowRight color="#292929" width="16" height="16" />
            </TouchableOpacity>
          </View>
       
      </View>
    </ScrollView>
  );
};

export default MainHomeAutomation;
