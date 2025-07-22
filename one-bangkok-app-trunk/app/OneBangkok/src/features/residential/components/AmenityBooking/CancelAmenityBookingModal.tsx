import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
interface Props {
  onConfirm?: Function;
  onCancel?: Function;
}
const CancelAmenityBookingModal = ({onConfirm, onCancel}: Props) => {
  const [_, modalAction] = useModal();

  const onPressConfirm = () => {
    onConfirm && onConfirm();
    modalAction.hide();
  };

  const onPressCancel = () => {
    onCancel && onCancel();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <TouchableOpacity
          className="p-[16px] flex flex-row items-center justify-center border-error-light border-[1px]"
          onPress={onPressConfirm}>
          <Text weight="medium" color="error">
            {t(
              'Residential__Amenity_Booking__Cancel_amenity_booking',
              'Cancel Booking',
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-[16px] flex flex-row items-center justify-center border-dark-teal-light border-[1px] mb-[12px]"
          onPress={onPressCancel}>
          <Text weight="medium" color="dark-teal">
            {t('Residential__Amenity_Booking__Back', 'Back')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CancelAmenityBookingModal;
