import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WayFindingContext} from '../store/wayfinding';
import {styles} from '../styles/WayFindingStyle';
import {CAMERA_EASING_MODE, MappedinLocation} from '@mappedin/react-native-sdk';
import {ImmutableObject} from '@hookstate/core';
import {Icon} from '~/components/atoms';
import {ScrollView} from 'react-native-gesture-handler';
import {Buildings, GF} from '../constants/Constants';
import {LabelId} from '../@types/common';

const ZoneBar = () => {
  const inset = useSafeAreaInsets();

  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    action: {getCurrentZone, getZoneColor, setMap, checkInsideBoundary},
    state: {zones, currentLocation},
  } = wayFindingContext;
  const Zone = useMemo(
    () =>
      Buildings.filter(x =>
        zones.value.some(z => z.externalId === x.externalId),
      ).map(x => ({
        location: zones.value.find(z => z.externalId === x.externalId)!,
        data: x,
      })),
    [zones],
  );

  const [selectedZone, setSelectedZone] =
    useState<ImmutableObject<MappedinLocation>>();

  const [selectedFloor, setSelectedFloor] = useState<LabelId>();
  const [isShowFloor, setIsShowFloor] = useState<boolean>(false);

  useEffect(() => {
    const process = async () => {
      if (selectedZone) {
        return;
      }
      const isInsideBoundary = await checkInsideBoundary();
      if (currentLocation.value && isInsideBoundary) {
        const zone = Zone.find(
          x => x.data.externalId === getCurrentZone()?.externalId,
        );
        setSelectedZone(zone?.location);
        const floor = zone?.data.floors.find(
          x => x.id === currentLocation.value?.map.id,
        );
        setSelectedFloor(floor ?? GF);
      }
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(() => {
    const process = async () => {
      if (!selectedFloor) {
        return;
      }
      setMap(
        mapView.current?.venueData?.maps.find(x => x.id === selectedFloor.id)!
          .id,
        true,
      );
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFloor]);

  useEffect(() => {
    const process = async () => {
      if (!selectedZone || !selectedFloor) {
        return;
      }
      const hasZone = Zone.find(
        x => x.location.id === selectedZone.id,
      )?.data.floors.some(x => x.id === selectedFloor?.id);
      if (!hasZone) {
        setSelectedFloor(GF);
      }
      const coordinate = mapView.current?.currentMap?.createCoordinate(
        selectedZone.nodes[0].lat, // latitude
        selectedZone.nodes[0].lon, // longitude
      );
      if (coordinate) {
        await mapView.current?.Camera.set({zoom: 4000});
        await mapView.current?.Camera.animate(
          {
            position: coordinate,
            zoom: 4000,
          },
          {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
        );
      }
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone, selectedFloor]);

  const floorItem = (floor: LabelId) => {
    const isSelected = floor.id === selectedFloor?.id;
    return (
      <Pressable
        key={floor.id}
        onPress={() => {
          setSelectedFloor(floor);
          setIsShowFloor(false);
        }}
        className="w-8 h-8 mb-2 justify-center items-center rounded-full border"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          backgroundColor: isSelected
            ? getZoneColor(selectedZone?.externalId ?? '').base
            : 'white',
          borderColor: getZoneColor(selectedZone?.externalId ?? '').base,
        }}>
        <Text
          className={`text-black font-bold text-m ${
            isSelected ? 'text-black' : ''
          }`}>
          {floor.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className="absolute left-4 right-4 flex-row justify-between items-center bg-white p-2 rounded-2xl shadow-lg"
      style={{top: inset.top + 110}}>
      {/* <ScrollView horizontal> */}
      {Zone.map(zone => (
        <Pressable
          key={zone.data.externalId}
          onPress={() => {
            setSelectedZone(zone.location);
            setIsShowFloor(false);
            if (!selectedFloor) {
              setSelectedFloor(GF);
            }
          }}
          className="flex-row items-center px-4 py-2 rounded-xl justify-center w-1/2"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor:
              selectedZone === zone.location
                ? getZoneColor(zone?.location.externalId ?? '').base
                : '#ffffff',
          }}>
          <View className="h-6">
            <Image
              className="flex-1 w-[74px]"
              style={styles.reSizeCover}
              source={{uri: zone.location.logo?.medium}}
            />
          </View>
          {selectedZone === zone.location && (
            <>
              <View className="ml-4 relative">
                <Pressable
                  className="px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: getZoneColor(
                      zone?.location.externalId ?? '',
                    ).highlight,
                  }}
                  onPress={() => {
                    setIsShowFloor(pre => !pre);
                  }}>
                  <View className="flex flex-row">
                    <Text className="text-black font-medium">
                      {selectedFloor?.label}
                    </Text>
                    {isShowFloor ? (
                      <Icon type="scArrowUpIcon" height={10} />
                    ) : (
                      <Icon type="scArrowDownIcon" height={10} />
                    )}
                  </View>
                </Pressable>
              </View>
              {isShowFloor && (
                <View className="absolute left-28 top-14 h-44">
                  <ScrollView
                    className="bg-white rounded-2xl py-2 px-2 flex-1"
                    contentContainerStyle={styles.itemCenter}>
                    {zone.data.floors.map(floor => floorItem(floor))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </Pressable>
      ))}
      {/* </ScrollView> */}
    </View>
  );
};

export default ZoneBar;
