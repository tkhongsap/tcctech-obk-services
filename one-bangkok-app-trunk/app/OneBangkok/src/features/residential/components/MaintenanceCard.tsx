import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {
  MaintenanceDetail,
  MaintenanceStatusBadge,
} from '../screens/MaintenanceDetailScreen';
import DateTime from '~/utils/datetime';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import DatetimeParser from '../utils/reformatter/datetime';

interface Props {
  maintenance: MaintenanceDetail;
}

const MaintenanceCard = ({maintenance}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const getFloor = () => {
    try {
      const floor = maintenance.reportedByFloors[0].floorZoneCode;
      return `${t('General__Floor', 'Floor')} ${floor}`;
    } catch (error) {
      return '-';
    }
  };

  return (
    <TouchableOpacity
      key={maintenance.id}
      className="py-2"
      onPress={() =>
        navigation.navigate('MaintenanceDetailScreen', {
          maintenance,
        })
      }>
      <View
        className={`justify-between px-4 py-4 flex-row items-center ${getTheme(
          'border border-line',
        )}`}>
        <View className="w-full">
          <View className="flex-row justify-between">
            <Text weight="medium">#{maintenance.displayId}</Text>
            <MaintenanceStatusBadge appStatus={maintenance.appStatus} />
          </View>
          <Spacing height={16} />

          <Text weight="medium">{maintenance.eventTypeDescription ?? '-'}</Text>
          <Spacing height={16} />
          <View className="flex flex-row justify-between">
            <View>
              {maintenance.locationType === 1 ? (
                <>
                  <Text size="B2" color="dark-gray" className="">
                    {maintenance.projectName}
                  </Text>
                  <Text size="B2" color="dark-gray" className="">
                    {maintenance.reportedByHouseNumber}
                  </Text>
                  <View className="flex flex-row justify-between w-[320px]">
                    <Text
                      weight="regular"
                      size="B2"
                      numberOfLines={2}
                      className="max-w-[150px]">
                      {getFloor()}
                    </Text>
                    <Text weight="regular" size="B2">
                      {getDiffDateTimeText(parseInt(maintenance.createdAt))}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text
                    weight="regular"
                    size="B2"
                    numberOfLines={2}
                    className="max-w-[300px]">
                    {t(
                      'Residential__Maintenance__Common_facility',
                      'Common Facility',
                    )}
                  </Text>
                  <View className="flex flex-row justify-between w-[320px]">
                    <Text
                      weight="regular"
                      size="B2"
                      numberOfLines={2}
                      className="max-w-[150px]">
                      {maintenance.commonAreaName ?? '-'}
                    </Text>
                    <Text weight="regular" size="B2">
                      {getDiffDateTimeText(parseInt(maintenance.createdAt))}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default MaintenanceCard;

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
