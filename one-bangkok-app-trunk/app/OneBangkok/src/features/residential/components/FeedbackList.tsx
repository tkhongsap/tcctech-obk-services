import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import FeedbackCard from './FeedbackCard';
import {FeedbackDetail} from '../screens/FeedbackDetailScreen';

type Props = {
  data: FeedbackDetail[];
  getData?: () => void;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

const FeedbackList = ({
  data,
  getData,
  isLoading = false,
  refreshing = false,
  onRefresh,
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
        return <FeedbackCard key={item.id} item={item} />;
      }}
      ListEmptyComponent={!isLoading ? FeedbackEmpty() : <></>}
      onEndReached={getData}
      extraData={data}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
export default FeedbackList;

const FeedbackEmpty = () => {
  return (
    <View>
      <Text className="text-center" weight="medium" size="H3">
        {t('Residential__Feedback__List__No_feedback', 'No feedback created')}
      </Text>
      <Text className="text-center">
        {t(
          'Residential__Feedback__List__No_feedback_body',
          'You haven’t created any feedback yet.',
        )}
      </Text>
    </View>
  );
};
