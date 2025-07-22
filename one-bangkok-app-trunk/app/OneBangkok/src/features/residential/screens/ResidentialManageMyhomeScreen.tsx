import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon} from '~/components/atoms';
import ManageMyHomeModal from '../components/ManageMyHomeModal';
import {Header} from '../components/Header';

const ResidentialManageMyHomeScreen = () => {
  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Manage my home"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />

      <ScrollView style={{height: 0}} className="bg-[#ffffff] w-full">
        <View className="bg-[#ffffff] w-full h-[] px-[16px] pt-[40px] flex flex-col">
          <View className="w-full flex flex-row items-center justify-between mb-[16px]">
            <Text className="text-[16px] font-[500] text-[#292929]">
              C3A-32001
            </Text>
            <ManageMyHomeModal />
          </View>

          <View className="border-[1px] border-[#DCDCDC] px-[16px] flex flex-col">
            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Exhibition
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  13
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Hold Exhibition
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  12
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Laboratory Room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  3
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Living now
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  1
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center border-b-[1px] border-[#DCDCDC]">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Practice room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  5
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>

            <View className="py-[16px] flex flex-row items-center ">
              <Text className="text-[16px] font-[400] text-[#292929] ">
                Training room
              </Text>
              <View className="h-[27px] w-[27px] flex items-center justify-center bg-[#014541] ml-[12px] rounded-[20px]">
                <Text className=" text-[12px] font-[400] text-[#FDFDFD] leading-[120%]">
                  4
                </Text>
              </View>
              <TouchableOpacity className="w-[16px] h-[16px] flex items-center justify-center ml-auto">
                <Icon type={'right'} width={16} height={16} color={'#292929'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
export default ResidentialManageMyHomeScreen;
