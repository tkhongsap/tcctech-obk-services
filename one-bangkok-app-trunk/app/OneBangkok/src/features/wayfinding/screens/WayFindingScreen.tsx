import React, {useEffect, useRef, useState} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import _, {first} from 'lodash';
import * as turf from '@turf/turf';
import {MiMapView, CAMERA_EASING_MODE} from '@mappedin/react-native-sdk';
import type {
  MappedinCategory,
  MappedinNode,
  TCameraTransform,
} from '@mappedin/react-native-sdk';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {MapScreen} from '~/components/templates';
import {Icon, Text} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {venueExtendedOptions} from '../constants/VenueOptions';
import {
  LocationNode,
  MarkerType,
  PageState,
  useWayFindingStateAction,
  WayFindingContext,
} from '../store/wayfinding';
import MapHeader from '../components/MapHeader';
import MapBottom from '../components/MapBottom';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import NoLocationPermission from '../components/NoLocationPermission';
import {logScreenView} from '~/utils/logGA';
import ReRouteModal from '../components/ReRouteModal';
import ZoneBar from '../components/ZoneBar';
import NoPermissionModal from '../components/NoPermissionModal';
import DestinationPreviewHeader from '../components/DestinationPreviewHeader';
import ConfirmModal from '../components/ConfirmModal';
import t from '../../../utils/text';
import FloatingSheet from '../components/FloatingSheet';
import FloorSelection from '../components/FloorSelection';
import {District, IncludedCategories} from '../constants/Constants';
import SingleButtonModal from '../components/SingleButtonModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WayFindingScreen'>;

const WayFindingScreen = ({route: {key}}: Props) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MappedinCategory>();
  const [isShowReRouteModal, setReRouteModalVisible] = useState(false);
  // const [isClickedCompass, setClickCompass] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;
  const targetRotation = useRef(0);
  const wayFindingStateAction = useWayFindingStateAction(key);
  const {
    mapView,
    nearestNode,
    isEnableBlueDot,
    bottomSheetRef,
    confirmModalRef,
    singleButtonModalRef,
    markers,
    isFirstLocatePosition,
    customizeBluedotIdRef,
    state: {
      pageState,
      selectedShop,
      direction,
      currentLocation,
      isNoPathConnect,
      shopList,
      magnetometerData,
      hasGeolocationPermission,
      isYourPositionClicked,
      isPositioning,
      activeDirections,
      bearingValue,
      isArrived,
      pinnedLocation,
      selectedAmenity,
      keepNotAllowLocation,
      isClickedCompass,
      rotation,
    },
    action: {
      setZones,
      checkInsideBoundary,
      setMap,
      findNearestLocation,
      navigate,
      createMarker,
      createPinMarker,
      createMarkerAmenity,
      resetMarker,
      hideMarker,
      showMarker,
      getCurrentLocation,
      createRotatingMarker,
      createMarkerBluedot,
    },
  } = wayFindingStateAction;

  const [defaultCameraPosition, setDefaultCameraPosition] =
    useState<TCameraTransform>();

  const isManualClick = useRef(false);
  const reRouteTimeoutId = useRef<NodeJS.Timeout>();

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  const defaultDegree = useRef<number>();

  useEffect(() => {
    targetRotation.current = magnetometerData.value % 360;
    const degreesToRadians = (degrees: number) => {
      return -degrees * (Math.PI / 180);
    };
    bearingValue.set(targetRotation.current);
    if (isClickedCompass.value) {
      if (!defaultDegree.current) {
        defaultDegree.current = targetRotation.current;
      }
      createRotatingMarker();
      // TODO Fix the rotation logic later.
      // let degree = targetRotation.current - defaultDegree.current;
      // if (degree < 0) {
      //   degree += 360;
      // }
      rotation.set(0);
    }
    if (!isClickedCompass.value) {
      defaultDegree.current = undefined;
      Animated.timing(rotate, {
        toValue: targetRotation.current,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    if (pageState.value === PageState.full_navigate && !isClickedCompass.value) {
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

  React.useEffect(() => {
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

  const calculateBearing = () => {
    if (currentLocation.value) {
      const _x = direction.destinations.value[0]?.node.x;
      const _y = direction.destinations.value[0]?.node.y;
      const _degree = (data: number) => {
        return data - 90 >= 0 ? data - 90 : data + 271;
      };

      const _angle = (x: number, y: number) => {
        let angle = 0;
        if (x && y) {
          if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
          } else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
          }
        }
        return Math.round(angle);
      };
      if (_x && _y) {
        const angle = _angle(_x, _y);
        const degree = _degree(angle);
        return degree;
      } else {
        return undefined;
      }
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

  const checkArrival = async () => {
    if (currentLocation.value && direction.destinations[0].value) {
      const from = turf.point([
        currentLocation.value.lat,
        currentLocation.value.lon,
      ]);

      const to = turf.point([
        direction.destinations[0].value?.node.lat,
        direction.destinations[0].value?.node.lon,
      ]);
      const distance = turf.distance(from, to, {units: 'meters'});
      if (
        Number(distance.toFixed(2)) <= 5 &&
        currentLocation.value.map.id ===
          direction.destinations[0].value.node.map.id
      ) {
        shopList.set([]);
        setSelectedCategory(undefined);
        isArrived.set(true);
        await mapView.current?.Journey.clear();
        return;
      }
    }
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
        console.log('Out of the path, showing re-route modal');
        reRouteTimeoutId.current = setTimeout(() => {
          setReRouteModalVisible(true);
        }, 5000);
      }
    }
  };

  const handleManualClick = (isManual: boolean) => {
    isManualClick.current = isManual;
  };

  const onReRoute = async () => {
    if (reRouteTimeoutId.current) {
      clearTimeout(reRouteTimeoutId.current);
      reRouteTimeoutId.current = undefined;
    }
    setReRouteModalVisible(false);
    const nearestLocation = findNearestLocation(
      currentLocation.value as MappedinNode,
    );
    if (nearestLocation) {
      const locationNode = new LocationNode(nearestLocation);
      pinnedLocation.set(locationNode);
      direction.departure.set(locationNode);
    }
  };

  const triggerCompassAction = _.debounce(async () => {
    isClickedCompass.set(!isClickedCompass.value);
    if (isClickedCompass.value) {
      rotation.set(0);
      // Reset the rotation to 0 when compass is clicked
      if (customizeBluedotIdRef.current) {
        mapView.current?.Markers.remove(customizeBluedotIdRef.current);
      }
      createMarkerBluedot(currentLocation.value as MappedinNode);
      createRotatingMarker();
    }
    // Logic rotate to north
    // const node = currentLocation.value
    //   ? [currentLocation.value as MappedinNode]
    //   : ([
    //       direction.departure.value?.node,
    //       direction.destinations.value[0]?.node,
    //     ] as MappedinNode[]);

    // if (!isClickedCompass) {
    //   // magnetometerData.set(0);
    //   await mapView.current?.Camera.focusOn(
    //     {
    //       nodes: node,
    //     },
    //     {
    //       rotation: 0,
    //       changeZoom: false,
    //       easing: CAMERA_EASING_MODE.EASE_OUT,
    //       duration: 100,
    //       tilt: magnetometerData.value,
    //     },
    //   ).then(() =>
    //     mapView.current?.Camera.animate(
    //       {zoom: 2400},
    //       {
    //         duration: 100,
    //         easing: CAMERA_EASING_MODE.EASE_IN_OUT,
    //       },
    //     ),
    //   );
    // }
  }, 200);

  useEffect(() => {
    logScreenView('WayFindingScreen');
  }, []);

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
        {!isLoading && <MapHeader />}
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
              setMap(District.id);
            }}
            onMapChanged={async ({map}) => {
              setMap(map.id, false);
            }}
            onBlueDotPositionUpdated={async ({update}) => {
              nearestNode.current = update.nearestNode;
              // mapView.current?.setState(STATE.FOLLOW);
              const isSameMap =
                mapView.current?.currentMap?.id === update.nearestNode?.map?.id;
              if (
                !isSameMap &&
                pageState.value === PageState.full_navigate &&
                update.nearestNode &&
                direction.departure.value === undefined &&
                !isManualClick
              ) {
                await setMap(update.nearestNode.map.id);
              }
              if (nearestNode.current !== currentLocation.value) {
                currentLocation.set(nearestNode.current);
              }
              isPositioning.set(false);
              if (isFirstLocatePosition.current) {
                const isInsideBoundary = await checkInsideBoundary();
                if (!isInsideBoundary) {
                  isFirstLocatePosition.current = false;
                  return;
                }
                setMap(update.nearestNode?.map.id);
                const nearestLocation = findNearestLocation(update.nearestNode);
                if (nearestLocation && mapView.current) {
                  isFirstLocatePosition.current = false;
                  resetMarker(MarkerType.Pin);
                  pinnedLocation.set(new LocationNode(nearestLocation));
                }
              }
            }}
            onClick={async e => {
              const {floatingLabels, paths, tooltips, markers: eMarkers} = e;
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
              if (eMarkers.length > 0) {
                const marker = eMarkers[0];
                const amenityMarker = markers.current.find(
                  x => x.id === marker.id && x.type === MarkerType.Amenity,
                );
                if (amenityMarker?.location && amenityMarker.id) {
                  bottomSheetRef.current?.close();
                  mapView.current?.Markers.remove(amenityMarker.id);
                  markers.current = markers.current.filter(
                    x => x.id !== amenityMarker.id,
                  );
                  await hideMarker(MarkerType.Amenity);
                  await showMarker(MarkerType.Amenity);
                  createMarkerAmenity(
                    amenityMarker.location.location.name,
                    amenityMarker.location.location.logo?.xsmall ?? '',
                    amenityMarker.location as LocationNode,
                    true,
                  );
                  selectedAmenity.set(amenityMarker.location);
                  setTimeout(() => {
                    bottomSheetRef.current?.collapse();
                  }, 1000);
                }
              }
            }}
          />
        </View>

        {!isLoading &&
          !isPositioning.value &&
          pageState.value === PageState.normal && (
            <>
              <DestinationPreviewHeader />
              <ZoneBar />
            </>
          )}

        {!isLoading && pageState.value === PageState.full_navigate && (
          <>
            <FloorSelection />
            <FloatingSheet />
          </>
        )}

        {!isLoading && <MapBottom isClickedCompass={isClickedCompass.value} />}

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
                  !isClickedCompass.value ? 'bg-[#ffffff]' : 'bg-[#475582]'
                } flex-row items-center justify-center rounded-full shadow-md p-2`}>
                <Icon
                  type={!isClickedCompass.value ? 'wfLockMapGray' : 'wfLockMap'}
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

export default WayFindingScreen;
