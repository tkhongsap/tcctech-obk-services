import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import IconHome from '../../../assets/icons/icon-home.svg';
import IconMock from '../../../assets/icons/icon-ob-mock.svg';
import Animated from 'react-native-reanimated';
import {useModal} from './ResidentialModal';
import {Tenant} from '~/states/residentialTenant/residentialTenantState';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

const NavbarModal = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [showContent, setShowContent] = useState(true);
  const [_, modalAction] = useModal();
  const [tenant, setTenant] = useState<Tenant>();

  useEffect(() => {
    const fetchData = async () => {
      setTenant(await residentialTenantAction.getTenant());
    };
    fetchData().catch();
  }, []);

  const handlePress = (screenName: string) => {
    modalAction.hide();
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 350); // Short delay to ensure modal closes before navigation
  };

  return (
    <View className="flex w-[343px]">
      <ScrollView className="">
        <View className="bg-white pl-6 pr-5 pt-4 pb-40 gap-8  min-h-screen ">
          <TouchableOpacity onPress={() => modalAction.hide()}>
            <Text className="p-3 text-right text-red font-medium text-black">
              Close
            </Text>
          </TouchableOpacity>

          <View className="gap-1">
            <View>
              <Text className="text-xl text-dark-gray-light font-medium ">
                {tenant?.name}
              </Text>
              <Text className="text-sm text-dark-gray-light ">
                {tenant?.email}
              </Text>
            </View>

            <View className={'flex flex-col justify-between  mt-1'}>
              <TouchableOpacity
                className={
                  'py-4 flex flex-row items-center border-b w-full border-line-light'
                }>
                <View className={'m-1'}>
                  <IconHome color="#1A1919" width="20" height="20" />
                </View>

                <Text
                  className={getTheme('text-dark-gray-light ml-3 text-base')}>
                  News
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={
                  'py-4 flex flex-row items-center border-b w-full border-line-light'
                }>
                <View className={'m-1'}>
                  <IconMock color="#1A1919" width="20" height="20" />
                </View>
                <Text
                  className={getTheme('text-dark-gray-light ml-3 text-base')}>
                  BTS / MRT Information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={
                  'py-4 flex flex-row items-center border-b w-full border-line-light'
                }>
                <View className={'m-1'}>
                  <IconMock color="#1A1919" width="20" height="20" />
                </View>
                <Text
                  className={getTheme('text-dark-gray-light ml-3 text-base')}>
                  Bus / Shuttle Information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePress('AccountInfoScreen')}
                className={
                  'py-4 flex flex-row items-center border-b w-full border-line-light'
                }>
                <View className={'m-1'}>
                  <IconMock color="#1A1919" width="20" height="20" />
                </View>
                <Text
                  className={getTheme('text-dark-gray-light ml-3 text-base')}>
                  My Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePress('SettingScreen')}
                className={
                  'py-4 flex flex-row items-center border-b w-full border-line-light'
                }>
                <Icon
                  type={'settingIcon'}
                  width={20}
                  height={20}
                  color={'#1A1919'}
                />
                <Text
                  className={getTheme('text-dark-gray-light ml-3 text-base')}>
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-1">
            <TouchableOpacity
              onPress={() => setShowContent(!showContent)}
              className="flex flex-row justify-between">
              <Text className="text-xl text-dark-gray-light font-medium ">
                Residence
              </Text>
              <Animated.View>
                <Icon
                  type={'right'}
                  width={14}
                  height={14}
                  color={'#292929'}
                  className="origin-center rotate-[270deg]"
                />
              </Animated.View>
            </TouchableOpacity>

            {showContent && (
              <View>
                <TouchableOpacity
                  onPress={() => handlePress('ResidentialHomeScreen')}
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1'}>
                    <IconHome color="#1A1919" width="20" height="20" />
                  </View>
                  <Text
                    className={getTheme('text-dark-gray-light ml-3 text-base')}>
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePress('FeedbackScreen')}
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1'}>
                    <IconMock color="#1A1919" width="20" height="20" />
                  </View>
                  <Text
                    className={getTheme('text-dark-gray-light ml-3 text-base')}>
                    Feedback
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePress('DirectoryContactScreen')}
                  className="py-4 flex flex-row items-center border-b w-full border-line-light">
                  <View className={'m-1'}>
                    <IconMock color="#1A1919" width="20" height="20" />
                  </View>
                  <Text
                    className={getTheme('text-dark-gray-light ml-3 text-base')}>
                    Contact Directory
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => handlePress('ResidentialPDPAScreen')}
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1'}>
                    <IconMock color="#1A1919" width="20" height="20" />
                  </View>
                  <Text
                    className={getTheme('text-dark-gray-light ml-3 text-base')}>
                    PDPA Compliance
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => handlePress('HouseRuleScreen')}
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1'}>
                    <IconMock color="#1A1919" width="20" height="20" />
                  </View>
                  <Text
                    className={getTheme('text-dark-gray-light ml-3 text-base')}>
                    House Rules & Regulation
                  </Text>
                </TouchableOpacity>
                {tenant?.isPropertyOwner && (
                  <TouchableOpacity
                    onPress={() => handlePress('PropertyScreen')}
                    className={
                      'py-4 flex flex-row items-center border-b w-full border-line-light'
                    }>
                    <View className={'m-1'}>
                      <IconMock color="#1A1919" width="20" height="20" />
                    </View>
                    <Text
                      className={getTheme(
                        'text-dark-gray-light ml-3 text-base',
                      )}>
                      My Property
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View className="gap-1">
            <TouchableOpacity className="flex flex-row justify-between">
              <Text className="text-xl text-dark-gray-light font-medium ">
                Office
              </Text>
              <Animated.View>
                <Icon
                  type={'right'}
                  width={14}
                  height={14}
                  color={'#292929'}
                  className="origin-center rotate-[90deg]"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View className="gap-1">
            <TouchableOpacity className="flex flex-row justify-between">
              <Text className="text-xl text-dark-gray-light font-medium ">
                Art + C
              </Text>
              <Animated.View>
                <Icon
                  type={'right'}
                  width={14}
                  height={14}
                  color={'#292929'}
                  className="origin-center rotate-[90deg]"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NavbarModal;
