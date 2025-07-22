import React from 'react';
import {Header} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {ScrollView} from 'react-native-gesture-handler';
import {View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text, Icon} from '~/components/atoms';
import InvalidQRCodeModal from '~/features/buildingAccess/components/InvalidQRCodeModal';
import QRSaveSuccessfullyModal from '~/features/buildingAccess/components/QRSaveSuccessfullyModal';
import {modalActions} from '~/features/buildingAccess/components/buildingAccessModal';
import {useNavigation} from '~/navigations/AppNavigation';

const ParkingRedemptionPaymentPromptPay = () => {
  const navigation = useNavigation();

  const onPressInvalidQRCodeModal = () => {
    modalActions.setContent(<InvalidQRCodeModal />);
    modalActions.show();
  };

  const onPressQRSaveSuccessfullyModal = () => {
    modalActions.setContent(<QRSaveSuccessfullyModal />);
    modalActions.setStates({
      animationIn: 'fadeIn',
      animationOut: 'fadeOut',
      backdropOpacity: 0,
    });
    modalActions.show();
  };

  const onPressParkingRedemptionPaymentPromptPaySlip = () => {
    navigation.navigate('ParkingRedemptionPaymentPromptPaySlip');
  };

  const onPressNewRedemptionAnnouncement = () => {
    navigation.navigate('NewRedemptionAnnouncement');
  };

  return (
    <Screen>
      <ScrollView className="w-full">
        <Header
          title={t('General__Payment_PromptPay', 'PromptPay')}
          leftAction="goBack"
          bgColor="bg-[#EFEFEF]"
        />
        <View className="flex flex-col w-full px-[16px] bg-[#EFEFEF] min-h-screen">
          <View className="flex flex-col p-[16px] w-full bg-[#fff]">
            <View className="flex flex-col items-center w-full border-[1px] border-[#DCDCDC]">
              <View className="flex items-center justify-center w-full h-[72px] bg-[#1A3763]">
                <Image
                  source={require('~/assets/images/thai_qr_payment.png')}
                  className="w-[108px] h-[32px]"
                />
              </View>
              <Spacing height={24} />
              <Text color="dark-gray" className="text-center w-full px-[16px]">
                The QR code is accepted for mobile banking across all banks.
              </Text>
              <Spacing height={24} />
              <Image
                source={require('~/assets/images/img_mock_qr.png')}
                className="w-[200px] h-[200px]"
              />
              <Spacing height={24} />
              <TouchableOpacity className="flex flex-row items-center">
                <Icon
                  type="refreshIcon"
                  width={12}
                  height={12}
                  color="#fff"
                  className="mr-[8px]"
                />
                <Text color="dark-gray" className="text-[12px] mr-[8px]">
                  Refresh
                </Text>
                <Text
                  weight="medium"
                  color="dark-gray"
                  className="text-[12px] font-[700]">
                  10:00
                </Text>
              </TouchableOpacity>
              <Spacing height={8} />
              <View className="flex flex-row items-end p-[16px] w-full h-[56px]">
                <Text weight="medium" color="dark-gray" className="mr-auto">
                  {t('General__Payment_Method', 'Payment')}
                </Text>

                <Text size="H3" weight="medium" color="dark-gray" className="">
                  60 Bath
                </Text>
              </View>
              <Spacing height={20} />
            </View>
            <Spacing height={24} />
            <TouchableOpacity
              className="flex flex-row items-center justify-center border-[1px] border-[#DCDCDC] bg-[#E4E4E4] h-[48px]"
              onPress={onPressInvalidQRCodeModal}>
              <Text weight="medium" color="dark-teal" className="">
                Save QR code
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            className="flex flex-row items-center justify-center border-[1px] border-[#DCDCDC] bg-[#E4E4E4] h-[48px]"
            onPress={onPressQRSaveSuccessfullyModal}>
            <Text weight="medium" color="dark-teal" className="">
              Save QR code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center justify-center border-[1px] border-[#DCDCDC] bg-[#E4E4E4] h-[48px]"
            onPress={onPressParkingRedemptionPaymentPromptPaySlip}>
            <Text weight="medium" color="dark-teal" className="">
              Slip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center justify-center border-[1px] border-[#DCDCDC] bg-[#E4E4E4] h-[48px]"
            onPress={onPressNewRedemptionAnnouncement}>
            <Text weight="medium" color="dark-teal" className="">
              new redemption Announcement
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ParkingRedemptionPaymentPromptPay;
