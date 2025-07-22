// external libraries
import React from 'react';
import clsx from 'clsx';
import {View} from 'react-native';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
// utils
import getTheme from '~/utils/themes/themeUtils';
// components
import {Icon, Spacing, Text} from '~/components/atoms';
import {Button} from '~/components/molecules';
// navigation
import {StackNavigation} from '~/navigations/AppNavigation';
import {valetStatus} from '../constants/valet';

const ParkingValetButton = ({
  id,
  status,
  parkingFee,
  logId,
  pickUpStation,
}: {
  id: number;
  status: string;
  parkingFee: number;
  logId: string;
  pickUpStation: string;
}) => {
  const navigation = useNavigation<StackNavigation>();
  let handleButtonPress;

  const isValetStatusAvailable =
    status === valetStatus.pending ||
    status === valetStatus.parked ||
    status === valetStatus.calling ||
    status === valetStatus.delivering ||
    status === valetStatus.ready;

  if (parkingFee > 0) {
    handleButtonPress = () =>
      navigation.navigate('ParkingPaymentScreen', {
        logId: logId,
        fee: parkingFee,
      });
  } else {
    handleButtonPress = () =>
      navigation.navigate('RequestCarRetrievalScreen', {valetId: id});
  }

  if (!isValetStatusAvailable) {
    return null;
  }

  switch (status) {
    case valetStatus.pending:
      return (
        <View className={clsx('p-3 flex-1', getTheme('bg-light-gray'))}>
          <View className="flex-row items-center space-x-2">
            <Icon type="parkingValet" width={20} height={20} />
            <Text size="B1" weight="bold" color="dark-teal">
              {t(
                'General__Car_is_on_the_way',
                'Car is on the way to parking spot',
              )}
            </Text>
          </View>
          <Spacing height={12} />
          <View className="space-y-1.5">
            <Text size="B2" color="black">
              {t(
                'General__Car_is_on_the_way_description',
                'Our valet boy is bringing your car to the parking spot at the moment.',
              )}
            </Text>
          </View>
        </View>
      );
    case valetStatus.parked:
      return (
        <View className={clsx('p-3 flex-1', getTheme('bg-light-gray'))}>
          <View className="flex-row items-center space-x-2">
            <Icon type="parkingValet" width={20} height={20} />
            <Text size="B1" weight="bold" color="dark-teal">
              {t(
                'General__Valet_parking_in_service',
                'Valet parking in service',
              )}
            </Text>
          </View>
          <Spacing height={12} />
          <View className="space-y-1.5">
            <Text size="B2" color="black">
              {t(
                'General__Valet_parking_in_service_description',
                'Your car is currently in valet parking service. \nTo retrieve your car, you can make a car retrieval request.',
              )}
            </Text>
          </View>
          <Spacing height={24} />
          <Button
            onPress={handleButtonPress}
            title={t('General__Request_car_retrieval', 'Request car retrieval')}
            outlined
            rightIcon="next"
          />
        </View>
      );
    case valetStatus.calling:
      return (
        <View className={clsx('p-3 flex-1', getTheme('bg-light-gray'))}>
          <View className="flex-row items-center space-x-2">
            <Icon type="parkingValet" width={20} height={20} />
            <Text size="B1" weight="bold" color="dark-teal">
              {t('General__Pickup_request', 'Pickup request')}
            </Text>
          </View>
          <Spacing height={12} />
          <View className="space-y-1.5">
            <Text size="B2" color="black">
              {t(
                'General__Pickup_request_detail',
                'You have requested a car pickup. Our valet is notified and will proceed to the next step shortly.',
              )}
            </Text>
            <Spacing height={12} />
            <Text size="B2" color="black">
              {t(
                'General__Request_pickup_location',
                'Requested pickup location.',
              )}
            </Text>
            <Text size="B1" weight="medium" color="black">
              {pickUpStation}
            </Text>
          </View>
        </View>
      );
    case valetStatus.delivering:
      return (
        <View className={clsx('p-3 flex-1', getTheme('bg-light-gray'))}>
          <View className="flex-row items-center space-x-2">
            <Icon type="parkingValet" width={20} height={20} />
            <Text size="B1" weight="bold" color="dark-teal">
              {t('General__Request_acknowledged', 'Request acknowledged')}
            </Text>
          </View>
          <Spacing height={12} />
          <View className="space-y-1.5">
            <Text size="B2" color="black">
              {t(
                'General__Car_is_delivering',
                'The valet has received it and is already on the way to retrieve your car. Hang tight, we’ll have it ready for you soon!',
              )}
            </Text>
            <Spacing height={12} />
            <Text size="B2" color="black">
              {t('General__Pickup_location', 'Pickup location.')}
            </Text>
            <Text size="B1" weight="medium" color="black">
              {pickUpStation}
            </Text>
          </View>
        </View>
      );
    case valetStatus.ready:
      return (
        <View className={clsx('p-3 flex-1', getTheme('bg-light-gray'))}>
          <View className="flex-row items-center space-x-2">
            <Icon type="parkingValet" width={20} height={20} />
            <Text size="B1" weight="bold" color="dark-teal">
              {t('General__Car_is_ready', 'Car is ready')}
            </Text>
          </View>
          <Spacing height={12} />
          <View className="space-y-1.5">
            <Text size="B2" color="black">
              {t(
                'General__Car_is_ready_description',
                'Our valet boy has brought your car to the pickup location.',
              )}
            </Text>
            <Spacing height={12} />
            <Text size="B2" color="black">
              {t('General__Pickup_location', 'Pickup location.')}
            </Text>
            <Text size="B1" weight="medium" color="black">
              {pickUpStation}
            </Text>
          </View>
        </View>
      );
    default:
      break;
  }

  return null;
};

export default ParkingValetButton;
