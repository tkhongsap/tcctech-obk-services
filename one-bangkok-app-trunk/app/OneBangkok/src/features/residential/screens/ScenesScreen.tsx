import {
  View,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Text, IconType} from '~/components/atoms';
import netatmoService from '~/services/residentialService/NetatmoService';
import {isTablet} from '../utils/device';
import {homeAutomationBrideId} from '~/states/residentialSchedule/residentialScheduleState';

type SceneIcon = {
  key: string;
  icon: IconType;
};

type scenarios = {
  type: string;
  id: string;
  category: string;
  customizable: boolean;
  editable: boolean;
  deletable: boolean;
  name: string;
  icon: any;
};

export const sceneIcons: SceneIcon[] = [
  {key: 'Home', icon: 'scHomeIcon'},
  {key: 'Away', icon: 'scAwayIcon'},
  {key: 'Wake up', icon: 'scWakeupIcon'},
  {key: 'Sleep', icon: 'scSleepIcon'},
  {key: 'Light Off', icon: 'scLightoffIcon'},
  {key: 'Exhibition', icon: 'scOtherIcon'},
  {key: 'Training room', icon: 'scOtherIcon'},
  {key: 'OFF', icon: 'scOtherIcon'},
  {key: 'Read', icon: 'scReadIcon'},
  {key: 'Show', icon: 'scOtherIcon'},
  {key: 'Open all shutters', icon: 'scShutterIcon'},
  {key: 'Close all shutters', icon: 'scShutterIcon'},
  {key: 'Scenario 1p', icon: 'scOtherIcon'},
  {key: 'Other', icon: 'scOtherIcon'},
  {key: 'Bedtime', icon: 'scSleepIcon'},
];

const ScenesScreen = () => {
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [scenesData, setScenesData] = useState<scenarios[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getScenesData();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScenesData = async () => {
    const {data} = await netatmoService.getScenario();
    mapScenarios(data.body.home.scenarios);
  };

  const mapScenarios = (scenarios: any) => {
    scenarios.map((scenario: any) => {
      if (scenario.name == null) {
        let name = textFormatHandle(scenario.type);
        scenario.name = name;
        let icon = sceneIcons.find((icon: any) => {
          return icon.key == name;
        });
        if (icon) scenario.icon = icon.icon;
      }
    });
    setScenesData(scenarios);
  };
  const textFormatHandle = (text: any) => {
    if (text.length === 0) return text;
    let newText = text.replace(/_/g, ' ');
    return newText.charAt(0).toUpperCase() + newText.slice(1);
  };

  const selectScene = async (name: string, id: string) => {
    setSelectedScene(id);
    await netatmoService.setStateModulesDevice('set launch state', [
      {
        id: homeAutomationBrideId.get(),
        scenario: id,
      },
    ]);
    setTimeout(() => {
      setSelectedScene('');
    }, 2000);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    const itemWidth = (width - 24) / 3;
    setContainerWidth(itemWidth);
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title="Scenes"
        titleColor="dark-gray"
        bgColor="bg-white"
      />

      <ScrollView
        className={
          isTablet
            ? getTheme('w-[780px] h-full bg-white p-3')
            : getTheme('w-full h-full bg-white p-3')
        }>
        <View
          className={'flex flex-row flex-wrap py-10'}
          style={{gap: 12}}
          onLayout={handleLayout}>
          {scenesData.map(({id, name, icon}) => (
            <TouchableOpacity
              key={id}
              onPress={() => selectScene(name, id)}
              className={
                isTablet
                  ? getTheme(
                      'flex-col p-3 pt-8 justify-end bg-[#014541] aspect-auto',
                    )
                  : getTheme(
                      'aspect-square p-3 flex-col justify-end bg-[#014541]',
                    )
              }
              style={{width: containerWidth}}>
              <View style={{width: '100%', height: 30, paddingBottom: 12}}>
                {selectedScene === id ? (
                  <Icon
                    className="flex items-start"
                    type="scCheckedIcon"
                    height={20}
                    width={20}
                    color={'#B0F0D5'}
                  />
                ) : null}
              </View>
              {selectedScene === name ? (
                <View>
                  <Icon
                    className="items-start justify-end"
                    type={icon}
                    height={16}
                    width={16}
                    color={'#B0F0D5'}
                  />
                  <Text
                    className={getTheme('text-[#B0F0D5] mt-1')}
                    size="B2"
                    weight="regular">
                    {name}
                  </Text>
                </View>
              ) : (
                <View>
                  <Icon
                    className="items-start justify-end"
                    type={icon}
                    height={16}
                    width={16}
                    color={'#FDFDFD'}
                  />
                  <Text
                    className={getTheme('text-[#FDFDFD] mt-1')}
                    size="B2"
                    weight="regular">
                    {name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity
            className="aspect-square p-3 flex flex-col justify-end border border-[#014541]"
            style={{width: blockWidth}}
            onPress={() => navigation.navigate('AddSceneScreen')}>
            <Icon
              className="flex-1 items-start justify-end"
              type={'plusIcon'}
              height={12}
              width={12}
              color={'#014541'}
            />
            <Text className={getTheme('text-xs  text-[#014541] mt-1')}>
              Add a scene
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default ScenesScreen;
