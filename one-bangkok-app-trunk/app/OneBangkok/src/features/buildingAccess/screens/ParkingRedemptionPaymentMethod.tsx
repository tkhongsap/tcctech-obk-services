import React, {useCallback, useEffect, useState} from 'react';
import {Header, StickyButton, useModal} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {ScrollView} from 'react-native-gesture-handler';
import {Pressable, View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text, Icon} from '~/components/atoms';

const ParkingRedemptionPaymentMethod = () => {
  const navigation = useNavigation();

  const onPressParkingRedemptionPaymentPromptPay = () => {
    navigation.navigate('ParkingRedemptionPaymentPromptPay');
  };

  return (
    // Before Select
    <Screen>
      <ScrollView className="w-full">
        <Header
          title={t('General__Payment_Method', 'Payment Method')}
          leftAction="goBack"
        />
        <View className="flex flex-col w-full px-[16px] pt-[32px]">
          <TouchableOpacity
            className="flex flex-row w-full h-[56px] items-center px-[12px] border-[1px] border-[#DCDCDC] mb-[12px]"
            onPress={onPressParkingRedemptionPaymentPromptPay}>
            <Image
              source={require('~/assets/images/promptpay.png')}
              className="mr-[12px] w-[32px] h-[32px]"
            />
            <Text color="dark-gray">PromptPay</Text>
          </TouchableOpacity>
          {/* After Select */}
          {/* <View className="flex flex-col w-full">
            <Text
              weight="medium"
              color="dark-gray"
              className="mr-auto mb-[12px]">
              QR Payment
            </Text>
            <TouchableOpacity className="flex flex-row w-full h-[56px] items-center pl-[12px] pr-[16px] border-[1px] border-[#014541] bg-[#EFEFEF]">
              <Image
                source={require('~/assets/images/promptpay.png')}
                className="mr-[12px] w-[32px] h-[32px]"
              />
              <Text weight="medium" color="dark-teal" className="mr-auto">
                PromptPay
              </Text>
              <Icon
                type={'checkedIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </TouchableOpacity>
          </View>
          <Spacing height={32} /> */}
          <TouchableOpacity className="flex flex-row w-full h-[56px] items-center px-[12px] border-[1px] border-[#DCDCDC] mb-[12px]">
            <Image
              source={require('~/assets/images/visa.png')}
              className="mr-[12px] w-[32px] h-[32px]"
            />
            <Text size="B1" color="dark-gray">
              Credit/Debit Card
            </Text>
          </TouchableOpacity>
          {/* After Select */}
          {/* <View className="flex flex-col w-full">
            <Text
              weight="medium"
              color="dark-gray"
              className="mr-auto mb-[12px]">
              Credit/Debit Card
            </Text>
            <TouchableOpacity className="flex flex-row w-full h-[56px] items-center pl-[12px] pr-[16px] border-[1px] border-[#DCDCDC] mb-[12px]">
              <Image
                source={require('~/assets/images/mastercard.png')}
                className="mr-[12px] w-[32px] h-[32px]"
              />
              <Text color="dark-gray" className="mr-auto">
                **** **** **** 0748
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row w-full h-[56px] items-center px-[16px] border-[1px] border-[#014541] mb-[12px]">
              <Text weight="medium" color="dark-teal" className="mr-auto">
                Use another card
              </Text>
              <Icon
                type={'addIconGreen'}
                width={20}
                height={20}
                color={'#014541'}
              />
            </TouchableOpacity>
          </View>
          <Spacing height={32} /> */}

          <TouchableOpacity className="flex flex-row w-full h-[56px] items-center px-[12px] border-[1px] border-[#DCDCDC] mb-[12px]">
            <Image
              source={require('~/assets/images/true.png')}
              className="mr-[12px] w-[32px] h-[32px]"
            />
            <Text color="dark-gray">True Money Wallet</Text>
          </TouchableOpacity>
          {/* After Select */}
          {/* <View className="flex flex-col w-full">
            <Text
              weight="medium"
              color="dark-gray"
              className="mr-auto mb-[12px]">
              Wallet
            </Text>
            <TouchableOpacity className="flex flex-row w-full h-[56px] items-center px-[12px] border-[1px] border-[#DCDCDC] mb-[12px]">
              <Image
                source={require('~/assets/images/true.png')}
                className="mr-[12px] w-[32px] h-[32px]"
              />
              <Text color="dark-gray">True Money Wallet</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ParkingRedemptionPaymentMethod;
