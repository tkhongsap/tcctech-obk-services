import {FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import {Header} from '~/features/residential/components/Header';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {useEffect, useState} from 'react';
import {useHookstate} from '@hookstate/core';
import _firebaseState from '~/states/firebase';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import accessLocalInformationService, {
  AccessLocalInformationType,
} from '../../../services/accessLocalInformation';
import getTheme from '~/utils/themes/themeUtils';
import {logScreenView} from '~/utils/logGA';
import {SafeAreaView} from 'react-native-safe-area-context';
import firebaseConfigState from '~/states/firebase';

export type AccessLocalInformationMenu = {
  name: string;
  iconName: IconType;
  onPress: () => void;
};

export const AccessLocalInformation = () => {
  const enabledWayfinding = firebaseConfigState.enable_wayfinding.value;
  const navigation = useNavigation();
  const [data, setData] = useState<AccessLocalInformationType[]>([]);
  const language = useHookstate(appLanguageState);
  const defaultLanguageSelected =
    language.currentLanguage.get() !== ''
      ? language.currentLanguage.get()
      : language.defaultLanguage.get();

  useEffect(() => {
    const fetchInformation = async () => {
      const data = await accessLocalInformationService.getInformations();
      setData(data);
    };

    fetchInformation();
  }, []);

  const accessLocalInformationManu: AccessLocalInformationMenu[] = [
    {
      name: t('General__Shuttle_bus_information', 'Shuttle bus information'),
      iconName: 'shuttleBus',
      onPress: async () => {
        const shuttleBus = await accessLocalInformationService.mappedContent(
          data,
          1,
          defaultLanguageSelected,
        );
        navigation.navigate('AccessLocalInformationContentDetail', {
          headerText: t(
            'General__Shuttle_bus_information',
            'Shuttle bus information',
          ),
          content: shuttleBus?.content || '',
          link: {
            name: t(
              'General__Shuttle_bus_information_link',
              'View real time information',
            ),
            onPress: () => navigation.navigate('MapScreen'),
          },
        });
      },
    },
    {
      name: t('General__Bts_information', 'BTS information'),
      iconName: 'support',
      onPress: async () => {
        const btsContent = await accessLocalInformationService.mappedContent(
          data,
          2,
          defaultLanguageSelected,
        );
        navigation.navigate('AccessLocalInformationContentDetail', {
          headerText: t('General__Bts_information', 'BTS information'),
          content: btsContent?.content || '',
          link: {
            name: t(
              'General__Bts_information_link',
              'View full timetable on BTS website',
            ),
            onPress: () =>
              btsContent?.url &&
              navigation.navigate('AccessLocalInformationUrl', {
                url: btsContent.url,
              }),
          },
        });
      },
    },
    {
      name: t('General__Mrt_information', 'MRT information'),
      iconName: 'support',
      onPress: async () => {
        const mrtContent = await accessLocalInformationService.mappedContent(
          data,
          3,
          defaultLanguageSelected,
        );
        navigation.navigate('AccessLocalInformationContentDetail', {
          headerText: t('General__Mrt_information', 'MRT information'),
          content: mrtContent?.content || '',
          link: {
            name: t(
              'General__Mrt_information_link',
              'View full timetable on MRT website',
            ),
            onPress: () =>
              mrtContent?.url &&
              navigation.navigate('AccessLocalInformationUrl', {
                url: mrtContent?.url,
              }),
          },
        });
      },
    },
  ];
  if (enabledWayfinding) {
    accessLocalInformationManu.push({
      name: t('Wayfinding', 'Wayfinding'),
      iconName: 'mcWayfinding',
      onPress: async () => {
        navigation.navigate('WayFindingScreen');
      },
    });
  }

  useEffect(() => {
    logScreenView('AccessLocalInformation');
  }, []);

  return (
    <View className={getTheme('h-screen w-screen bg-default')}>
      <SafeAreaView className="h-screen">
        <Header
          leftAction="goBack"
          title={t('General__Access_local', 'Access local Information')}
        />
        <ScrollView className="px-4">
          <FlatList
            scrollEnabled={false}
            data={accessLocalInformationManu}
            extraData={accessLocalInformationManu}
            renderItem={item => {
              return (
                <TouchableOpacity
                  key={`${item.item.name}-${item.index}`}
                  testID={`local-information-${item.index}`}
                  activeOpacity={activeOpacity}
                  className="flex flex-row py-4 border-b border-gray-300 justify-between"
                  onPress={item.item.onPress}>
                  <View>
                    <View className="w-full flex flex-row items-center">
                      <Icon type={item.item.iconName} width={16} height={16} />
                      <Spacing width={12} />
                      <Text weight="medium" color="dark-gray">
                        {item.item.name}
                      </Text>
                    </View>
                  </View>
                  <Icon type="arrowRightIcon" width={12} height={12} />
                </TouchableOpacity>
              );
            }}
          />
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
