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

dayjs.extend(isTomorrow);
dayjs.extend(isToday);
dayjs.extend(duration);

const VisitorPassCard = ({
  item,
  showDate = true,
  index,
}: {
  item?: any;
  showDate?: boolean;
  index?: number;
}) => {
  const navigation = useNavigation<StackNavigation>();
  const languages = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : appLanguageState.defaultLanguage.get();
  const checkDate = () => {
    let stringDate = '';

    if (dayjs(item.date).isTomorrow()) {
      stringDate = t('General__Tomorrow', 'Tomorrow');
    } else if (dayjs(item.date).isToday()) {
      stringDate = t('General__Today', 'Today');
    } else {
      stringDate = dayjs(item.date)
        .locale(languages)
        .format('dddd DD MMM YYYY');
    }
    return (
      <View>
        <Spacing height={index === 0 ? 12 : 32} />
        <Text weight="medium">{stringDate}</Text>
      </View>
    );
  };

  const DateItem = (date: any) => {
    const start = dayjs(date.from);
    const end = dayjs(date.to);
    const diff = dayjs.duration(end.diff(start));
    const diffFormatted = diff.format('HH:mm');

    const isSameDay = start.isSame(end, 'day');
    const isSameMonth = start.isSame(end, 'month');
    const isSameYear = start.isSame(end, 'year');

    let dateString = '';

    if (isSameDay) {
      dateString = `${start.locale(languages).format('DD MMMM YYYY')}`;
    } else if (!isSameMonth) {
      dateString = `${start.locale(languages).format('DD MMMM')} - ${end.locale(languages).format('DD MMMM YYYY')}`;
    } else if (!isSameYear) {
      dateString = `${start.locale(languages).format('DD MMMM YYYY')} - ${end.locale(languages).format(
        'DD MMMM YYYY',
      )}`;
    } else {
      dateString = `${start.locale(languages).format('DD')} - ${end.locale(languages).format('DD MMMM YYYY')}`;
    }

    return dateString;
  };
  const TimeItem = (date: any) => {
    const start = dayjs(date.from);
    const end = dayjs(date.to);
    let timeString = '';

    timeString = `${start.format('HH:mm')} - ${end.format('HH:mm')}`;

    return timeString;
  };

  return (
    <View>
      <FlatList
        data={item?.visitorPass}
        renderItem={item => {
          return (
            <TouchableOpacity
              className={'py-2'}
              onPress={() =>
                navigation.navigate('VisitorPassDetailScreen', {
                  visitorPassDetail: item?.item,
                })
              }>
              <View
                className={`justify-between px-4 py-4 flex-row items-center ${getTheme(
                  'border border-line',
                )}`}>
                <View>
                  <Text weight="medium">{item?.item?.visitor?.name}</Text>
                  <Text weight="regular" size="B2" color="subtitle-muted">
                    {item?.item?.visitor?.company_name}
                  </Text>
                  <Spacing height={16} />
                  <Text weight="regular" size="B2">
                    {DateItem(item?.item.visitor_schedule)}
                  </Text>
                  <Text weight="medium" size="B2">
                    {TimeItem(item?.item.visitor_schedule)}
                  </Text>
                </View>
                <View>
                  <Icon type="arrowRightIcon" width={16} height={16} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={showDate ? checkDate : null}
      />
    </View>
  );
};
export default VisitorPassCard;
