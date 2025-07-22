import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  NativeScrollEvent,
} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import MaintenanceCard from './MaintenanceCard';
import {MaintenanceDetail} from '../screens/MaintenanceDetailScreen';

type Props = {
  data: MaintenanceDetail[];
  getData?: () => void;
  isLoading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onScroll?: (event: NativeScrollEvent) => void;
};

const MaintenanceList = ({
  data,
  isLoading,
  refreshing = false,
  onRefresh = () => {},
  onScroll = () => {},
}: Props) => {
  return (
    <FlatList
      data={data}
      style={styles.flatList}
      contentContainerStyle={[
        data?.length === 0 && styles.contentStyle,
        {flexGrow: 1, paddingBottom: 150},
      ]}
      renderItem={({item}) => {
        return <MaintenanceCard key={item.id} maintenance={item} />;
      }}
      ListEmptyComponent={!isLoading ? MaintenanceEmpty() : <></>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({nativeEvent}) => onScroll(nativeEvent)}
      showsVerticalScrollIndicator={false}
    />
  );
};

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
    paddingBottom: 24,
  },
});
export default MaintenanceList;

const MaintenanceEmpty = () => {
  return (
    <View>
      <Text className="text-center" weight="medium" size="H3">
        {t(
          'Residential__Maintenance__No_Requests_Created',
          'No requests created',
        )}
      </Text>
      <Text className="text-center">
        {t(
          'Residential__Maintenance__No_Requests_Body',
          'You haven’t created any ticket yet.',
        )}
      </Text>
    </View>
  );
};
