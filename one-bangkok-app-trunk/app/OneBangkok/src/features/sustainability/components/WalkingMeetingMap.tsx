import React, {useEffect, useRef, useState} from 'react';
import {IRouteItem} from '../screens/WalkingSelectRouteScreen';
import {
  LocationNode,
  MarkerType,
  PageState,
  useWayFindingStateAction,
  WayFindingContext,
} from '~/features/wayfinding/store/wayfinding';
import {styles} from '~/features/wayfinding/styles/WayFindingStyle';
import {MapScreen} from '~/components/templates';
import NoLocationPermission from '~/features/wayfinding/components/NoLocationPermission';
import {
  CAMERA_EASING_MODE,
  MappedinCategory,
  MappedinDirections,
  MappedinLocation,
  MappedinNode,
  MiMapView,
  TCameraTransform,
} from '@mappedin/react-native-sdk';
import {venueExtendedOptions} from '~/features/wayfinding/constants/VenueOptions';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _, {first} from 'lodash';
import {Animated, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as turf from '@turf/turf';
import {Icon, Text} from '~/components/atoms';
import ReRouteModal from '~/features/wayfinding/components/ReRouteModal';
import {MAP_STATES} from '../screens/WalkingMapRouteScreen';
import NoPermissionModal from '~/features/wayfinding/components/NoPermissionModal';
import ConfirmModal from '~/features/wayfinding/components/ConfirmModal';
import SingleButtonModal from '~/features/wayfinding/components/SingleButtonModal';
import t from '~/utils/text';
import {IncludedCategories} from '~/features/wayfinding/constants/Constants';
import MapHeader from '~/features/wayfinding/components/MapHeader';
import FloatingSheet from '~/features/wayfinding/components/FloatingSheet';
import {ImmutableObject} from '@hookstate/core';

interface IWalkingMeetingMap {
  mapState: string;
  navigateToRoute: boolean;
  routeItem: IRouteItem;
  handleRouteArrived: () => void;
}

const WalkingMeetingMap = ({
  mapState,
  navigateToRoute,
  routeItem,
  handleRouteArrived,
}: IWalkingMeetingMap) => {
  const insets = useSafeAreaInsets();
  const [isMapInit, setIsMapInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MappedinCategory>();
  const [isShowReRouteModal, setReRouteModalVisible] = useState(false);
  const [isClickedCompass, setClickCompass] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;
  const targetRotation = useRef(0);
  const wayFindingStateAction = useWayFindingStateAction('WayFindingScreen');
  const {
    mapView,
    nearestNode,
    isEnableBlueDot,
    bottomSheetRef,
    confirmModalRef,
    singleButtonModalRef,
    state: {
      pageState,
      selectedShop,
      direction,
      currentLocation,
      isNoPathConnect,
      magnetometerData,
      hasGeolocationPermission,
      isYourPositionClicked,
      activeDirections,
      bearingValue,
      pinnedLocation,
      selectedAmenity,
      keepNotAllowLocation,
    },
    action: {
      setZones,
      setMap,
      navigate,
      navigateFromCurrentLocation,
      createMarker,
      createPinMarker,
      createMarkerAmenity,
      resetMarker,
      getCurrentLocation,
    },
  } = wayFindingStateAction;

  const [defaultCameraPosition, setDefaultCameraPosition] =
    useState<TCameraTransform>();

  const isManualClick = useRef(false);
  const reRouteTimeoutId = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleSelectShop = async () => {
      if (selectedShop.value) {
        pageState.set(PageState.shop_detail);
        bottomSheetRef.current?.collapse();
        if (selectedShop.value.node) {
          const coordinate = mapView.current?.currentMap?.createCoordinate(
            selectedShop.value.node.lat, // latitude
            selectedShop.value.node.lon, // longitude
          );
          if (coordinate) {
            await mapView.current?.Camera.animate(
              {
                position: coordinate,
                zoom: 1500,
              },
              {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
            );
            resetMarker(MarkerType.Destination);
            resetMarker(MarkerType.Pin);
            await createMarker(selectedShop.value);
          }
        }
        return;
      }
      resetMarker(MarkerType.Destination);
      pageState.set(PageState.normal);
    };

    handleSelectShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  useEffect(() => {
    const handleSelectLocation = async () => {
      if (pinnedLocation.value) {
        bottomSheetRef.current?.collapse();
        if (pinnedLocation.value.node) {
          const coordinate = mapView.current?.currentMap?.createCoordinate(
            pinnedLocation.value.node.lat, // latitude
            pinnedLocation.value.node.lon, // longitude
          );
          if (coordinate) {
            await mapView.current?.Camera.animate(
              {
                position: coordinate,
                zoom: 1500,
              },
              {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
            );
            resetMarker(MarkerType.Pin);
            await createPinMarker(pinnedLocation.value);
          }
        }
        return;
      }
      resetMarker(MarkerType.Pin);
      pageState.set(PageState.normal);
    };

    handleSelectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedLocation]);

  useEffect(() => {
    targetRotation.current = magnetometerData.value % 360;
    const degreesToRadians = (degrees: number) => {
      return -degrees * (Math.PI / 180);
    };
    bearingValue.set(targetRotation.current);
    if (!isClickedCompass) {
      Animated.timing(rotate, {
        toValue: targetRotation.current,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    if (pageState.value === PageState.full_navigate && !isClickedCompass) {
      mapView.current?.Camera.animate(
        {
          rotation: degreesToRadians(targetRotation.current),
        },
        {
          duration: 100,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magnetometerData, isClickedCompass]);

  useEffect(() => {
    const handleDirection = async () => {
      resetMarker(MarkerType.Pin);
      resetMarker(MarkerType.Destination);
      resetMarker(MarkerType.Amenity);
      const validDirectionFromDeparture =
        direction.destinations.value.length > 0 && direction.departure.value;

      if (direction.destinations.value.length > 0) {
        const destinationLocation = first(direction.destinations.value);
        if (destinationLocation) {
          if (selectedAmenity.value) {
            await createMarkerAmenity(
              destinationLocation.location.name,
              destinationLocation.location.logo?.xsmall ?? '',
              destinationLocation as LocationNode,
            );
          } else {
            await createMarker(destinationLocation);
          }
        }
        // if (pageState.value !== PageState.full_navigate) {
        //   pageState.set(PageState.navigate);
        //   // ทำให้ตัว bottomsheet มันปิดลงเวลาที่ไม่มี permission
        //   // bottomSheetRef.current?.close();
        // }
      } else {
        await mapView.current?.Journey.clear();
        bottomSheetRef.current?.collapse();
      }

      isNoPathConnect.set(false);
      if (validDirectionFromDeparture) {
        await navigate().then(res => {
          if (res && pageState.value === PageState.navigate) {
            bottomSheetRef?.current?.collapse();
          }
        });
      }
    };

    handleDirection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  useEffect(() => {
    const handleCurrentPositionChange = async () => {
      const validDirectionFromCurrentLocation =
        direction.destinations.value.length > 0 && currentLocation.value;
      if (
        validDirectionFromCurrentLocation &&
        pageState.value === PageState.full_navigate
      ) {
        await checkArrival();
        await checkIsOutOfThePath();
        // await Promise.all([checkArrival(), checkIsOutOfThePath()]);
      }
    };
    handleCurrentPositionChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, direction.destinations, direction.isAccessible]);

  const normalizeDegree = (angle: number) =>
    angle - 90 >= 0 ? angle - 90 : angle + 271;

  const calculateAngle = (x: number, y: number) => {
    const rad = Math.atan2(y, x);
    return Math.round((rad >= 0 ? rad : rad + 2 * Math.PI) * (180 / Math.PI));
  };

  const calculateBearing = () => {
    const _x = direction.destinations.value[0]?.node.x;
    const _y = direction.destinations.value[0]?.node.y;
    if (_x && _y) {
      const angle = calculateAngle(_x, _y);
      return normalizeDegree(angle);
    }
  };

  const onResetMapPosition = async () => {
    handleManualClick(false);
    if (currentLocation.value) {
      const heading = calculateBearing();
      if (currentLocation.value.map.id !== mapView.current?.currentMap?.id) {
        await setMap(currentLocation.value.map.id);
      }
      mapView.current?.Camera.focusOn(
        {
          nodes: [currentLocation.value] as MappedinNode[],
        },
        {
          changeZoom: false,
          duration: 500,
          easing: CAMERA_EASING_MODE.EASE_IN_OUT,
          ...(heading !== undefined ? {rotation: heading} : {}),
        },
      );
      return;
    }
    if (direction.departure.value && direction.destinations.value.length > 0) {
      mapView.current?.Camera.focusOn(
        {
          nodes: [direction.departure.value.node] as MappedinNode[],
        },
        {
          changeZoom: false,
          duration: 500,
          easing: CAMERA_EASING_MODE.EASE_IN_OUT,
          safeAreaInsets: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 60,
          },
        },
      );
      mapView.current?.clearAllPolygonColors();
      return;
    }
  };

  const onClearMapPosition = async () => {
    await mapView.current?.Camera.animate(defaultCameraPosition!, {
      duration: 500,
      easing: CAMERA_EASING_MODE.EASE_IN_OUT,
    });
    await mapView.current?.Camera.animate(
      {zoom: 10000},
      {
        duration: 500,
        easing: CAMERA_EASING_MODE.EASE_IN_OUT,
      },
    );
    mapView.current?.clearAllPolygonColors();
    mapView.current?.FloatingLabels.removeAll();
  };

  const checkIsOutOfThePath = async () => {
    if (activeDirections.value && currentLocation.value) {
      const paths = activeDirections.value.path
        .filter(x => x.map.id === currentLocation.value?.map.id)
        .map(p => [p.lat, p.lon]);
      const line = turf.lineString(paths);
      const pt = turf.point([
        currentLocation.value.lat,
        currentLocation.value.lon,
      ]);
      const distance = turf.pointToLineDistance(pt, line, {units: 'meters'});
      if (distance > 10 && reRouteTimeoutId.current === undefined) {
        // Show bottom sheet
        reRouteTimeoutId.current = setTimeout(() => {
          setReRouteModalVisible(true);
        }, 5000);
      }
    }
  };

  const handleManualClick = (isManual: boolean) => {
    isManualClick.current = isManual;
  };

  const triggerCompassAction = useRef(
    _.debounce(() => {
      setClickCompass(prev => !prev);
    }, 200),
  ).current;

  const [routeLocations, setRouteLocations] = useState<MappedinLocation[]>([]);
  const [routeDirections, setRouteDirections] = useState<MappedinDirections[]>(
    [],
  );

  const handleUpdateRouteDirections = () => {
    const directions: MappedinDirections[] = [];
    routeLocations.forEach((item, index) => {
      if (index !== 0) {
        const di: MappedinDirections =
          routeLocations[index - 1].directionsTo(item);
        directions.push(di);
      }
    });

    setRouteDirections(directions);
  };

  const onReRoute = async () => {
    if (reRouteTimeoutId.current) {
      clearTimeout(reRouteTimeoutId.current);
      reRouteTimeoutId.current = undefined;
    }
    setReRouteModalVisible(false);
    handleDrawRoute();
  };

  useEffect(() => {
    if (routeLocations.length === 0) {
      return;
    }

    handleUpdateRouteDirections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeLocations]);

  const handleMapInit = async () => {
    if (
      !mapView.current ||
      !mapView.current.venueData ||
      !currentLocation ||
      !currentLocation.value ||
      routeDirections.length > 0
    ) {
      return;
    }

    const locationMap = new Map(
      mapView.current.venueData.locations.map(l => [l.name, l]),
    );
    const locOrdered = routeItem.routeIds
      .map(id => locationMap.get(id))
      .filter(Boolean);

    const startIndex = (
      await Promise.all(
        locOrdered.map(async (loc, i) => ({
          index: i,
          distance:
            (await getDistanceBetweenPlaces(currentLocation.value, loc)) ??
            Infinity,
        })),
      )
    ).reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev,
    ).index;

    const resultLocation = reorderArrayWithLoop(locOrdered, startIndex);
    if (!resultLocation) {
      return;
    }

    if (resultLocation.length > 0) {
      await setMap(`${resultLocation[0].nodes[0].map.id}`);
    }

    setDefaultCameraPosition({
      tilt: mapView.current!.Camera.tilt,
      zoom: 5000,
      rotation: mapView.current!.Camera.rotation,
      position: resultLocation[0].nodes[0],
    });

    mapView.current?.Camera.focusOn(
      {
        nodes: resultLocation[0].nodes as MappedinNode[],
      },
      {
        changeZoom: false,
        duration: 500,
        easing: CAMERA_EASING_MODE.EASE_IN_OUT,
        safeAreaInsets: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 60,
        },
      },
    );

    setRouteLocations(resultLocation);
  };

  const getDistanceBetweenPlaces = async (
    fromNode: any,
    toNode: any,
  ): Promise<number | undefined> => {
    const result = await mapView.current!.getDirections({
      from: fromNode,
      to: toNode,
    });

    const locDirectionsArray: any[] = Array.isArray(result) ? result : [result];

    let totalDistance = 0;
    for (const locDirection of locDirectionsArray) {
      if (!locDirection.path) {
        continue;
      }

      const locPath = locDirection.path;
      for (const leg of locPath) {
        totalDistance += leg.paths.length ?? 0;
      }
    }

    return totalDistance;
  };

  const reorderArrayWithLoop = (
    arr: any[],
    startIndex: number,
  ): any[] | undefined => {
    if (
      !arr ||
      arr.length === 0 ||
      startIndex < 0 ||
      startIndex >= arr.length
    ) {
      return;
    }

    const rotated = arr.slice(startIndex).concat(arr.slice(0, startIndex));
    rotated.push(arr[startIndex]);

    return rotated;
  };

  useEffect(() => {
    if (!isMapInit || !currentLocation) {
      return;
    }

    handleMapInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapInit, routeItem, currentLocation]);

  const [isDisplaySelectedRoute, setIsDisplaySelectedRoute] =
    useState<boolean>(false);
  const [isRouteArrived, setIsRouteArrived] = useState<boolean>(false);
  const [isInitRoute, setIsInitRoute] = useState<boolean>(false); // Add state for current navigation instruction

  const handleDrawRoute = async () => {
    if (!currentLocation || !currentLocation.value) {
      return;
    }

    let routeDirection = [...routeDirections];
    if (!navigateToRoute) {
      if (isDisplaySelectedRoute) {
        return;
      }

      setIsDisplaySelectedRoute(true);
    } else {
      if (mapView.current?.currentMap?.id !== currentLocation.value.map.id) {
        await setMap(currentLocation.value.map.id);
      }

      pageState.set(PageState.full_navigate);
      if (!isInitRoute) {
        // triggerCompassAction();
        setIsInitRoute(true);
      }

      routeDirection = [
        currentLocation.value.directionsTo(routeLocations[0]),
        ...routeDirections,
      ];

      const locationNode = new LocationNode(
        routeLocations[0],
      ) as ImmutableObject<LocationNode>;

      direction.set({
        destinations: [locationNode],
        departure: undefined,
        isAccessible: direction.isAccessible.value,
      });

      navigateFromCurrentLocation();
    }

    mapView.current?.Journey.draw(routeDirection, {
      departureMarkerTemplateString: '',
      destinationMarkerTemplateString: '',
      pathOptions: {
        color: '#1E8DF2',
      },
      inactivePathOptions: {
        color: '#1E8DF2',
      },
    });
  };

  useEffect(() => {
    if (routeDirections.length === 0) {
      return;
    }

    handleDrawRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeDirections, currentLocation, navigateToRoute]);

  const checkArrival = async () => {
    if (
      currentLocation.value &&
      routeLocations[0] &&
      routeLocations[0].nodes[0]
    ) {
      const from = turf.point([
        currentLocation.value?.lat,
        currentLocation.value?.lon,
      ]);
      const to = turf.point([
        routeLocations[0].nodes[0].lat,
        routeLocations[0].nodes[0].lon,
      ]);

      const distance = turf.distance(from, to, {units: 'meters'});

      if (
        Number(distance.toFixed(2)) <= 20 &&
        mapView.current?.currentMap?.id === routeLocations[0].nodes[0].map.id
      ) {
        if (mapState === MAP_STATES.READY || mapState === MAP_STATES.NAVIGATE) {
          handleRouteArrived();
          setIsDisplaySelectedRoute(false);
        } else {
          setIsRouteArrived(true);
        }
      }
    }
  };

  const [isDrawFinishedRoute, setIsDrawFinishedRoute] =
    useState<boolean>(false);
  const handleArrivedAtRoute = async () => {
    if (!isRouteArrived || isDrawFinishedRoute) return;

    if (currentLocation && currentLocation.value) {
      await setMap(currentLocation.value.map.id);
    }

    await mapView.current?.Journey.clear();

    resetMarker(MarkerType.Pin);
    resetMarker(MarkerType.Destination);
    resetMarker(MarkerType.Amenity);

    pageState.set(PageState.normal);

    mapView.current?.Journey.draw(routeDirections, {
      departureMarkerTemplateString: '',
      destinationMarkerTemplateString: '',
      pathOptions: {
        color: '#1E8DF2',
      },
      inactivePathOptions: {
        color: '#1E8DF2',
      },
    });

    setIsDrawFinishedRoute(true);
  };

  useEffect(() => {
    handleArrivedAtRoute();
  }, [isRouteArrived]);

  useEffect(() => {
    const handleCurrentPositionChange = () => {
      checkArrival();
    };

    handleCurrentPositionChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation.value]);

  return (
    <WayFindingContext.Provider
      value={{
        ...wayFindingStateAction,
        selectedCategory,
        setSelectedCategory,
        onResetMapPosition,
        onClearMapPosition,
        handleManualClick,
      }}>
      <View style={styles.container}>
        <Animated.Image
          source={require('../../../assets/images/compass.png')}
          style={[
            styles.compassImage,
            {
              transform: [
                {
                  rotate: `${-magnetometerData.value % 360}deg`, // Normalize rotation between 0 and 360
                },
              ],
            },
          ]}
        />
      </View>

      <MapScreen isLoading={isLoading}>
        {!isLoading && <MapHeader title={routeItem.title} />}

        {!hasGeolocationPermission.value &&
          !isLoading &&
          (isYourPositionClicked.value ||
            (currentLocation.value &&
              pageState.value === PageState.full_navigate)) && (
            <NoLocationPermission />
          )}

        <View className="w-full h-full">
          {/* Your MiMapView component */}
          <MiMapView
            style={styles.fullSafeAreaView}
            key="mappedin"
            ref={mapView}
            options={venueExtendedOptions}
            onFirstMapLoaded={async () => {
              try {
                if (isEnableBlueDot) {
                  await mapView.current?.BlueDot.enable({showBearing: true});
                  getCurrentLocation();
                }
                bottomSheetRef.current?.collapse();
              } catch (e) {
                console.error(e);
              }
              const currentLanguage =
                appLanguageState.currentLanguage.value ?? 'en';
              if (
                currentLanguage !==
                mapView.current?.venueData?.currentLanguage.code
              ) {
                await mapView.current?.venueData
                  ?.changeLanguage(currentLanguage)
                  .catch(async () => {
                    await mapView.current?.venueData?.changeLanguage('en');
                  });
              }
              setDefaultCameraPosition({
                tilt: mapView.current!.Camera.tilt,
                zoom: 5000,
                rotation: mapView.current!.Camera.rotation,
                position: mapView.current!.Camera.position,
              });
              setZones();
              setIsLoading(false);
              setIsMapInit(true);
            }}
            onMapChanged={async ({map}) => {
              setMap(map.id, false);
            }}
            onBlueDotPositionUpdated={async ({update}) => {
              nearestNode.current = update.nearestNode;
              if (nearestNode.current !== currentLocation.value) {
                currentLocation.set(nearestNode.current);
              }
            }}
            onClick={e => {
              const {floatingLabels, paths, tooltips} = e;
              if (tooltips && tooltips.length > 0) {
                handleManualClick(true);
              }
              if (
                floatingLabels &&
                floatingLabels.length > 0 &&
                pageState.value !== PageState.navigate &&
                pageState.value !== PageState.full_navigate
              ) {
                const location = first(
                  floatingLabels[0].node?.locations.filter(x =>
                    IncludedCategories.includes(x.type),
                  ),
                );
                if (location) {
                  const locationNode = new LocationNode(location);
                  if (
                    locationNode.node.map.id !== currentLocation.value?.map.id
                  ) {
                    confirmModalRef.current?.onOpen({
                      content: (
                        <View className="w-full h-full p-2 ">
                          <Text className="flex flex-row justify-center mx-auto my-auto text-lg font-bold">
                            {t(
                              'Wayfinding_Pin_Location_Different_Floor',
                              'Do you want to start navigation from here instead?',
                            )}
                          </Text>
                        </View>
                      ),
                      confirmButtonText: t(
                        'Wayfinding_Pin_Location_Different_Floor_Ok',
                        'Start here',
                      ),
                      cancelButtonText: t(
                        'Wayfinding_Pin_Location_Different_Floor_Cancel',
                        'Cancel',
                      ),
                      onConfirm: () => {
                        pinnedLocation.set(locationNode);
                        confirmModalRef.current?.onClose();
                      },
                    });
                  } else {
                    pinnedLocation.set(locationNode);
                  }
                }
              }
              if (paths && paths.length > 0) {
                mapView.current?.Journey.setStepByPath(paths[0]);
              }
            }}
          />
        </View>

        {/* {!isLoading &&
          !isPositioning.value &&
          pageState.value === PageState.normal && (
            <>
              <DestinationPreviewHeader />
              <ZoneBar />
            </>
          )} */}

        {!isLoading && pageState.value === PageState.full_navigate && (
          <>
            {/* <FloorSelection /> */}
            <FloatingSheet />
          </>
        )}

        {/* {!isLoading && <MapBottom />} */}

        {!hasGeolocationPermission.value &&
          !keepNotAllowLocation.value &&
          pageState.value === PageState.navigate && <NoPermissionModal />}

        {!isLoading && <ConfirmModal ref={confirmModalRef} />}
        {!isLoading && pageState.value === PageState.navigate && (
          <SingleButtonModal ref={singleButtonModalRef} />
        )}

        {pageState.value === PageState.full_navigate && (
          <>
            <TouchableOpacity
              onPress={async () => {
                await onResetMapPosition();
                // await handleMockPosition();
              }}
              className="absolute right-5 "
              style={{bottom: insets.bottom + 320}}>
              <View className="w-[45px] h-[45px] bg-[#475582] flex-row items-center justify-center rounded-full shadow-md p-2">
                <Icon
                  type="wfArrowRecenter"
                  width={24}
                  height={24}
                  className="text-white font-semibold text-xs"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={triggerCompassAction}
              className="absolute right-5 "
              style={{bottom: insets.bottom + 260}}>
              <View
                className={`w-[45px] h-[45px] ${
                  !isClickedCompass ? 'bg-[#ffffff]' : 'bg-[#475582]'
                } flex-row items-center justify-center rounded-full shadow-md p-2`}>
                <Icon
                  type={!isClickedCompass ? 'wfLockMapGray' : 'wfLockMap'}
                  width={24}
                  height={24}
                  className="text-white font-semibold text-xs"
                />
              </View>
            </TouchableOpacity>
          </>
        )}
        {isShowReRouteModal && (
          <ReRouteModal
            isShowModal={isShowReRouteModal}
            onClose={() => setReRouteModalVisible(false)}
            onReRoute={onReRoute}
          />
        )}
      </MapScreen>
    </WayFindingContext.Provider>
  );
};

export default WalkingMeetingMap;
