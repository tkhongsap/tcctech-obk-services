import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/buildingAccess/components/buildingAccessModal';
import {useNavigation} from '~/navigations/AppNavigation';

const InvalidQRCodeModal = () => {
   const navigation = useNavigation();
  const [_, modalAction] = useModal();
  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View>
        <Text size="B1" weight="medium">
          Invalid QR code
        </Text>
        <Text size="B1" weight="regular" color="mist-gray-700">
          The QR code you scanned is no longer valid or has expired. Please
          regenerate a new QR code.
        </Text>
      </View>
      <View style={{gap: 12}}>
        {/* <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={() => onPressDelete && onPressDelete()}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressCancel && onPressCancel();
            modalAction.hide();
          }}
          className="p-4 border border-navy-dark flex-row justify-center">
          <Text size="B1" weight="medium" className="text-navy-dark">
            Cancel
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity className="bg-[#014541] flex-row items-center justify-center h-[48px]">
          <Text size="B1" weight="medium" color="white">
            Generate New QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-dark-teal-dark flex-row items-center justify-center h-[48px]"
          onPress={() => {
            modalAction.hide();
            navigation.navigate('ResidentialParkingRedemptionPaymentMethod');
          }}>
          <Text size="B1" weight="medium" color="dark-teal">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvalidQRCodeModal;
