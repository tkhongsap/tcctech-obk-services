import {TouchableOpacity, View, ScrollView} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Text} from '~/components/atoms';
import React, {useCallback, useEffect, useState} from 'react';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import {isTablet, deviceWidth} from '../utils/device';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {ScreenContainer} from '../components/ScreenContainer';
import {ParkingQuotaGrouped} from './PropertyDetailScreen';
import {useFocusEffect} from '@react-navigation/native';
import appLanguageState from '~/states/appLanguage/appLanguageState';

const PropertyScreen = () => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const navigation = useNavigation();
  const [properties, setProperties] = useState<UnitDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [parkingQuotaGroups, setParkingQuotaGroups] = useState<
    ParkingQuotaGrouped[]
  >([]);
  const padding = 12 * 2;
  const blockUnitWidth = isTablet
    ? 780 - padding - 12
    : deviceWidth - padding - 12; // Include the gap

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [properties, parkingQuotaGroups] = await Promise.all([
        getProperties(),
        getCarParkingQuotaUnitWise(),
      ]);
      const propertyOwnerOrResidentProps = properties.filter(
        e => e.isPropertyOwner || e.isPropertyResident,
      );
      setProperties(propertyOwnerOrResidentProps);
      setParkingQuotaGroups(parkingQuotaGroups);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getProperties = async (): Promise<UnitDetail[]> => {
    const {data} = await serviceMindService.properties();
    return data.properties;
  };

  const getCarParkingQuotaUnitWise = async () => {
    const {data} = await serviceMindService.carParkingQuotaUnitWise();
    return data.parkingQuotaGrouped;
  };

  const onPress = (property: UnitDetail) => {
    let parkingQuotaGroup = parkingQuotaGroups.find(
      e => e.propertyUnitId === property.propertyUnitId,
    );
    if (!parkingQuotaGroup) {
      parkingQuotaGroup = {
        propertyUnitId: '',
        unitNumber: '',
        fixedEvNormal: {
          count: 0,
          lots: [],
        },
        fixedEvSupercar: {
          count: 0,
          lots: [],
        },
        fixedNonEvNormal: {
          count: 0,
          lots: [],
        },
        fixedNonEvSupercar: {
          count: 0,
          lots: [],
        },
        floatNonEvNormal: {
          count: 0,
          lots: [],
        },
      };
    }
    navigation.navigate('PropertyDetailScreen', {
      property,
      parkingQuotaGroup,
    });
  };

  return (
    <ScreenContainer
      isLoading={isLoading}
      bgColor="#ffffff"
      barStyle="dark-content">
      <Header
        title={t('Residential__My_property', 'My Property')}
        leftAction="goBack"
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      <View
        className={
          isTablet
            ? getTheme('w-[780px] h-full bg-white')
            : getTheme('flex-1 w-full h-full bg-white pb-4')
        }>
        <ScrollView className="w-full bg-white ">
          <View className="p-4 py-10 pt-6 pb-[80px]">
            {properties.map((property, index) => (
              <View
                className="flex flex-col px-4 border border-line-light"
                style={{width: blockUnitWidth, marginTop: index === 0 ? 0 : 12}}
                key={property.houseNumber}>
                <TouchableOpacity
                  className=" py-4 flex flex-row justify-between items-center border-line-light"
                  onPress={() => onPress(property)}>
                  <View>
                    <Text weight="medium" color="default" size="B1">
                      {property.houseNumber}
                    </Text>
                    <Text weight="regular" color="subtitle-muted" size="B2">
                      {language === 'th'
                        ? property.projectsNameThai
                        : property.projectsName}
                    </Text>
                  </View>
                  <Icon
                    type="arrowRightIcon"
                    height={16}
                    width={16}
                    color="#292929"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default PropertyScreen;
