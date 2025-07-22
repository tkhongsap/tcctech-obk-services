import {
  Animated,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Screen} from '~/components/templates';
import {HeadText, Header, useModal} from '~/components/molecules';
import t from '~/utils/text';
import {Icon, Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import dayjs from 'dayjs';
import {find, isEmpty} from 'lodash';
import SmartParkingInfoTab from '../components/SmartParkingInfoTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import SmartParkingInfo from '../components/SmartParkingInfo';
import {ScrollView} from 'react-native';
import RadioList, {Radio} from '~/components/molecules/RadioList';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import firebaseConfigState from '~/states/firebase';
import appLanguageState from '~/states/appLanguage/appLanguageState';

const ModalSelectZone = ({
  data,
  selected,
  onPressCancel,
  onPressDone,
  isByFloor,
}: {
  data: WrappedResponseParkingLotsIndexResponseData;
  selected: string;
  onPressCancel: any;
  onPressDone: any;
  isByFloor: boolean;
}) => {
  const [selectedArea, setSelectedArea] = useState(selected);

  let options: ListSelect[] = [];
  if (isByFloor) {
    data.map(item => {
      const nameZone =
        item.display_name[appLanguageActions.getLanguage()] ?? item.name;
      options.push({name: nameZone, value: item?.id});
    });
  } else {
    data.forEach(floor => {
      floor.parking_lots.forEach(lot => {
        const existingCard = find(options, {name: lot.name});

        if (!existingCard) {
          options.push({
            name: lot.name,
            value: lot.name,
          });
        }
      });
    });
  }
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
          {isByFloor
            ? t('General__Floor', 'Floor')
            : t('General__Zone', 'Zone')}
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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SmartParkingInfoScreen'
>;

const SmartParkingInfoScreen = ({
  route: {
    params: {parkingLots, areaId, nameZoneOrFloor, floorId},
  },
}: Props) => {
  const [selectedId, setSelectedId] = useState(areaId ?? floorId);
  const [selectedName, setSelectedName] = useState(nameZoneOrFloor);
  const [dataTab, setDataTab] = useState<any>();
  const [_modalState, modalActions] = useModal();
  const layout = useWindowDimensions();
  const languages = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : appLanguageState.defaultLanguage.get();
  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });

  const modalSelectZone = () => {
    modalActions.setContent(
      <ModalSelectZone
        selected={floorId ? selectedId! : selectedName!}
        data={parkingLots}
        onPressCancel={() => modalActions.hide()}
        onPressDone={handleOnPressDone}
        isByFloor={!isEmpty(floorId)}
      />,
    );
    modalActions.show();
  };

  const handleOnPressDone = (value: string) => {
    modalActions.hide();
    if (floorId) {
      setSelectedId(value);
    } else {
      setSelectedName(value);
    }
  };

  const getParkingLots = useCallback(() => {
    let data;

    if (floorId) {
      data = parkingLots?.filter(item => item.id === selectedId);
    } else {
      const temp = [];
      parkingLots.map(floor => {
        floor.parking_lots.map(lot => {
          if (lot.name === selectedName) {
            const clone = {
              ...lot,
              name: floor.name,
              display_name: {
                en: floor.name,
                th: floor.name,
              },
            };
            temp.push(clone);
          }
        });
      });
      data = [
        {
          name: selectedName,
          parking_lots: temp,
        },
      ];
    }

    if (data) {
      if (floorId) {
        const name =
          data[0].display_name[appLanguageActions.getLanguage()] ??
          data[0].name;
        setSelectedName(name);
      } else {
        const name = data[0].name;
        setSelectedName(name);
      }

      const spotTypeInParkingLotList: any[] = [];
      data.map(parkingFloor => {
        if (!isEmpty(parkingFloor?.parking_lots)) {
          parkingFloor?.parking_lots?.map(parkingLots => {
            if (!isEmpty(parkingLots.spot_types)) {
              parkingLots.spot_types.map(item => {
                spotTypeInParkingLotList.push(item);
              });
            }
          });
        }
      });
      const filterSpotType = [
        ...new Map(
          spotTypeInParkingLotList.map(item => [item.name, item]),
        ).values(),
      ];
      const routesList: {key: string; title: string}[] = [
        {key: 'All', title: 'All'},
      ];
      let Route = () => (
        <SmartParkingInfo
          data={data}
          spotType={'All'}
          isByFloor={!isEmpty(floorId)}
          floor={selectedName}
        />
      );
      const renderSceneObj: any = {All: Route};
      filterSpotType.map(item => {
        const nameSpotType =
          item.display_name[appLanguageActions.getLanguage()] ?? item.name;
        Route = () => (
          <SmartParkingInfo
            data={data}
            spotType={item.name}
            isByFloor={!isEmpty(floorId)}
            floor={selectedName}
          />
        );

        routesList.push({
          key: nameSpotType.replaceAll(' ', ''),
          title: nameSpotType,
        });
        renderSceneObj[nameSpotType.replaceAll(' ', '')] = Route;
      });
      setDataTab(p => {
        const clone = {...p};
        clone.renderScene = renderSceneObj;
        clone.routes = routesList;
        clone.data = data;
        return clone;
      });
    }
  }, [floorId, parkingLots, selectedId, selectedName]);
  useEffect(() => {
    getParkingLots();
  }, [getParkingLots, selectedId, selectedName]);

  const smartParkingColor = firebaseConfigState.smart_parking_color.value;

  const areaColor = smartParkingColor?.find(item => item.name === selectedName);

  return (
    <View className={`${getTheme('bg-default h-screen w-screen')}`}>
      <Header
        leftAction="goBack"
        title={t('General__Smart_parking', 'Smart Parking')}
      />
      <View className="flex w-full ">
        <View className="px-5">
          <Spacing height={24} />
          <View className="flex-row">
            <HeadText
              taglineColor="muted"
              tagline={t('General__One_bangkok', 'One Bangkok')}
              title={selectedName ?? ''}
              titleIconColor={
                !floorId ? areaColor?.color ?? '#0B692C' : undefined
              }
            />
            <Spacing width={12} />
            <TouchableOpacity activeOpacity={1} onPress={modalSelectZone}>
              <View className="justify-center pt-3">
                <Icon type="arrowDownIcon" color="#000" />
              </View>
            </TouchableOpacity>
          </View>
          <Spacing height={16} />
          <Text size="C1" weight="regular">{`${dayjs()
            .locale(languages)
            .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`}</Text>
          <Spacing height={16} />
        </View>
        <View
          className={getTheme(' w-full')}
          style={{height: layout.height / 1.5}}>
          {dataTab?.renderScene && dataTab?.routes && !isEmpty(dataTab?.routes) && (
            <SmartParkingInfoTab
              sceneMap={dataTab.renderScene}
              routes={dataTab.routes}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default SmartParkingInfoScreen;
