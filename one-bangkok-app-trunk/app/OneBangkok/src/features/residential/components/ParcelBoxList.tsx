import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  NativeScrollEvent,
} from 'react-native';
import React, {forwardRef, useEffect, useState} from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import ParcelBoxCard, {ParcelList} from './ParcelBoxCard';

type Props = {
  parcels: ParcelList[];
  onPress: (id: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
  onScroll: (e: NativeScrollEvent) => void;
};

const ParcelBoxList = forwardRef<FlatList, Props>((props, ref) => {
  const {parcels, onPress, isLoading, onRefresh, refreshing, onScroll} = props;

  return (
    <FlatList
      ref={ref}
      data={parcels}
      extraData={parcels}
      style={styles.flatList}
      contentContainerStyle={[
        parcels?.length === 0 && styles.contentStyle,
        {flexGrow: 1, paddingBottom: 150},
      ]}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      renderItem={({item, index}) => {
        return (
          <ParcelBoxCard
            key={`${item.id}-vp-card`}
            item={item}
            index={index}
            onPress={onPress}
          />
        );
      }}
      ListEmptyComponent={!isLoading ? ParcelBoxEmpty() : null}
      onScroll={({nativeEvent}) => onScroll(nativeEvent)}
      scrollEventThrottle={16}
    />
  );
});

const styles = StyleSheet.create({
  flatList: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 24,
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ParcelBoxList;

const ParcelBoxEmpty = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // delay 1s
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  }, []);

  if (!isVisible) return null;
  return (
    <View className="mt-[-100px]">
      <Text className="text-center" weight="medium" size="H3">
        {t('Residential__Parcel_Box__No_new_parcels', 'No new parcels')}
      </Text>
    </View>
  );
};
