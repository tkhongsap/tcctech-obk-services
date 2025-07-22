import React, {useEffect, useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
} from 'react-native';
import {
  NotficationCard,
  NotificationEnum,
} from '~/components/molecules/NotificationCard';
import {NotificationData} from '~/states/notification/notificationState';
import DateTime from '~/utils/datetime';
import NotificationShimmer from './NotificationShimmer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const getCloser = (value: any, checkOne: number, checkTwo: number) =>
  Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

const NotificationList = (props: any) => {
  const {
    scrollY,
    translateY,
    headerHeight,
    translateYNumber,
    scrollToTop,
    onScrollToTop,
    edit,
    onEndReached,
    loading,
    refreshing = false,
    onRefresh,
    data,
    onPress,
    onSelected,
    islastPage,
    checked,
    allowFetch = true,
    ...restProps
  } = props;
  const ref = useRef<Animated.FlatList>(null);
  // still have some wrong behavior need to improve
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSnap = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / 2 ||
        scrollToTop
      )
    ) {
      if (ref.current) {
        ref.current.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
            -headerHeight / 2
              ? offsetY + headerHeight / 2
              : offsetY - headerHeight / 2,
        });
      }
    }
  };

  const handleOnRefresh = () => {
    onRefresh && onRefresh();
  };

  useEffect(() => {
    if (scrollToTop) {
      ref.current?.scrollToOffset({offset: 0, animated: true});
      onScrollToTop && onScrollToTop();
    }
    if (loading) {
      ref.current?.scrollToEnd({animated: true});
    }
  }, [scrollToTop, loading, onScrollToTop, data]);
  const handleOnEndReached = () => {
    if (!refreshing) {
      onEndReached && onEndReached();
    }
  };
  const insets = useSafeAreaInsets();

  return (
    <Animated.FlatList
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY.current}}}],
        {useNativeDriver: true},
      )}
      ref={ref}
      style={[
        {
          transform: [{translateY}],
        },
      ]}
      // bounces={false}
      // overScrollMode="never"
      // todo: still have some wrong behavior need to improve
      // onMomentumScrollEnd={handleSnap}
      contentContainerStyle={{paddingBottom: insets.bottom}}
      data={data as NotificationData[]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={notification => {
        const isLast =
          notification.index + 1 === (data as NotificationData[]).length;
        return (
          <>
            <NotficationCard
              bottomBorder={isLast}
              iconCategory={notification.item.icon_url}
              category={notification.item.category as NotificationEnum}
              timestamp={DateTime.getDiffDateTimeText(
                notification.item.created_at,
              )}
              image={notification.item.thumbnail}
              title={notification.item.title ?? ''}
              edit={edit}
              read={notification.item.read}
              onPress={() => {
                if (onPress) {
                  onPress(notification.item.id);
                }
              }}
              onSelected={() => {
                if (onSelected) {
                  onSelected(notification.item.id);
                }
              }}
              checked={checked(notification.item.id)}
            />
          </>
        );
      }}
      {...restProps}
      extraData={data}
      refreshControl={
        <RefreshControl
          //refresh control used for the Pull to Refresh
          refreshing={refreshing}
          onRefresh={handleOnRefresh}
        />
      }
      ListFooterComponent={
        loading && (
          <View className="flex flex-col min-h-[282px]">
            <NotificationShimmer
              borderTop={!((data as NotificationData[]).length > 0)}
            />
            <NotificationShimmer />
            <NotificationShimmer />
          </View>
        )
      }
      onEndReached={(info: {distanceFromEnd: number}) => {
        if (
          info.distanceFromEnd === 0 &&
          !loading &&
          !islastPage &&
          allowFetch
        ) {
          handleOnEndReached();
        }
      }}
      onEndReachedThreshold={0}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default NotificationList;
