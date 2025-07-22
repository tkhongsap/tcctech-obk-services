import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {CAMERA_EASING_MODE, MappedinNode} from '@mappedin/react-native-sdk';

import {Button} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import ShopLocationDetail from '../components/ShopLocationDetail';
import {
  LocationNode,
  MarkerType,
  PageState,
  WayFindingContext,
} from '../store/wayfinding';
import {logEvent} from '~/utils/logGA';
import WayfindingSearchBottom from './WayfindingSearchBottom';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PreviewPathBottom from './PreviewPathBottom';
import t from '../../../utils/text';
import NavigateBottomSheet from './NavigateBottomsheet';
import {AmenityModalData} from '../@types/amenity-modal-data';

interface MapBottomProps {
  isClickedCompass: boolean;
}

const MapBottom: React.FC<MapBottomProps> = ({isClickedCompass}) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    singleButtonModalRef,
    handleManualClick,
    customizeBluedotIdRef,
    state: {
      currentLocation,
      direction,
      pageState,
      selectedShop,
      pinnedLocation,
      hasGeolocationPermission,
      isYourPositionClicked,
      bottomSheetState,
      isArrived,
      selectedAmenity,
      isPositioning,
      bearingValue,
      rotation,
    },
    action: {
      checkInsideBoundary,
      createMarkerBluedot,
      createPinMarker,
      findNearestLocation,
      resetMarker,
      createRotatingMarker,
      setMap,
    },
  } = wayFindingContext;
  const inset = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [editState, setEditState] = useState<'Departure' | 'Destination'>();
  const [shops, setShops] = React.useState<LocationNode[]>();
  const [modalAmenityValue, setModalAmenityValue] =
    useState<AmenityModalData>();
  const [modalAmenity, setModalAmenity] = useState<AmenityModalData>();

  useEffect(() => {
    switch (pageState.value) {
      case PageState.normal:
        setShops(undefined);
        if (selectedAmenity.value) {
          bottomSheetState.set({
            ...bottomSheetState.value,
            min: '25%',
            max: '85%',
            backdropOpacity: 0.2,
          });
          break;
        } else {
          bottomSheetState.set({
            ...bottomSheetState.value,
            min: '20%',
            max: '100%',
            backdropOpacity: 0.2,
          });
          break;
        }
      case PageState.search:
        bottomSheetRef.current?.close();
        break;
      case PageState.shop_detail:
        bottomSheetState.set({
          ...bottomSheetState.value,
          min: '28%',
          max: '85%',
          backdropOpacity: 0.2,
        });
        break;
      case PageState.navigate:
        bottomSheetState.set({
          ...bottomSheetState.value,
          min: '32%',
          max: '32%',
          backdropOpacity: 0,
        });
        break;
      case PageState.full_navigate:
        if (isArrived.value) {
          bottomSheetState.set({
            ...bottomSheetState.value,
            min: '25%',
            max: '25%',
            backdropOpacity: 0,
          });
          break;
        } else {
          bottomSheetState.set({
            ...bottomSheetState.value,
            min: '18%',
            max: '18%',
            backdropOpacity: 0,
          });
          break;
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState, isArrived, selectedAmenity]);

  const backdrop = (backdropProps: BottomSheetBackdropProps) => {
    if (pageState.value === PageState.navigate) {
      return undefined;
    }
    if (
      pageState.value === PageState.full_navigate &&
      (isClickedCompass || !currentLocation.value)
    ) {
      return undefined;
    }
    return (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior={'none'}
        opacity={bottomSheetState.backdropOpacity.value}
        enableTouchThrough={true}
      />
    );
  };

  const onAnimate = useCallback((_: number, toIndex: number) => {
    bottomSheetState.set({...bottomSheetState.value, index: toIndex});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleStartButton = async () => {
    logEvent('button_click', {
      screen_name: 'Wayfinding',
      feature_name: 'Start',
      action_type: 'click',
      bu: 'LBS',
    });
    try {
      setIsLoading(true);
      isYourPositionClicked.set(false);
      handleManualClick(false);
      pageState.set(PageState.full_navigate);
      if (direction.departure.value?.location) {
        // bottomSheetRef.current?.close();
        await setMap(direction.departure.value.node.map.id);
        // Comment below code cuz new req want to show label when click start button
        // mapView.current?.FloatingLabels.removeAll();
        await mapView.current?.Camera.focusOn(
          {nodes: [direction.departure.value.node as MappedinNode]},
          {
            changeZoom: false,
            easing: CAMERA_EASING_MODE.EASE_OUT,
            duration: 100,
          },
        )
          .then(() =>
            mapView.current?.Camera.animate(
              {zoom: 1000},
              {
                duration: 1000,
                easing: CAMERA_EASING_MODE.EASE_IN_OUT,
              },
            ),
          )
          .then(async () => {
            bottomSheetRef.current?.collapse();
            bearingValue.set(0);
            rotation.set(0);
            if (customizeBluedotIdRef.current) {
              mapView.current?.Markers.remove(customizeBluedotIdRef.current);
            }
            await createMarkerBluedot(currentLocation.value as MappedinNode);
            await createRotatingMarker();
            await mapView.current?.BlueDot.disable();
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getHandleBottomSheet = () => {
    if (
      pageState.value === PageState.full_navigate ||
      pageState.value === PageState.navigate
    ) {
      return null;
    }
    return undefined;
  };

  const getBottomSheetContent = () => {
    if (isLoading) {
      return (
        <BottomSheetScrollView stickyHeaderIndices={[0]}>
          <View className="w-full bg-white">
            <Spacing height={40} />
            <ActivityIndicator size="large" />
            <Spacing height={40} />
          </View>
        </BottomSheetScrollView>
      );
    }
    if (pageState.value === PageState.full_navigate && isArrived.value) {
      return (
        <BottomSheetView collapsable={false}>
          <View className="flex justify-center w-full px-6 pt-6">
            <View className="items-center mb-3">
              <Text className="text-xl font-bold">You've arrived</Text>
              <Text className="text-3xl font-bold">
                {direction.destinations[0].value?.location.name}
              </Text>
            </View>
            <View className="py-1" />
            <Button
              title="Done"
              color="navy"
              onPress={async () => {
                direction.set({
                  destinations: [],
                  departure: undefined,
                  isAccessible: direction.isAccessible.value,
                });
                const nearestLocation = findNearestLocation(
                  currentLocation.value,
                );
                if (nearestLocation) {
                  pinnedLocation.set(new LocationNode(nearestLocation));
                } else {
                  pinnedLocation.set(undefined);
                }
                selectedShop.set(undefined);
                pageState.set(PageState.normal);
                isArrived.set(false);
                selectedAmenity.set(undefined);
                resetMarker(MarkerType.ArrowPin);
                await mapView.current?.BlueDot.enable();
              }}
            />
          </View>
        </BottomSheetView>
      );
    }
    if (pageState.value === PageState.full_navigate) {
      return <NavigateBottomSheet />;
    }
    if (pageState.value === PageState.shop_detail && selectedShop.value) {
      return (
        <BottomSheetScrollView>
          <ShopLocationDetail
            shop={selectedShop.value!}
            onDirectionClick={async () => {
              try {
                if (hasGeolocationPermission.value) {
                  pageState.set(PageState.navigate);
                } else {
                  currentLocation.set(undefined);
                }
                direction.departure.set(pinnedLocation.value);
                direction.destinations.set([selectedShop.value]);
                resetMarker(MarkerType.Pin);
                await createPinMarker(pinnedLocation.value);
                pageState.set(PageState.navigate);
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </BottomSheetScrollView>
      );
    }
    if (pageState.value === PageState.navigate) {
      return (
        <PreviewPathBottom
          onStart={async () => {
            setIsLoading(true);
            try {
              if (!isLoading && direction.departure.value === undefined) {
                singleButtonModalRef.current?.onOpen({
                  content: (
                    <View className="w-full h-full p-2 ">
                      <Text className="flex flex-row justify-center mx-auto my-auto text-lg font-bold">
                        {t(
                          'Select_starting_point',
                          'Please select your starting point',
                        )}
                      </Text>
                    </View>
                  ),
                  confirmButtonText: t('Wayfinding_Confirm', 'Confirm'),
                  contentContainerStyle: {
                    height: 170,
                  },
                  onConfirm: () => {
                    singleButtonModalRef.current?.onClose();
                    setEditState('Departure');
                    bottomSheetState.set({
                      ...bottomSheetState.value,
                      max: '100%',
                      min: '90%',
                    });
                  },
                });
                return;
              }
              if (hasGeolocationPermission.value) {
                const isInsideBoundary = await checkInsideBoundary();
                if (!isInsideBoundary && !isPositioning.value) {
                  singleButtonModalRef.current?.onOpen({
                    content: (
                      <View className="w-full h-full p-4">
                        <Text className="justify-center mx-auto my-auto">
                          {t(
                            'Wayfinding_Outside_Area',
                            "Navigation can't be started because you're currently outside One Bangkok. Please enter the area to use this feature.",
                          )}
                        </Text>
                      </View>
                    ),
                    confirmButtonText: t(
                      'Wayfinding_Outside_Area_Ok',
                      'Confirm',
                    ),
                    contentContainerStyle: {
                      height: 210,
                    },
                    onConfirm: async () => {
                      singleButtonModalRef.current?.onClose();
                      await handleStartButton();
                    },
                  });
                  return;
                }
                handleStartButton();
              } else {
                handleStartButton();
              }
              setEditState(undefined);
            } finally {
              setIsLoading(false);
            }
          }}
          setEditState={setEditState}
          editState={editState}
        />
      );
    }
    if (pageState.value === PageState.normal) {
      if (selectedAmenity.value) {
        bottomSheetRef.current?.collapse();
        return (
          <BottomSheetScrollView>
            <ShopLocationDetail
              shop={selectedAmenity.value!}
              directionButtonText="Get Direction to nearest"
              setShops={setShops}
              shops={shops}
              modalAmenityValue={modalAmenityValue}
              setModalAmenity={setModalAmenity}
              onDirectionClick={async () => {
                try {
                  if (hasGeolocationPermission.value) {
                    pageState.set(PageState.navigate);
                  } else {
                    currentLocation.set(undefined);
                  }
                  direction.departure.set(pinnedLocation.value);
                  direction.destinations.set([selectedAmenity.value]);
                  resetMarker(MarkerType.Pin);
                  await createPinMarker(pinnedLocation.value);
                  pageState.set(PageState.navigate);
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          </BottomSheetScrollView>
        );
      }
      return (
        <WayfindingSearchBottom
          setShops={setShops}
          shops={shops}
          setModalAmenityValue={setModalAmenityValue}
          modalAmenity={modalAmenity}
          setModalAmenity={setModalAmenity}
        />
      );
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={backdrop}
      onChange={index => {
        bottomSheetState.set({...bottomSheetState.value, index: index});
      }}
      onAnimate={onAnimate}
      topInset={inset.top}
      snapPoints={[bottomSheetState.min.value, bottomSheetState.max.value]}
      handleComponent={getHandleBottomSheet()}>
      {getBottomSheetContent()}
    </BottomSheet>
  );
};

export default MapBottom;
