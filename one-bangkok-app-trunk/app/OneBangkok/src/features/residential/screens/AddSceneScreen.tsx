import {View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {TextField} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {activeOpacity} from '~/constants';

type Scene = {
  id: string;
  name: string;
  icon: IconType;
};
type SceneList = {
  category: string;
  scenes: Scene[];
};

//mock
const sceneList: SceneList[] = [
  {
    category: 'Life Scenes',
    scenes: [
      {id: 'ls01', name: 'Party', icon: 'scPartyIcon'},
      {id: 'ls02', name: 'Music', icon: 'scMusicIcon'},
      {id: 'ls03', name: 'Cinema', icon: 'scCinemaIcon'},
      {id: 'ls04', name: 'Work', icon: 'scWorkIcon'},
      {id: 'ls05', name: 'Relaxation', icon: 'scRelaxationIcon'},
      {id: 'ls06', name: 'Reading', icon: 'scReadingIcon'},
      {id: 'ls07', name: 'Sport', icon: 'scSportIcon'},
      {id: 'ls08', name: 'Romance', icon: 'scRomanceIcon'},
      {id: 'ls09', name: 'Holiday', icon: 'scHolidayIcon'},
      {id: 'ls10', name: 'Garage', icon: 'scGarageIcon'},
      {id: 'ls11', name: 'Swimming Pool', icon: 'scPoolIcon'},
    ],
  },
  {
    category: 'Devices',
    scenes: [
      {id: 'ds01', name: 'Outlet', icon: 'scOutletIcon'},
      {id: 'ds02', name: 'Light', icon: 'scLightDeviceIcon'},
      {id: 'ds03', name: 'Shutter', icon: 'scShutterDeviceIcon'},
      {id: 'ds04', name: 'Ventilation', icon: 'scVentilationIcon'},
      {id: 'ds05', name: 'Other', icon: 'scOtherDeviceIcon'},
    ],
  },
];
const AddSceneScreen = () => {
  const navigation = useNavigation();
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle={'light-content'}>
      <Header
        leftAction="goBack"
        title="Add a scene"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />

      <View className="bg-line-light p-4 pt-10 w-full" style={{gap: 8}}>
        <Text size="B1">Name</Text>
        <View className="bg-line-light justify-center">
          <TextField
            className="h-[52px]"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            value="Read"
          />
          <Icon
            className="absolute right-4"
            type="close"
            height={12}
            width={12}
            color={'#7C7C7C'}
          />
        </View>
      </View>

      <ScrollView className="w-full bg-white p-4 py-10" style={{gap: 12}}>
        {sceneList.map(({category, scenes}) => (
          <View style={{gap: 12}} key={category}>
            <Text size="B1" weight="medium">
              {category}
            </Text>
            <View className={getTheme('flex flex-col')}>
              {scenes.map(scene => (
                <TouchableOpacity
                  key={scene.id}
                  className="mb-3"
                  activeOpacity={activeOpacity}
                  onPress={() => setSelectedScene(scene)}>
                  <View
                    className={`min-h-[48px] px-5 py-4 flex flex-row justify-between items-center ${getTheme(
                      `border-[1px] ${
                        selectedScene?.name === scene.name
                          ? 'bg-light-gray'
                          : 'border-line'
                      }`,
                    )} `}>
                    <View className="flex-row " style={{gap: 12}}>
                      <Icon
                        className="text-dark-tael-light"
                        type={scene.icon}
                        height={24}
                        width={24}
                        color={'#191919'}
                      />

                      <Text weight="regular" size="B1">
                        {scene.name}
                      </Text>
                    </View>
                    {selectedScene?.name === scene.name && (
                      <Icon
                        type={'checkedIcon'}
                        width={20}
                        height={20}
                        color={'#1A1919'}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <Spacing height={12} />
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() =>
          selectedScene && navigation.navigate('SettingAddSceneScreen')
        }
        className="flex-row  w-full bg-dark-teal-light p-4 justify-between">
        <Text size="B1" weight="medium" color="white">
          Validate
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default AddSceneScreen;
