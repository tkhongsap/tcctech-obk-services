import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {WayFindingContext} from '../store/wayfinding';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CAMERA_EASING_MODE, MappedinNode} from '@mappedin/react-native-sdk';
import {Buildings, Floors} from '../constants/Constants';
import {LabelId} from '../@types/common';

const FloorSelection = () => {
  const [expanded, setExpanded] = useState(false);
  const wayFindingContext = useContext(WayFindingContext);
  const insets = useSafeAreaInsets();

  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    state: {
      currentMap,
      isManualChangeMap,
      currentLocation,
      activeDirections,
      direction,
    },
    action: {setMap, getCurrentZone},
  } = wayFindingContext;

  const [selectedFloor, setSelectedFloor] = useState<LabelId>();

  const currentZone = useMemo(() => getCurrentZone(), [currentLocation]);

  const [floorList, setFloorList] = useState(
    Buildings.find(x => x.externalId === currentZone?.externalId)?.floors ??
      Buildings.map(x => x.floors).flat(1),
  );

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({animated: false});
      }, 50);
    }
  }, [expanded]);

  useEffect(() => {
    if (!isManualChangeMap.value) {
      const defaultFloor = Floors.find(
        x => x.id === currentLocation.value?.map.id,
      );
      if (defaultFloor) {
        setSelectedFloor(defaultFloor);
      }
    } else {
      const floor = Floors.find(x => x.id === mapView.current?.currentMap?.id);
      setSelectedFloor(floor);
    }

    setFloorList(
      Buildings.find(x => x.externalId === currentZone?.externalId)?.floors ??
        Buildings.map(x => x.floors).flat(1),
    );
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
      const currentFloor = mapView.current?.venueData?.maps.find(
        x => x.id === selectedFloor.id,
      );
      const isIdValid = activeDirections.value?.path.some(
        item => item.map.id === currentFloor?.id,
      );

      const nodes =
        activeDirections.value?.instructions
          .map(x => {
            return x.node as MappedinNode;
          })
          .filter(x => x.map.id === mapView.current?.currentMap?.id) ?? [];

      if (!isIdValid) {
        const coordinate = mapView.current?.currentMap?.createCoordinate(
          direction.departure.value?.node.lat ?? 0, // latitude
          direction.departure.value?.node.lon ?? 0, // longitude
        );
        mapView.current?.Camera.set({zoom: 4000}).then(() => {
          mapView.current?.Camera.animate(
            {
              position: coordinate,
              zoom: 4000,
            },
            {
              duration: 500,
              easing: CAMERA_EASING_MODE.EASE_OUT,
            },
          );
        });
      } else {
        await mapView.current?.Camera.animate(
          {
            zoom: 5000,
          },
          {
            duration: 500,
            easing: CAMERA_EASING_MODE.EASE_IN,
          },
        );
        await mapView.current?.Camera.focusOn(
          {
            nodes: nodes as MappedinNode[],
          },
          {
            changeZoom: false,
            duration: 100,
            easing: CAMERA_EASING_MODE.EASE_IN,
            safeAreaInsets: {
              top: 50,
              bottom: 50,
              left: 50,
              right: 0,
            },
          },
        );
      }
    };
    try {
      process();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFloor]);

  return (
    <View
      className="z-50"
      style={[style.wrapper, {bottom: insets.bottom + 200, flex: 1}]}>
      {expanded && (
        <ScrollView
          ref={scrollRef}
          style={[
            style.dropDownWrapper,
            Platform.OS === 'ios' && style.dropdown,
          ]}>
          {floorList
            .slice()
            .reverse()
            .map((floor, index, arr) => {
              return (
                <TouchableOpacity
                  key={floor.id}
                  onPress={() => {
                    isManualChangeMap.set(true);
                    setSelectedFloor(floor);
                    setExpanded(false);
                  }}
                  style={[
                    style.dropdownItem,
                    selectedFloor === floor && style.activeItem,
                    index === arr.length - 1 && {borderBottomWidth: 0},
                  ]}>
                  <Text
                    className="text-xs font-semibold text-[#475582] ml-2"
                    style={[
                      {lineHeight: 20, color: '#475582'},
                      selectedFloor === floor && {color: '#fff'},
                    ]}>
                    {floor.label}
                    {', '}{' '}
                    {currentZone?.name.toLocaleUpperCase() ??
                      Buildings.find(x =>
                        x.floors.includes(floor),
                      )?.name.toLocaleUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => setExpanded(prev => !prev)}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <View className="flex-row items-center justify-between w-full px-2">
          <Text className="text-xs mr-2 font-semibold text-[#475582]">
            {selectedFloor?.label ?? currentMap.value?.name}
            {', '}
            {currentZone?.name.toLocaleUpperCase() ??
              Buildings.find(x =>
                x.floors.includes(selectedFloor ?? floorList[0]),
              )?.name.toLocaleUpperCase()}
          </Text>
          <Icon type="scArrowUpIcon" width={13} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    elevation: 5,
    width: 140,
    position: 'absolute',
    right: 15,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  dropdown: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 9,
    backgroundColor: '#fff',
    paddingVertical: 6,
    elevation: 5,
    width: '100%',
    flex: 1,
  },
  dropdownItem: {
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activeItem: {
    backgroundColor: '#475582',
  },
  dropDownWrapper: {
    maxHeight: 100,
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
  },
});

export default FloorSelection;
