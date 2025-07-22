import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {Callout, Marker} from 'react-native-maps';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {Header, HeadText, useModal} from '~/components/molecules';
import Config from 'react-native-config';
import {
  ShuttleBusDetail,
  ShuttleBusResponse,
  StationDetail,
  TimeTable,
} from 'ob-bus-sdk/dist/api';
import busService from '~/services/busService';
import {useNavigation} from '~/navigations/AppNavigation';
import Carousel from 'react-native-reanimated-carousel';
import DateTime from '~/utils/datetime';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import t from '~/utils/text';
import {isEmpty, isUndefined} from 'lodash';
import dayjs from 'dayjs';
import TimeTableTab from '../components/TimeTableTab';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {useScreenHook} from '~/services/EventEmitter';

type Coordinate = {
  latitude: number;
  longitude: number;
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

const ModalSelectStation = ({
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
          {t('General__Station', 'Station')}
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

const TimeTableInfo = ({timeSlot}: {timeSlot: TimeTable[]}) => {
  const now = dayjs();

  return (
    <ScrollView bounces={false} overScrollMode="never" scrollEventThrottle={16}>
      <TouchableOpacity activeOpacity={1}>
        {timeSlot.map((item, index) => {
          const displayedDateTime = dayjs(
            `${now.format('YYYY-MM-DD')} ${item.time}`,
          );

          const differenceInMinutes = displayedDateTime.diff(now, 'minute');
          const differenceInHours = Math.floor(differenceInMinutes / 60);
          const remainingMinutes = differenceInMinutes % 60;
          let departure = '';

          if (differenceInMinutes <= 0) {
            departure = `${t('General__tomorrow', 'tomorrow')}`;
          } else if (differenceInMinutes < 60) {
            departure =
              remainingMinutes === 1
                ? `1 ${t('General__min', 'min')}`
                : `${remainingMinutes} ${t('General__mins', 'mins')}`;
          } else {
            const hours = Math.floor(differenceInMinutes / 60);
            const minutes = differenceInMinutes % 60;
            departure = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${t(
              'General__hrs',
              'hrs',
            )}`;
          }
          return (
            <View
              key={index}
              className="flex flex-row justify-between py-2 px-4 bg-white border-l-4 border-l-black border-t border-r border-b items-center mt-1">
              <Text weight="bold" size="H3">
                {item.time}
              </Text>
              <View className="flex items-end">
                <Text weight="regular" size="B2" color="subtitle-muted">
                  {t(
                    'Shuttle_bus__Estimated_departure',
                    'Estimated departure in',
                  )}
                </Text>
                <Text weight="bold" size="B2" color="subtitle-muted">
                  {departure}
                </Text>
              </View>
            </View>
          );
        })}
        <WarningCard />
      </TouchableOpacity>
    </ScrollView>
  );
};

const UpComingCard = ({
  shuttleBus,
}: {
  shuttleBus: ShuttleBusDetail | undefined;
}) => {
  if (isUndefined(shuttleBus)) {
    return (
      <TouchableOpacity activeOpacity={1}>
        <Text size="B1" weight="medium" className="pb-4">
          {t('General__Upcoming_arrival', 'Upcoming arrival to this station')}
        </Text>
        <View
          key={'up-coming-card'}
          className="flex flex-row justify-between py-5 px-4 bg-white border-l-4 border-l-black border-t border-r border-b  items-center mt-1 text-center">
          <Text weight="bold" size="B1" color="subtitle-muted">
            {t('General__No_upcomming_buses', 'No upcoming buses.')}
          </Text>
        </View>

        <WarningCard />
      </TouchableOpacity>
    );
  }

  const currentDate = DateTime.getCurrentDateTime().add(
    parseFloat(shuttleBus.duration_in_traffic!.value!),
    'seconds',
  );

  return (
    <TouchableOpacity activeOpacity={1}>
      <Text size="B1" weight="medium" className="pb-4">
        {t('General__Upcoming_arrival', 'Upcoming arrival to this station')}
      </Text>
      <View
        key="up-coming-card-detail"
        className="flex flex-row justify-between py-2 px-4 bg-white border-l-4 border-l-black border-t border-r border-b  items-center mt-1">
        <Text weight="bold" size="H3">
          {currentDate.format('HH:mm A')}
        </Text>
        <View className="flex items-end">
          <Text weight="regular" size="B2" color="subtitle-muted">
            {t('Shuttle_bus__Estimated_arrival', 'Estimated arrival in')}
          </Text>
          <Text weight="bold" size="B2" color="subtitle-muted">
            {parseInt(shuttleBus.duration_in_traffic.text) > 1
              ? t('General__mins_mins', '{{mins}} mins', {
                  mins: parseInt(shuttleBus.duration_in_traffic.text),
                })
              : t('General__min_min', '{{min}} min', {
                  min: parseInt(shuttleBus.duration_in_traffic.text),
                })}
          </Text>
        </View>
      </View>
      <WarningCard />
    </TouchableOpacity>
  );
};

const WarningCard = () => {
  return (
    <View className="bg-[#FFFEC1] border-[#FFE35A] p-3 rounded mt-4 mb-10 flex flex-row items-center">
      <View className="w-5 h-5 border rounded-full flex items-center justify-center mr-2">
        <Icon type="warningIcon" height={14} />
      </View>

      <Text weight="regular" size="B2" color="subtitle-muted">
        {t(
          'Shuttle_bus__Estimated_description',
          'The time shown on the above table is only estimated time of arrival,',
        )}
        <Text weight="bold" size="B2" color="subtitle-muted">
          {t('General__Not_actual_time', 'not the actual time of arrival.')}
        </Text>
      </Text>
    </View>
  );
};

const ShuttleBusDetailCarosel = ({
  currentStation,
  shuttleBus,
  width,
  onSnapToItem,
}: {
  currentStation: StationDetail | undefined;
  shuttleBus: ShuttleBusResponse;
  width: number;
  onSnapToItem: Function;
}) => {
  if (isUndefined(currentStation) || isEmpty(currentStation.shuttleBusDetail)) {
    return null;
  }

  return (
    <View className="absolute bottom-0 rounded-lg shadow-lg z-10">
      <Carousel
        key={currentStation?.name}
        mode="parallax"
        loop={false}
        width={width}
        height={width / 2.5}
        autoPlay={false}
        data={currentStation?.shuttleBusDetail!}
        scrollAnimationDuration={1000}
        onSnapToItem={index => {
          onSnapToItem(index);
        }}
        renderItem={({index}) => {
          const selected = currentStation?.shuttleBusDetail[index];
          const currentDate = DateTime.getCurrentDateTime().add(
            parseFloat(selected!.duration_in_traffic!.value!),
            'seconds',
          );
          let origin = '';
          const destination = currentStation?.name;
          if (shuttleBus && shuttleBus.stations) {
            for (let i = 0; i < shuttleBus!.stations!.length; i++) {
              if (destination === shuttleBus!.stations[i].name) {
                origin =
                  shuttleBus!.stations[(i + 1) % shuttleBus!.stations!.length]
                    .name;
                break;
              }
            }
          }

          return (
            <View className="flex-1 justify-center px-4 h-full bg-white rounded-lg shadow-lg">
              {!isEmpty(selected?.detail.name) && (
                <Text weight="bold" size="H4" color="subtitle-muted">
                  {selected?.detail.name}
                </Text>
              )}

              <View className="flex flex-row justify-between py-3 items-center">
                <Text size="B1" weight="bold">
                  {origin}
                </Text>
                <Icon type="next" color="gray" />
                <Text size="B1" weight="bold">
                  {destination}
                </Text>
              </View>

              <Text size="B1" weight="regular" color="subtitle-muted">
                {t(
                  'Shuttle_bus__Estimated_arrival',
                  'Estimated arrival time in',
                )}
              </Text>
              <View className="flex flex-row items-end ">
                <Text size="H1" weight="regular" className="pr-3">
                  {parseInt(selected?.duration_in_traffic.text) > 1
                    ? t('General__minutes', '{{mins}} minutes', {
                        mins: parseInt(selected?.duration_in_traffic.text),
                      })
                    : t('General__min_minute', '{{min}} minute', {
                        min: parseInt(selected?.duration_in_traffic.text),
                      })}
                </Text>
                <Text size="B1" weight="regular" color="subtitle-muted">
                  {`(${currentDate.format('HH:mm')})`}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const MapScreen = () => {
  const topLeft = {latitude: 13.7447185, longitude: 100.539491};
  const bottomRight = {latitude: 13.7243082, longitude: 100.557019};

  const latitudeCenter = (topLeft.latitude + bottomRight.latitude) / 2;
  const longitudeCenter = (topLeft.longitude + bottomRight.longitude) / 2;

  const latitudeDelta = Math.abs(topLeft.latitude - bottomRight.latitude);
  const longitudeDelta = Math.abs(topLeft.longitude - bottomRight.longitude);

  const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_APIKEY;
  const navigation = useNavigation();

  const [shuttleBus, setShuttleBus] = useState<ShuttleBusResponse>();
  const [directionOrigin, setDirectionOrigin] = useState<Coordinate>();
  const [directionDestination, setDirectionDestination] =
    useState<Coordinate>();
  const [showDetail, setShowDetail] = useState(false);
  const [currentStation, setCurrentStation] = useState<StationDetail>();
  const [_modalState, modalActions] = useModal();
  const [selectedName, setSelectedName] = useState('');
  const mapRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [upcomingData, setUpcomingData] = useState<TimeTable[]>([]);
  const [timetableData, setTimetableData] = useState<TimeTable[]>([]);
  const [selectedBus, setSelectedBus] = useState<ShuttleBusDetail>();
  const getShuttleBusIndex = useCallback(async () => {
    const result = await busService.getShuttleBusIndex();
    if (result) {
      setShuttleBus(result);
    }
  }, []);

  useEffect(() => {
    getShuttleBusIndex();
  }, [getShuttleBusIndex]);

  const width = Dimensions.get('window').width;

  const modalSelectStation = () => {
    modalActions.setMaxHeight('50%');

    const listSelection = shuttleBus?.stations.map((station, index) => {
      return {
        name: station.name,
        value: index.toString(),
      };
    });

    modalActions.setContent(
      <ModalSelectStation
        selected={selectedName}
        onPressCancel={() => modalActions.hide()}
        onPressDone={handleOnPressDone}
        options={listSelection!}
      />,
    );
    modalActions.show();
  };

  const handleOnPressDone = (value: string) => {
    modalActions.hide();
    setSelectedName(value);
    setShowDetail(true);
    setCurrentStation(shuttleBus!.stations[parseFloat(value)]);

    const now = dayjs();
    const times = shuttleBus!.stations[parseFloat(value)]!.time;
    const upcoming = times
      .filter(time =>
        dayjs(`${now.format('YYYY-MM-DD')} ${time.time}`).isAfter(now),
      )
      .slice(0, 4);
    setUpcomingData(upcoming);
    setTimetableData(times);

    const routesList: {key: string; title: string}[] = [
      {key: 'Upcoming', title: t('General__Upcoming', 'Upcoming')},
      {key: 'Timetable', title: t('General__Timetable', 'Timetable')},
    ];
    const renderSceneObj: any = {};
    let Route1 = () => <TimeTableInfo timeSlot={times} />;
    let Route2 = () => <TimeTableInfo timeSlot={upcoming} />;
    renderSceneObj['Timetable'] = Route1;
    renderSceneObj['Upcoming'] = Route2;

    setDataTab(p => ({
      ...p,
      renderScene: renderSceneObj,
      routes: routesList,
      data: shuttleBus!.stations[parseFloat(value)]!.time,
      index: 0,
    }));

    if (shuttleBus!.stations[parseFloat(value)].shuttleBusDetail.length > 0) {
      setSelectedBus(
        shuttleBus!.stations[parseFloat(value)].shuttleBusDetail[0],
      );

      setDirectionOrigin({
        latitude: parseFloat(
          shuttleBus!.stations[parseFloat(value)].shuttleBusDetail[0].origin
            .latitude,
        ),
        longitude: parseFloat(
          shuttleBus!.stations[parseFloat(value)].shuttleBusDetail[0].origin
            .longitude,
        ),
      });
      setDirectionDestination({
        latitude: parseFloat(shuttleBus!.stations[parseFloat(value)].latitude),
        longitude: parseFloat(
          shuttleBus!.stations[parseFloat(value)].longitude,
        ),
      });
    } else {
      setSelectedBus(undefined);
      setDirectionOrigin(undefined);
      setDirectionDestination(undefined);
    }
    if (mapRef.current !== null) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(shuttleBus!.stations[parseFloat(value)].latitude),
        longitude: parseFloat(
          shuttleBus!.stations[parseFloat(value)].longitude,
        ),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMarkerSelect = (station, stationIndex) => {
    setShowDetail(true);
    setCurrentStation(station);
    setSelectedName(stationIndex.toString());

    const now = dayjs();
    const times = station!.time;
    const upcoming = times
      .filter(time =>
        dayjs(`${now.format('YYYY-MM-DD')} ${time.time}`).isAfter(now),
      )
      .slice(0, 4);
    setUpcomingData(upcoming);
    setTimetableData(times);

    const routesList: {key: string; title: string}[] = [
      {key: 'Upcoming', title: t('General__Upcoming', 'Upcoming')},
      {key: 'Timetable', title: t('General__Timetable', 'Timetable')},
    ];
    const renderSceneObj: any = {};
    let Route1 = () => <TimeTableInfo timeSlot={times} />;
    let Route2 = () => <TimeTableInfo timeSlot={upcoming} />;
    renderSceneObj['Timetable'] = Route1;
    renderSceneObj['Upcoming'] = Route2;

    setDataTab(p => ({
      ...p,
      renderScene: renderSceneObj,
      routes: routesList,
      data: station!.time,
      index: 0,
    }));

    if (station.shuttleBusDetail.length > 0) {
      setSelectedBus(station.shuttleBusDetail[0]);
      setDirectionOrigin({
        latitude: parseFloat(station.shuttleBusDetail[0].origin.latitude),
        longitude: parseFloat(station.shuttleBusDetail[0].origin.longitude),
      });
      setDirectionDestination({
        latitude: parseFloat(station.latitude),
        longitude: parseFloat(station.longitude),
      });
    } else {
      if (directionOrigin !== undefined) {
        setSelectedBus(undefined);
        setDirectionOrigin(undefined);
        setDirectionDestination(undefined);
      }
    }

    // Animate to the region of the selected marker
    if (mapRef.current !== null) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(station.latitude),
        longitude: parseFloat(station.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const [dataTab, setDataTab] = useState<dataTab>();

  const onSnapToItem = (index: number) => {
    const selected = currentStation?.shuttleBusDetail[index];
    if (selected) {
      setSelectedBus(selected);
      setDirectionOrigin({
        latitude: parseFloat(selected!.origin.latitude),
        longitude: parseFloat(selected!.origin.longitude),
      });
    }
  };

  const updateCurrentStation = (data: ShuttleBusResponse) => {
    setShuttleBus(data);
    if (currentStation) {
      const stationName = currentStation.name;
      const newCurrentStation = data?.stations.find(
        station => station.name === stationName,
      );
      setCurrentStation(newCurrentStation);
      if (!isEmpty(newCurrentStation?.shuttleBusDetail) && newCurrentStation) {
        setDirectionOrigin({
          latitude: parseFloat(
            newCurrentStation.shuttleBusDetail[0].origin.latitude,
          ),
          longitude: parseFloat(
            newCurrentStation.shuttleBusDetail[0].origin.longitude,
          ),
        });
        setDirectionDestination({
          latitude: parseFloat(
            newCurrentStation.shuttleBusDetail[0].destination.latitude,
          ),
          longitude: parseFloat(
            newCurrentStation.shuttleBusDetail[0].destination.longitude,
          ),
        });
      } else {
        setDirectionOrigin(undefined);
        setDirectionDestination(undefined);
      }
    }
  };

  useScreenHook('WebSocket', async event => {
    const data = event.data;

    switch (event.name) {
      case WebSocketEventNames.SHUTTLE_BUS_POSITION_UPDATED:
        updateCurrentStation(data);
        break;
      default:
        break;
    }
  });

  return (
    <Screen>
      <Header
        title={t('General__Shuttle_bus', 'Shuttle Bus')}
        leftAction="goBack"
        onPressLeftAction={() => {
          if (!showDetail) {
            navigation.goBack();
          } else {
            setShowDetail(false);
          }
        }}
      />
      {showDetail && (
        <>
          <TouchableOpacity activeOpacity={1} onPress={modalSelectStation}>
            <View className="flex-row px-5 w-screen items-end justify-start ">
              <HeadText
                tagline={t('General__Station', 'Stations')}
                taglineColor={'vp-pass-date'}
                title={currentStation?.name}
              />
              <Spacing width={12} />
              <View className="items-end pt-2">
                <Icon type="arrowDownIcon" color="#000" />
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex-row flex-wrap px-5 w-screen items-end justify-start pb-10">
            <Text>{t('General__Around_this_area', 'Around this area:')}</Text>

            {currentStation?.flag.name.map((item, index) => (
              <View key={index} className="bg-black  px-3 m-1 rounded">
                <Text color="default-inverse">{item}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      <View className="flex-[1.5] w-full h-full">
        {showDetail && (
          <ShuttleBusDetailCarosel
            currentStation={currentStation}
            shuttleBus={shuttleBus!}
            width={width}
            onSnapToItem={onSnapToItem}
          />
        )}
        <MapView
          ref={mapRef}
          className="flex-1"
          rotateEnabled={false}
          initialRegion={{
            latitude: latitudeCenter,
            longitude: longitudeCenter,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}>
          {shuttleBus?.stations.map((station, stationIndex) => {
            return (
              <React.Fragment key={stationIndex}>
                {station.shuttleBusDetail.map((bus, busIndex) => (
                  <Marker
                    key={`bus-${stationIndex}-${busIndex}`}
                    coordinate={{
                      latitude: parseFloat(bus.origin.latitude),
                      longitude: parseFloat(bus.origin.longitude),
                    }}>
                    <Icon type="bus" rotation={parseFloat(bus.course)} />
                  </Marker>
                ))}
                <Marker
                  key={`station-${stationIndex}`}
                  coordinate={{
                    latitude: parseFloat(station.latitude),
                    longitude: parseFloat(station.longitude),
                  }}
                  onSelect={() => handleMarkerSelect(station, stationIndex)}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleMarkerSelect(station, stationIndex)}>
                    <View>
                      <View className="w-full p-2 bg-black rounded-lg shadow-lg">
                        <Text color="default-inverse">{station.name}</Text>
                      </View>
                      <Icon type="pin" />
                    </View>
                  </TouchableOpacity>
                </Marker>
              </React.Fragment>
            );
          })}
          {showDetail && directionOrigin && directionDestination && (
            <MapViewDirections
              origin={directionOrigin}
              destination={directionDestination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={2}
              strokeColor="#DC7032"
              lineDashPhase={0}
              lineDashPattern={[2, 5]}
            />
          )}
        </MapView>
      </View>
      {showDetail && timetableData.length > 0 && (
        <View className="flex-1 w-full p-5">
          {dataTab?.renderScene && dataTab?.routes && (
            <TimeTableTab
              sceneMap={dataTab.renderScene}
              routes={dataTab.routes}
              selectedIndex={dataTab.index}
            />
          )}
        </View>
      )}
      {showDetail && timetableData.length === 0 && (
        <View className="flex-1 w-full p-5">
          <UpComingCard shuttleBus={selectedBus} />
        </View>
      )}
    </Screen>
  );
};

export default MapScreen;
