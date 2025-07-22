import React, {useContext} from 'react';
import {Dimensions, View, VirtualizedList} from 'react-native';
import {HeaderSearch} from '~/components/molecules/HeaderSearch';
import {LocationNode, PageState, WayFindingContext} from '../store/wayfinding';
import {ImmutableObject} from '@hookstate/core';
import RenderShopItem from '../components/RenderShopItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const LocationSearchHeader = () => {
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const {
    mapView,
    bottomSheetRef,
    state: {selectedShop, pageState},
    action: {search, setMap},
  } = wayFindingContext;
  const locations =
    mapView.current?.venueData?.locations
      .filter(x => x.nodes[0])
      .map(x => new LocationNode(x)) ?? [];
  const [shops, setShops] = React.useState(locations);

  const onSearch = async (text: string) => {
    if (text.trim().length === 0) {
      setShops(locations);
      return;
    }
    const data = await search(text);
    setShops(data);
  };

  const getItem = (
    _data: unknown,
    index: number,
  ): ImmutableObject<LocationNode> => {
    return shops[index] as ImmutableObject<LocationNode>;
  };

  const getItemCount = (_data: unknown) => shops.length;

  const onSelectShop = async (location?: ImmutableObject<LocationNode>) => {
    if (location) {
      selectedShop.set(location);
      await setMap(location.node.map.id);
    }
  };

  return (
    <>
      <HeaderSearch
        leftAction="goBack"
        onPressLeftAction={() => {
          pageState.set(PageState.normal);
          bottomSheetRef.current?.collapse();
        }}
        onChangeText={onSearch}
        onClearText={() => onSearch('')}
      />
      <View
        className="absolute bg-white z-50 w-full text-slate-950"
        style={{top: insets.top + 60}}>
        <View
          style={{
            maxHeight: windowHeight - (insets.top + insets.bottom + 100),
          }}>
          <VirtualizedList
            keyboardShouldPersistTaps={'handled'}
            maxToRenderPerBatch={5}
            windowSize={5}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
            onEndReachedThreshold={0.1}
            initialNumToRender={10}
            getItem={getItem}
            getItemCount={getItemCount}
            renderItem={({item}) => (
              <RenderShopItem item={item} callback={onSelectShop} />
            )}
            keyExtractor={(_, i) => i.toString()}
          />
        </View>
      </View>
    </>
  );
};

export default LocationSearchHeader;
