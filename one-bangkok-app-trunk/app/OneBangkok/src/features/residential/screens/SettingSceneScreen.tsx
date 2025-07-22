import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Header} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {QuickAction} from '../components/QuickActions';
import {Icon, IconType, Text} from '~/components/atoms';
import {TextField, IconButton} from '~/components/molecules';

type Scene = {
  name: string;
  icon: IconType;
};

const SettingSceneScreen = () => {
  const navigation = useNavigation();
  const sceneOptions: Scene[] = [
    {name: 'Party', icon: 'scPartyIcon'},
    {name: 'Music', icon: 'scMusicIcon'},
    {name: 'Cinema', icon: 'scCinemaIcon'},
    {name: 'Work', icon: 'scWorkIcon'},
    {name: 'Relaxation', icon: 'scRelaxationIcon'},
    {name: 'Reading', icon: 'scReadingIcon'},
    {name: 'Sport', icon: 'scSportIcon'},
    {name: 'Romance', icon: 'scRomanceIcon'},
    {name: 'Holiday', icon: 'scHolidayIcon'},
    {name: 'Garage', icon: 'scGarageIcon'},
    {name: 'Swimming Pool', icon: 'scPoolIcon'},
  ];

  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle={'light-content'}>
      <Header
        leftAction="goBack"
        title="Scenes"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />

      <ScrollView className="w-full bg-white p-4 py-10 " style={{gap: 12}}>
        <View style={{gap: 12}} className="pb-20">
          {/* <Text size='B1' weight='medium'>Life Scenes</Text> */}

          {sceneOptions.map(({name, icon}) => (
            <TouchableOpacity
              key={name}
              onPress={() => navigation.navigate('SettingEditSceneScreen')}>
              <View className="min-h-[48px] px-5 py-4 flex flex-row justify-between items-center border-[1px] border-line-light">
                <View className="flex-row " style={{gap: 12}}>
                  <Icon
                    className="text-dark-tael-light"
                    type={icon}
                    height={24}
                    width={24}
                    color={'#191919'}
                  />

                  <Text weight="regular" size="B1" className="">
                    {name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* <TouchableOpacity>
            <View className="min-h-[48px] px-5 py-4 flex flex-row justify-between items-center border-[1px] border-line-light">
              <View className="flex-row " style={{gap: 12}}>
                <Text weight="medium" size="B1" color="dark-teal" className="">
                  Add a scene
                </Text>
              </View>
              <Icon
                className="text-dark-tael-light"
                type="plusIcon"
                height={12}
                width={12}
                color={'#014541'}
              />
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      {/* <TouchableOpacity className='flex-row bg-dark-teal-light p-4 justify-between'>
            <Text size='B1' weight='medium' color='white'>Vaildate</Text>
            <Icon type={'next'} width={20} height={20} color={'#fff'} />
        </TouchableOpacity> */}
    </ScreenContainer>
  );
};

export default SettingSceneScreen;
