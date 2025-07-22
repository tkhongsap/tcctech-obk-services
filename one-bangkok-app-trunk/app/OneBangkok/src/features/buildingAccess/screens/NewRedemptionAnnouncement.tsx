import React from 'react';
import {Header, StickyButton} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {ScrollView} from 'react-native-gesture-handler';
import {View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text, Icon} from '~/components/atoms';
import InvalidQRCodeModal from '~/features/buildingAccess/components/InvalidQRCodeModal';
import QRSaveSuccessfullyModal from '~/features/buildingAccess/components/QRSaveSuccessfullyModal';
import {modalActions} from '~/features/buildingAccess/components/buildingAccessModal';

const NewRedemptionAnnouncement = () => {
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
          title={t(
            'new redemption Announcement',
            'new redemption Announcement',
          )}
          leftAction="goBack"
          bgColor="bg-[#EFEFEF]"
        />
        <View className="flex flex-col items-center justify-center w-full max-w-[425px] px-[24px] bg-[#fff] min-h-screen">
          {/* Payment Successful */}
          <View className="flex flex-col w-full items-start">
            <Icon type="checkedIcon" color="#22973F" width={40} height={40} />
            <Spacing height={24} />
            <Text size="H2" weight="medium" className="text-[#22973F]">
              Payment Successful
            </Text>
            <Spacing height={20} />
            <Text color="dark-gray">
              Your payment has been successfully processed. A receipt has been
              sent to your email with billing details.
            </Text>
            <Text weight="medium" color="dark-gray">
              Receipt Number: 000000001234
            </Text>
            <Spacing height={40} />
            <TouchableOpacity className="flex items-center justify-center w-full h-[48px] bg-[#E4E4E4] border-[#BDBDBD]">
              <Text weight="medium" color="dark-teal">
              Save Receipt
              </Text>
            </TouchableOpacity>
          </View>
          {/* Payment Unsuccessful */}
          {/* <View className="flex flex-col w-full items-start">
            <Icon
              type="close"
              color="#000"
              width={40}
              height={40}
              className="ml-[-2px]"
            />
            <Spacing height={24} />
            <Text size="H2" weight="medium" color="dark-gray">
              Payment Unsuccessful
            </Text>
            <Spacing height={20} />
            <Text color="dark-gray">Please contact our support</Text>
            <View className="flex flex-row">
              <TouchableOpacity>
                <Text color="dark-teal">023 456 789</Text>
              </TouchableOpacity>
              <Text weight="medium" color="dark-gray" className="mx-[4px]">
                or
              </Text>
              <TouchableOpacity>
                <Text color="dark-teal">support@onebangkok.com</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>

      {/* Payment Successful */}
      <StickyButton
        title={t('General__Done', 'Done')}
        rightIcon="next"
        color="dark-teal"
      />

      {/* Payment Unsuccessful */}
      {/* <StickyButton
        title={t('General__Try_again', 'Try again')}
        rightIcon="next"
        color="dark-teal"
      /> */}
    </Screen>
  );
};

export default NewRedemptionAnnouncement;
