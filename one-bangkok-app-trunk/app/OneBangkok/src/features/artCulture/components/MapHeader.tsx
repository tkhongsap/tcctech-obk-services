import React, {useContext} from 'react';
import {Header} from '~/components/molecules';
import t from '~/utils/text';
import {HeaderSearch} from '~/components/molecules/HeaderSearch';
import {useNavigation} from '~/navigations/AppNavigation';
import {CAMERA_EASING_MODE, MappedinCategory} from '@mappedin/react-native-sdk';
import {logEvent} from '~/utils/logGA';
import {
  PageState,
  WayFindingContext,
} from '~/features/wayfinding/store/wayfinding';
import CompassHeading from 'react-native-compass-heading';
import DirectionHeader from '~/features/wayfinding/components/DirectionHeader';
import LocationSearchHeader from '~/features/wayfinding/components/LocationSearchHeader';

type Props = {
  selectedCategory: MappedinCategory | undefined;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<MappedinCategory | undefined>
  >;
  onResetMapPosition: () => void;
  isArrived: boolean;
  setIsArrived: (isArrived: boolean) => void;
  onClearMapPosition: () => void;
};

const MapHeader = ({
  setSelectedCategory,
  onResetMapPosition,
  isArrived,
  setIsArrived,
  onClearMapPosition,
}: Props) => {
  const navigation = useNavigation();
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    state: {
      currentMap,
      currentLocation,
      direction,
      pageState,
      selectedShop,
      hasGeolocationPermission,
      isYourPositionClicked,
    },
    action: {setMap, setZones},
  } = wayFindingContext;

  const handleOnBackCategoryClick = () => {
    CompassHeading.stop();
    navigation.goBack();
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
      return (
        <>
          <Header
            title="Direction"
            isOverlay={true}
            leftAction="goBack"
            onPressLeftAction={() => {
              pageState.set(PageState.shop_detail);
              direction.set({
                destinations: [],
                departure: undefined,
                isAccessible: false,
              });
              currentLocation.set(undefined);
              selectedShop.set(selectedShop.value);
              isYourPositionClicked.set(false);
            }}
          />
          <DirectionHeader />
        </>
      );
    }
    if (pageState.value === PageState.search) {
      return <LocationSearchHeader />;
    }
    if (pageState.value === PageState.full_navigate) {
      return (
        <Header
          title="Direction"
          isOverlay={true}
          leftAction="goBack"
          onPressLeftAction={async () => {
            await setMap(currentMap.value?.id);
            pageState.set(PageState.navigate);
            if (selectedShop.value) {
              const coordinate = mapView.current?.currentMap?.createCoordinate(
                selectedShop.value.node.lat, // latitude
                selectedShop.value.node.lon, // longitude
              );
              if (coordinate) {
                await mapView.current?.Camera.animate(
                  {
                    position: coordinate,
                    zoom: 5000,
                  },
                  {duration: 500, easing: CAMERA_EASING_MODE.EASE_OUT},
                );
              }
            }
          }}
        />
      );
    }
    if (pageState.value === PageState.normal && isArrived) {
      const handleResetMap = async () => {
        setIsArrived(!isArrived);
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
      return (
        <Header
          title={t('General__Indoor_navigation', 'One Bangkok Map')}
          isOverlay={true}
          leftAction="goBack"
          onPressLeftAction={() => {
            handleOnBackCategoryClick();
          }}
          rightAction="search"
          onPressRightAction={() => {
            logEvent('button_click', {
              screen_name: 'ArtCultureArtMapScreen',
              feature_name: 'Search here',
              action_type: 'click',
              bu: 'LBS',
            });
            pageState.set(PageState.search);
          }}
        />
      );
    }
    if (pageState.value === PageState.shop_detail) {
      return selectedShop.value ? (
        <HeaderSearch
          isOverlay={true}
          leftAction={undefined}
          searchValue={selectedShop.value.location.name}
          onClearText={async () => {
            selectedShop.set(undefined);
            setSelectedCategory(undefined);
            setZones();
            await setMap(
              mapView.current?.venueData?.mapGroups.find(
                x => x.name === 'Overview',
              )?.maps[0].id,
            );
            onResetMapPosition();
          }}
          onPressIn={() => {
            pageState.set(PageState.search);
          }}
          disabled={true}
        />
      ) : (
        <></>
      );
    }
  };
  return header();
};

export default MapHeader;
