import React, {useContext, useEffect} from 'react';
import {Image, Keyboard, View} from 'react-native';
import {LocationNode, WayFindingContext} from '../store/wayfinding';
import {Text, TextInput} from '~/components/atoms';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SvgUri from 'react-native-svg-uri';
import Config from 'react-native-config';
import {ImmutableObject} from '@hookstate/core';
import {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import {isEmpty} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShopLocationListItem from './ShopLocationListItem';
import AmenityShortcut from './AmenityShortcut';
import {IncludedCategories} from '../constants/Constants';
import {MappedinCategory} from '@mappedin/react-native-sdk';
import {AmenityModalData} from '../@types/amenity-modal-data';

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

const WayfindingSearchBottom: React.FC<Props> = ({
  shops,
  setShops,
  setModalAmenity,
  modalAmenity,
  setModalAmenityValue,
}) => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }

  const {
    mapView,
    bottomSheetRef,
    ignoreCategories,
    state: {selectedShop, bottomSheetState},
    action: {search, setMap},
  } = wayFindingContext;

  // const [shops, setShops] = React.useState<LocationNode[]>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<MappedinCategory>();
  const [searchList, setSearchList] = React.useState<string[] | null>(null);
  const [isShowMore, setShowmore] = React.useState(false);

  useEffect(() => {
    if (bottomSheetState.index.value === 0) {
      Keyboard.dismiss();
      if (selectedCategory) {
        setSelectedCategory(undefined);
        setShops(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetState]);

  useEffect(() => {
    const fetchRecentlySearch = async () => {
      try {
        const status = await AsyncStorage.getItem('recentlySearch');
        setSearchList(status ? JSON.parse(status) : []);
      } catch (e) {
        console.error('Error fetching recently search:', e);
      }
    };

    fetchRecentlySearch();
  }, []);

  const getCategories = () => {
    const isContainIgnoreCategories = (externalId: string) => {
      return ignoreCategories.map(x => x.externalId).includes(externalId);
    };
    return mapView.current?.venueData?.categories
      .filter(x => x.parents === undefined || x.parents?.length === 0)
      .filter(x => !isContainIgnoreCategories(x.externalId ?? ''));
  };

  const onSearch = async (text: string) => {
    setSelectedCategory(undefined);
    if (text.trim().length === 0) {
      setShops(undefined);
      return;
    }
    const data = await search(text);
    setShops(
      data.filter(x => {
        return x.node && IncludedCategories.includes(x.location.type);
      }),
    );
  };

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
      saveRecentlySearch(location);
    }
  };

  const onSelectCategory = (category: MappedinCategory) => {
    setSelectedCategory(category);
    const locations = category.locations
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

  const saveRecentlySearch = async (
    shopSelect: ImmutableObject<LocationNode>,
  ) => {
    let arrayData: string[] = [];
    try {
      if (searchList && !isEmpty(searchList)) {
        arrayData = searchList;
        if (searchList.length >= 10) {
          arrayData.shift();
        }
        if (shopSelect) {
          const exists = arrayData.find(
            id => id === shopSelect?.node.externalId,
          );
          if (exists) {
            arrayData = [
              ...arrayData.filter(id => id !== shopSelect?.node.externalId),
            ];
          }
          if (shopSelect.node.externalId !== undefined) {
            arrayData.unshift(shopSelect.node.externalId);
          }
        }
        await AsyncStorage.setItem('recentlySearch', JSON.stringify(arrayData));
      } else {
        await AsyncStorage.setItem(
          'recentlySearch',
          JSON.stringify([shopSelect.node.externalId]),
        );
      }
    } catch (e) {
      console.error('Error saving recently search:', e);
    }
  };

  const renderRecentlySearch = () => {
    const list = searchList?.map(item => {
      return mapView.current?.venueData?.locations
        .filter(x => x.nodes[0])
        .map(x => new LocationNode(x))
        .find(data => data.node.externalId === item);
    });
    return (
      <View className="mt-2 flex justify-between">
        <View className="flex flex-row justify-between items-center">
          <Text className="font-bold">Recently</Text>
          <TouchableOpacity onPress={() => setShowmore(!isShowMore)}>
            <Text className="">more...</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flexDirection: 'column',
            },
            !isShowMore && {maxHeight: 155, overflow: 'hidden'},
          ]}>
          {list &&
            list.map((item, i) => {
              return (
                <ShopLocationListItem
                  key={i}
                  item={item as ImmutableObject<LocationNode>}
                  callback={onSelectShop}
                />
              );
            })}
        </View>
      </View>
    );
  };

  return (
    <>
      <BottomSheetView>
        <View className={'flex w-full px-4 '}>
          <TextInput
            className="w-full text-slate-950 rounded-md"
            onChangeText={onSearch}
            onFocus={() => {
              bottomSheetRef.current?.expand();
            }}
            onPressIn={() => {}}
            leftIcon={{name: 'search'}}
            placeholder="What are you looking for?"
            value={''}
          />
        </View>
      </BottomSheetView>
      {(!shops || bottomSheetState.index.value === 0) && (
        <View className="h-12">
          <AmenityShortcut
            setModalAmenityValue={setModalAmenityValue}
            setModalAmenity={setModalAmenity}
            modalAmenity={modalAmenity}
          />
        </View>
      )}
      {bottomSheetState.index.value === 1 && (
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
                renderItem={({item, index}) => {
                  return (
                    <ShopLocationListItem
                      key={index}
                      item={item}
                      callback={onSelectShop}
                    />
                  );
                }}
                keyExtractor={(_, i) => i.toString()}
              />
            </>
          ) : shops === undefined ? (
            <BottomSheetScrollView>
              <View className="px-4">
                {searchList && searchList.length > 0 && renderRecentlySearch()}
                <View className="mt-2">
                  <Text className="font-bold">Categories</Text>
                </View>
                {getCategories()?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => onSelectCategory(item)}
                      key={index}>
                      <View className="flex flex-row align-middle text-center border-b border-gray-300 py-2">
                        <View className="mr-3">
                          {item.icon?.original?.endsWith('.svg') ? (
                            <SvgUri
                              width={24}
                              source={{uri: item.icon.original}}
                            />
                          ) : item.icon?.original ? (
                            <Image
                              width={24}
                              source={{uri: item.icon.original}}
                            />
                          ) : item.iconFromDefaultList ? (
                            <SvgUri
                              width={24}
                              source={{
                                uri: `${Config.OPERATION_BACKEND_API!}/api/v1/LBS/GetDefaultIcon/${
                                  item.iconFromDefaultList
                                }`,
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </View>
                        <Text className="my-auto">{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BottomSheetScrollView>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No item.</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default WayfindingSearchBottom;
