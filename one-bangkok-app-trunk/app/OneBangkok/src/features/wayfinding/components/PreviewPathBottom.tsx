import React, {useContext, useEffect, useState} from 'react';
import {View, Pressable, TouchableOpacity, Image} from 'react-native';
import {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';

import {Icon, Text, TextInput} from '~/components/atoms';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import {ImmutableObject} from '@hookstate/core';
import WfNewElevator from '~/assets/icons/icon_elevator.svg';
import WfNewEscalator from '~/assets/icons/icon_escalator.svg';
import IconSwap from '~/assets/icons/icon_swap.svg';
import ShopLocationListItem from './ShopLocationListItem';
import {MappedinLocation} from '@mappedin/react-native-sdk';
import {IncludedCategories} from '../constants/Constants';
import {styles} from '../styles/WayFindingStyle';

let isSwap: boolean = false; // Used to track if the swap button was pressed

const CHAMBRAY_COLOUR = '#475582';
interface PropType {
  onStart: () => void;
  setEditState: (state: 'Departure' | 'Destination' | undefined) => void;
  editState: 'Departure' | 'Destination' | undefined;
}

const PreviewPathBottom: React.FC<PropType> = ({
  onStart,
  setEditState,
  editState,
}) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    state: {
      direction,
      bottomSheetState,
      hasGeolocationPermission,
      pinnedLocation,
      isNoPathConnect,
    },
    action: {getZoneLocation, getZoneColor, search},
  } = wayFindingContext;
  const [departureText, setDepartureText] = useState(
    'Select your starting point',
  );
  const [departureZone, setDepartureZone] = useState<
    ImmutableObject<MappedinLocation> | undefined
  >();
  const locations =
    mapView.current?.venueData?.locations
      .filter(x => x.nodes[0] && IncludedCategories.includes(x.type))
      .map(x => new LocationNode(x)) ?? [];
  const [shops, setShops] = React.useState(locations);

  const onSearch = async (text: string) => {
    if (text.trim().length === 0) {
      return;
    }
    const data = await search(text);
    setShops(
      data.filter(x => x.node && IncludedCategories.includes(x.location.type)),
    );
  };

  const getItem = (
    _data: unknown,
    index: number,
  ): ImmutableObject<LocationNode> => {
    return shops![index] as ImmutableObject<LocationNode>;
  };

  const getItemCount = (_data: unknown) => shops!.length;

  useEffect(() => {
    isSwap = !isSwap;
    if (direction.departure.value && !isSwap) {
      setDepartureText(direction.departure.value?.location.name);
      const data = getZoneLocation(direction.departure.value);
      setDepartureZone(data);
    }
  }, [hasGeolocationPermission, direction.departure, getZoneLocation]);

  useEffect(() => {
    if (hasGeolocationPermission.value === true && pinnedLocation.value) {
      direction.departure.set(pinnedLocation.value);
    }
  }, [pinnedLocation]);

  const onSwap = () => {
    isSwap = !isSwap;
    let currentDeparture: ImmutableObject<LocationNode> | undefined;
    let currentDestination: ImmutableObject<LocationNode> | undefined;
    if (direction.value.departure || pinnedLocation.value) {
      currentDeparture =
        (direction.value.departure as ImmutableObject<LocationNode>) ??
        pinnedLocation.value;
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
    setDepartureText(currentDestination?.location.name ?? '');
    setDepartureZone(getZoneLocation(currentDestination));
  };

  useEffect(() => {
    if (bottomSheetState.value.index === 0 && editState) {
      setEditState(undefined);
      bottomSheetState.set({
        ...bottomSheetState.value,
        max: '32%',
        min: '32%',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetState]);

  if (editState) {
    return (
      <>
        <BottomSheetView>
          <View className={'flex w-full px-4 pb-3'}>
            <TextInput
              className="w-full text-slate-950 rounded-md"
              onChangeText={onSearch}
              onPressIn={() => {}}
              leftIcon={{name: 'search'}}
              placeholder="What are you looking for?"
              value={''}
            />
          </View>
        </BottomSheetView>
        <BottomSheetVirtualizedList
          keyboardShouldPersistTaps={'handled'}
          maxToRenderPerBatch={5}
          windowSize={5}
          updateCellsBatchingPeriod={30}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          getItem={getItem}
          getItemCount={getItemCount}
          renderItem={({item}) => (
            <ShopLocationListItem
              item={item}
              callback={location => {
                editState === 'Departure' && direction.departure.set(location);
                editState === 'Destination' &&
                  direction.destinations.set([location]);
                setEditState(undefined);
                bottomSheetState.set({
                  ...bottomSheetState.value,
                  max: '32%',
                  min: '32%',
                });
                bottomSheetRef.current?.expand();
              }}
            />
          )}
          keyExtractor={(_, i) => i.toString()}
        />
      </>
    );
  } else {
    return (
      <BottomSheetScrollView stickyHeaderIndices={[0]}>
        <View className="bg-white z-50 w-full text-slate-950 mt-5">
          <View
            className="flex flex-row border py-3"
            style={{
              borderRadius: 10,
              marginHorizontal: 16,
              borderColor: '#6C6C6C',
            }}>
            <View className="basis-1/7" style={{justifyContent: 'center'}}>
              <Icon type="dot" height={10} className="-mb-0.2" />
              <Icon type="fourLineDot" />
              <Icon type="ObPinIcon" className="-mt-1.5" />
            </View>
            <View className="basis-5/6 gap-1">
              <View className="w-full pr-2">
                <Pressable
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className="w-full flex-row"
                  onPress={() => {
                    setEditState('Departure');
                    bottomSheetState.set({
                      ...bottomSheetState.value,
                      index: 1,
                      max: '100%',
                      min: '32%',
                    });
                  }}>
                  <View className="flex">
                    <View
                      className="flex flex-row justify-between border-0 ml-2 w-220"
                      style={{width: 220}}>
                      <Text
                        numberOfLines={1}
                        className={'my-auto text-lg text-slate-950'}
                        style={{fontFamily: 'OneBangkok-Italic'}}>
                        {departureText}
                      </Text>
                    </View>
                  </View>
                  {departureZone?.logo?.xsmall && (
                    <View
                      style={{
                        backgroundColor: getZoneColor(
                          departureZone.externalId ?? '',
                        ).base,
                        width: 56,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        className="flex-1 w-16"
                        style={{width: 20, height: 20, aspectRatio: 4 / 3}}
                        source={{uri: departureZone.logo.xsmall}}
                      />
                    </View>
                  )}
                  {/* </View> */}
                </Pressable>
              </View>

              <View style={{borderWidth: 1, borderColor: '#BDBDBD'}} />

              {direction.destinations.map(destination => {
                const zone = getZoneLocation(destination.value);
                return (
                  <View
                    key={destination.value?.location.id ?? 'destinationId'}
                    className="w-full flex-row">
                    <Pressable
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className="w-full flex-row"
                      onPress={() => {
                        setEditState('Destination');
                        bottomSheetState.set({
                          ...bottomSheetState.value,
                          index: 1,
                          max: '100%',
                          min: '32%',
                        });
                        bottomSheetRef.current?.expand();
                      }}>
                      <View className="flex">
                        <View
                          className="flex flex-row justify-between border-0 ml-2 w-220"
                          style={{width: 220}}>
                          <Text
                            numberOfLines={1}
                            className={'my-auto text-lg text-slate-950'}
                            style={{fontFamily: 'OneBangkok-Italic'}}>
                            {destination.value?.location.name}
                          </Text>
                        </View>
                      </View>
                      {zone?.logo?.xsmall && (
                        <View
                          style={{
                            backgroundColor: getZoneColor(zone.externalId ?? '')
                              .base,
                            width: 56,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8,
                          }}>
                          <Image
                            className="flex-1 w-16"
                            style={{width: 20, height: 20, aspectRatio: 4 / 3}}
                            source={{uri: zone.logo.xsmall}}
                          />
                        </View>
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>
            <View
              style={{alignItems: 'flex-end', flex: 1, marginRight: 12}}
              className="basis-1/8 my-auto flex">
              <Pressable className="my-auto ml-3" onPress={onSwap}>
                <IconSwap className="text-xs" color="#A5A0A0" />
              </Pressable>
            </View>
          </View>
          <View className="my-3 flex flex-row ml-3">
            <Pressable
              className={
                'flex flex-row justify-around py-1 px-3 rounded-3xl w-36 '
              }
              style={{
                backgroundColor: !direction.isAccessible.value
                  ? CHAMBRAY_COLOUR
                  : 'white',
                borderWidth: 1,
                borderColor: direction.isAccessible.value ? '' : '#DADDE6',
              }}
              onPress={() => {
                direction.isAccessible.set(false);
              }}>
              <View className="text-xs -mr-2">
                <WfNewEscalator
                  height={25}
                  className="text-xs"
                  color={
                    !direction.isAccessible.value ? '#ffffff' : CHAMBRAY_COLOUR
                  }
                />
              </View>
              <View>
                <Text
                  style={{
                    color: direction.isAccessible.value
                      ? CHAMBRAY_COLOUR
                      : 'white',
                  }}
                  className={'my-auto font-regular '}>
                  Escalator
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: direction.isAccessible.value
                  ? CHAMBRAY_COLOUR
                  : 'white',
                borderWidth: 1,
                borderColor: direction.isAccessible.value ? '' : '#DADDE6',
              }}
              className={
                'flex flex-row justify-around py-1 px-5 rounded-3xl w-36 ml-2'
              }
              onPress={() => direction.isAccessible.set(true)}>
              <View className="text-xs">
                <WfNewElevator
                  height={25}
                  className="text-xs"
                  color={
                    direction.isAccessible.value ? 'white' : CHAMBRAY_COLOUR
                  }
                />
              </View>
              <View>
                <Text
                  style={{
                    color: direction.isAccessible.value
                      ? 'white'
                      : CHAMBRAY_COLOUR,
                  }}
                  className={'my-auto font-regular '}>
                  Elevator
                </Text>
              </View>
            </Pressable>
          </View>
          <View className="p-3 w-full">
            <TouchableOpacity
              onPress={onStart}
              disabled={isNoPathConnect.value}
              style={[
                styles.startButton,
                isNoPathConnect.value && styles.disabledColor,
              ]}>
              <Text style={{color: 'white'}}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    );
  }
};

export default PreviewPathBottom;
