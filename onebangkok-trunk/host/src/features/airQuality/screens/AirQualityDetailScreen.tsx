import {View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HeadText, Header, useModal} from '~/components/molecules';
import t from '~/utils/text';
import {Icon, Spacing, Text, iconTypes} from '~/components/atoms';
import dayjs from 'dayjs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {buildingAccessAction} from '~/features/buildingAccess/store/buildingAccess';
import getTheme from '~/utils/themes/themeUtils';
import {find, isEmpty} from 'lodash';
import {SensorData} from 'ob-bms-sdk/dist/api';
import {useNavigation} from '~/navigations/AppNavigation';
import {logScreenView} from '~/utils/logGA';

interface AirDetailProps {
  title: string;
  description: string;
  iconType: keyof typeof iconTypes;
  value: {value: string; indicator: string; colorCode?: string};
  type?: string;
}

const ModalSelectFloor = ({
  selected,
  onPressCancel,
  onPressDone,
  options,
}: {
  selected: string;
  onPressCancel: any;
  onPressDone: any;
  options: ListSelect[];
}) => {
  const [selectedArea, setSelectedArea] = useState(selected);

  const handleAreaSelection = (value: string) => {
    setSelectedArea(value);
  };

  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="date-picker-cancel-id"
          color="primary"
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {t('General__Floor', 'Floor')}
        </Text>
        <Text
          testID="date-picker-done-id"
          color="primary"
          weight="medium"
          className="text-right"
          onPress={() => onPressDone && onPressDone(selectedArea)}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      <ScrollView className="w-full">
        <Spacing height={24} />
        <SelectList
          data={options}
          onPress={handleAreaSelection}
          selected={selectedArea}
        />
      </ScrollView>
    </>
  );
};


const AirQualityDetail = (props: AirDetailProps) => {
  const {title, description, iconType, value, type} = props;

  const mapType = () => {
    let values = value.value
    if (values === '0') {
      values = 'N/A';
    }

    switch (type) {
      case 'PM2.5':
        return `${values} µg/m3`;
      case 'PM10':
        return `${values} µg/m3`;
      case 'Temperature':
        return `${values} °C`;
      case 'Humidity':
        return `${values} %`;
      case 'CO2':
        return `${values} ppm`;
    }
  };
  
  return (
    <View className="">
      <View className="py-4 flex-row items-center justify-between w-full border-b-green-500">
        <View className="flex-row w-[70%]">
          <View className={getTheme('bg-muted-50 p-[8px] rounded')}>
            <Icon type={iconType} />
          </View>
          <Spacing width={8} />
          <View className="justify-center">
            <Text weight="medium">{title}</Text>
            <Text size="C1" color="subtitle-muted">
              {description}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-right">{mapType()}</Text>
          <Text
            style={{color: value.colorCode}}
            className="text-right"
            weight="bold"
            size="C1">
            {!isEmpty(value.indicator) ? value.indicator : 'undefined'}
          </Text>
        </View>
      </View>
    </View>
  );
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AirQualityDetailScreen'
>;

const AirQualityDetailScreen = ({
  route: {
    params: {towerName, towerId, floorSensorData},
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();
  const [selectedId, setSelectedId] = useState('');
  const navigation = useNavigation();
  const [locationList, setLocationList] = useState<ListSelect[]>([]);
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const mapLocation = useCallback(async () => {
    const locations = await buildingAccessAction.mapLocation(
      languageSelected,
      towerId,
    );

    if (locations) {
      const floorsSensor: ListSelect[] = [];
      floorSensorData.forEach(floor => {
        const existingLocation = locations.find(
          location => location.value === floor.floor_id,
        );
        if (existingLocation) {
          floorsSensor.push(existingLocation);
        }
      });

      if (floorsSensor) {
        setSelectedId(locations[0].value);
        setLocationList(locations);
      }
    }
  }, [languageSelected]);

  useEffect(() => {
    mapLocation();
  }, []);

  useEffect(() => {
    logScreenView('AirQualityDetailScreen');
  }, []);

  const modalSelectFloor = () => {
    modalActions.setMaxHeight('50%');
    modalActions.setContent(
      <ModalSelectFloor
        selected={selectedId}
        onPressCancel={() => modalActions.hide()}
        onPressDone={handleOnPressDone}
        options={locationList}
      />,
    );
    modalActions.show();
  };
  const handleOnPressDone = (value: string) => {
    modalActions.hide();
    setSelectedId(value);
  };

  const getFloorName = useCallback(() => {
    const floorNameObj = find(locationList, {
      value: selectedId,
    });

    return floorNameObj?.name;
  }, [selectedId, locationList]);

  const getFloorSensorValue = useCallback(
    (sensorType: string) => {
      const existingFloors = floorSensorData?.flatMap(value => {
        const existingFloor = value.floors.find(
          floor => floor.floor_id === selectedId,
        );
        return existingFloor ? [existingFloor] : [];
      });
      let sensors: SensorData | undefined = {};

      existingFloors?.forEach(floor => {
        const existingSensors = floor.sensors.find(
          sensor => sensor.sensor_type === sensorType,
        );
        if (existingSensors) {
          sensors = existingSensors;
        }
      });

      return {
        value: sensors?.value ?? '0',
        indicator: sensors?.indicator ?? '',
        colorCode: sensors?.color_code,
      };
    },
    [selectedId, locationList],
  );

  const onPress = (type: {name: string; index: number}) => {
    const floor = getFloorName();
    const dataFloor = {name: floor, floorId: selectedId};

    navigation.navigate('AirQualityDetailInfoScreen', {
      towerName: towerName,
      selectType: type,
      selectFloor: dataFloor,
      floorSensorData: floorSensorData,
    });
  };

  function getIconType(sensorType: string) {
    switch (sensorType) {
      case 'PM2.5':
        return 'aqPMIcon';
      case 'PM10':
        return 'aqPMIcon';
      case 'Temperature':
        return 'aqTempIcon';
      case 'Humidity':
        return 'aqHumidityIcon';
      case 'CO2':
        return 'aqCo2Icon';
    }
  }
  return (
    <View className={`${getTheme('bg-default h-screen w-screen')}`}>
      <Header title="" leftAction="goBack" />
      <ScrollView className="px-4 w-full">
        <View className="flex-row">
          <HeadText
            tagline={towerName}
            taglineColor={'vp-pass-date'}
            title={getFloorName()}
          />
          <Spacing width={12} />
          <TouchableOpacity
            activeOpacity={1}
            onPress={modalSelectFloor}
            className="justify-center">
            <View className="justify-center pt-2">
              <Icon type="arrowDownIcon" color="#000" />
            </View>
          </TouchableOpacity>
        </View>
        <Spacing height={16} />
        <Text color="subtitle-muted">{`${dayjs().format(
          'dddd DD MMMM YYYY',
        )} at ${dayjs().format('HH:mm')}`}</Text>
        <Spacing height={40} />
        <Text weight="medium">
          {t('General__Air_index_details', 'Air index details')}
        </Text>
        <Spacing height={8} />
        {floorSensorData.map((value, index) => {
          return value.indicator.map((item, subIndex) => (
            <TouchableOpacity
              key={`${index}-${subIndex}`}
              onPress={() => onPress({name: item.name, index: subIndex})}>
              <AirQualityDetail
                key={`${index}-${subIndex}`}
                title={item.display_name[languageSelected]}
                iconType={getIconType(item.name)!}
                description={item.short_description[languageSelected]}
                value={getFloorSensorValue(item.name)}
                type={item.name}
              />
              <View className={getTheme('border-b border-line mt-1')} />
            </TouchableOpacity>
          ));
        })}
      </ScrollView>
    </View>
  );
};

export default AirQualityDetailScreen;
