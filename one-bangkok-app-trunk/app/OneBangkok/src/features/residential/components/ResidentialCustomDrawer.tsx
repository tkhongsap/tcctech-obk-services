import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';
import {Icon, IconType, Spacing} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {Text} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';

import {View, TouchableOpacity, ScrollView} from 'react-native';
import IconHome from '../../../assets/icons/icon-home.svg';
import IconMock from '../../../assets/icons/icon-ob-mock.svg';
import Animated from 'react-native-reanimated';
import {Tenant} from '~/states/residentialTenant/residentialTenantState';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

export default function ResidentialCustomDrawer() {
  const navigation = useNavigation();
  const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());
  const [tenant, setTenant] = useState<Tenant>();
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setTenant(await residentialTenantAction.getTenant());
    };
    fetchData().catch();
  }, []);

  const handlePress = (screenName: string) => {
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 350); // Short delay to ensure modal closes before navigation
  };

  return (
    <View className={getTheme('bg-white h-screen')}>
      <SafeAreaView>
        <View className="flex items-end pb-8">
          <View className="p-3">
            <Text weight="medium" onPress={closeDrawer}>
              {t('General__Close', 'Close')}
            </Text>
          </View>
        </View>
        <ScrollView className="h-full">
          <View className="bg-white pb-40 pr-5 gap-8  min-h-screen ">
            <View className="gap-1">
              <View>
                <Text size="H4" weight="medium" color="dark-gray">
                  {tenant?.name}
                </Text>
                <Text size="B2" color="dark-gray">
                  {tenant?.email}
                </Text>
              </View>

              <View className={'flex flex-col justify-between  mt-1'}>
                <TouchableOpacity
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1 ml-0'}>
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
                  <View className={'m-1 ml-0'}>
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
                  <View className={'m-1 ml-0'}>
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
                  <View className={'m-1 ml-0'}>
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
                <Text size="H4" weight="medium" color="dark-gray">
                  {t('Residential__Residence', 'Residences')}
                </Text>
                <Animated.View>
                  <Icon
                    type={'right'}
                    width={14}
                    height={14}
                    color={'#292929'}
                    className={`origin-center ${
                      showContent ? 'rotate-[270deg]' : 'rotate-[90deg]'
                    }`}
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
                    <View className={'m-1 ml-0'}>
                      <IconHome color="#1A1919" width="20" height="20" />
                    </View>
                    <Text
                      className={getTheme(
                        'text-dark-gray-light ml-3 text-base',
                      )}>
                      {t('Residential__Home', 'Home')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePress('FeedbackScreen')}
                    className={
                      'py-4 flex flex-row items-center border-b w-full border-line-light'
                    }>
                    <View className={'m-1 ml-0'}>
                      <IconMock color="#1A1919" width="20" height="20" />
                    </View>
                    <Text
                      className={getTheme(
                        'text-dark-gray-light ml-3 text-base',
                      )}>
                      {t('Residential__Feedback', 'Feedback')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePress('DirectoryContactScreen')}
                    className="py-4 flex flex-row items-center border-b w-full border-line-light">
                    <View className={'m-1 ml-0'}>
                      <IconMock color="#1A1919" width="20" height="20" />
                    </View>
                    <Text
                      className={getTheme(
                        'text-dark-gray-light ml-3 text-base',
                      )}>
                      {t('Residential__Contact_directory', 'Contact Directory')}
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                  onPress={() => handlePress('ResidentialPDPAScreen')}
                  className={
                    'py-4 flex flex-row items-center border-b w-full border-line-light'
                  }>
                  <View className={'m-1 ml-0'}>
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
                    <View className={'m-1 ml-0'}>
                      <IconMock color="#1A1919" width="20" height="20" />
                    </View>
                    <Text
                      className={getTheme(
                        'text-dark-gray-light ml-3 text-base',
                      )}>
                      {t(
                        'Residential__House_rules_and_others',
                        'House Rules & Others',
                      )}
                    </Text>
                  </TouchableOpacity>
                  {tenant?.isPropertyOwner && (
                    <TouchableOpacity
                      onPress={() => handlePress('PropertyScreen')}
                      className={
                        'py-4 flex flex-row items-center border-b w-full border-line-light'
                      }>
                      <View className={'m-1 ml-0'}>
                        <IconMock color="#1A1919" width="20" height="20" />
                      </View>
                      <Text
                        className={getTheme(
                          'text-dark-gray-light ml-3 text-base',
                        )}>
                        {t('Residential__My_property', 'My Property')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <View className="gap-1">
              <TouchableOpacity className="flex flex-row justify-between">
                <Text size="H4" weight="medium" color="dark-gray">
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
                <Text size="H4" weight="medium" color="dark-gray">
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
          <Spacing height={50} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
