import React, {useContext, useMemo} from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {ImmutableObject} from '@hookstate/core';
import {
  LocationNode,
  MarkerType,
  PageState,
  WayFindingContext,
} from '../store/wayfinding';
import {first} from 'lodash';
import IconClose from '../../../assets/icons/icon_close.svg';
import {Pressable} from 'react-native-gesture-handler';
import {CAMERA_EASING_MODE, MappedinLocation} from '@mappedin/react-native-sdk';
import {AmenityModalData} from '../@types/amenity-modal-data';
import {District, Floors} from '../constants/Constants';

const CHAMBRAY_COLOUR = '#475582';

type ModalData = {
  name: string;
  children: MappedinLocation[];
};

type Props = {
  shop: ImmutableObject<LocationNode>;
  directionButtonText?: string;
  onDirectionClick: () => void;
  shops?: LocationNode[];
  setShops?: React.Dispatch<React.SetStateAction<LocationNode[] | undefined>>;
  modalAmenityValue?: ModalData;
  setModalAmenity?: React.Dispatch<
    React.SetStateAction<AmenityModalData | undefined>
  >;
};

const ShopLocationDetail = (props: Props) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    bottomSheetRef,
    state: {
      pageState,
      bottomSheetState,
      selectedShop,
      hasGeolocationPermission,
      pinnedLocation,
      selectedAmenity,
    },
    action: {
      getZoneLocation,
      resetMarker,
      getZoneColor,
      createPinMarker,
      setMap,
      checkInsideBoundary,
    },
  } = wayFindingContext;

  const {shop, directionButtonText = 'Get Direction', onDirectionClick} = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Zone = useMemo(() => getZoneLocation(shop), [shop]);

  const getOpenHour = () => {
    const operationHours = shop.location.operationHours;
    if (operationHours && operationHours.length > 0) {
      return operationHours[0];
    }
    return undefined;
  };
  const onViewMoreDetial = () => {
    if (shop.location.detailsUrl) {
      const url = new URL(shop.location.detailsUrl);
      const replaceMeWith = url.searchParams.get('replaceWithThisLink');
      if (replaceMeWith) {
        Linking.openURL(replaceMeWith);
      } else {
        Linking.openURL(shop.location.detailsUrl);
      }
    }
  };

  const renderZoneIcon = (location: ImmutableObject<LocationNode>) => {
    const categories: string[] =
      location?.location?.categories
        ?.map(cat => cat.externalId)
        .filter((id): id is string => typeof id === 'string') || [];
    const isDistrict = location?.node?.map?.id === District.id;
    const zoneLocation = getZoneLocation(location);
    if (isDistrict && categories.includes('CAT-SFOVUFSB')) {
      return (
        <Icon
          type="wfBuilding"
          width={20}
          height={20}
          className="border border-[#FDFDFD] rounded-full w-[35px] h-[35px]"
        />
      );
    }

    if (isDistrict && categories.includes('CAT-1808RPRA')) {
      return (
        <Icon
          type="wfGrass"
          width={20}
          height={20}
          className="border border-[#FDFDFD] rounded-full w-[35px] h-[35px]"
        />
      );
    }

    return (
      <View
        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{
          backgroundColor: getZoneColor(zoneLocation?.externalId ?? '').base,
        }}>
        <Text>
          {Floors.find(x => x.id === location?.node?.map.id)?.label ?? ''}
        </Text>
      </View>
    );
  };

  return (
    <View className="px-5">
      <View className="flex-1 flex-row gap-4">
        <View className="flex-1 pb-2 align-middle py-2">
          <View
            className="flex-1 flex-row align-center"
            style={{justifyContent: 'space-between'}}>
            <Text className="text-2xl font-bold text-slate-950">
              {shop.location.name}
            </Text>
            <Pressable
              style={{justifyContent: 'center'}}
              className="align-center ml-3"
              onPress={async () => {
                props.setModalAmenity && props.setModalAmenity(undefined);
                selectedAmenity.set(undefined);
                mapView.current?.Journey.clear();
                resetMarker(MarkerType.Amenity);
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
                    mapView.current?.venueData?.maps.find(
                      x => x.id === District.id,
                    )?.id,
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
              }}>
              <IconClose width={18} height={18} color="#A5A0A0" />
            </Pressable>
          </View>
          <View className="flex-row items-center mt-2">
            {renderZoneIcon(shop)}
            <View className="h-16 w-16 align-center justify-center">
              {Zone?.logo?.original?.endsWith('.svg') ? (
                <></>
              ) : Zone?.logo?.xsmall ? (
                <Image
                  className="flex-1 w-16 h-16"
                  style={styles.zoneLogoWrapper}
                  source={{uri: Zone.logo.xsmall}}
                />
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
      {shop.node && shop.location.detailsUrl && (
        <View className="flex flex-row justify-center items-center">
          <TouchableOpacity
            className="flex-1 mr-1"
            style={[styles.primaryButton]}
            onPress={onViewMoreDetial}>
            <Text style={styles.primaryButtonText}>More Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-1"
            style={[styles.outlinedButton]}
            onPress={onDirectionClick}>
            <Text style={styles.outlinedButtonText}>Direction</Text>
          </TouchableOpacity>
        </View>
      )}
      {shop.node && !shop.location.detailsUrl && (
        <TouchableOpacity
          onPress={onDirectionClick}
          style={{
            width: '100%',
            backgroundColor: CHAMBRAY_COLOUR,
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
          }}>
          <Text
            className="text-white text-base"
            style={{fontFamily: 'OneBangkok-Bold'}}>
            {directionButtonText}
          </Text>
        </TouchableOpacity>
      )}
      {bottomSheetState.value.index === 1 && (
        <>
          {getOpenHour() && (
            <View className="border-t border-gray-300 mt-5 py-2">
              <Text className="text-gray-500 text-lg font-semibold">Hours</Text>
              <View className="flex flex-row text-lg">
                <Text style={styles.textGreen}>Open</Text>
                <Text className="text-gray-500 pb-2">
                  {' '}
                  | Close {getOpenHour()?.closes ?? ''}
                </Text>
              </View>
            </View>
          )}
          <View className="border-t border-gray-300 pb-2">
            <Text className="text-gray-500 text-lg font-semibold">
              Categories
            </Text>
            <View className="flex flex-row py-2 ">
              {shop.location.categories.map(x => (
                <View
                  key={x.externalId}
                  className="p-2 mr-4 "
                  style={{...styles.categoryItem}}>
                  <Text className="text-slate-950">{x.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="border-t border-gray-300 pb-2">
            <Text className="text-gray-500 py-3 text-lg">
              {shop.location.description}
            </Text>
            <View className="flex flex-row">
              {shop.location.phone?.number && (
                <View
                  className="flex flex-row p-2 mr-4"
                  style={{...styles.categoryItem}}>
                  <Icon type="phoneIcon" />
                  <Text className="my-auto">{shop.location.phone?.number}</Text>
                </View>
              )}
              {shop.location.social?.instagram && (
                <View
                  className="flex flex-row p-2 mr-4"
                  style={{...styles.categoryItem}}>
                  <Icon type="instagram" />
                </View>
              )}
              {shop.location.social?.facebook && (
                <View
                  className="flex flex-row p-2 mr-4"
                  style={{...styles.categoryItem}}>
                  <Icon type="facebook" />
                </View>
              )}
            </View>
          </View>
          <View className="flex flex-row justify-center w-full h-fit py-2">
            {first(shop?.location.gallery)?.image.original && (
              <Image
                className="object-cover"
                width={375}
                height={240}
                source={{uri: first(shop.location.gallery)!.image.original}}
              />
            )}
          </View>
          <View className="w-full py-4" />
        </>
      )}
    </View>
  );
};

export default ShopLocationDetail;
