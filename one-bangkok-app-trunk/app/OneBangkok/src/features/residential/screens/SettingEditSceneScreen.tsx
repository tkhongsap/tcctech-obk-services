import {View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Header} from '../components/Header';
import {Icon, IconType, Text} from '~/components/atoms';
import {ScreenContainer} from '../components';
import ToggleSwitch from '../components/ToggleSwitch';
import {activeOpacity} from '~/constants';
import {modalActions} from '../components/ResidentialModal';
import SceneSettingDelayModal from '../components/SceneSettingDelayModal';
import {useNavigation} from '~/navigations/AppNavigation';
import SceneSettingDelayDurationModal from '../components/SceneSettingDelayDurationModal';
import StatusSlider from '../components/StatusSlider';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

type SettingSceneTime = 'DELAY' | 'DELAY_DERATION';
type Scene = {
  id: string;
  name: string;
  icon: IconType;
  settingTime: SettingSceneTime;
  checked: boolean;
};
type RoomScene = {
  id: string;
  name: string;
  scenes: Scene[];
};

// mock
const mockRoomScenes: RoomScene[] = [
  {
    id: '001',
    name: 'Exhibition',
    scenes: [
      {
        id: 'ex01',
        name: 'Exhibition Dimmer 1',
        icon: 'scPartyIcon',
        settingTime: 'DELAY',
        checked: true,
      },
      {
        id: 'ex02',
        name: 'Light Sofa',
        icon: 'scMusicIcon',
        settingTime: 'DELAY_DERATION',
        checked: true,
      },
      {
        id: 'ex03',
        name: 'Light L now cabinet',
        icon: 'scCinemaIcon',
        settingTime: 'DELAY',
        checked: false,
      },
    ],
  },
  {
    id: '002',
    name: 'Hold Exhibition',
    scenes: [
      {
        id: 'hex01',
        name: 'Exhibition Dimmer 1',
        icon: 'scPartyIcon',
        settingTime: 'DELAY_DERATION',
        checked: true,
      },
      {
        id: 'hex02',
        name: 'Light Sofa',
        icon: 'scMusicIcon',
        settingTime: 'DELAY_DERATION',
        checked: false,
      },
      {
        id: 'hex03',
        name: 'Light L now cabinet',
        icon: 'scCinemaIcon',
        settingTime: 'DELAY_DERATION',
        checked: true,
      },
    ],
  },
];

const SettingEditSceneScreen = () => {
  const navigation = useNavigation();
  const [roomScenes, setRoomScenes] = useState<RoomScene[]>(mockRoomScenes);

  const onPressSceneSettingModal = (key: SettingSceneTime) => {
    modalActions.setContent(
      key === 'DELAY' ? (
        <SceneSettingDelayModal />
      ) : (
        <SceneSettingDelayDurationModal />
      ),
    );
    modalActions.show();
  };

  const handleOnPressCheck = (sceneId: string) => {
    setRoomScenes(prev => {
      return prev.map(room => {
        return {
          ...room,
          scenes: room.scenes.map(scene => ({
            ...scene,
            checked: scene.id === sceneId ? !scene.checked : scene.checked,
          })),
        };
      });
    });
  };

  const onPressDelete = () => {
    modalActions.setContent(
      <ConfirmDeleteModal
        title="Scene deletion"
        description="Are you sure you want to Delete this scene?"
      />,
    );
    modalActions.show();
  };

  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle={'light-content'}>
      <Header
        leftAction="goBack"
        title="Edit scene"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <ScrollView className="w-full bg-white p-4 pt-10 pb-20" style={{gap: 12}}>
        <View className="w-full pb-[120px]">
          <View className="flex flex-row justify-between items-center pb-8">
            <View className="flex flex-row items-center" style={{gap: 12}}>
              <Icon
                className="text-dark-tael-light"
                type="scReadingIcon"
                height={24}
                width={24}
                color={'#333333'}
              />
              <Text size="H4" weight="medium">
                Reading 1
              </Text>
            </View>
            <View className="flex flex-row items-center" style={{gap: 4}}>
              <Icon
                className="text-dark-tael-light text-[#014541]"
                type="scHomeEditIcon"
                height={20}
                width={20}
              />
              <Text
                size="B2"
                weight="medium"
                color="dark-teal"
                onPress={() => navigation.navigate('ResidentialSceneRename')}>
                Rename
              </Text>
            </View>
          </View>
          {roomScenes.map(({id, name, scenes}) => (
            <View style={{gap: 12}} className="pb-3" key={id}>
              <Text size="B1" weight="medium">
                {name}
              </Text>
              {scenes.map(scene => (
                <>
                  {scene.checked ? (
                    <TouchableOpacity
                      key={'selected' + scene.id}
                      activeOpacity={activeOpacity}
                      onPress={() => handleOnPressCheck(scene.id)}>
                      <View
                        className={
                          'min-h-[48px] flex flex-col px-4 py-3 border border-line-light'
                        }
                        style={{gap: 1}}>
                        <View
                          className="flex flex-row justify-between items-center"
                          style={{gap: 8}}>
                          <View
                            className="flex-row items-center"
                            style={{gap: 8}}>
                            <Icon
                              type={'scRadioCheckedIcon'}
                              width={24}
                              height={24}
                              color={'#FFFFFF'}
                            />
                            <Text weight="regular" size="B1">
                              {scene.name}
                            </Text>
                          </View>
                          <View
                            className="flex-row items-center"
                            style={{gap: 12}}>
                            <TouchableOpacity
                              className="w-6 aspect-square rounded-full flex flex-row items-center justify-center bg-[#E4E4E4]"
                              onPress={() =>
                                onPressSceneSettingModal(scene.settingTime)
                              }>
                              <Icon
                                type={'scTimeIcon'}
                                width={12}
                                height={12}
                                color={'#FFFFFF'}
                              />
                            </TouchableOpacity>
                            <ToggleSwitch initialValue={true} />
                          </View>
                        </View>
                        <View className="flex-col items-center">
                          <View className="w-full flex-row items-center justify-between">
                            <Icon
                              type={'scMoonIcon'}
                              width={12}
                              height={12}
                              color={'#292929'}
                            />
                            <Icon
                              type={'scSunIcon'}
                              width={16}
                              height={16}
                              color={'#292929'}
                            />
                          </View>
                        </View>
                        <StatusSlider step={0} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={'non-selected' + scene.id}
                      activeOpacity={activeOpacity}
                      onPress={() => handleOnPressCheck(scene.id)}>
                      <View
                        className={
                          'min-h-[48px] flex flex-col px-4 py-3 border border-line-light'
                        }
                        style={{gap: 8}}>
                        <View
                          className="flex flex-row justify-between items-center"
                          style={{gap: 8}}>
                          <View
                            className="flex-row items-center"
                            style={{gap: 8}}>
                            <Icon
                              type={'scRadioIcon'}
                              width={24}
                              height={24}
                              color={'#FFFFFF'}
                            />
                            <Text weight="regular" size="B1">
                              {scene.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              ))}
            </View>
          ))}

          <Text
            size="B1"
            weight="medium"
            className="text-center text-error-dark mt-5"
            onPress={onPressDelete}>
            Delete scene
          </Text>
        </View>
      </ScrollView>
      <View className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-[16px] justify-between absolute left-0 bottom-0">
        <Text size="B1" weight="medium" color="default-inverse">
          Validate
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </View>
    </ScreenContainer>
  );
};

export default SettingEditSceneScreen;
