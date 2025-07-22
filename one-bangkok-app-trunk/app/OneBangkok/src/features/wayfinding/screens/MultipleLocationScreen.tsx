import {
  FlatList,
  Image,
  ListRenderItem,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Screen} from '~/components/templates';
import {
  Button,
  Header,
  Tab,
  TabBody,
  TabContent,
  TabHeader,
  TabItem,
} from '~/components/molecules';
import {
  MappedinMap,
  MiMapView,
  getVenue,
  MappedinLocation,
  MappedinDestinationSet,
} from '@mappedin/react-native-sdk';
import type {Mappedin, MapViewStore} from '@mappedin/react-native-sdk';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import {Icon, Text} from '~/components/atoms';
import {useNavigation} from '@react-navigation/native';
import t from '~/utils/text';
import {StackNavigation} from '~/navigations/AppNavigation';
import {HeaderSearch} from '~/components/molecules/HeaderSearch';
import {styles} from '../styles/WayFindingStyle';
import {venueOptions} from '../constants/VenueOptions';
import {TextInputClear} from '~/components/atoms/TextInputClear';

const MultipleLocationScreen = () => {
  const mapView = React.useRef<MapViewStore>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [levels, setLevels] = React.useState<MappedinMap[]>([]);
  const [selectedMapId, setSelectedMapId] = React.useState<MappedinMap['id']>();
  const [venueData, setVenueData] = React.useState<Mappedin>();
  const [shopList, setShopList] = React.useState<MappedinLocation[]>([]);
  const [selectedShop, setSelectedShop] = React.useState<
    MappedinLocation | undefined
  >(undefined);
  const [selectedShopList, setSelectedShopList] = React.useState<
    MappedinLocation[]
  >([]);
  const [isNaviagating, setIsNavigating] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetStartRef = useRef<BottomSheet>(null);
  const navigation = useNavigation<StackNavigation>();

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  React.useEffect(() => {
    bottomSheetStartRef.current?.close();
    async function init() {
      setIsLoading(true);
      const data = await getVenue(venueOptions).finally(() =>
        setIsLoading(false),
      );
      setVenueData(data);
    }
    async function setMap() {
      if (
        selectedMapId &&
        mapView.current &&
        selectedMapId !== mapView.current?.currentMap?.id
      ) {
        await mapView.current?.setMap(selectedMapId);
      }
    }
    // onChangeLevelMap
    async function levelChange() {
      const levelTenants = venueData?.locations
        .filter(lc => {
          return lc.type === 'tenant' && lc.nodes[0]?.map.id === selectedMapId;
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      setShopList(levelTenants as any);
    }

    init();
    setMap();
    levelChange();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMapId, selectedShopList]);

  const getDestinations = async () => {
    if (!selectedShop) {
      stopNavigate();
      return;
    }
    const departure = mapView.current?.venueData?.locations.find(
      (l: MappedinLocation) => l.name === 'Parking Lot A',
    );
    if (!departure || !selectedShop) {
      return;
    }

    const destinationSet = new MappedinDestinationSet(selectedShopList);
    const directions = departure.directionsTo(destinationSet);
    if (directions) {
      mapView.current?.Journey.draw(directions, {
        pathOptions: {interactive: true},
        inactivePathOptions: {interactive: true},
      });
      setIsNavigating(true);
    }
  };

  const stopNavigate = () => {
    bottomSheetRef.current?.expand();
    bottomSheetStartRef.current?.close();
    mapView.current?.Journey.clear();
    setIsNavigating(false);
    setSelectedShop(undefined);
    setSelectedShopList([]);
  };

  const onNavigateSearch = () => {
    // const locations = venueData?.locations ?? [];
    // const callBack = (location?: LocationNode) => {
    //   if (location) {
    //     // setSelectedShop(location);
    //     bottomSheetRef.current?.expand();
    //     bottomSheetStartRef.current?.close();
    //   }
    // };
    // navigation.navigate('WayFindingSearchScreen', {
    //   locations: locations,
    //   amenities: [],
    //   callBack: callBack,
    // });
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const LocationList = ({locations}: {locations: MappedinLocation[]}) => {
    const renderItem: ListRenderItem<MappedinLocation> = ({item}) => (
      <TouchableOpacity onPress={() => setSelectedShop(item)}>
        <View style={styles.listItem}>
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.nodes[0].map.name}</Text>
          </View>
          <View style={styles.item}>
            <Text>View</Text>
            <Icon type="arrowRightIcon" height={14} />
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
      />
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const LocationDeparture = ({locations}: {locations: MappedinLocation[]}) => {
    const renderItem: ListRenderItem<MappedinLocation> = ({item}) => (
      <TouchableOpacity
        onPress={() => {
          const shoplist = selectedShopList;
          shoplist.push(item);
          setSelectedShopList(shoplist);
          getDestinations();
        }}>
        <View style={styles.listItem}>
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.nodes[0].map.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
      />
    );
  };

  return (
    <Screen isLoading={isLoading}>
      {!selectedShop ? (
        <Header
          title={t('General__Indoor_navigation', 'Indoor Navigation')}
          leftAction="goBack"
          onPressLeftAction={() => {
            navigation.goBack();
          }}
          rightAction="search"
          onPressRightAction={() => onNavigateSearch()}
        />
      ) : (
        <HeaderSearch
          leftAction={undefined}
          searchValue={selectedShop.name}
          onClearText={() => {
            bottomSheetRef.current?.expand();
            bottomSheetStartRef.current?.close();
            mapView.current?.Journey.clear();
            setIsNavigating(false);
            setSelectedShop(undefined);
          }}
          onPressIn={() => onNavigateSearch()}
          disabled={true}
        />
      )}
      <View className="w-full h-full">
        <MiMapView
          style={styles.fullSafeAreaView}
          key="mappedin"
          ref={mapView}
          options={venueOptions}
          onFirstMapLoaded={() => {
            if (mapView.current) {
              setSelectedMapId(mapView.current.currentMap?.id);
              setLevels(mapView.current.venueData?.maps ?? []);
            }
          }}
          onMapChanged={({map}) => {
            setSelectedMapId(map.id);
          }}
          onClick={e => {
            if (e.paths) {
              mapView.current?.Journey.setStepByPath(e.paths[0]);
            }
          }}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['15%', '50%']} // Add snapPoints here
      >
        {!selectedShop ? (
          <>
            <Text size="H4" weight="bold" className="text-center">
              Select your destination
            </Text>
            <BottomSheetView style={styles.contentContainer}>
              <View className="flex flex-col w-full">
                <Tab>
                  <TabHeader>
                    {levels?.map(m => (
                      <TabItem onPress={() => setSelectedMapId(m.id)}>
                        {m.name}
                      </TabItem>
                    ))}
                  </TabHeader>
                  <TabBody>
                    <TabContent>
                      <LocationList locations={shopList} />
                    </TabContent>
                    <TabContent>
                      <LocationList locations={shopList} />
                    </TabContent>
                  </TabBody>
                </Tab>
              </View>
            </BottomSheetView>
          </>
        ) : (
          <BottomSheetView>
            <View className="p-5">
              <Text className="text-sm text-gray-600 pb-2">
                {selectedShop.nodes[0].map.name}
              </Text>
              <Text className="text-4xl font-bold">{selectedShop.name}</Text>
              <View className="flex flex-row text-lg">
                <Text style={styles.textGreen}>Open</Text>
                <Text className="text-gray-500 pb-2">
                  {' '}
                  | Close {selectedShop.operationHours![0].closes}
                </Text>
              </View>
              <Button
                title="Direction"
                onPress={() => {
                  const shoplist = selectedShopList;
                  shoplist.push(selectedShop);
                  setSelectedShopList(shoplist);
                  bottomSheetRef.current?.close();
                  bottomSheetStartRef.current?.expand();
                }}
              />
              <View className="flex flex-row justify-center">
                <Image
                  className="w-1/2 h-48"
                  source={{uri: selectedShop?.logo?.xxlarge}}
                />
              </View>
            </View>
          </BottomSheetView>
        )}
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetStartRef}
        snapPoints={['20%', '80%']} // Add snapPoints here
      >
        <BottomSheetView>
          {selectedShop && (
            <>
              <View className="flex flex-row justify-between p-5">
                <View>
                  <Text className="text-sm text-gray-600 pb-2">
                    {selectedShop!.nodes[0].map.name}
                  </Text>
                  <Text className="text-4xl font-bold">
                    {selectedShop!.name}
                  </Text>
                </View>
                {isNaviagating ? (
                  <Button
                    className="w-20 text-center"
                    title="Exit"
                    onPress={stopNavigate}
                  />
                ) : (
                  <Button
                    className="w-20 text-center"
                    title="Start"
                    onPress={getDestinations}
                  />
                )}
              </View>

              {selectedShopList.map(e => (
                <View className="flex flex-row flex-wrap p-5">
                  <TextInputClear
                    className="w-full"
                    rightIcon="search"
                    placeholder="Search here"
                    disabled
                    value={e.name}
                  />
                </View>
              ))}
              <View>
                <Text>Add More Direction</Text>
              </View>
              <View>
                <LocationDeparture locations={shopList} />
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
};

export default MultipleLocationScreen;
