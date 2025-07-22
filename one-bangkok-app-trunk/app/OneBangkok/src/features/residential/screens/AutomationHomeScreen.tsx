import {
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import IconArrowRight from '../../../assets/icons/icon-ob-arrow-right.svg';
import IconLivingRoom from '../../../assets/icons/icon-ob-living-room.svg';
import {Icon, IconType, Text, Spacing} from '~/components/atoms';
import netatmoService from '~/services/residentialService/NetatmoService';
import {useResidentialUnitSelectedState} from '~/states/residentialTenant/residentialTenantState';
import {
  Home,
  homeAutomationBrideId,
  useResidentialHomeState,
} from '~/states/residentialSchedule/residentialScheduleState';
import {isTablet} from '../utils/device';
import {useFocusEffect} from '@react-navigation/native';
import {Header} from '../components/Header';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import firebaseConfigState from '~/states/firebase';
import {sceneIcons} from './ScenesScreen';

type HomeMenu = {
  key: string;
  icon: IconType;
};
type Scenario = {
  type: string;
  id: string;
  category: string;
  customizable: boolean;
  editable: boolean;
  deletable: boolean;
  name: string;
  icon: any;
};
type Tab = 'HOME' | 'SETTING';
type SettingMenu = {
  key: string;
};

const settingMenus: SettingMenu[] = [{key: 'Schedules'}];

const AutomationHomeScreen = () => {
  const delayGetResidentHomeAutomation =
    firebaseConfigState.delay_get_resident_home_automation.value || 1000; //MS
  const navigation = useNavigation();
  const homeState = useResidentialHomeState();
  const [selectedTab, setSelectedTab] = useState<Tab>('HOME');
  const [homeData, setHomeData] = useState<Home>();
  const [scenesData, setScenesData] = useState<Scenario[]>([]);
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState(0);
  const unitSelectedState = useResidentialUnitSelectedState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [moduleBridge, setModuleBridge] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIsFirstLoad(true);
    preload(3);
  }, []);

  const preload = async (retry: number = 1) => {
    try {
      setIsLoading(true);
      await sleep(delayGetResidentHomeAutomation);
      const isHomeApiAvailable = await Promise.all([
        getHomeData(),
        getScenesData(),
      ]);

      if (isHomeApiAvailable.includes(false)) {
        if (retry >= 1) {
          await preload(retry - 1);
        } else {
          navigateToErrorScreen();
        }
      } else {
        setIsFirstLoad(false);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const getScenesData = async () => {
    try {
      const {data} = await netatmoService.getScenario();
      mapScenarios(data.body.home.scenarios);
    } catch (error) {
      return false;
    }
  };

  const getHomeData = async () => {
    try {
      const home = await residentialScheduleAction.getHome();
      if (home == undefined) {
        return false;
      }
      setHomeData(home);
      homeState.set(home);
      updateModuleBridge(home);
      return true;
    } catch (error) {
      return false;
    }
  };

  const mapScenarios = (scenarios: Scenario[]) => {
    scenarios.map(scenario => {
      if (scenario.name == null) {
        let name = textFormatHandle(scenario.type);
        scenario.name = name;
        let icon = sceneIcons.find(icon => {
          return icon.key == name;
        });
        if (icon) scenario.icon = icon.icon;
      }
    });
    setScenesData(scenarios);
  };

  const updateModuleBridge = (home: Home) => {
    if (home.rooms.length > 0) {
      if (home.rooms[0].module.length > 0) {
        const bridge = home.rooms[0].module[0].bridge;
        setModuleBridge(bridge);
        homeAutomationBrideId.set(bridge);
      }
    }
  };

  const textFormatHandle = (text: any) => {
    if (text.length === 0) return text;
    let newText = text.replace(/_/g, ' ');
    return newText.charAt(0).toUpperCase() + newText.slice(1);
  };

  const isSomeLightOn = (modules: any[]) => modules.some(e => e.on);

  const isAcOn = (modules: any[]) => modules.some(e => e.cooler_status);
  const selectScene = async (name: string, id: string) => {
    setSelectedScene(id);
    const {status} = await netatmoService.setStateModulesDevice(
      'set launch state',
      [
        {
          id: moduleBridge,
          scenario: id,
        },
      ],
    );
    if (status === 200) {
      getHomeData();
    }
    setTimeout(() => {
      setSelectedScene('');
    }, 2000);
  };

  const onPressLightIcon = async (module: any) => {
    const isOpen = isSomeLightOn(module);
    let on = true;
    if (isOpen) {
      on = false;
    }
    module.map(async (module: any) => {
      if (module.type == 'BNLD' || module.type == 'BNIL') {
        await netatmoService.setStateModulesDevice('set light', [
          {
            id: module.id,
            bridge: module.bridge,
            on: on,
          },
        ]);
      }
    });
    getHomeData();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    const _itemWidth = (width - 26) / 3;
    setContainerWidth(_itemWidth);
  };

  const onPressSettingMenu = (key: string) => {
    switch (key) {
      case 'Schedules':
        homeData !== undefined &&
          navigation.navigate('ResidentialSchedulesScreen');
        break;
      case 'Manage my home':
        navigation.navigate('ResidentialManageMyHomeScreen');
        break;

      case 'Scenes':
        navigation.navigate('SettingSceneScreen');
        break;

      default:
        break;
    }
  };

  const mappingSettingMenuLanguage = (key: string) => {
    switch (key) {
      case 'Schedules':
        return t('Residential__Home_Automation__Schedules', 'Schedules');

      default:
        break;
    }
  };
  // Reload after fetch
  useFocusEffect(
    useCallback(() => {
      loadAfterBack();
    }, [isFirstLoad]),
  );

  const sleep = (ms: number) =>
    new Promise<void>(resolve => setTimeout(resolve, ms));

  const loadAfterBack = async () => {
    try {
      if (isFirstLoad) {
        return false;
      }

      setIsLoading(true);
      await sleep(delayGetResidentHomeAutomation);
      const isHomeApiAvailable = await Promise.all([
        getHomeData(),
        getScenesData(),
      ]);

      if (isHomeApiAvailable.includes(false)) {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      if (!isFirstLoad) {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const isHomeApiAvailable = await Promise.all([
        getHomeData(),
        getScenesData(),
      ]);
      if (isHomeApiAvailable.includes(false)) {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'ResidentialHomeScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ResidentialHomeScreen'),
    });
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Home_Automation__Home_Automation',
          'Home Automation',
        )}
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      {!isLoading && (
        <ScrollView
          className={
            isTablet
              ? getTheme('w-[780px] h-full bg-white')
              : getTheme('w-full h-full bg-white')
          }
          scrollEnabled={!isLoading}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="pb-10">
            <View className={'flex flex-col px-4 mt-6'}>
              <View className={'flex flex-row justify-between gap-2'}>
                <Text size="B2" weight="regular" color="subtitle-muted">
                  {unitSelectedState.projectName.get()}
                </Text>
              </View>
              <Text size="H2" weight="medium" color="dark-gray">
                {unitSelectedState.selectedUnit.get()}
              </Text>
            </View>
            <View className={'flex flex-row px-4 mt-4'}>
              <Pressable
                onPress={() => setSelectedTab('HOME')}
                disabled={isLoading}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === 'HOME'
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={selectedTab === 'HOME' ? 'medium' : 'regular'}
                  color={
                    selectedTab === 'HOME' ? 'dark-teal' : 'subtitle-muted'
                  }>
                  {t('Residential__Home_Automation__Home', 'Home')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedTab('SETTING')}
                disabled={isLoading}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === 'SETTING'
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={selectedTab === 'SETTING' ? 'medium' : 'regular'}
                  color={
                    selectedTab === 'SETTING' ? 'dark-teal' : 'subtitle-muted'
                  }>
                  {t('Residential__Home_Automation__Settings', 'Settings')}
                </Text>
              </Pressable>
            </View>
            {selectedTab === 'HOME' ? (
              <>
                <View className="flex flex-col p-4 mt-4" style={{gap: 12}}>
                  <View className="flex flex-row justify-between items-center">
                    <Text size="H3" weight="medium" color="default">
                      {t('Residential__Home_Automation__Scenes', 'Scenes')}
                    </Text>
                    <Text
                      size="B2"
                      weight="medium"
                      color="dark-teal"
                      onPress={() => navigation.navigate('ScenesScreen')}>
                      {t('Residential__Home_Automation__View_All', 'View All')}
                    </Text>
                  </View>
                  <View
                    className={'flex flex-row flex-wrap'}
                    style={{gap: 12}}
                    onLayout={handleLayout}>
                    {scenesData.slice(0, 6).map(({id, name, icon}) => (
                      <TouchableOpacity
                        key={id}
                        className={
                          isTablet
                            ? getTheme(
                                'flex-col p-3 pt-8 justify-end bg-[#014541] aspect-auto',
                              )
                            : getTheme(
                                'aspect-square p-3 flex-col justify-end bg-[#014541]',
                              )
                        }
                        onPress={() => selectScene(name, id)}
                        style={{width: containerWidth}}>
                        <View
                          style={{
                            width: '100%',
                            height: 30,
                            paddingBottom: 12,
                          }}>
                          {selectedScene === id && (
                            <Icon
                              className="flex items-start"
                              type="scCheckedIcon"
                              height={20}
                              width={20}
                              color={'#B0F0D5'}
                            />
                          )}
                        </View>
                        <Icon
                          className="items-start justify-end"
                          type={icon}
                          height={16}
                          width={16}
                          color={'#FFFFFF'}
                        />
                        <Text
                          className={getTheme('text-white mt-1')}
                          size="B2"
                          weight="regular">
                          {name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View className="flex flex-col p-4" style={{gap: 12}}>
                  <Text size="H3" weight="medium" color="default">
                    {t('Residential__Home_Automation__Rooms', 'Rooms')}
                  </Text>
                  <View className={'flex flex-col'}>
                    {homeData?.rooms.map(
                      ({
                        id,
                        name,
                        type,
                        module,
                        therm_measured_temperature,
                        cooling_setpoint_temperature,
                        cooling_setpoint_end_time,
                        cooling_setpoint_mode,
                      }) => (
                        // <TouchableOpacity
                        //   key={id}
                        //   className="flex flex-row justify-between items-center"
                        //   onPress={() =>
                        //     navigation.navigate('ResidentialRoomScreen', {
                        //       title: name,
                        //       module: module,
                        //     })
                        //   }>
                        //   <View
                        //     className={'flex flex-col justify-start p-2'}
                        //     style={{gap: 4}}>
                        //     <View
                        //       className={'flex flex-row items-center'}
                        //       style={{gap: 8}}>
                        //       <IconLivingRoom
                        //         color="#292929"
                        //         width="16"
                        //         height="17"
                        //       />
                        //       <Text
                        //         className={getTheme('text-jet-black font-medium')}>
                        //         {name}
                        //       </Text>
                        //     </View>
                        //     <View className={'flex flex-row items-center'}>
                        //       <Icon
                        //         type={'aqTempIcon'}
                        //         width={8}
                        //         height={14}
                        //         color={'#7C7C7C'}
                        //       />
                        //       <Text
                        //         className={getTheme('text-subtitle-muted mr-1')}>
                        //         {therm_measured_temperature} °C
                        //       </Text>
                        //       <Icon
                        //         type={'scLightIcon'}
                        //         width={14}
                        //         height={14}
                        //         color={'#7C7C7C'}
                        //       />
                        //     </View>
                        //   </View>
                        //   <IconArrowRight color="#292929" width="16" height="16" />
                        // </TouchableOpacity>
                        <TouchableOpacity
                          key={id}
                          disabled={isLoading}
                          onPress={() =>
                            navigation.navigate('ResidentialRoomScreen', {
                              title: name,
                              module: module,
                              temperature: cooling_setpoint_temperature,
                              homeId: homeData.id,
                            })
                          }
                          className="flex flex-row justify-between items-center min-h-[80px]">
                          <View
                            className={'flex flex-col justify-start px-2'}
                            style={{gap: 4}}>
                            <View
                              className={'flex flex-row items-center'}
                              style={{gap: 8}}>
                              <IconLivingRoom
                                color="#292929"
                                width="16"
                                height="17"
                              />
                              <Text size="B2" weight="medium" color="jet-black">
                                {name}
                              </Text>
                            </View>
                            {isAcOn(module) && (
                              <View
                                className={'flex flex-row items-center h-6'}>
                                <>
                                  <Icon
                                    type={'aqTempIcon'}
                                    width={8}
                                    height={14}
                                    color={'#7C7C7C'}
                                  />
                                  {!isAcOn(module) ? (
                                    <></>
                                  ) : (
                                    // <Text
                                    //   size="B1"
                                    //   weight="regular"
                                    //   color="subtitle-muted"
                                    //   className={getTheme('mr-1')}>
                                    //   OFF
                                    // </Text>
                                    <Text
                                      size="B1"
                                      weight="regular"
                                      color="subtitle-muted"
                                      className={getTheme('mr-1')}>
                                      {cooling_setpoint_temperature} °C
                                    </Text>
                                  )}
                                </>
                              </View>
                            )}
                          </View>
                          <View
                            className="flex flex-row items-center"
                            style={{gap: 12}}>
                            <TouchableOpacity
                              className=""
                              onPress={() => onPressLightIcon(module)}
                              disabled={isLoading}>
                              {isSomeLightOn(module) ? (
                                <View className="w-[44px] h-[44px] rounded-full bg-[#FFF1C5] flex flex-row items-center justify-center">
                                  <Icon
                                    type={'scLightonIcon'}
                                    width={12}
                                    height={16}
                                    color={'#FF9500'}
                                  />
                                </View>
                              ) : (
                                <View className="w-[44px] h-[44px] rounded-full bg-light-gray-light flex flex-row items-center justify-center">
                                  <Icon
                                    type={'scLightIcon'}
                                    width={12}
                                    height={16}
                                    color={'#7C7C7C'}
                                  />
                                </View>
                              )}
                            </TouchableOpacity>
                            <View>
                              <IconArrowRight
                                color="#292929"
                                width="16"
                                height="16"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                  <Spacing height={40} />
                </View>
              </>
            ) : (
              <View className="flex flex-col p-4 mt-6" style={{gap: 12}}>
                <View className="flex flex-col px-4 border border-line-light">
                  {settingMenus.map(({key}, index) => (
                    <TouchableOpacity
                      key={key}
                      className={`py-4 flex flex-row justify-between items-center border-line-light ${
                        index !== settingMenus.length - 1 ? 'border-b' : ''
                      }`}
                      onPress={() => onPressSettingMenu(key)}
                      disabled={homeData === undefined}>
                      <Text
                        className={getTheme('mt-1')}
                        size="B1"
                        weight="regular"
                        color="default">
                        {mappingSettingMenuLanguage(key)}
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
            )}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
};
const styles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap', // จัดเรียงไอเท็มที่เกินจาก 3 ไอเท็มในแถวแรกไปยังแถวถัดไป
    justifyContent: 'space-between', // เว้นช่องว่างระหว่างไอเท็ม
    paddingHorizontal: 4,
  },

  item: {
    width: '32.5%', // ปรับให้แถวมี 3 ไอเท็มพอดี
    marginBottom: 8, // เพิ่มช่องว่างระหว่างแถว
  },
};
export default AutomationHomeScreen;
