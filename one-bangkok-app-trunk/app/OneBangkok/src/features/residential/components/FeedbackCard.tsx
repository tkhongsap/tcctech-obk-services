import {View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {
  FeedbackDetail,
  FeedbackStatusBadge,
} from '../screens/FeedbackDetailScreen';
import DateTime from '~/utils/datetime';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import DatetimeParser from '../utils/reformatter/datetime';

type Props = {
  item: FeedbackDetail;
};

const FeedbackCard = ({item}: Props) => {
  const navigation = useNavigation();

  return (
    <View>
      <FlatList
        data={[item]}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              key={item.id}
              className={'py-2'}
              onPress={() =>
                navigation.navigate('FeedbackDetailScreen', {
                  feedback: item,
                })
              }>
              <View
                className={`justify-between px-4 py-4 flex-row items-center ${getTheme(
                  'border border-line',
                )}`}>
                <View className="w-full">
                  <View className="flex-row justify-between">
                    <Text weight="medium">#{item.displayId}</Text>
                    <FeedbackStatusBadge appStatus={item.appStatus} />
                  </View>
                  <Spacing height={16} />
                  <Text weight="medium">{item.feedbackTypeName}</Text>
                  <Spacing height={16} />
                  <View className="w-full justify-end flex-row">
                    <Text weight="regular" size="B2">
                      {getDiffDateTimeText(parseInt(item.createdAt))}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};
export default FeedbackCard;

const getDiffDateTimeText = (date: string | number | Date) => {
  const current = DateTime.getCurrentDateTime();

  let diff = DateTime.getDateDiff(date, current.toDate(), 'seconds');
  if (diff <= 60) {
    return t('General__Just_now', 'Just now');
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'minutes');
  if (diff <= 60) {
    return t('General__mins_ago', '{{min}} mins ago', {min: diff});
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'hours');
  if (diff <= 24) {
    return t('General__hours_ago', '{{hour}} hours ago', {hour: diff});
  } else {
    const language = appLanguageActions.getLanguage() || 'en';
    const timestamp = new Date(date).getTime();
    return t('General__date_time', '{{date}} at {{time}}', {
      date: DatetimeParser.toDMY({language, timestamp}),
      time: DatetimeParser.toHM({language, timestamp}),
    });
  }
};
