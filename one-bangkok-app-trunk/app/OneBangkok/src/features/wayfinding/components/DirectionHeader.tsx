import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  VirtualizedList,
  Alert,
  Keyboard,
} from 'react-native';
import {Icon, TextInput} from '~/components/atoms';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImmutableObject} from '@hookstate/core';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import WfEscalor from '~/assets/icons/wf-escalor.svg';
import WfLift from '~/assets/icons/wf-lift.svg';
import RenderShopItem from './RenderShopItem';
import CurrentLocationButton from './CurrentLocationButton';
import t from '~/utils/text';
import * as turf from '@turf/turf';
import axios from 'axios';
import Config from 'react-native-config';
import {first, last} from 'lodash';
import {logEvent} from '~/utils/logGA';

const DirectionHeader = () => {
  const windowHeight = Dimensions.get('window').height;
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    isEnableBlueDot,
    state: {
      direction,
      currentLocation,
      isNoPathConnect,
      hasGeolocationPermission,
      isYourPositionClicked,
      isPositioning,
      currentPosition,
    },
    action: {search},
  } = wayFindingContext;

  const locations =
    mapView.current?.venueData?.locations
      .filter(x => x.nodes[0])
      .map(x => new LocationNode(x)) ?? [];
  const insets = useSafeAreaInsets();
  const [target, setTarget] = React.useState<'departure' | 'destination'>();
  const [shops, setShops] = React.useState<LocationNode[]>(locations);
  const [isEditDeparture, setIsEditDeparture] = React.useState(false);
  const [isEditDestination, setIsEditDestination] = React.useState(false);
  const [departText, setDepartText] = React.useState('');

  let boundary: number[][] = [];

  const isShowSelectYourLocation = isEnableBlueDot && target === 'departure';

  const onSearch = async (text: string) => {
    if (text.trim().length === 0) {
      setShops(locations);
      return;
    }
    const data = await search(text);
    setShops(data);
  };

  const onSwap = () => {
    let currentDeparture: ImmutableObject<LocationNode> | undefined;
    let currentDestination: ImmutableObject<LocationNode> | undefined;
    if (direction.value.departure) {
      currentDeparture = direction.value
        .departure as ImmutableObject<LocationNode>;
    }
    if (direction.value.destinations.length > 0) {
      currentDestination = direction.value
        .destinations[0] as ImmutableObject<LocationNode>;
    }
    const isAccessible = direction.isAccessible.value;
    direction.set({
      departure: currentDestination,
      destinations: currentDeparture ? [currentDeparture] : [undefined],
      isAccessible: isAccessible,
    });
  };

  const getItem = (
    _data: unknown,
    index: number,
  ): ImmutableObject<LocationNode> => {
    return shops[index] as ImmutableObject<LocationNode>;
  };

  const getItemCount = (_data: unknown) => shops.length;

  const fetchBoundary = async () => {
    try {
      if (boundary && boundary.length > 0) {
        return;
      }
      const res = await axios.get<{polygon: number[][]}>(
        `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/getBoundaryOBK`,
      );
      boundary = res.data.polygon;
      const firstPolygon = first(boundary);
      if (firstPolygon && firstPolygon !== last(boundary)) {
        boundary.push(firstPolygon);
      }
    } catch {}
  };

  useEffect(() => {
    const process = async () => {
      if (direction.departure.value) {
        setDepartText(direction.departure.value.location.name);
        return;
      }
      const point = turf.point([
        currentPosition.value?.coords.latitude ?? 0,
        currentPosition.value?.coords.longitude ?? 0,
      ]);
      await fetchBoundary();
      const isPointInPolygon =
        boundary.length > 4 &&
        turf.booleanPointInPolygon(point, turf.polygon([boundary]));
      if (currentLocation.value && !isEditDeparture && isPointInPolygon) {
        setIsEditDeparture(false);
        setDepartText('Your position');
        return;
      }
      if (isPositioning.value) {
        setDepartText('Locating your position...');
        return;
      }
      if (
        (!currentLocation.value || !isPointInPolygon) &&
        !direction.departure.value
      ) {
        setIsEditDeparture(true);
        return;
      }
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentLocation,
    isEditDeparture,
    currentPosition,
    direction.departure,
    isPositioning,
  ]);

  return (
    <View
      className="absolute bg-white z-50 w-full text-slate-950"
      style={{top: insets.top + 60}}>
      <View className="flex flex-row w-full">
        <View className="basis-1/6">
          <Icon type="dot" height={10} />
          <Icon type="lineDot" />
          <Icon type="lineDot" />
          <Icon type="ObLocationIcon" />
        </View>
        <View className="basis-4/6 gap-1">
          {!isEditDeparture ? (
            <Pressable
              className="w-full"
              onPress={() => {
                isYourPositionClicked.set(false);
                setIsEditDeparture(true);
                setIsEditDestination(false);
              }}>
              <View className="flex w-full">
                <View className="flex flex-row justify-between p-3 border">
                  <Text
                    className={'my-auto text-lg text-slate-950'}
                    style={{fontFamily: 'OneBangkok-Italic'}}>
                    {hasGeolocationPermission.value !== undefined && departText}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <View className="flex w-full">
              <TextInput
                className="w-full h-14 p-4 text-slate-950"
                placeholder="Choose starting point"
                onFocus={() => {
                  logEvent('button_click', {
                    screen_name: 'Wayfinding',
                    feature_name: 'Choose starting point',
                    action_type: 'click',
                    bu: 'LBS',
                  });
                  setTarget('departure');
                }}
                value={direction.departure.value?.location.name ?? ''}
                onChangeText={onSearch}
              />
            </View>
          )}

          {direction.destinations.map(destination => (
            <View
              key={destination.value?.location.id ?? 'destinationId'}
              className="w-full">
              {!isEditDestination && destination.value ? (
                <Pressable
                  className="w-full"
                  onPress={() => {
                    setIsEditDestination(true);
                    if (direction.departure.value) {
                      setIsEditDeparture(false);
                    }
                  }}>
                  <View className="flex w-full">
                    <View className="flex flex-row justify-between p-3 border">
                      <Text
                        className={'my-auto text-lg text-slate-950'}
                        style={{fontFamily: 'OneBangkok-Italic'}}>
                        {destination.value?.location.name}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ) : (
                <View className="flex w-full">
                  <TextInput
                    className="w-full h-14 p-4 text-slate-950"
                    placeholder="Choose your destination"
                    onFocus={() => {
                      setTarget('destination');
                    }}
                    value={destination.value?.location.name ?? ''}
                    onChangeText={onSearch}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        <View className="basis-1/6 my-auto flex justify-center">
          <Pressable className="my-auto" onPress={onSwap}>
            <Icon type="Swap" />
          </Pressable>
        </View>
      </View>
      <View className="my-3 flex flex-row ml-3">
        <Pressable
          className={
            'flex flex-row justify-around py-1 px-3 rounded-3xl w-36 ' +
            (!direction.isAccessible.value ? 'bg-navy-light' : '')
          }
          onPress={() => {
            direction.isAccessible.set(false);
          }}>
          <View className="text-xs mr-2">
            <WfEscalor
              height={25}
              className="text-xs"
              color={!direction.isAccessible.value ? '#ffffff' : '#000000'}
            />
          </View>
          <View>
            <Text
              className={
                'my-auto font-bold ' +
                (!direction.isAccessible.value
                  ? 'text-white'
                  : 'text-slate-950')
              }>
              Escalator
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={
            'flex flex-row justify-around py-1 px-3 rounded-3xl w-36 ' +
            (direction.isAccessible.value ? 'bg-navy-light' : '')
          }
          onPress={() => direction.isAccessible.set(true)}>
          <View className="text-xs mr-2">
            <WfLift
              height={25}
              className="text-xs"
              color={direction.isAccessible.value ? '#ffffff' : '#000000'}
            />
          </View>
          <View>
            <Text
              className={
                'my-auto font-bold ' +
                (direction.isAccessible.value ? 'text-white' : 'text-slate-950')
              }>
              Elevator
            </Text>
          </View>
        </Pressable>
      </View>
      {isNoPathConnect.value && (
        <View className="my-3 flex flex-row flex-wrap p-2">
          <Icon type="warningSignIcon" />
          <Text className="my-auto font-bold text-slate-950">
            There is no path connecting{' '}
            {direction.departure.value?.location.name}
            {' to '}
            {direction?.destinations[0].value?.location.name}
          </Text>
        </View>
      )}
      {target && (
        <View
          style={{
            maxHeight: windowHeight - (insets.top + insets.bottom + 290),
          }}>
          {target === 'departure' && (
            <>
              {isShowSelectYourLocation ? (
                <CurrentLocationButton
                  callback={async () => {
                    setTarget(undefined);
                    setIsEditDeparture(false);
                    if (hasGeolocationPermission.value) {
                      await fetchBoundary();
                      const point = turf.point([
                        currentPosition.value?.coords.latitude ?? 0,
                        currentPosition.value?.coords.longitude ?? 0,
                      ]);
                      const isPointInPolygon =
                        boundary.length > 4 &&
                        turf.booleanPointInPolygon(
                          point,
                          turf.polygon([boundary]),
                        );
                      if (!isPointInPolygon && !isPositioning.value) {
                        Alert.alert(
                          '',
                          t(
                            'Wayfinding__Alert_Message_Outside_OBK',
                            'You are not in the One Bangkok area.',
                          ),
                          [
                            {
                              onPress: () => {
                                Keyboard.dismiss();
                              },
                            },
                          ],
                        );
                        setIsEditDeparture(false);
                      }
                    } else {
                      currentLocation.set(undefined);
                    }

                    direction.departure.set(undefined);
                    isYourPositionClicked.set(true);
                  }}
                />
              ) : (
                <></>
              )}
              <VirtualizedList
                keyboardShouldPersistTaps={'handled'}
                getItem={getItem}
                getItemCount={getItemCount}
                renderItem={({item}) => (
                  <RenderShopItem
                    item={item}
                    callback={depart => {
                      direction.departure.set(depart);
                      currentLocation.set(undefined);
                      setIsEditDeparture(false);
                      setTarget(undefined);
                    }}
                  />
                )}
                keyExtractor={(_, i) => i.toString()}
              />
            </>
          )}
          {target === 'destination' && (
            <VirtualizedList
              keyboardShouldPersistTaps={'handled'}
              getItem={getItem}
              getItemCount={getItemCount}
              maxToRenderPerBatch={5}
              windowSize={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              initialNumToRender={10}
              renderItem={({item}) => (
                <RenderShopItem
                  item={item}
                  callback={des => {
                    direction.destinations.set([des]);
                    setIsEditDestination(false);
                    setTarget(undefined);
                  }}
                />
              )}
              keyExtractor={(_, i) => i.toString()}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default DirectionHeader;
