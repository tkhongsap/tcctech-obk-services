import {
  ScrollView,
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {Tenant} from '~/states/residentialTenant/residentialTenantState';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import DateTime from '~/utils/datetime';
import t from '~/utils/text';
import residentialAuthenAction from '~/states/residentialAuthen/residentialAuthenAction';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon} from '~/components/atoms';
import NavbarWelcome from '../components/NavbarWelcome';
import netamoAuthenAction from '~/states/netamoAuthen/netamoAuthenAction';
import netatmoService from '~/services/residentialService/NetatmoService';

const ResidentialWelcomeScreen = () => {
  const navigation = useNavigation();
  const [tenant, setTenant] = useState<Tenant>();

  const fetchData = async () => {
    // validate Residential token
    if (!(await residentialAuthenAction.validToken())) {
      await fetchResidentialToken();
    }
    setTenant(await residentialTenantAction.getTenant());

    // validate Netamo token
    if (!(await netamoAuthenAction.validToken())) {
      await fetchNetamoToken();
    }
  };

  const fetchResidentialToken = async () => {
    const now = Date.now();
    const {data} = await serviceMindService.authToken();
    const {access_token: token, expires_in: expiresIn} = data;
    await residentialAuthenAction.storeToken({
      token,
      expiresIn: expiresIn * 1000 + now,
    });
  };

  const fetchNetamoToken = async () => {
    const now = Date.now();
    const {data} = await netatmoService.authToken();
    const {access_token: token, expires_in: expiresIn} = data;
    await netamoAuthenAction.storeToken({
      token,
      expiresIn: expiresIn * 1000 + now,
    });
  };

  useEffect(() => {
    fetchData().catch();
  }, []);

  const onPressExploreResidential = () => {
    navigation.navigate('ResidentialHomeScreen');
  };

  const onPressExploreVisitor = () => {
    navigation.navigate('VisitorStartScreen');
  };

  const getGreetingWord = () => {
    // Get the current time in Thailand time zone
    const currentDateTimeThailand = DateTime.getCurrentDateTime();

    // Get the hour of the current time in Thailand time zone
    const hour = currentDateTimeThailand.hour();

    // Determine the greeting based on the hour
    if (hour >= 0 && hour < 12) {
      return t('General__Good_morning', 'Good Morning');
    } else if (hour >= 12 && hour < 18) {
      return t('General__Good_afternoon', 'Good Afternoon');
    } else {
      return t('General__Good_Evening', 'Good Evening');
    }
  };

  const Home_bg = StyleSheet.create({
    stretch: {
      resizeMode: 'cover',
    },
  });

  return (
    <ScreenContainer bgColor={'#162C51'} barStyle="light-content">
      <ScrollView className="relative w-full h-[607px]">
        <View className="relative w-full h-[607px]">
          <NavbarWelcome />
          <Image
            className="z-0 top-[0px] left-[0px] w-full h-[607px]"
            style={Home_bg.stretch}
            source={require('~/assets/images/home_bg.png')}
          />
          <View className="z-99 absolute left-[14px] bottom-[100px]">
            <Text className="text-[#fff] font-[400] text-[30.19px]">
              Welcome to
            </Text>
            <Text className="text-[#fff] font-[500] text-[40.25px]">
              The Heart
            </Text>
            <Text className="text-[#fff] font-[500] text-[40.25px]">
              of Bangkok
            </Text>
          </View>
        </View>
        <View className="relative w-full bg-[#162C51] pb-[40px] px-[16px]">
          <View className="relative w-full px-[16px] pt-[40px] pb-[24px] flex flex-col items-center">
            <Text className="text-[24px] font-[500] text-[#87DAFF]">
              {getGreetingWord()},
            </Text>
            <Text className="text-[24px] font-[500] text-[#fff]">
              {tenant?.userName}
            </Text>
          </View>
          <View className="relative w-full px-[16px] pt-[12px] pb-[40px] flex flex-col items-center">
            <Text className="text-[16px] font-[400] text-[#87DAFF]">
              What would you like to do first?
            </Text>
          </View>
          <TouchableOpacity className="w-full flex flex-row items-center h-[55px] border-[1px] border-white px-[16px] mb-[12px]">
            <View className="w-full flex flex-row items-center justify-between	">
              <View className="flex flex-row items-center">
                <Icon
                  type={'elevatorWhite'}
                  width={20}
                  height={20}
                  color={'#fff'}
                />
                <Text className="text-[16px] font-[400] text-[#fff] ml-[8px]">
                  Calling Elevator
                </Text>
              </View>
              <Icon type={'next'} width={18.26} height={18.26} color={'#fff'} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full flex flex-row items-center h-[55px] border-[1px] border-white px-[16px] mb-[12px]"
            onPress={() => navigation.navigate('VisitorPassScreen')}>
            <View className="w-full flex flex-row items-center justify-between	">
              <View className="flex flex-row items-center">
                <Icon
                  type={'createVisitorPassIcon'}
                  width={20}
                  height={20}
                  color={'#fff'}
                />
                <Text className="text-[16px] font-[400] text-[#fff] ml-[8px]">
                  Create Visitor Pass
                </Text>
              </View>
              <Icon type={'next'} width={18.26} height={18.26} color={'#fff'} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-full flex flex-row items-center h-[55px] border-[1px] border-white px-[16px] mb-[12px]">
            <View className="w-full flex flex-row items-center justify-between	">
              <View className="flex flex-row items-center">
                <Icon
                  type={'serviceBellIcon'}
                  width={20}
                  height={20}
                  color={'#fff'}
                />
                <Text className="text-[16px] font-[400] text-[#fff] ml-[8px]">
                  Building Request
                </Text>
              </View>
              <Icon type={'next'} width={18.26} height={18.26} color={'#fff'} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="relative w-full bg-[#ffffff] py-[40px] px-[16px]">
          <Text className="text-[16px] font-[500] text-[#014541] mb-[12px]">
            Parking Availability
          </Text>
          <Text className="text-[14px] font-[400] text-[#7C7C7C] mb-[31px]">
            Find parking spot and view ticket
          </Text>
          <View className="flex flex-row mb-[31px]">
            <View className="flex flex-col mr-[60px]">
              <Text className="text-[20px] font-[500] text-[#292929] mb-[11px]">
                800
              </Text>
              <Text className="text-[14px] font-[400] text-[#7C7C7C]">
                Post 28
              </Text>
            </View>
            <View className="flex flex-col mr-[60px]">
              <Text className="text-[20px] font-[500] text-[#292929] mb-[11px]">
                500
              </Text>
              <Text className="text-[14px] font-[400] text-[#7C7C7C]">
                The Storey
              </Text>
            </View>
            <View className="flex flex-col">
              <Text className="text-[20px] font-[500] text-[#292929] mb-[11px]">
                150
              </Text>
              <Text className="text-[14px] font-[400] text-[#7C7C7C]">
                Zone Name
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-full flex flex-row items-center">
            <View className="w-full flex flex-row items-center justify-between	">
              <View className="flex flex-row items-center">
                <Text className="text-[16px] font-[400] text-[#292929]">
                  View more details
                </Text>
              </View>
              <Icon
                type={'arrowRightIcon'}
                width={18.26}
                height={18.26}
                color={'#292929'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View className="relative w-full bg-[#DCDCDC] py-[40px] px-[16px]">
          <Text className="text-[16px] font-[500] text-[#842525] mb-[20px]">
            Announcement
          </Text>
          <Text className="text-[16px] font-[400] text-[#292929]">
            One Bangkok is setting new benchmarks for sustainable development.
            Aiming to the first LEED-Neighborhood Development in....
          </Text>
        </View>

        <View className="bg-[#DCDCDC] py-[40px] px-[16px]">
          <Button
            title="Explore Residential"
            onPress={onPressExploreResidential}
          />
        </View>
        <View className="bg-[#DCDCDC] py-[40px] px-[16px]">
          <Button title="Explore Visittor" onPress={onPressExploreVisitor} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default ResidentialWelcomeScreen;
