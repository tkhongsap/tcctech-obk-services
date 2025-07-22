import React from 'react';
import {Header} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {ScrollView} from 'react-native-gesture-handler';
import {View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text, Icon} from '~/components/atoms';
import {modalActions} from '../components/buildingAccessModal';
import InvalidQRCodeModal from '../components/InvalidQRCodeModal';
import QRSaveSuccessfullyModal from '../components/QRSaveSuccessfullyModal';

const ResidentialParkingRedemptionPaymentPromptPaySlip = () => {
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

  return (
    <Screen>
      <ScrollView className="w-full">
        <Header
          title={t('PromptPay Slip', 'PromptPay Slip')}
          leftAction="goBack"
          bgColor="bg-[#EFEFEF]"
        />
        <View className="flex flex-col items-center w-full max-w-[425px] px-[12px] py-[16px] bg-[#EFEFEF] min-h-screen">
          <Image
            source={require('~/assets/images/bg_slip.png')}
            className="w-screen absolute z-0"
          />
          <Image
            source={require('~/assets/images/logo_ob_black.png')}
            className="h-[48px] z-1"
          />
          <View className="bg-white/50 flex flex-col items-center px-[12px] py-[24px] w-full z-1 relative">
            {/* <View className="bg-white opacity-75 w-max h-full absolute top-0 left-0 right-0" /> */}
            <Text weight="medium" color="dark-teal" className="">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Title',
                'One Bangkok',
              )}
            </Text>
            <Spacing height={12} />
            <Text size="B2" color="dark-gray" className="text-center px-4">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Address',
                '57 Wireless Road Lumpini, Patumwan, Bangkok 10330 Thailand',
              )}
            </Text>
            <Text size="B2" color="dark-gray">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Tax_ID',
                'Tax ID #0000000000 Tel.+66(0)1234 5678',
              )}
            </Text>
            <Spacing height={24} />
            <Text weight="medium" color="dark-teal">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Receipt',
                'Receipt/ Tax INV',
              )}
            </Text>
            <Spacing height={12} />
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Transaction_ID',
                  'Transaction ID',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                00000000
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method',
                  'Payment Method',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                Credit Card
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Timestamp',
                  'Timestamp',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                24 Jan 2024 20:40:10
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Receipt_Number',
                  'Receipt No.',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                00000000
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Ticket_Number',
                  'Ticket No.',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                00000000
              </Text>
            </View>
            <Spacing height={24} />
            <Text weight="medium" color="dark-teal">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Parking_Details',
                'Parking Details',
              )}
            </Text>
            <Spacing height={12} />
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_License_Plate',
                  'License Plate',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                3กข 1234
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t('Residential__Car_Park_Payment__Time_In', 'Time in')}
              </Text>
              <Text size="B2" color="dark-gray">
                24 Jan 2024 15:08:41
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t('Residential__Car_Park_Payment__Duration', 'Duration')}
              </Text>
              <Text size="B2" color="dark-gray">
                6 hrs 45mins
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between h-[26px] w-full">
              <Text size="B2" weight="medium" color="dark-gray">
                {t(
                  'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Fee',
                  'Fee',
                )}
              </Text>
              <Text size="B2" color="dark-gray">
                150 {t('Residential__Car_Park_Payment__Bath', 'Bath')}
              </Text>
            </View>
            <Spacing height={4} />
            <View className="flex flex-row items-center justify-between h-[56px] w-full border-[#DCDCDC] border-y-[1px]">
              <Text weight="medium" color="dark-gray">
                {t('Residential__Car_Park_Payment__Total', 'Total')}
              </Text>
              <Text size="H3" weight="medium" color="dark-teal">
                150 {t('Residential__Car_Park_Payment__Bath', 'Bath')}
              </Text>
            </View>
            <Spacing height={24} />
            <Text size="B2" weight="medium" color="dark-gray">
              {t(
                'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_Thank_You',
                'Thank you',
              )}
            </Text>
          </View>
          <Image
            source={require('~/assets/images/Receipt_ends.png')}
            className="h-[8px] z-1 w-full opacity-50"
          />
          <TouchableOpacity
            className="flex flex-row items-center justify-center border-[1px] border-[#DCDCDC] bg-[#E4E4E4] h-[48px]"
            onPress={onPressQRSaveSuccessfullyModal}>
            <Text weight="medium" color="dark-teal" className="">
              Save QR code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ResidentialParkingRedemptionPaymentPromptPaySlip;
