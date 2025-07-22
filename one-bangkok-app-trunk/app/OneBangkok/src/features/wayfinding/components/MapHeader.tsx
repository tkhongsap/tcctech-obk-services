import React, {useContext} from 'react';
import CompassHeading from 'react-native-compass-heading';
import {CAMERA_EASING_MODE} from '@mappedin/react-native-sdk';
import {Header} from '~/components/molecules';
import t from '~/utils/text';
import {HeaderSearch} from '~/components/molecules/HeaderSearch';
import {useNavigation} from '~/navigations/AppNavigation';
import LocationSearchHeader from './LocationSearchHeader';
import {MarkerType, PageState, WayFindingContext} from '../store/wayfinding';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';
import DestinationPreviewHeader from './DestinationPreviewHeader';

interface IMapHeader {
  title?: string;
}

const MapHeader = ({title}: IMapHeader) => {
  const navigation = useNavigation();
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    selectedCategory,
    setSelectedCategory,
    onClearMapPosition,
    state: {
      currentLocation,
      direction,
      pageState,
      selectedShop,
      shopList,
      hasGeolocationPermission,
      isYourPositionClicked,
      bottomSheetState,
      isArrived,
      pinnedLocation,
      selectedAmenity,
    },
    action: {
      setMap,
      setZones,
      createPinMarker,
      createMarker,
      resetMarker,
      checkInsideBoundary,
    },
  } = wayFindingContext;
  const inset = useSafeAreaInsets();

  const handleOnBackCategoryClick = () => {
    if (selectedCategory) {
      shopList.set([]);
      setSelectedCategory(undefined);
    } else {
      CompassHeading.stop();
      navigation.goBack();
    }
  };

  const header = () => {
    if (
      hasGeolocationPermission.value === false &&
      (isYourPositionClicked.value || currentLocation.value)
    ) {
      return (
        <Header
          title={t('General__Indoor_navigation', 'One Bangkok Map')}
          isOverlay={true}
          leftAction="goBack"
          onPressLeftAction={() => {
            currentLocation.set(undefined);
            isYourPositionClicked.set(false);
            direction.departure.set(undefined);
            if (selectedShop.value) {
              direction.destinations.set([selectedShop.value]);
            }
            bottomSheetRef.current?.close();
          }}
        />
      );
    }
    if (pageState.value === PageState.navigate) {
      if (
        bottomSheetState.index.value === 1 &&
        bottomSheetState.max.value === '100%'
      ) {
        return (
          <View className="bg-white w-full" style={{paddingTop: inset.top}} />
        );
      }
      return (
        <>
          <Header
            title={title ?? 'Wayfinding'}
            isOverlay={true}
            leftAction="goBack"
            onPressLeftAction={async () => {
              if (selectedAmenity.value) {
                pageState.set(PageState.normal);
              }
              if (selectedShop?.value?.node) {
                pageState.set(PageState.shop_detail);
                direction.destinations.set([]);
                await setMap(selectedShop.value.node.map.id);
                resetMarker(MarkerType.Destination);
                await createMarker(selectedShop.value);
                const coordinate =
                  mapView.current?.currentMap?.createCoordinate(
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
                }
              }
              bottomSheetRef.current?.collapse();
              await mapView.current?.Journey.clear();
            }}
          />
        </>
      );
    }
    if (pageState.value === PageState.search) {
      return <LocationSearchHeader />;
    }
    if (pageState.value === PageState.full_navigate && isArrived.value) {
      return <></>;
    }
    if (pageState.value === PageState.full_navigate) {
      return (
        <></>
        // <Header
        //   title="Direction"
        //   isOverlay={true}
        //   leftAction="goBack"
        //   onPressLeftAction={async () => {
        //     await setMap(currentMap.value?.id);
        //     pageState.set(PageState.navigate);
        //     if (selectedShop.value) {
        //       const coordinate = mapView.current?.currentMap?.createCoordinate(
        //         selectedShop.value.node.lat, // latitude
        //         selectedShop.value.node.lon, // longitude
        //       );
        //       if (coordinate) {
        //         await mapView.current?.Camera.animate(
        //           {
        //             position: coordinate,
        //             zoom: 5000,
        //           },
        //           {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
        //         );
        //       }
        //     }
        //   }}
        // />
      );
    }
    if (pageState.value === PageState.normal && isArrived.value) {
      const handleResetMap = async () => {
        isArrived.set(false);
        selectedShop.set(undefined);
        setZones();
        await setMap(
          mapView.current?.venueData?.mapGroups.find(x => x.name === 'Overview')
            ?.maps[0].id,
        );
        onClearMapPosition();
      };
      return (
        <HeaderSearch
          onPressLeftAction={handleResetMap}
          isOverlay={true}
          leftAction="goBack"
          onClearText={handleResetMap}
          onPressIn={() => {
            pageState.set(PageState.search);
          }}
          disabled={false}
        />
      );
    }
    if (pageState.value === PageState.normal) {
      if (
        bottomSheetState.index.value === 1 &&
        bottomSheetState.max.value === '100%'
      ) {
        return (
          <View className="bg-white w-full" style={{paddingTop: inset.top}} />
        );
      }
      return (
        <>
          <Header
            title={title ?? 'Wayfinding'}
            isOverlay={true}
            leftAction="goBack"
            onPressLeftAction={() => {
              handleOnBackCategoryClick();
            }}
          />
        </>
      );
    }
    if (pageState.value === PageState.shop_detail) {
      return (
        <>
          <Header
            title={title ?? 'Wayfinding'}
            isOverlay={true}
            leftAction="goBack"
            onPressLeftAction={async () => {
              pageState.set(PageState.normal);
              const isInsideBoundary = await checkInsideBoundary();
              if (hasGeolocationPermission.value && isInsideBoundary) {
                selectedShop.set(undefined);
                if (pinnedLocation.value) {
                  bottomSheetRef.current?.collapse();
                  if (pinnedLocation.value.node) {
                    const coordinate =
                      mapView.current?.currentMap?.createCoordinate(
                        pinnedLocation.value.node.lat, // latitude
                        pinnedLocation.value.node.lon, // longitude
                      );
                    if (coordinate) {
                      await setMap(pinnedLocation.value?.node.map.id);
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
              } else {
                selectedShop.set(undefined);
                await setMap(
                  mapView.current?.venueData?.mapGroups.find(
                    x => x.name === 'Overview',
                  )?.maps[0].id,
                );
                await mapView.current?.Camera.animate(
                  {
                    zoom: 15000,
                    // rotation: 150,
                    // tilt: 1,
                  },
                  {
                    duration: 500,
                    easing: CAMERA_EASING_MODE.EASE_IN_OUT,
                  },
                );
              }
            }}
          />
          <DestinationPreviewHeader />
        </>
      );
    }
  };
  return header();
};

export default MapHeader;
