import React, {useContext, useEffect} from 'react';
import {Keyboard, View} from 'react-native';
import {Text} from '~/components/atoms';
import Config from 'react-native-config';
import {ImmutableObject} from '@hookstate/core';
import {BottomSheetVirtualizedList} from '@gorhom/bottom-sheet';
import {
  LocationNode,
  WayFindingContext,
} from '~/features/wayfinding/store/wayfinding';
import ShopLocationListItem from '~/features/wayfinding/components/ShopLocationListItem';
import {MappedinCategory} from '@mappedin/react-native-sdk';
import {AmenityModalData} from '~/features/wayfinding/@types/amenity-modal-data';

type Props = {
  shops?: LocationNode[] | undefined;
  setShops: React.Dispatch<React.SetStateAction<LocationNode[] | undefined>>;
  modalAmenity?: AmenityModalData | undefined;
  setModalAmenity: React.Dispatch<
    React.SetStateAction<AmenityModalData | undefined>
  >;
  setModalAmenityValue: React.Dispatch<
    React.SetStateAction<AmenityModalData | undefined>
  >;
};

const MapSearchBottom: React.FC<Props> = ({shops, setShops}) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    state: {selectedShop, bottomSheetState},
    action: {setMap},
  } = wayFindingContext;

  // const [shops, setShops] = React.useState<LocationNode[]>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<MappedinCategory>();

  useEffect(() => {
    if (bottomSheetState.index.value === 0) {
      Keyboard.dismiss();
    }

    onSelectCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetState]);

  const getItem = (
    _data: unknown,
    index: number,
  ): ImmutableObject<LocationNode> => {
    return shops![index] as ImmutableObject<LocationNode>;
  };

  const getItemCount = (_data: unknown) => shops!.length;

  const onSelectShop = async (location?: ImmutableObject<LocationNode>) => {
    if (location) {
      selectedShop.set(location);
      await setMap(location.node.map.id);
    }
  };

  const onSelectCategory = () => {
    if (
      !mapView.current ||
      !mapView.current.venueData ||
      !mapView.current.venueData.categories
    ) {
      return;
    }

    const artCultureCategory = mapView.current.venueData.categories.find(
      x => x.id === `${Config.ART_C_CATEGORY_ID_LBS}`,
    );

    if (!artCultureCategory) {
      return;
    }

    setSelectedCategory(artCultureCategory);

    const locations = artCultureCategory.locations
      .map(x => new LocationNode(x))
      .sort((a, b) => a.location.name.localeCompare(b.location.name));
    const locationsToInsert: {locationNode: LocationNode; index: number}[] = [];
    locations.forEach((x, i) => {
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
      locations.splice(x.index, 0, x.locationNode);
    });
    setShops(locations);
  };

  return (
    <>
      {!!shops && shops.length > 0 ? (
        <>
          <View className="mt-2 ml-4">
            {selectedCategory ? (
              <Text className="font-bold">{selectedCategory.name}</Text>
            ) : (
              <Text className="font-bold">Search results</Text>
            )}
          </View>
          <BottomSheetVirtualizedList
            keyboardShouldPersistTaps={'handled'}
            maxToRenderPerBatch={5}
            windowSize={5}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
            onEndReachedThreshold={0.1}
            initialNumToRender={10}
            getItem={getItem}
            getItemCount={getItemCount}
            renderItem={({item}) => {
              return (
                <ShopLocationListItem item={item} callback={onSelectShop} />
              );
            }}
            keyExtractor={(_, i) => i.toString()}
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No item.</Text>
        </View>
      )}
    </>
  );
};

export default MapSearchBottom;
