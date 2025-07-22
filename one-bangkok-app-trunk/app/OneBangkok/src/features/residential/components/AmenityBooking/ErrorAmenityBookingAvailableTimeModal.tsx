import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import {useModal} from '../ResidentialModal';

interface Props {
  title: string;
  description: string;
}

const ErrorAmenityBookingAvailableTimeModal = ({title, description}: Props) => {
  const [_, modalAction] = useModal();

  const onCancel = () => {
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-8 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View>
        <Text size="B1" weight="medium" className="text-fire-engine-red-dark ">
          {title}
        </Text>
        <Text
          size="B1"
          weight="regular"
          color="mist-gray-700"
          className="text-fire-engine-red-dark ">
          {description}
        </Text>
      </View>
      <View style={{gap: 12}}>
        <TouchableOpacity
          className="p-4 border border-dark-teal-light flex-row justify-center"
          onPress={onCancel}>
          <Text size="B1" weight="medium" color="dark-teal">
            {t('Residential__Booking_Ok', 'OK')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ErrorAmenityBookingAvailableTimeModal;
