import React from 'react';
import {
  ParkingRedemptionRateResult,
  RateDetail,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import {View} from 'react-native';
import {Text} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {dayjs} from '~/utils/dayjs';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import DatetimeParser from '../../utils/reformatter/datetime';

export type TParkingDetail = WrappedResponseParkingTicketDataData & {
  rate_detail: {[language: string]: string};
};
type Props = {
  data: TParkingDetail;
  selectedRate?: ParkingRedemptionRateResult;
};
const ParkingDetail = ({data, selectedRate}: Props) => {
  const parkedAt = data?.parked_at;
  const dateStart = dayjs(parkedAt);
  const hourDiff = dayjs().diff(dateStart, 'hour');
  const minuteDiff = dayjs().diff(dateStart.add(hourDiff, 'hours'), 'minute');
  const language =
    (appLanguageState.currentLanguage.get() as keyof RateDetail) ||
    (appLanguageState.defaultLanguage.get() as keyof RateDetail);

  const dateStringToTimestamp = (value: string) => {
    return new Date(value).getTime();
  };

  return (
    <>
      <View
        className={`flex-row justify-between pb-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Ticket_number', 'Ticket no.')}
        </Text>
        <View className="max-w-[200px]">
          <Text className="mt-[-4px]" numberOfLines={3}>
            {data.ticket_number}
          </Text>
        </View>
      </View>

      <View
        className={`justify-between py-5 flex-row  ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Vehicle_type', 'Vehicle type')}
        </Text>
        <Text>{data.vehicle_type}</Text>
      </View>
      <View
        className={`justify-between py-5 flex-row  ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Date', 'Date')}
        </Text>
        <Text>
          {DatetimeParser.toDMY({
            language,
            timestamp: dateStringToTimestamp(parkedAt),
          })}
        </Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Time_In', 'Time in')}
        </Text>
        <Text>
          {DatetimeParser.toHMS({
            language,
            timestamp: dateStringToTimestamp(parkedAt),
          })}
        </Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Duration', 'Duration')}
        </Text>
        <Text>{`${t('General__Hour_min', '{{hour}} hrs {{mis}} mins', {
          hour: hourDiff,
          mis: minuteDiff,
        })}`}</Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          `border-line ${selectedRate ? 'border-b' : ''}`,
        )}`}>
        <Text weight="medium">
          {t('Residential__Car_Park_Payment__Total', 'Total')}
        </Text>
        <Text size="H3" weight="medium">{`${t(
          'General__Bath_fee',
          '{{totalFee}} Bath',
          {
            totalFee: data.total_fee.toLocaleString(),
          },
        )}`}</Text>
      </View>
      {selectedRate && (
        <View className={`justify-between py-5 ${getTheme('')}`}>
          <Text size="B2" weight="medium">
            {t('Residential__Car_Park_Payment__Rate_Details', 'Rate details')}
          </Text>
          <Text size="B2">{`${selectedRate.detail[language] ?? '-'}`}</Text>
        </View>
      )}
    </>
  );
};

export default ParkingDetail;
