import React from 'react';
import {useContext, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {first} from 'lodash';
import {
  LocationNode,
  MarkerType,
  PageState,
  WayFindingContext,
} from '../store/wayfinding';
import {Floors} from '../constants/Constants';
import {styles} from '../styles/WayFindingStyle';
import {t} from 'i18next';

const NavigateBottomSheet = () => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    state: {pageState, direction, pinnedLocation, currentLocation},
    action: {
      setMap,
      getZoneLocation,
      getZoneColor,
      checkPermission,
      findNearestLocation,
      resetMarker,
    },
  } = wayFindingContext;

  const [zone] = useState(getZoneLocation(direction.destinations.value[0]));

  return (
    <BottomSheetView collapsable={false}>
      <View className="px-4 pt-6 flex-row align-center justify-between">
        <Text className="text-2xl font-bold text-slate-950">
          {direction.destinations.value[0] &&
            direction.destinations.value[0].location.name}
        </Text>
      </View>
      <View className="w-full flex flex-row gap-4 justify-between items-center px-4">
        <View className="pb-2 align-middle">
          <View className="flex-row items-center mt-2">
            <View
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{
                backgroundColor: getZoneColor(zone?.externalId ?? '').base,
              }}>
              <Text>
                {(first(direction.destinations.value)?.node &&
                  Floors.find(
                    x =>
                      x.id ===
                      first(direction.destinations.value)?.node?.map.id,
                  )?.label) ??
                  ''}
              </Text>
            </View>
            <View className="h-16 w-16">
              {zone?.logo?.original?.endsWith('.svg') ? (
                <></>
              ) : zone?.logo?.xsmall ? (
                <Image
                  className="flex-1 w-16"
                  style={styles.zoneLogoWrapper}
                  source={{uri: zone.logo.xsmall}}
                />
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
        <View className="items-end mb-0 align-bottom">
          <TouchableOpacity
            onPress={async () => {
              pageState.set(PageState.navigate);
              if (direction.departure.value) {
                await setMap(direction.departure.value.node.map.id);
              } else {
                const nearestLocation = findNearestLocation(
                  currentLocation.value,
                );
                const hasPermission = await checkPermission();
                if (hasPermission && nearestLocation) {
                  pinnedLocation.set(new LocationNode(nearestLocation));
                }
              }
              resetMarker(MarkerType.ArrowPin);
              await mapView.current?.BlueDot.enable();
            }}
            className="align-bottom justify-center items-center"
            style={styles.exitButton}>
            <Text className="text-sm text-white font-obBold">
              {t('General__Exit', 'Exit')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetView>
  );
};

export default NavigateBottomSheet;
