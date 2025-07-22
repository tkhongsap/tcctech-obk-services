import React from 'react';
import {WrappedResponseParkingTicketDataData} from 'ob-bms-sdk/dist/api';
import {View} from 'react-native';
import {Text} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {dayjs} from '~/utils/dayjs';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';

const ParkingDetail = ({
  data,
}: {
  data: WrappedResponseParkingTicketDataData;
}) => {
  const parkedAt = data?.parked_at;

  const dateStart = dayjs(parkedAt);
  const hourDiff = dayjs().diff(dateStart, 'hour');
  const minuteDiff = dayjs().diff(dateStart.add(hourDiff, 'hours'), 'minute');
  let language = appLanguageState.currentLanguage.get();
  if (language === '') {
    language = appLanguageState.defaultLanguage.get();
  }

  return (
    <>
      <View
        className={`justify-between py-5 ${getTheme('border-b border-line')}`}>
        <Text weight="medium">{t('General__Ticket_number', 'Ticket no.')}</Text>
        <Text>{data.ticket_number}</Text>
      </View>

      <View
        className={`justify-between py-5 flex-row  ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('General__Vehicle_type', 'Vehicle type')}
        </Text>
        <Text>{data.vehicle_type}</Text>
      </View>
      <View
        className={`justify-between py-5 flex-row  ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">{t('General__Date', 'Date')}</Text>
        <Text>{`${dayjs(parkedAt).format('DD MMM YYYY')}`}</Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">{t('General__Time_in', 'Time in')}</Text>
        <Text>{`${dayjs(parkedAt).format('HH:mm:ss')}`}</Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">{t('General__Duration', 'Duration')}</Text>
        <Text>{`${t('General__Hour_min', '{{hour}} hrs {{mis}} mins', {
          hour: hourDiff,
          mis: minuteDiff,
        })}`}</Text>
      </View>
      <View
        className={`justify-between flex-row py-5 ${getTheme(
          'border-b border-line',
        )}`}>
        <Text weight="medium">
          {t('General__Totle_payment_amount', 'Total')}
        </Text>
        <Text size="H3" weight="medium">{`${t(
          'General__Bath_fee',
          '{{totalFee}} Baht',
          {
            totalFee: data.total_fee.toLocaleString(),
          },
        )}`}</Text>
      </View>
      <View className={`justify-between py-5 ${getTheme('')}`}>
        <Text size="B2" weight="medium">
          {t('General__Rate_details', 'Rate details')}
        </Text>
        <Text size="B2">{`${data.rate_detail[language] ?? '-'}`}</Text>
      </View>
    </>
  );
};

export default ParkingDetail;
