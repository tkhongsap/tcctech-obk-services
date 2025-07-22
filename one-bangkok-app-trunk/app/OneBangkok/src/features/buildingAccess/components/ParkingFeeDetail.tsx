import clsx from 'clsx';
import {GestureResponderEvent, View} from 'react-native';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import React from 'react';
import {IconType, Spacing, Text} from '~/components/atoms';
import {Button} from '~/components/molecules';

import {
  CampaignResponse,
  CampaignSequenceResponseData,
} from 'ob-parking-sdk/dist/api';
import {capitalize} from 'lodash';

interface ParkingFeeDetailProps {
  campaign: CampaignSequenceResponseData;
  totalSpending: number;
  title: string;
  buttonAction: ((event: GestureResponderEvent) => void) | undefined;
  icon?: IconType;
  buttonTitle: string;
  showFreeHour?: boolean;
  showDetail?: boolean;
}

const FeeBlock = ({data}: {data: CampaignResponse}) => (
  <View className="flex-1 flex items-center justify-start pb-2.5">
    <Text size="C1" weight="regular">
      {`${data.redeem_hour} ${t('General__hrs', 'hrs')}`}
    </Text>
    <Text size="C1" weight="bold">
      {data.price_min === 0
        ? capitalize(t('Booking__Free', 'Free'))
        : t('General__Price_thb', '{{price}} THB', {
            price:
              data.price_min && data.price_max
                ? data.price_min
                : `${data.price_min}+`,
          })}
    </Text>
  </View>
);

const ParkingFeeDetail = ({
  campaign,
  totalSpending,
  title,
  buttonAction,
  icon,
  buttonTitle,
  showFreeHour = true,
  showDetail = true,
}: ParkingFeeDetailProps) => {
  let widthClass = '';
  let moreSpend = 0;
  let currentFreeHour = 0;
  let moreHour = 0;
  let backgroundColor = '';
  let isMax = false;

  const levels = [
    {width: 'w-1/4', current: 1, next: 2, backgroundColor: 'bg-yellow'},
    {width: 'w-2/4', current: 2, next: 3, backgroundColor: 'bg-dark-teal'},
    {width: 'w-3/4', current: 3, next: 4, backgroundColor: 'bg-dark-teal'},
  ];

  for (const level of levels) {
    const currentMax =
      campaign[level.current.toString() as keyof typeof campaign]?.price_max ??
      Infinity;
    const nextMin =
      campaign[level.next.toString() as keyof typeof campaign]?.price_min ?? 0;
    const hour =
      campaign[level.current.toString() as keyof typeof campaign]
        ?.redeem_hour ?? 0;
    const nextHour =
      campaign[level.next.toString() as keyof typeof campaign]?.redeem_hour ??
      0;

    if (totalSpending <= currentMax) {
      widthClass = level.width;
      moreSpend = Number((nextMin - totalSpending).toFixed(2));
      currentFreeHour = hour;
      moreHour = nextHour;
      backgroundColor = level.backgroundColor;
      break;
    }
  }

  if (!widthClass && !campaign[4]?.price_max) {
    widthClass = 'w-full';
    moreHour = campaign[4].redeem_hour;
    currentFreeHour = campaign[4].redeem_hour;
    isMax = true;
    backgroundColor = 'bg-dark-teal';
  }

  return (
    <View className={clsx('p-4', getTheme('border-[1px] border-line'))}>
      <Text weight="medium" size="B1">
        {title}
      </Text>
      <Spacing height={20} />
      {showDetail && (
        <>
          <View className={`${getTheme('border-[0.5px] border-line')}`} />
          <Spacing height={20} />
        </>
      )}
      <View>
        <View className={clsx(getTheme('flex flex-row items-center'))}>
          <FeeBlock data={campaign[1]} />
          <View
            className={getTheme(
              'w-[1px] h-full border-[0.5px] border-dashed  border-line',
            )}
          />
          <FeeBlock data={campaign[2]} />
          <View
            className={getTheme(
              'w-[1px] h-full border-[0.5px] border-dashed  border-line',
            )}
          />
          <FeeBlock data={campaign[3]} />
          <View
            className={getTheme(
              'w-[1px] h-full border-[0.5px] border-dashed  border-line',
            )}
          />
          <FeeBlock data={campaign[4]} />
        </View>
        <View className={getTheme('h-2.5 bg-line')}>
          <View
            className={clsx('h-2.5', widthClass, getTheme(backgroundColor))}
          />
        </View>
        {showDetail && (
          <View className="flex flex-row items-center gap-1">
            <Text size="B2">
              {t('General__Your_total_spending', 'Your total spending :')}
            </Text>
            <Text size="B2" weight="bold">
              {t('General__Bath_fee', '{{totalFee}} Baht', {
                totalFee: totalSpending,
              })}
            </Text>
          </View>
        )}
      </View>
      <Spacing height={6} />
      {!isMax && showDetail && (
        <Text size="B1" weight="medium" className={getTheme('text-dark-teal')}>
          {t(
            'General__Spend_amount_for_free',
            'Spend {{price}} THB more to get {{hours}} hours free parking!',
            {price: moreSpend, hours: moreHour},
          )}
        </Text>
      )}
      {showDetail ? <Spacing height={12} /> : <Spacing height={24} />}
      <Button
        onPress={buttonAction}
        outlined
        rightIconColor="#162C51"
        title={buttonTitle}
        rightIcon={icon}
      />
      {showFreeHour && (
        <>
          <Spacing height={32} />
          <View className="flex flex-row items-center justify-between">
            <Text size="B1" weight="medium">
              {t('General__Free_parking', 'Free parking')}
            </Text>
            <Text>
              {`${currentFreeHour.toString()} ${t('General__hr', 'hr')}`}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ParkingFeeDetail;
