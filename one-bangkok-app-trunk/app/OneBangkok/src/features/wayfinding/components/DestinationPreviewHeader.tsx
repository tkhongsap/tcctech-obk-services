import React, {useContext, useEffect, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {Text} from '~/components/atoms';
import {PageState, WayFindingContext} from '../store/wayfinding';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {first, isEmpty, last} from 'lodash';
import Config from 'react-native-config';
import axios from 'axios';
import * as turf from '@turf/turf';
import {ImmutableObject} from '@hookstate/core';
import {MappedinLocation} from '@mappedin/react-native-sdk';

const {width} = Dimensions.get('window');

const DestinationPreviewHeader = () => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const buildings = [
    {
      externalId: 'Parade',
      name: 'Parade',
      floors: ['B1', 'GF', '1F', '2F', '3F', '4F', '5F', '6F', '7F'],
    },
    {
      externalId: 'TheStoreys',
      name: 'The Storeys',
      floors: ['B1', 'GF', '1F', '2F', '3F'],
    },
  ];
  const {
    mapView,
    state: {
      zones,
      pinnedLocation,
      pageState,
      hasGeolocationPermission,
      currentLocation,
      userLocationZone,
      currentPosition,
      isPositioning,
    },
    action: {getZoneLocation, getZoneColor, getCurrentZone},
  } = wayFindingContext;

  const [zoneData] = useState(
    buildings
      .filter(x => zones.value.some(z => z.externalId === x.externalId))
      .map(x => ({
        location: zones.value.find(z => z.externalId === x.externalId)!,
        data: x,
      })),
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentZone = React.useMemo(() => getCurrentZone(), [currentLocation]);

  const [selectedZone, setSelectedZone] =
    useState<ImmutableObject<MappedinLocation>>();

  const [selectedFloor, setSelectedFloor] = useState<string>();
  const zone = zoneData.find(
    x => x.data.externalId === getCurrentZone()?.externalId,
  );

  const checkFloor = (name: string) => {
    if (!!name && name.includes('ชั้น')) {
      return name.replace('ชั้น', '').trim() + 'F';
    } else {
      return name;
    }
  };

  const floor = zone?.data.floors.find(
    x => x === checkFloor(currentLocation.value?.map.shortName ?? ''),
  );

  const boundary = useRef<number[][]>([]);

  const fetchBoundary = async () => {
    try {
      if (boundary.current && boundary.current.length > 0) {
        return;
      }
      const res = await axios.get<{polygon: number[][]}>(
        `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/getBoundaryOBK`,
      );
      boundary.current = res.data.polygon;
      const firstPolygon = first(boundary.current);
      if (firstPolygon && firstPolygon !== last(boundary.current)) {
        boundary.current.push(firstPolygon);
      }
    } catch {}
  };

  useEffect(() => {
    if (selectedZone) {
      return;
    }
    if (currentLocation.value) {
      const zone = zoneData.find(
        x => x.data.externalId === getCurrentZone()?.externalId,
      );
      setSelectedZone(zone?.location);
      const floor = zone?.data.floors.find(
        x => x === currentLocation.value?.map.shortName,
      );
      setSelectedFloor(floor ?? 'GF');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(() => {
    if (hasGeolocationPermission.value) {
      const fetchData = async () => {
        await fetchBoundary();
      };
      fetchData();
    }
  }, []);

  const insets = useSafeAreaInsets();

  if (pinnedLocation.value !== undefined) {
    getZoneLocation(pinnedLocation.value);
  } else {
    const filteredList = mapView.current?.currentMap?.locations.filter(
      item => item.toMap === currentLocation?.value?.map.id,
    );

    if (filteredList && !isEmpty(filteredList)) {
      userLocationZone.set(filteredList[0].name);
    }
  }

  if (!hasGeolocationPermission.value) {
    return null;
  }

  const point = turf.point([
    currentPosition.value?.coords.latitude ?? 0,
    currentPosition.value?.coords.longitude ?? 0,
  ]);
  const isPointInPolygon =
    boundary.current.length > 4 &&
    turf.booleanPointInPolygon(point, turf.polygon([boundary.current]));

  if (!isPointInPolygon && !isPositioning.value) {
    return null;
  }

  return (
    <View
      className="justify-center items-center absolute"
      style={{
        width: width,
        backgroundColor: 'white',
        marginTop: insets.top + 60,
        zIndex: pageState.value === PageState.shop_detail ? 100 : 0,
      }}>
      <View
        className="justify-center items-center py-2"
        style={{
          width: width,
          backgroundColor: getZoneColor(currentZone?.externalId ?? '').base,
          zIndex: pageState.value === PageState.shop_detail ? 100 : 0,
          opacity: 50,
        }}>
        <Text weight="regular" color="black">
          {currentZone?.name.toLocaleUpperCase()} - {''}
          {floor}
        </Text>
      </View>
    </View>
  );
};

export default DestinationPreviewHeader;
