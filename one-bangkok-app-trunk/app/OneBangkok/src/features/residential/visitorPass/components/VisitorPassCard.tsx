import {View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isToday from 'dayjs/plugin/isToday';
import duration from 'dayjs/plugin/duration';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {VisitorPass} from '../screens/ResidentialVisitorPassScreen';
import DatetimeParser from '../../utils/reformatter/datetime';

type VPCardItem = {
  date: string;
  visitorPass: VisitorPass[];
};

type Props = {
  index: number;
  item: VPCardItem;
  showDate: boolean;
};

type DateInfo = {
  from: string;
  to: string;
};

dayjs.extend(isTomorrow);
dayjs.extend(isToday);
dayjs.extend(duration);

const VisitorPassCard = ({item, showDate = true, index}: Props) => {
  const language = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : appLanguageState.defaultLanguage.get();

  const checkDate = () => {
    let stringDate = '';

    if (dayjs(item.date).isTomorrow()) {
      stringDate = t('Residential__Tomorrow', 'Tomorrow');
    } else if (dayjs(item.date).isToday()) {
      stringDate = t('Residential__Today', 'Today');
    } else {
      stringDate = dayjs(item.date).locale(language).format('DD MMM YYYY');
    }
    return (
      <View>
        <Spacing height={index === 0 ? 12 : 32} />
        <Text weight="medium">{stringDate}</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={[item.visitorPass]}
        renderItem={({item, index}) => {
          return <VisitorPassCardList items={item} />;
        }}
        ListHeaderComponent={showDate ? checkDate : null}
      />
    </View>
  );
};
export default VisitorPassCard;

const VisitorPassCardList = ({items}: {items: VisitorPass[]}) => {
  const navigation = useNavigation<StackNavigation>();

  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

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

  const onPress = (visitorPass: VisitorPass) => {
    navigation.navigate('ResidentialVisitorPassDetailScreen', {visitorPass});
  };

  return (
    <>
      {items.map(
        (
          {
            id,
            visitorName,
            propertyProjectName,
            propertyUnit,
            fromDate,
            toDate,
            fromTime,
            toTime,
          },
          index,
        ) => (
          <TouchableOpacity
            key={id}
            className="py-2"
            onPress={() => onPress(items[index])}>
            <View
              className={`justify-between px-4 py-4 flex-row items-center ${getTheme(
                'border border-line',
              )}`}>
              <View>
                <Text
                  weight="medium"
                  className="max-w-[280px]"
                  numberOfLines={3}>
                  {visitorName}
                </Text>
                <Text weight="regular" size="B2" color="subtitle-muted">
                  {propertyProjectName ? `${propertyProjectName} | ` : ''}
                  {propertyUnit}
                </Text>
                <Spacing height={16} />
                <Text weight="regular" size="B2">
                  {DateItem({from: fromDate, to: toDate})}
                </Text>
                <Text weight="medium" size="B2">
                  {TimeItem({from: fromTime, to: toTime})}
                </Text>
              </View>
              <View>
                <Icon type="arrowRightIcon" width={16} height={16} />
              </View>
            </View>
          </TouchableOpacity>
        ),
      )}
    </>
  );
};
