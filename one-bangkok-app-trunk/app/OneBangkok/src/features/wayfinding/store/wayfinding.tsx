import {
  ImmutableArray,
  ImmutableObject,
  State,
  useHookstate,
} from '@hookstate/core';
import {
  CAMERA_EASING_MODE,
  COLLISION_RANKING_TIERS,
  MappedinCategory,
  MappedinCoordinate,
  MappedinDirections,
  MappedinLocation,
  MappedinMap,
  MappedinNode,
  MapViewStore,
  MARKER_ANCHOR,
} from '@mappedin/react-native-sdk';
import {first, last} from 'lodash';
import {WifiEntry} from 'react-native-wifi-reborn';
import {
  SensorTypes,
  setUpdateIntervalForType,
  magnetometer,
} from 'react-native-sensors';
import {
  createContext,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  removeScreenFromStack,
  useNavigation,
} from '~/navigations/AppNavigation';
import {
  ArrowIcon,
  DepartureMarkerTemplate,
  DummyMarkerTemplate,
  MarkerAmenityTemplate,
  MarkerIcon,
  MarkerTemplate,
  PinMarker,
} from '../constants/MarkerTemplate';
import axios from 'axios';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import Config from 'react-native-config';
import {TGeolocationObject} from '@mappedin/react-native-sdk';
import {Alert, AppState, Platform} from 'react-native';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import obkLocationService from '~/services/OBKLocationService';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import _firebaseState from '~/states/firebase';
import CompassHeading from 'react-native-compass-heading';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as turf from '@turf/turf';
import {logEvent} from '~/utils/logGA';
import mockPositionsJson from '../mocks/mock-positions.json';
import {ConfirmModalHandle} from '../components/ConfirmModal';
import {IncludedCategories} from '../constants/Constants';
import {SingleButtonModalHandle} from '../components/SingleButtonModal';
import {SiblingGroup} from '../@types/siblingGroup';
import {blobToBase64} from '../utils/blob-image';

enum PageState {
  normal,
  search,
  shop_detail,
  select_direction,
  navigate,
  full_navigate,
}

class LocationNode {
  location: MappedinLocation;
  nodeIndex: number = 0;

  get node() {
    return this.location.nodes[this.nodeIndex];
  }

  constructor(location: MappedinLocation, index?: number, node?: MappedinNode) {
    this.location = location;
    this.nodeIndex = index ?? 0;
    if (node) {
      const i = this.location.nodes.findIndex(x => x.id === node.id);
      if (i > -1) {
        this.nodeIndex = i;
      }
    }
  }
}

export type DirectionState = {
  departure?: LocationNode;
  destinations: (LocationNode | undefined)[];
  isAccessible: boolean;
};

export type CurrentLocation = {
  accuracy: number;
  latitude: number;
  longitude: number;
  predicted_buildings: {
    confidence: number;
    label: string;
  }[];
  predicted_floors: {
    confidence: number;
    label: string;
  }[];
};

export enum MarkerType {
  Destination,
  Pin,
  ArrowPin,
  Amenity,
}

export type MapMarker = {
  id: string | undefined;
  type: MarkerType;
  location?: ImmutableObject<LocationNode> | LocationNode;
  node?: MappedinNode | ImmutableObject<MappedinNode>;
  visible: boolean;
};

export interface GeomagneticState {
  x: number;
  y: number;
  z: number;
}

export type GeolocationResponseType = Omit<GeolocationResponse, 'coords'> & {
  coords: GeolocationResponse['coords'] & {
    floor?: number;
  };
};

export type CompassHeadingUpdate = {
  heading: number;
  accuracy: number;
};

export interface WayFindingState {
  pageState: PageState;
  currentMap: MappedinMap | undefined;
  zones: MappedinLocation[];
  shopList: LocationNode[];
  selectedShop: LocationNode | undefined;
  currentPosition: TGeolocationObject | undefined;
  currentLocation?: MappedinNode;
  direction: DirectionState;
  isNoPathConnect: boolean;
  activeDirections: MappedinDirections | undefined;
  hasGeolocationPermission: boolean | undefined;
  magnetometerData: number;
  isYourPositionClicked: boolean; // deprecated remove later.
  isPositioning: boolean;
  isManualChangeMap: boolean;
  bearingValue: number;
  rotation: number;
  // customizeBluedotId: string;
  bottomSheetState: {
    backdropOpacity: number;
    min: string;
    max: string;
    index: number;
  };
  isArrived: boolean;
  pinnedLocation: LocationNode | undefined;
  keepNotAllowLocation: boolean;
  userLocationZone: string;
  selectedAmenity: LocationNode | undefined;
  activeMarkerId: string;
  isClickedCompass: boolean;
}

const DEFAULT_STATE: WayFindingState = {
  pageState: PageState.normal,
  currentMap: undefined,
  zones: [],
  shopList: [],
  selectedShop: undefined,
  currentPosition: undefined,
  currentLocation: undefined,
  direction: {
    departure: undefined,
    destinations: [],
    isAccessible: false,
  },
  isNoPathConnect: false,
  activeDirections: undefined,
  magnetometerData: 0,
  hasGeolocationPermission: undefined,
  isYourPositionClicked: false,
  isManualChangeMap: false,
  isPositioning: false,
  bearingValue: 0,
  rotation: 0,
  // customizeBluedotId: '',
  bottomSheetState: {
    index: 0,
    backdropOpacity: 0.2,
    min: '20%',
    max: '65%',
  },
  isArrived: false,
  pinnedLocation: undefined,
  keepNotAllowLocation: false,
  userLocationZone: '',
  selectedAmenity: undefined,
  activeMarkerId: '',
  isClickedCompass: false,
};

const DEGREE_UPDATE_RATE = 6;

interface WayfindingAction {
  setZones: () => void;
  checkInsideBoundary: () => Promise<boolean>;
  setMap: (mapId?: string, resetMap?: boolean) => Promise<void>;
  findNearestLocation: (
    node?: MappedinNode | ImmutableObject<MappedinNode>,
  ) => MappedinLocation | undefined;
  navigateFromCurrentLocation: () => Promise<boolean | undefined>;
  navigate: () => Promise<boolean | undefined>;
  getZoneLocation: (
    data: ImmutableObject<LocationNode> | undefined,
  ) => ImmutableObject<MappedinLocation> | undefined;
  getCurrentZone: () => ImmutableObject<MappedinLocation> | undefined;
  getZoneColor: (zoneName: string) => {
    base: string;
    highlight: string;
  };
  search: (text: string) => Promise<LocationNode[]>;
  createMarker: (
    location: ImmutableObject<LocationNode | undefined>,
  ) => Promise<string | undefined>;
  createPinMarker: (
    location: ImmutableObject<LocationNode | undefined>,
  ) => Promise<string | undefined>;
  createMarkerBluedot: (location: MappedinNode) => Promise<string | undefined>;
  createRotatingMarker: () => void;
  createMarkerAmenity: (
    name: string,
    logoUrl: string,
    node: LocationNode,
    isFocus?: boolean,
  ) => string | undefined;
  resetMarker: (type?: MarkerType) => void;
  hideMarker: (type?: MarkerType) => Promise<void>;
  showMarker: (type?: MarkerType) => Promise<void>;
  watchPosition: () => Promise<void>;
  clearWatch: () => void;
  checkPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  requestGeolocationPermission: () => void;
  handleMockPosition: () => Promise<void>;
}

export interface WayFindingStateAction {
  mapView: RefObject<MapViewStore>;
  nearestNode: React.MutableRefObject<MappedinNode | undefined>;
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  customizeBluedotIdRef: React.MutableRefObject<string>;
  confirmModalRef: React.RefObject<ConfirmModalHandle>;
  singleButtonModalRef: React.RefObject<SingleButtonModalHandle>;
  state: State<WayFindingState>;
  isEnableBlueDot: boolean;
  ignoreCategories: ImmutableArray<{
    externalId: string;
  }>;
  isFirstLocatePosition: React.MutableRefObject<boolean>;
  markers: React.MutableRefObject<MapMarker[]>;
  action: WayfindingAction;
}

export interface WayFindingContextType extends WayFindingStateAction {
  selectedCategory: MappedinCategory | undefined;
  setSelectedCategory: (category: MappedinCategory | undefined) => void;
  onResetMapPosition: () => void;
  onClearMapPosition: () => void;
  handleManualClick: (isManual: boolean) => void;
}

const WayFindingContext = createContext<WayFindingContextType | undefined>(
  undefined,
);

export const useWayFindingStateAction = (
  pageKey: string,
): WayFindingStateAction => {
  const navigation = useNavigation();

  const mapView = useRef<MapViewStore>(null);
  const customizeBluedotIdRef = useRef<string>('');
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const confirmModalRef = useRef<ConfirmModalHandle>(null);
  const singleButtonModalRef = useRef<SingleButtonModalHandle>(null);
  const nearestNode = useRef<MappedinNode>();
  const subscriptionId = useRef<number | null>(null);
  const [timer, setTimer] = useState(30);
  const previousFloor = useRef(0);
  const geomagneticData = useRef<GeomagneticState>({x: 0, y: 0, z: 0});
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const counterWifiScan = useRef(31);
  const boundary = useRef<number[][]>([]);
  const isFirstLocatePosition = useRef(true);
  const siblingGroups = useRef<SiblingGroup[]>();
  const markers = useRef<MapMarker[]>([]);

  const config = useMemo(() => {
    const {
      enable_wayfinding_bluedot_ios,
      enable_wayfinding_bluedot_android,
      ignore_wayfinding_categories,
    } = _firebaseState;
    const isEnableBlueDot =
      (enable_wayfinding_bluedot_ios.value && Platform.OS === 'ios') ||
      (enable_wayfinding_bluedot_android.value && Platform.OS === 'android');
    const ignoreCategories = ignore_wayfinding_categories.value;

    return {isEnableBlueDot, ignoreCategories};
  }, []);

  useEffect(() => {
    resetState();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    if (config.isEnableBlueDot) {
      requestGeolocationPermission();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
        enableBackgroundLocationUpdates: true,
        locationProvider: 'playServices',
      });
      watchPosition();
      subscribeToGeomagneticData();
    }

    startCompass();
    getSiblingGroup();

    const intervalId = setInterval(() => {
      setTimer(value => value + 1);
      counterWifiScan.current++;
    }, 1000);
    let isTriggered = false;
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (!isTriggered) {
        isTriggered = true;
        removeScreenFromStack(navigation, pageKey);
      }
    });
    return () => {
      subscription.remove();
      unsubscribe();
      clearWatch();
      clearInterval(intervalId);
      stopCompass();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const runnerCheck = async () => {
      if (timer % 3 === 0) {
        const result = await checkPermission();
        try {
          if (
            state.hasGeolocationPermission.value !== result &&
            appStateVisible === 'active'
          ) {
            if (result) {
              await mapView.current?.BlueDot.enable({showBearing: true});
              await watchPosition();
              isFirstLocatePosition.current = true;
              startCompass();
            } else {
              isFirstLocatePosition.current = false;
              await mapView.current?.BlueDot.disable();
              state.currentLocation.set(undefined);
              if (state.pageState.value === PageState.navigate) {
                await mapView.current?.Journey.clear();
                bottomSheetRef.current?.collapse();
              }
              stopCompass();
              clearWatch();
            }
            state.hasGeolocationPermission.set(result);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    runnerCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, appStateVisible]);

  const getSiblingGroup = async () => {
    if (siblingGroups.current) {
      return;
    }
    try {
      const res = await axios.get<SiblingGroup[]>(
        `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/s3/siblingGroups-node.json`,
      );
      siblingGroups.current = res.data;
    } catch (e) {
      console.error(e);
    }
  };

  const startCompass = () => {
    CompassHeading.start(
      DEGREE_UPDATE_RATE,
      ({heading}: CompassHeadingUpdate) => {
        try {
          state.magnetometerData.set(heading);
        } catch {
          console.error('magnetometerData error');
        }
      },
    );
  };

  const stopCompass = () => {
    CompassHeading.stop();
  };

  const checkPermission = async () => {
    const isLocationEnabled = await DeviceInfo.isLocationEnabledSync();
    if (Platform.OS === 'ios') {
      const result = await checkMultiple([
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
      ]);
      return (
        isLocationEnabled &&
        (result['ios.permission.LOCATION_ALWAYS'] === 'granted' ||
          result['ios.permission.LOCATION_WHEN_IN_USE'] === 'granted')
      );
    } else {
      const result = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      return (
        isLocationEnabled &&
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      );
    }
  };

  const requestGeolocationPermission = () => {
    Geolocation.requestAuthorization(
      async () => {
        console.warn('requestAuthorization:success');
      },
      e => {
        console.warn('Request geolocation error.', e);
      },
    );
  };

  const subscribeToGeomagneticData = async () => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    const subscription = magnetometer.subscribe(
      ({x, y, z}) => {
        geomagneticData.current = {x, y, z};
      },
      _ => console.log('magnetometer error'),
    );
    return subscription;
  };

  const fetchCurrentPosition = async (
    pos: GeolocationResponseType,
    wifiData: WifiEntry[],
  ) => {
    try {
      const geomagnetic = geomagneticData.current;
      const payload = wifiData.map((item: WifiEntry) => ({
        ...item,
        ...geomagnetic,
        buildingNumber: '0',
        floorNumber: '0',
        locationID: '0',
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      }));

      const result = await axios.post<CurrentLocation>(
        `${Config.PREDICT_POSITION_API!}/predict`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return result.data;
    } catch (error) {
      console.log('Error:', error);
      return undefined;
    }
  };

  let isProcessingGeolocation = false;

  const checkDistance = (
    departure: TGeolocationObject,
    destination: MappedinCoordinate,
  ) => {
    const from = turf.point([
      departure.coords?.latitude,
      departure.coords?.longitude,
    ]);
    const to = turf.point([destination.lat, destination.lon]);

    const distance = turf.distance(from, to, {units: 'meters'});
    return distance;
  };

  const handleSuccessGetGeolocation = async (pos: GeolocationResponseType) => {
    try {
      if (!mapView.current || isProcessingGeolocation) {
        return;
      }

      isProcessingGeolocation = true;
      const previousFloorWayfinding = await AsyncStorage.getItem(
        'previousFloorWayfinding',
      );
      previousFloor.current = Number(previousFloorWayfinding);
      const position: TGeolocationObject = {
        timestamp: pos.timestamp,
        coords: {
          accuracy: pos.coords.accuracy,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          floorLevel:
            Platform.OS === 'ios' ? pos.coords.floor : previousFloor.current,
        },
        bearing: state.bearingValue.value ?? 0,
        type: 0,
      };
      if (Platform.OS === 'android') {
        if (counterWifiScan.current > 30) {
          const wifiData = await obkLocationService.refreshWifiData();
          counterWifiScan.current = 0;
          const result = await fetchCurrentPosition(pos, wifiData ?? []);
          if (result) {
            const floorFromPredict = first(result.predicted_floors)?.label
              ? Number(first(result.predicted_floors)?.label)
              : previousFloor.current;
            position.coords = {
              accuracy: result.accuracy ?? pos.coords.accuracy,
              latitude: result.latitude ?? pos.coords.latitude,
              longitude: result.longitude ?? pos.coords.longitude,
              floorLevel: floorFromPredict,
            };
            previousFloor.current = floorFromPredict;
            await AsyncStorage.setItem(
              'previousFloorWayfinding',
              previousFloor.current.toString(),
            );
          }
        }
      }

      state.currentPosition.set(position);

      const isInsideBoundary = await checkInsideBoundary(position);
      if (isInsideBoundary) {
        mapView.current?.overrideLocation(position);
      } else {
        state.currentLocation.set(undefined);
        state.isPositioning.set(false);
      }

      if (state.pageState.value === PageState.full_navigate) {
        await handleMoveArrow(position);
      }
    } catch (e) {
      console.log(e);
    } finally {
      isProcessingGeolocation = false;
    }
  };

  const handleMoveArrow = async (position: TGeolocationObject) => {
    const maps = mapView.current?.venueData?.maps.filter(
      x => x.elevation === position.coords.floorLevel,
    );

    let coordinate: MappedinCoordinate | undefined;

    if (maps) {
      if (Array.isArray(maps) && maps.length > 1) {
        const coordinate1 = maps[0].createCoordinate(
          position.coords.latitude,
          position.coords.longitude,
        );
        const coordinate2 = maps[1].createCoordinate(
          position.coords.latitude,
          position.coords.longitude,
        );

        const distance1 = checkDistance(position, coordinate1);
        const distance2 = checkDistance(position, coordinate2);

        coordinate = distance1 <= distance2 ? coordinate1 : coordinate2;
      } else {
        coordinate = first(maps)?.createCoordinate(
          position.coords.latitude,
          position.coords.longitude,
        );
      }

      if (!coordinate) {
        return;
      }
      const isSameMap =
        mapView.current?.currentMap?.id === coordinate?.nearestNode.map.id;
      if (
        !isSameMap &&
        !state.isManualChangeMap.value &&
        state.pageState.value === PageState.full_navigate &&
        coordinate?.nearestNode
      ) {
        await setMap(coordinate.nearestNode.map.id);
      }

      if (
        coordinate.nearestNode &&
        state.activeDirections.value &&
        state.currentLocation.value
      ) {
        const targetPoint = turf.point([
          state.currentLocation.value.lat,
          state.currentLocation.value.lon,
        ]);
        const points = turf.featureCollection([
          ...state.activeDirections.value.path
            .filter(x => x.map.id === coordinate!.nearestNode.map.id)
            .map(x => turf.point([x.lat, x.lon], {id: x.id})),
        ]);
        const nearest = turf.nearestPoint(targetPoint, points);
        const nearestNodeOnPath = state.activeDirections.value?.path.find(
          x => x.id === nearest.properties.id,
        );
        if (nearestNodeOnPath) {
          state.currentLocation.set(coordinate.nearestNode);
          mapView.current?.Markers.animate(
            customizeBluedotIdRef.current,
            nearestNodeOnPath as MappedinNode,
            {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
          ).then(() => {
            mapView.current?.Camera.focusOn(
              {nodes: [nearestNodeOnPath as MappedinNode]},
              {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
            );
            mapView.current?.Camera.animate(
              {
                zoom: state.isClickedCompass.value ? undefined : 1000,
                position: nearestNodeOnPath as MappedinNode,
              },
              {
                duration: 500,
                easing: CAMERA_EASING_MODE.EASE_IN_OUT,
              },
            );
          });
        }
      }
    }
  };

  const handleErrorGetGeolocation = (error: GeolocationError) => {
    if (error) {
      console.error(error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        return;
      }
      Geolocation.getCurrentPosition(
        handleSuccessGetGeolocation,
        handleErrorGetGeolocation,
        {
          distanceFilter: 1,
          maximumAge: 3000,
        },
      );
    } catch {}
  };

  const watchPosition = async () => {
    try {
      state.isPositioning.set(true);
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        state.isPositioning.set(false);
        return;
      }
      const watchId = Geolocation.watchPosition(
        handleSuccessGetGeolocation,
        handleErrorGetGeolocation,
        {
          interval: 2000,
          enableHighAccuracy: true,
          distanceFilter: 0,
          timeout: 20000,
          maximumAge: 0,
        },
      );
      subscriptionId.current = watchId;
      setTimeout(() => {
        try {
          state.isPositioning.set(false);
        } catch {}
      }, 5000);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const fetchBoundary = async () => {
    try {
      if (boundary && boundary.current.length > 0) {
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

  const clearWatch = () => {
    subscriptionId.current !== null &&
      Geolocation.clearWatch(subscriptionId.current);
    subscriptionId.current = null;
  };

  const state = useHookstate<WayFindingState>({...DEFAULT_STATE});

  const resetState = async () => {
    previousFloor.current = 0;
    setTimer(30);
    counterWifiScan.current = 31;
    isProcessingGeolocation = false;
    // markers.current = [];
    state.pageState.set(PageState.normal);
    state.currentMap.set(undefined);
    state.zones.set([]);
    state.shopList.set([]);
    state.selectedShop.set(undefined);
    state.currentPosition.set(undefined);
    state.currentLocation.set(undefined);
    state.direction.set({
      departure: undefined,
      destinations: [],
      isAccessible: false,
    });
    state.isNoPathConnect.set(false);
    state.activeDirections.set(undefined);
    state.hasGeolocationPermission.set(undefined);
    state.magnetometerData.set(0);
    state.isYourPositionClicked.set(false);
    state.isPositioning.set(false);
    // state.customizeBluedotId.set('');
    state.bottomSheetState.set({
      index: 0,
      backdropOpacity: 0.2,
      min: '20%',
      max: '65%',
    });
    state.isArrived.set(false);
    state.keepNotAllowLocation.set(false);
    state.userLocationZone.set('');
    state.isClickedCompass.set(false);
  };

  const setZones = () => {
    const data =
      mapView.current?.venueData?.locations.filter(l => l.type === 'zone') ??
      [];
    state.zones.set(data);
  };

  const checkInsideBoundary = async (position?: TGeolocationObject) => {
    await fetchBoundary();
    const lat =
      position?.coords.latitude ?? state.currentPosition.value?.coords.latitude;
    const lon =
      position?.coords.longitude ??
      state.currentPosition.value?.coords.longitude;
    const point = turf.point([lat ?? 0, lon ?? 0]);
    const isPointInPolygon =
      boundary.current.length > 4 &&
      turf.booleanPointInPolygon(point, turf.polygon([boundary.current]));
    return isPointInPolygon;
  };

  const setMap = async (mapId?: string, resetMap = true) => {
    logEvent('button_click', {
      screen_name: 'Wayfinding',
      feature_name: 'See Location on Map',
      action_type: 'click',
      bu: 'LBS',
    });

    const isContainIgnoreCategories = (externalId: string) => {
      return config.ignoreCategories
        .map(x => x.externalId)
        .includes(externalId);
    };

    state.currentMap.set(mapView?.current?.currentMap);

    if (mapId && mapView.current && resetMap) {
      await mapView.current.setMap(mapId);
      state.currentMap.set(mapView?.current?.currentMap);
      mapView.current?.venueData?.categories.forEach(async category => {
        if (isContainIgnoreCategories(category.externalId ?? '')) {
          return;
        }
        const color = (category as any)?.color?.hex ?? '#263b48';
        let icon = (category.icon as any)?.small;
        if (
          category.icon?.original &&
          category.icon.original.endsWith('.svg')
        ) {
          const iconData = await axios.get(category.icon.original);
          icon = MarkerIcon(iconData.data);
        } else if (category.iconFromDefaultList) {
          const iconData = await axios.get(
            `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/GetDefaultIcon/${
              category.iconFromDefaultList
            }`,
          );
          icon = MarkerIcon(iconData.data);
        }

        category?.locations.forEach(async location => {
          const node =
            location.polygons.length > 0
              ? location.polygons[0]
              : location.nodes[0];
          if (node) {
            await mapView.current?.FloatingLabels.add(node, location.name, {
              interactive: true,
              appearance: {
                text: {
                  foregroundColor: color,
                },
                marker: {
                  icon: icon,
                  iconFit: 'cover',
                  iconSize: 15,
                  backgroundColor: {
                    active: 'white',
                    inactive: 'white',
                  },
                  iconPadding: 2,
                  foregroundColor: {
                    active: color,
                    inactive: color,
                  },
                },
              },
            });
          }
        });
      });
    }
  };

  const pathOptions = {
    farRadius: 4,
    nearRadius: 0.5,
    interactive: true,
    color: '#000000',
    animateDrawing: false,
  };

  const findNearestLocation = (
    node?: MappedinNode | ImmutableObject<MappedinNode>,
  ) => {
    try {
      if (node) {
        const coordinate = node.map?.createCoordinate(node.lat, node.lon);
        const targetPoint = turf.point([node.lat, node.lon]);
        const nodes = coordinate
          ?.nodesInRadius(20)
          .filter(
            x =>
              x.locations.length > 0 &&
              x.locations.some(l => IncludedCategories.includes(l.type)),
          );
        const points = nodes?.map(x => turf.point([x.lat, x.lon], {id: x.id}));
        if (points) {
          const featurePoints = turf.featureCollection([...points]);
          var nearest = turf.nearestPoint(targetPoint, featurePoints);
          const nearestLocation = first(
            nodes
              ?.find(x => x.id === nearest.properties.id)
              ?.locations.filter(l => IncludedCategories.includes(l.type)),
          );
          return nearestLocation;
        }
      }
      return undefined;
    } catch {}
  };

  const navigateFromCurrentLocation = async () => {
    logEvent('button_click', {
      screen_name: 'Wayfinding',
      feature_name: 'Map Navigation',
      action_type: 'click',
      bu: 'LBS',
    });

    if (
      !state.currentLocation.value ||
      !state.direction.destinations[0].value
    ) {
      return Promise.resolve(false);
    }
    state.isNoPathConnect.set(false);
    return mapView.current
      ?.getDirections({
        from: state.currentLocation.value as MappedinNode,
        to: state.direction.destinations[0].value.node as MappedinNode,
        accessible: state.direction.isAccessible.value,
      })
      .then(directions => {
        const draw = mapView.current?.Journey.draw(directions, {
          destinationMarkerTemplateString: '',
          pathOptions: {
            ...pathOptions,
          },
          inactivePathOptions: {interactive: true},
          departureMarkerTemplateString: '',
        });

        let startMap: string;

        if (Array.isArray(directions)) {
          startMap = directions[0].instructions[0]?.node?.map.id;
          directions[0].instructions = directions[0].instructions.filter(
            x => !x.instruction.startsWith('Depart from'),
          );
          state.activeDirections.set(directions[0]);
        } else {
          startMap = directions.instructions[0]?.node?.map.id;
          directions.instructions = directions.instructions.filter(
            x => !x.instruction.startsWith('Depart from'),
          );
          state.activeDirections.set(directions);
        }
        if (!startMap) {
          startMap = state.currentLocation.value!.map.id;
        }
        let setMapPromise: Promise<void> = Promise.resolve();
        return Promise.all([setMapPromise, draw]);
      })
      .then(() => {
        if (state.pageState.value === PageState.navigate) {
          return mapView.current?.Camera.focusOn(
            {
              nodes: [state.currentLocation.value] as MappedinNode[],
            },
            {
              changeZoom: false,
              easing: CAMERA_EASING_MODE.EASE_OUT,
              duration: 500,
            },
          );
        }
        return Promise.resolve();
      })
      .then(() => Promise.resolve(true));
  };

  const navigate = async () => {
    logEvent('button_click', {
      screen_name: 'Wayfinding',
      feature_name: 'Map Navigation',
      action_type: 'click',
      bu: 'LBS',
    });

    if (
      !state.direction.departure.value ||
      !state.direction.destinations[0].value
    ) {
      return Promise.resolve(false);
    }
    state.isNoPathConnect.set(
      state.direction.departure.value.node.id ===
        state.direction.destinations[0].value.node.id,
    );
    return mapView.current
      ?.getDirections({
        from: state.direction.departure.value.node as MappedinNode,
        to: state.direction.destinations[0].value.node as MappedinNode,
        accessible: state.direction.isAccessible.value,
      })
      .then(directions => {
        const draw = mapView.current?.Journey.draw(directions, {
          destinationMarkerTemplateString: '',
          pathOptions: {...pathOptions},
          inactivePathOptions: {interactive: true},
          departureMarkerTemplateString: DepartureMarkerTemplate,
        });

        let startMap: string;

        if (Array.isArray(directions)) {
          startMap = directions[0].instructions[0]?.node?.map.id;
          directions[0].instructions = directions[0].instructions.slice(
            1,
            directions[0].instructions.length - 1,
          );
          state.activeDirections.set(directions[0]);
        } else {
          startMap = directions.instructions[0]?.node?.map.id;
          directions.instructions = directions.instructions.slice(
            1,
            directions.instructions.length - 1,
          );
          state.activeDirections.set(directions);
        }
        if (!startMap) {
          startMap = state.direction.departure.value!.node.map.id;
        }
        const setMapPromise = setMap(startMap);
        return Promise.all([setMapPromise, draw]);
      })
      .then(() => {
        return mapView.current?.Camera.focusOn(
          {
            nodes: state.direction.departure.value!.location
              .nodes as MappedinNode[],
          },
          {
            changeZoom: false,
            easing: CAMERA_EASING_MODE.EASE_OUT,
            duration: 500,
          },
        );
      })
      .then(() => {
        if (Platform.OS === 'android') {
          mapView.current?.Camera.animate(
            {zoom: 1000},
            {
              duration: 1000,
              easing: CAMERA_EASING_MODE.EASE_IN_OUT,
            },
          );
        }
      })
      .then(() => Promise.resolve(true));
  };

  // Get store under building
  const getZoneLocation = (data: ImmutableObject<LocationNode> | undefined) => {
    if (!data) {
      return undefined;
    }
    const venue = siblingGroups.current?.find(
      x => x.externalId === data.location.externalId,
    );
    const node = venue?.nodes.find(x => x.node === data.node.id);
    let siblingGroup = data?.location?.siblingGroups?.find(
      x => x.label === 'REFERENCE_POINT',
    );

    if (node) {
      siblingGroup = node?.siblingGroups?.find(
        x => x.label === 'REFERENCE_POINT',
      ) as {
        label: string;
        siblings: string[];
      };
    }

    const sibling =
      siblingGroup?.siblings[data.nodeIndex] ?? siblingGroup?.siblings[0];
    const zone = state.zones.value.find(x => x.id === sibling);
    if (
      zone &&
      (data.location.id === state.pinnedLocation.value?.location.id ||
        data.location.id === state.currentLocation.value?.id)
    ) {
      state.userLocationZone.set(zone?.name);
    }
    return zone;
  };

  const getCurrentZone = () => {
    try {
      if (state.currentLocation.value) {
        const coordinate = state.currentLocation.value.map?.createCoordinate(
          state.currentLocation.value.lat,
          state.currentLocation.value.lon,
        );
        const targetPoint = turf.point([
          state.currentLocation.value.lat,
          state.currentLocation.value.lon,
        ]);
        const nodes = coordinate
          ?.nodesInRadius(25)
          .filter(
            x =>
              x.locations.length > 0 &&
              x.locations.some(l => IncludedCategories.includes(l.type)),
          );
        const points = nodes?.map(x => turf.point([x.lat, x.lon], {id: x.id}));
        if (points) {
          const featurePoints = turf.featureCollection([...points]);
          var nearest = turf.nearestPoint(targetPoint, featurePoints);
          const nearestLocation = first(
            nodes
              ?.find(x => x.id === nearest.properties.id)
              ?.locations.filter(l => IncludedCategories.includes(l.type)),
          );
          const siblingGroup = nearestLocation?.siblingGroups?.find(
            x => x.label === 'REFERENCE_POINT',
          );
          const sibling = siblingGroup?.siblings[0];
          const zone = state.zones.value.find(x => x.id === sibling);
          return zone;
        }
      }
      return undefined;
    } catch {}
  };

  const getZoneColor = (externalId: string) => {
    switch (externalId) {
      case 'Parade':
        return {base: '#69B3E780', highlight: '#5FA3D2B3'};
      case 'TheStoreys':
        return {base: '#F9E26780', highlight: '#CDBA55B3'};
      case 'Forum':
        return {base: '#D5003280', highlight: '#5FA3D2B3'};
      case 'Post 1928':
        return {base: '#FF6A1380', highlight: '#5FA3D2B3'};
      case 'One Bangkok Park':
        return {base: '#006F4480', highlight: '#5FA3D2B3'};
      default:
        return {base: '#69B3E780', highlight: '#5FA3D2B3'};
    }
  };

  const search = async (text: string) => {
    const searchResults = await mapView.current?.OfflineSearch.search(text);

    const data =
      searchResults
        ?.filter(r => r.type === 'MappedinLocation')
        .map(r => new LocationNode(r.object as MappedinLocation)) ?? [];
    const locationsToInsert: {locationNode: LocationNode; index: number}[] = [];
    data.forEach((x, i) => {
      if (x.location.nodes?.length && x.location.nodes.length > 1) {
        for (let index = 1; index < x.location.nodes.length; index++) {
          locationsToInsert.push({
            locationNode: new LocationNode(x.location, index),
            index: i + 1,
          });
        }
      }
    });
    locationsToInsert.forEach(x => {
      data.splice(x.index, 0, x.locationNode);
    });
    return data;
  };

  const createMarkerBluedot = async (node: MappedinNode) => {
    if (!node) {
      return;
    }
    const id = mapView.current?.Markers.add(node, ArrowIcon, {
      anchor: MARKER_ANCHOR.CENTER,
      rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE,
      interactive: true,
    });
    const newMarker: MapMarker = {
      id: id,
      node: node,
      type: MarkerType.ArrowPin,
      visible: true,
    };
    markers.current.push(newMarker);
    // state.customizeBluedotId.set(id!);
    customizeBluedotIdRef.current = id!;
    return id;
  };

  const createRotatingMarker = () => {
    // Remove existing marker if it exists

    if (state.activeMarkerId.value) {
      mapView.current?.Markers.remove(state.activeMarkerId.value);
    }

    const center = mapView.current?.currentMap?.center;
    if (center) {
      const marker = mapView.current?.Markers.add(
        center,
        DummyMarkerTemplate(state.rotation.value),
        {
          interactive: true,
          rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE, // This is required to ensure the connection between CSS variables remains active.
        },
      );

      if (marker) {
        state.activeMarkerId.set(marker);
      }
    }
  };

  const createMarker = async (
    location: ImmutableObject<LocationNode | undefined>,
  ) => {
    if (!location) {
      return;
    }
    const coordinate = location.node.map.createCoordinate(
      location.node.lat, // latitude
      location.node.lon, // longitude
    );
    if (coordinate) {
      let imageUrl: string | ArrayBuffer | undefined =
        location.location.logo?.small;
      if (!imageUrl) {
        imageUrl = await blobToBase64(
          `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/GetDefaultIcon/ob-logo.jpeg`,
        );
      }
      const id = await mapView.current?.createMarker(
        coordinate,
        MarkerTemplate(location.location.name, imageUrl),
        {
          anchor: MARKER_ANCHOR.CENTER,
          rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE,
          interactive: true,
        },
      );
      const newMarker: MapMarker = {
        id: id,
        location: location,
        type: MarkerType.Destination,
        visible: true,
      };
      markers.current.push(newMarker);
      return id;
    }
    return undefined;
  };

  const createPinMarker = async (
    location: ImmutableObject<LocationNode | undefined>,
  ) => {
    if (!location) {
      return;
    }
    const coordinate = location.node.map.createCoordinate(
      location.node.lat, // latitude
      location.node.lon, // longitude
    );
    if (coordinate) {
      const category = first(location.location.categories);
      const uri = await blobToBase64(
        `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/GetDefaultIcon/ob-logo.jpeg`,
      );

      const id = mapView.current?.createMarker(
        coordinate,
        PinMarker(
          location.location.name,
          location.location.logo?.original ??
            location.location.logo?.xxsmall ??
            category?.icon?.original ??
            uri,
          'en',
        ),
        {
          anchor: MARKER_ANCHOR.CENTER,
          rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE,
          interactive: true,
        },
      );
      const newMarker: MapMarker = {
        id: id,
        location: location,
        type: MarkerType.Pin,
        visible: true,
      };
      markers.current.push(newMarker);
      return id;
    }
    return undefined;
  };

  const createMarkerAmenity = (
    name: string,
    logoUrl: string,
    location: LocationNode,
    isFocus?: boolean,
  ) => {
    if (!location.node) {
      return;
    }
    const size = isFocus ? 52 : 44;
    const id = mapView.current?.createMarker(
      location.node,
      MarkerAmenityTemplate(name, '#2B7CCD', logoUrl, size),
      {
        anchor: MARKER_ANCHOR.CENTER,
        rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE,
        interactive: true,
      },
    );
    const newMarker: MapMarker = {
      id: id,
      location: location,
      node: location.node,
      type: MarkerType.Amenity,
      visible: true,
    };
    markers.current.push(newMarker);
    return id;
  };

  const resetMarker = (type?: MarkerType) => {
    const rmMarkersId: string[] = [];
    markers.current.forEach(async marker => {
      if (
        marker.id &&
        ((type !== undefined && marker.type === type) || type === undefined)
      ) {
        await mapView.current?.removeMarker(marker.id);
        rmMarkersId.push(marker.id);
      }
    });
    markers.current = markers.current.filter(
      x => x.id && !rmMarkersId.includes(x.id),
    );
  };

  const hideMarker = async (type?: MarkerType) => {
    await markers.current.map(async marker => {
      if (
        marker.id &&
        ((type !== undefined && marker.type === type) || type === undefined)
      ) {
        await mapView.current?.removeMarker(marker.id);
        marker.visible = false;
      }
    });
  };

  const showMarker = async (type?: MarkerType) => {
    const rmMarkersId: string[] = [];
    await markers.current.map(async marker => {
      if (
        marker.id &&
        ((type !== undefined && marker.type === type) || type === undefined)
      ) {
        if (
          marker.type === MarkerType.ArrowPin &&
          state.currentLocation.value
        ) {
          await createMarkerBluedot(
            state.currentLocation.value as MappedinNode,
          );
        }

        if (marker.type === MarkerType.Pin) {
          resetMarker(MarkerType.Pin);
          await createPinMarker(
            marker.location as ImmutableObject<LocationNode>,
          );
        } else if (marker.type === MarkerType.Destination) {
          resetMarker(MarkerType.Destination);
          await createMarker(marker.location as ImmutableObject<LocationNode>);
        } else if (marker.type === MarkerType.Amenity) {
          await createMarkerAmenity(
            marker.location?.location.name ?? '',
            marker.location?.location.logo?.xsmall ?? '',
            marker.location as LocationNode,
          );
        }
        rmMarkersId.push(marker.id);
      }
    });
    markers.current = markers.current.filter(
      x => x.id && !rmMarkersId.includes(x.id),
    );
  };

  const mockPositions = mockPositionsJson.map(x => {
    x.coords.latitude + 0.005; // Adjust latitude for mock data
    x.coords.longitude + 0.005; // Adjust longitude for mock data
    const pos: GeolocationResponseType = {
      coords: {
        ...x.coords,
        floor: x.coords.floorLevel,
        altitude: null,
        altitudeAccuracy: null,
        heading: 1,
        speed: 2,
      },
      timestamp: x.timestamp,
    };
    return pos;
  });
  let currentMockIndex = useRef(0);

  const handleMockPosition = async () => {
    if (mockPositions.length >= currentMockIndex.current) {
      currentMockIndex.current++;
    }
    await handleSuccessGetGeolocation(mockPositions[currentMockIndex.current]);
  };

  const action: WayfindingAction = {
    setZones,
    checkInsideBoundary,
    setMap,
    findNearestLocation,
    navigateFromCurrentLocation,
    navigate,
    getZoneLocation,
    getCurrentZone,
    getZoneColor,
    search,
    createMarker,
    createPinMarker,
    createMarkerBluedot,
    createMarkerAmenity,
    createRotatingMarker,
    resetMarker,
    hideMarker,
    showMarker,
    watchPosition,
    clearWatch,
    checkPermission,
    getCurrentLocation,
    requestGeolocationPermission,
    handleMockPosition,
  };
  const {isEnableBlueDot, ignoreCategories} = config;
  return {
    mapView,
    nearestNode,
    bottomSheetRef,
    customizeBluedotIdRef,
    confirmModalRef,
    singleButtonModalRef,
    state,
    isEnableBlueDot,
    ignoreCategories,
    isFirstLocatePosition,
    markers,
    action,
  };
};

export {WayFindingContext, PageState, LocationNode, DEFAULT_STATE};
