import {View} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/buildingAccess/components/buildingAccessModal';

const QRSaveSuccessfullyModal = () => {
  const [_, modalAction] = useModal();

  return (
    <View className="bg-transparent py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="w-full flex items-center justify-center bg-[#DFF9E5] h-[48px]">
        <Text className="text-[#22973F]">QR code image save successfully</Text>
      </View>
    </View>
  );
};

export default QRSaveSuccessfullyModal;
