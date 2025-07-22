import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon, Text, TextInput, Spacing} from '~/components/atoms';
import {Header} from '../components/Header';

const ResidentialRenameScreen = () => {
  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Rename"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <View className="bg-[#ffffff] h-[100vh]">
        <View className="flex flex-col h-[100vh] relative">
          <View className="bg-[#ffffff] w-full h-[] px-[16px] pt-[40px] flex flex-col mb-auto">
            <Text size="B1" weight="regular" color="dark-gray">
              Name
            </Text>
            <Spacing height={12} />
            <View className="relative w-full ">
              <TextInput className="h-[48px]" />
              <TouchableOpacity className="absolute top-[14px] right-[12px]">
                <Icon type={'close'} width={12} height={12} color={'#7C7C7C'} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-[36px] w-full bg-[#014541]"></View>
        </View>
      </View>
      <View className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-[16px] justify-between absolute left-0 bottom-0">
        <Text size="B1" weight="medium" color="default-inverse">
          Change name
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </View>
    </ScreenContainer>
  );
};
export default ResidentialRenameScreen;
