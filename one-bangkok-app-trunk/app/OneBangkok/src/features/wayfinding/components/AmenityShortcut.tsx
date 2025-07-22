import React, {useContext, useEffect} from 'react';
import {View, Pressable, Text, Image} from 'react-native';
import {styles} from '../styles/WayFindingStyle';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import IconArrowRight from '../../../assets/icons/icon-ob-arrow-right.svg';
import Modal from 'react-native-modal';
import {Icon} from '~/components/atoms';
import {
  CAMERA_EASING_MODE,
  MappedinLocation,
  MappedinNode,
} from '@mappedin/react-native-sdk';
import SvgUri from 'react-native-svg-uri';
import {ScrollView} from 'react-native-gesture-handler';
import {first, get} from 'lodash';
import {AmenityModalData} from '../@types/amenity-modal-data';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';
import {GF, Zone} from '../constants/Constants';
import {ImmutableObject} from '@hookstate/core';

type Props = {
  setModalAmenityValue: React.Dispatch<
    React.SetStateAction<AmenityModalData | undefined>
  >;
  setModalAmenity: React.Dispatch<
    React.SetStateAction<AmenityModalData | undefined>
  >;
  modalAmenity?: AmenityModalData;
};

const AmenityShortcut: React.FC<Props> = ({
  setModalAmenityValue,
  setModalAmenity,
  modalAmenity,
}) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    markers,
    state: {currentLocation, selectedAmenity},
    action: {createMarkerAmenity, setMap, hideMarker, getZoneLocation},
  } = wayFindingContext;

  const [amenitiesShortcut, setAmenitiesShortcut] = React.useState<
    {
      name: string;
      children: MappedinLocation[];
    }[]
  >([]);

  useEffect(() => {
    const lang = appLanguageState.value;
    const {wayfinding_amenities_shortcut} = _firebaseState;
    const _amenitiesShortcut = wayfinding_amenities_shortcut.value.map(x => ({
      name: (get(x.name, lang.currentLanguage) as string) ?? x.name.en,
      children:
        mapView.current?.venueData?.locations.filter(l =>
          l.tags?.includes(x.tag),
        ) ?? [],
    }));
    setAmenitiesShortcut(_amenitiesShortcut);
  }, [mapView]);

  const onPressAmenity = async (item: typeof modalAmenity) => {
    bottomSheetRef.current?.collapse();
    if (item && item.children.length > 1) {
      setModalAmenity(item);
      setModalAmenityValue(item);
    } else if (item) {
      const location = first(item.children);
      if (location) {
        onSelectAmenity(location);
        setModalAmenity(undefined);
        setModalAmenityValue(undefined);
      }
    }
  };

  const onSelectAmenity = async (location: MappedinLocation) => {
    if (!location) {
      return;
    }

    hideMarker();

    let nearest:
      | {
          index: number;
          node: MappedinNode;
          distance: number;
        }
      | undefined;

    for (let i = 0; i < location.nodes.length; i++) {
      const node = location.nodes[i];
      if (currentLocation.value) {
        const direction = await mapView.current?.getDirections({
          from: currentLocation.value as MappedinNode,
          to: node,
        });
        let distance = 0;
        if (Array.isArray(direction)) {
          distance = direction[0].distance;
        } else {
          distance = direction?.distance ?? 0;
        }
        if (distance > 0) {
          if (nearest === undefined || (nearest.distance ?? 0) > distance) {
            nearest = {
              index: i,
              node: node,
              distance: distance,
            };
          }
        }
      }

      createMarkerAmenity(
        location.name,
        location.logo?.xsmall ?? '',
        new LocationNode(location, i),
      );
    }

    let nodeToFocus: MappedinNode[] = [];
    if (nearest) {
      nodeToFocus = location.nodes.filter(
        x => x.map.id === nearest.node.map.id,
      );
      await setMap(nearest.node.map.id);
    } else {
      nodeToFocus = location.nodes.filter(
        x =>
          x.map.id === GF.id &&
          getZoneLocation(
            new LocationNode(
              location,
              undefined,
              x,
            ) as ImmutableObject<LocationNode>,
          )?.id === Zone.Parade.id,
      );
      if (nodeToFocus.length === 0) {
        nodeToFocus = location.nodes.filter(x => x.map.id === GF.id);
      }
      if (nodeToFocus.length === 0) {
        nodeToFocus = location.nodes.sort(
          (a, b) => b.map.elevation - a.map.elevation,
        );
      }
      await setMap(first(nodeToFocus)?.map.id);
    }

    await mapView.current?.Camera.focusOn(
      {nodes: nodeToFocus},
      {
        duration: 500,
        easing: CAMERA_EASING_MODE.EASE_OUT,
        safeAreaInsets: {left: 50, right: 50, top: 50, bottom: 50},
      },
    );
    let nodeIndex = location.nodes.findIndex(x => x.id === nearest?.node.id);
    if (nodeIndex === -1) {
      nodeIndex = location.nodes.findIndex(
        x => x.id === first(nodeToFocus)?.id,
      );
    }
    const amenityLocation = new LocationNode(
      location,
      nodeIndex === -1 ? 0 : nodeIndex,
    );
    const marker = markers.current.find(
      x => x.location?.node.id === amenityLocation.node.id,
    );
    if (marker?.id) {
      await mapView.current?.Markers.remove(marker.id);
      markers.current = markers.current.filter(x => x.id !== marker.id);
      createMarkerAmenity(
        location.name,
        location.logo?.xsmall ?? '',
        amenityLocation,
        true,
      );
      selectedAmenity.set(amenityLocation);
    }
  };

  return (
    <ScrollView horizontal={true}>
      <View>
        <Modal className="z-50 flex-1" isVisible={modalAmenity !== undefined}>
          <View className="flex flex-row">
            <View className="my-auto mx-auto h-72 w-11/12 bg-white rounded-md">
              <View className="flex flex-row justify-between p-2">
                <Text className="text-lg font-bold">{modalAmenity?.name}</Text>
                <Pressable onPress={() => setModalAmenity(undefined)}>
                  <Icon type="close" width={16} />
                </Pressable>
              </View>
              <ScrollView>
                <View className="flex flex-row flex-wrap px-4">
                  {modalAmenity?.children.map((item, i) => (
                    <Pressable
                      onPress={() => {
                        setModalAmenity(undefined);
                        onSelectAmenity(item);
                      }}
                      className="flex items-center w-1/3 px-2 py-3"
                      key={i}>
                      <View className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-1">
                        {item.logo?.xsmall?.endsWith('.svg') ? (
                          <SvgUri
                            width={25}
                            source={{
                              uri: item.logo?.xsmall,
                            }}
                          />
                        ) : item.logo?.xsmall ? (
                          <Image
                            source={{uri: item.logo?.xsmall}}
                            style={styles.image}
                          />
                        ) : (
                          <Icon
                            type="obNewIcon"
                            width={20}
                            height={20}
                            className="border border-[#FDFDFD] rounded-full bg-[#111] w-[35px] h-[35px]"
                          />
                        )}
                      </View>
                      <Text className="text-center text-sm">{item.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
      <View className="px-4 my-3 flex flex-row h-8">
        {amenitiesShortcut.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onPressAmenity(item)}
            className={
              'flex flex-row justify-around py-1 px-2 rounded-3xl max-w-[125] min-w-[100px] mr-2'
            }
            style={styles.badge}>
            {item.children?.length > 1 ? (
              <View className="flex flex-row flex-wrap justify-around w-full">
                <Text
                  className={'my-auto font-bold mt-[2px]'}
                  style={{
                    ...styles.colorDarkPeriwinkle,
                    ...styles.fontObRegular,
                  }}>
                  {item.name}
                </Text>
                <View className="mt-[2px] mr-0 absolute right-0">
                  <IconArrowRight
                    color={styles.colorDarkPeriwinkle.color}
                    width="16"
                    height="16"
                  />
                </View>
              </View>
            ) : (
              <Text
                className={'my-auto font-bold '}
                style={{
                  ...styles.colorDarkPeriwinkle,
                  ...styles.fontObRegular,
                }}>
                {item.name}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default AmenityShortcut;
