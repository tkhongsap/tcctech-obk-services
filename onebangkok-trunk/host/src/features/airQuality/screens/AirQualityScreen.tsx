import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import {Diverder, HeadText, Header} from '~/components/molecules';
import t from '~/utils/text';
import dayjs from 'dayjs';
import {buildingAccessAction} from '~/features/buildingAccess/store/buildingAccess';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {useHookstate} from '@hookstate/core';
import {ListSelect} from '~/components/molecules/SelectList';
import bmsService from '~/services/bmsService';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import {Screen} from '~/components/templates';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import {logScreenView} from '~/utils/logGA';

const AirQualityScreen = () => {
  const [towerList, setTowerList] = useState<ListSelect[]>([]);
  const navigation = useNavigation();

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const mapTower = useCallback(async () => {
    const towers = await buildingAccessAction.mapTower(languageSelected);
    setTowerList(towers);
  }, [languageSelected]);

  useEffect(() => {
    mapTower();
  }, []);

  useEffect(() => {
    logScreenView('AirQualityScreen');
  }, []);

  const onPressTower = async (
    value: string,
    towerName: string,
    towerId: string,
  ) => {
    const sensors = await bmsService.getSensor(value,languageSelected);
    if (sensors) {
      navigation.navigate('AirQualityDetailScreen', {
        towerName: towerName,
        towerId: towerId,
        floorSensorData: sensors,
      });
    }
  };
  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_air_quality.png')}>
        <Header
          title=""
          leftAction="goBack"
          onPressLeftAction={() => navigation.goBack()}
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
        />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            description={`${dayjs().format(
              'dddd DD MMMM YYYY',
            )} at ${dayjs().format('HH:mm')}`}
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__Air_quality', 'Air Quality')}
            titleColor="default-inverse"
            taglineColor="sky-blue"
            descriptionColor="line"
            descriptionSpacing={16}
          />
        </View>
      </HeaderImage>
      <ScrollView className="w-full px-5">
        <Spacing height={40} />
        <Text weight="medium">{t('General__Buildings', 'Buildings')}</Text>
        <Spacing height={16} />
        <FlatList
          data={towerList}
          scrollEnabled={false}
          contentContainerStyle={{borderColor: '#DCDCDC', borderWidth: 1}}
          ItemSeparatorComponent={() => (
            <View className="px-4">
              <Diverder />
            </View>
          )}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  className={`p-4 flex-row justify-between`}
                  onPress={() =>
                    onPressTower(item.value, item.name, item.value)
                  }>
                  <Text>{item.name}</Text>
                  <Icon type="right" width={16} height={16} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </ScrollView>
    </Screen>
  );
};

export default AirQualityScreen;
