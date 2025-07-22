import React, {useCallback, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {Header, HeadText} from '~/components/molecules';
import {View, useWindowDimensions, FlatList} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import getTheme from '~/utils/themes/themeUtils';
import AirQualityInfoTab from '~/features/buildingAccess/components/AirQualityInfoTab';
import {
  AirQualityIndex,
  AirQualityIndexIndicator,
} from 'ob-bms-sdk/dist/api';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AirQualityDetailInfoScreen'
>;

export interface SensorData {
  tower_id: string;
  floor_id: string;
  zone_id: string;
  sensor_type: any;
  value: string;
  unit: string;
  updated_at: string;
  indicator: string;
  color_code: string;
}

const AirQualityInfo = ({item}: {item: AirQualityIndexIndicator}) => {
  const defaultSelected = appLanguageActions.getLanguage();
  const formatDisplayRange = ranges => {
    const results = [];
    for (const range of ranges) {
      const min = range.min_display;
      const max = range.max_display;

      if (min && !max) {
        results.push(min);
      } else if (!min && max) {
        results.push(`<${max}`);
      } else if (min && max) {
        results.push(`${min}-${max}`);
      }
    }
    return results.join(' or ');
  };
  return (
    <View className="flex flex-row  items-baseline mt-4 mb-4 ">
      <View
        className="rounded-full w-3 h-3"
        style={{backgroundColor: item.color_code}}></View>
      <Spacing width={10} />
      <View>
        <Text weight="bold">{`${formatDisplayRange(
          item.air_quality_index_indicator_range,
        )} · ${item.title[defaultSelected]}`}</Text>
        <Text size="B2" color="subtitle-muted">
          {item.description[defaultSelected]}
        </Text>
      </View>
    </View>
  );
};

const AirQualitysInfo = ({
  sensorData,
  indicator,
}: {
  sensorData: SensorData;
  indicator: AirQualityIndex[];
}) => {
  const defaultSelected = appLanguageActions.getLanguage();
  const mapType = () => {
    let value = sensorData?.value;
    let sensorType = sensorData?.sensor_type;
    const indicators = sensorData?.indicator;
    const nameIndicator = indicator?.name;

    if (!value) {
      value = 'N/A';
    }
    if (!sensorType) {
      sensorType = nameIndicator;
    }
    switch (sensorType) {
      case 'PM2.5':
        return `${value} µg/m3 · ${indicators}`;
      case 'PM10':
        return `${value} µg/m3 · ${indicators}`;
      case 'Temperature':
        return `${value} °C · ${indicators}`;
      case 'Humidity':
        return `${value} % · ${indicators}`;
      case 'CO2':
        return `${value} ppm · ${indicators}`;
    }
  };

  const renderItem = ({item}: {item: AirQualityIndex[]}) => {
    return (
      <View className={getTheme('border-b border-line mx-3')}>
        <View className="flex w-full mt-6">
          <View>
            <Text size="H3" weight="bold">
              {mapType()}
            </Text>
            <Spacing height={10} />
            <Text size="B2" weight="regular">
              {item.description[defaultSelected]}
            </Text>
            <Spacing height={20} />
            <Text weight="medium">Indicator</Text>
          </View>
        </View>
        <FlatList
          data={item.air_quality_index_indicator}
          ItemSeparatorComponent={() => (
            <View className={getTheme('border-b border-line')} />
          )}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => {
            return <AirQualityInfo item={item} />;
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={[indicator]}
      extraData={indicator}
      renderItem={renderItem}
    />
  );
};
interface dataTab {
  renderScene: any;
  routes: {
    key: string;
    title: any;
  }[];
  data: object[];
  index: number;
}
const AirQualityDetailInfoScreen = ({
  route: {
    params: {selectFloor, floorSensorData, selectType, towerName},
  },
}: Props) => {
  const [dataTab, setDataTab] = useState<dataTab>();
  const layout = useWindowDimensions();
  const getAirQualitys = useCallback(() => {
    if (selectFloor.floorId && selectType) {
      let indicatorList: any[] = [];
      const existingFloorsSensor = floorSensorData?.flatMap(value => {
        const existingFloor = value.floors.find(
          floor => floor.floor_id === selectFloor.floorId,
        );
        return existingFloor ? [existingFloor] : [];
      });

      floorSensorData?.flatMap(value => {
        indicatorList.push(...value.indicator);
        const existingFloor = value.indicator.find(
          indicator => indicator.name === selectType.name,
        );
        return existingFloor ? existingFloor : [];
      });

      const routesList: {key: string; title: string}[] = [];
      const renderSceneObj: any = {};

      indicatorList.map(item => {
        const nameSpotType =
          item.display_name[appLanguageActions.getLanguage()] ?? item.name;

        const findSensorData = existingFloorsSensor[0].sensors.find(
          value => value.sensor_type === item.name,
        );

        let Route = () => (
          <AirQualitysInfo sensorData={findSensorData!} indicator={item} />
        );
        routesList.push({
          key: nameSpotType.replaceAll(' ', ''),
          title: nameSpotType,
        });
        renderSceneObj[nameSpotType.replaceAll(' ', '')] = Route;
      });

      setDataTab(p => ({
        ...p,
        renderScene: renderSceneObj,
        routes: routesList,
        data: indicatorList,
        index: selectType.index,
      }));
    }
  }, [selectFloor, selectType]);
  useEffect(() => {
    getAirQualitys();
  }, [getAirQualitys, selectFloor, selectType]);

  useEffect(() => {
    logScreenView('AirQualityDetailInfoScreen');
  }, []);

  return (
    <View className=" bg-white h-full z-50">
      <Header title="Floor Details" leftAction="goBack" />
      <Spacing height={30} />

      <View className="flex-row px-4 w-full ">
        <HeadText
          tagline={`One Bangkok ${towerName}`}
          taglineColor={'vp-pass-date'}
          title={selectFloor.name}
        />
        <Spacing width={12} />
      </View>
      <Spacing height={12} />
      <View
        className={getTheme('px-4 w-full')}
        style={{height: layout.height / 1.4}}>
        {dataTab?.renderScene && dataTab?.routes && (
          <AirQualityInfoTab
            sceneMap={dataTab.renderScene}
            routes={dataTab.routes}
            selectedIndex={dataTab.index}
          />
        )}
      </View>
    </View>
  );
};

export default AirQualityDetailInfoScreen;
