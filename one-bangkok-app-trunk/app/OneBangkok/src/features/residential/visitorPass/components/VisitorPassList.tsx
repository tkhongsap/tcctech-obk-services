import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import dayjs from 'dayjs';
import {VisitorPass} from '../screens/ResidentialVisitorPassScreen';
import {RefreshControl} from 'react-native-gesture-handler';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import DatetimeParser from '../../utils/reformatter/datetime';
import appLanguageState from '~/states/appLanguage/appLanguageState';

type PassType = 'active' | 'expired';
type VisitorPassDate = {
  date: string;
  visitorPass: VisitorPass[];
};
type Props = {
  data: VisitorPass[];
  passType: PassType;
  getData?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  disabled?: boolean;
};
type GroupedVisitorPass = {[date: string]: VisitorPass[]};

const VisitorPassList = ({
  data = [],
  getData = () => {},
  passType,
  onRefresh = () => {},
  refreshing = false,
  disabled = false,
}: Props) => {
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>([]);
  // const [visitorPasses, setVisitorPasses] = useState<VisitorPassDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sortByDate = (passData: VisitorPass[]) => {
    return passData.sort((a, b) => parseInt(a.fromDate) - parseInt(b.fromDate));
  };

  const groupByDate = (passData: VisitorPass[]) => {
    return passData.reduce<GroupedVisitorPass>((grouped, vp) => {
      const date = dayjs(vp.fromDate).format('YYYY-MM-DD');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(vp);
      return grouped;
    }, {});
  };

  const groupVisitorPass = () => {
    try {
      setIsLoading(true);
      const grouped = groupByDate(sortByDate(data));
      const groupedKeys = Object.keys(grouped);
      const mapped = groupedKeys.map(date => ({
        date,
        visitorPass: grouped[date],
      }));
      // setVisitorPasses(mapped);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // useEffect(() => {
  //   groupVisitorPass();
  // }, [data]);

  useEffect(() => {
    setIsLoading(true);
    setVisitorPasses(sortByDate(data));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [data]);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={visitorPasses}
      style={styles.flatList}
      contentContainerStyle={[{flexGrow: 1, paddingBottom: 100}]}
      renderItem={({item, index}) => (
        <VisitorPassCard key={`${item.id}_${index}`} item={item} />
      )}
      ListEmptyComponent={
        !isLoading && !disabled ? VisitorPassEmpty(passType) : <></>
      }
      onEndReached={getData}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
    paddingBottom: 12,
    height: '100%',
    width: '100%',
  },
});
export default VisitorPassList;

type DateInfo = {
  from: string;
  to: string;
};

const VisitorPassCard = ({item}: {item: VisitorPass}) => {
  const navigation = useNavigation<StackNavigation>();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const onPress = (visitorPass: VisitorPass) => {
    navigation.navigate('ResidentialVisitorPassDetailScreen', {visitorPass});
  };

  const DateItem = (date: DateInfo) => {
    const start = dayjs(date.from);
    const end = dayjs(date.to);
    const isSameDay = start.isSame(end, 'day');
    const isSameMonth = start.isSame(end, 'month');
    const isSameYear = start.isSame(end, 'year');
    let dateString = '';

    if (isSameDay) {
      dateString = DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      });
    } else if (!isSameMonth) {
      dateString = `${start
        .locale(language)
        .format('DD MMMM')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else if (!isSameYear) {
      dateString = `${DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      })} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else {
      dateString = `${start
        .locale(language)
        .format('DD')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    }

    return dateString;
  };

  const TimeItem = (time: DateInfo) => {
    return `${time.from} - ${time.to}`;
  };

  return (
    <TouchableOpacity
      key={item.id}
      className="py-2"
      onPress={() => onPress(item)}>
      <View
        className={`justify-between px-4 py-4 flex-row items-center  ${getTheme(
          'border border-line',
        )}`}>
        <View>
          <Text weight="medium" className="max-w-[280px]" numberOfLines={3}>
            {item.visitorName}
          </Text>
          <Text weight="regular" size="B2" color="subtitle-muted">
            {item.propertyProjectName ? `${item.propertyProjectName} | ` : ''}
            {item.propertyUnit}
          </Text>
          <Spacing height={16} />
          <Text weight="regular" size="B2">
            {DateItem({from: item.fromDate, to: item.toDate})}
          </Text>
          <Text weight="medium" size="B2">
            {TimeItem({from: item.fromTime, to: item.toTime})}
          </Text>
        </View>
        <View>
          <Icon type="arrowRightIcon" width={16} height={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VisitorPassEmpty = (passType: PassType) => {
  return (
    <View className="pt-[23vh]">
      <Icon type="emptyVisitorPass" width={49} height={41} />
      <Spacing height={24} />
      <Text className="text-center" weight="medium" size="H3">
        {passType === 'active'
          ? t(
              'Residential__Visitor_management__List__No_active_passes',
              'No active passes',
            )
          : t(
              'Residential__Visitor_management__List__No_active_passes_expired',
              'No expired passes',
            )}
      </Text>
      <Text className="text-center">
        {passType === 'active'
          ? t(
              'Residential__Visitor_management__List__No_active_passes_body',
              'You don’t have any passes created yet.',
            )
          : t(
              'Residential__Visitor_management__List__No_active_passes_body_expired',
              'You don’t have any expired passes',
            )}
      </Text>
    </View>
  );
};
