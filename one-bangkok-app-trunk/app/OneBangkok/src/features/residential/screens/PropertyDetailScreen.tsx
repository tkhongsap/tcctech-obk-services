import {View, ScrollView} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {isTablet, deviceWidth} from '../utils/device';
import {ScreenContainer} from '../components/ScreenContainer';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  UnitDetail,
  UnitDirection,
  UnitFloor,
} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';

export type ParkingQuotaGrouped = {
  propertyUnitId: string;
  unitNumber: string;
  fixedEvNormal: {
    count: number;
    lots: number[];
  };
  fixedEvSupercar: {
    count: number;
    lots: number[];
  };
  fixedNonEvNormal: {
    count: number;
    lots: number[];
  };
  fixedNonEvSupercar: {
    count: number;
    lots: number[];
  };
  floatNonEvNormal: {
    count: number;
    lots: number[];
  };
};
type Props = NativeStackScreenProps<RootStackParamList, 'PropertyDetailScreen'>;

const PropertyDetailScreen = ({
  route: {
    params: {property, parkingQuotaGroup},
  },
}: Props) => {
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const padding = 12 * 2;
  const blockUnitWidth = isTablet
    ? 780 - padding - 12
    : deviceWidth - padding - 12; // Include the gap

  const [propertyDetail, setPropertyDetail] = useState<UnitDetail>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resp = await serviceMindService.propertyDetail(
          property.propertyUnitId,
        );
        setPropertyDetail(resp.data.property);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch();
  }, []);

  const displayLots = (lots: number[]) => {
    try {
      if (!lots || lots?.length === 0) return '-';
      return lots.join(', ');
    } catch (error) {
      return '-';
    }
  };

  const parseUnitOrientation = (directions: UnitDirection[]) => {
    try {
      if (!directions || directions?.length === 0) return '-';
      return directions[0]?.description ?? '-';
    } catch (error) {
      return '-';
    }
  };

  const parseWarrantyDate = ({
    warrantyStartDate,
    warrantyEndDate,
  }: {
    warrantyStartDate: string;
    warrantyEndDate: string;
  }) => {
    try {
      if (!warrantyStartDate || !warrantyEndDate) return '-';
      return `${DatetimeParser.toDMY({
        language,
        timestamp: parseInt(warrantyStartDate),
      })} - ${DatetimeParser.toDMY({
        language,
        timestamp: parseInt(warrantyEndDate),
      })}`;
    } catch (error) {
      return '-';
    }
  };

  const parseArea = (value: string) => {
    try {
      if (!value) return '-';
      return `${value} ${language === 'th' ? ' ตร.ม.' : ' sq m.'}`;
    } catch (error) {
      return '-';
    }
  };

  const parseFloor = (floors: UnitFloor[]) => {
    try {
      if (!floors || floors?.length === 0) return '-';
      return floors[0]?.floorDescription ?? '-';
    } catch (error) {
      return '-';
    }
  };

  return (
    <ScreenContainer
      bgColor={isTablet ? '#1A1919' : '#ffffff'}
      barStyle={isTablet ? 'light-content' : 'dark-content'}
      isLoading={isLoading}>
      <Header
        title={t('Residential__My_property', 'My Property')}
        leftAction="goBack"
        bgColor={isTablet ? 'bg-jet-black' : 'bg-default'}
        titleColor={isTablet ? 'white' : 'default'}
        leftColor={isTablet ? 'white' : '#000'}
      />
      {isTablet ? (
        <HeaderImage
          defaultImage={require('../../../assets/images/bg_property.png')}>
          <View
            className={
              isTablet
                ? getTheme('flex w-[780px] h-full justify-end p-6 mx-auto')
                : getTheme('')
            }>
            <HeadText
              tagline={
                language === 'th'
                  ? property.projectsNameThai
                  : property.projectsName
              }
              title={property.houseNumber}
              titleColor="dark-teal"
              taglineColor="subtitle-muted"
              descriptionColor="line"
            />
          </View>
        </HeaderImage>
      ) : null}

      <View
        className={
          isTablet
            ? getTheme('w-[780px] h-full bg-white')
            : getTheme('flex-1 w-full h-full bg-white pb-4')
        }>
        {propertyDetail && (
          <ScrollView
            className={getTheme('w-full h-full px-4 py-6')}
            showsHorizontalScrollIndicator={false}>
            {isTablet ? null : (
              <View>
                <Text size="B1" color="muted-500">
                  {language === 'th'
                    ? property.projectsNameThai
                    : property.projectsName}
                </Text>
                <Text size="H2" weight="medium" color="dark-teal">
                  {property.houseNumber}
                </Text>
              </View>
            )}
            <Spacing height={28} />
            <View
              className={getTheme(
                'flex w-full border border-line px-6 py-[20px]',
              )}
              style={{width: blockUnitWidth}}>
              <View>
                <Text size="C1" color="muted-400">
                  {t('Residential__Unit_type', 'Unit Type')}
                </Text>
                <Text>
                  {propertyDetail?.propertyUnitTypeDetails?.propertyTypeCode ??
                    '-'}
                </Text>
              </View>
              <Spacing height={20} />
              <View>
                <Text size="C1" color="muted-400">
                  {t('Residential__Unit_number', 'Unit Number')}
                </Text>
                <Text>{property.unitNumber}</Text>
              </View>
              <Spacing height={20} />
              <View>
                <Text size="C1" color="muted-400">
                  {t('Residential__Floor', 'Floor')}
                </Text>
                <Text>{parseFloor(propertyDetail.floors)}</Text>
              </View>
              <Spacing height={20} />
              <View>
                <Text size="C1" color="muted-400">
                  {t('Residential__Area', 'Area')}
                </Text>
                <Text>{parseArea(propertyDetail.unitArea)}</Text>
              </View>
              <Spacing height={20} />
              <View>
                <View className="flex flex-row w-full bg-light-gray-light px-[4px]">
                  <View className="w-[45%] flex relative">
                    <Text size="C1" weight="bold" className=" ">
                      {t('Residential__Fixed_Parking_lot', 'Fixed Parking lot')}
                    </Text>
                  </View>

                  <View className="w-[20%] flex relative items-center">
                    <Text size="C1" weight="bold" className="w-2/10">
                      {t('Residential__quota', 'Quota')}
                    </Text>
                  </View>

                  <View className="w-[35%] flex relative items-end">
                    <Text size="C1" weight="bold" className="w-4/10">
                      {t('Residential__lot_number', 'Lot no.')}
                    </Text>
                  </View>
                </View>

                <View className="flex flex-row justify-between py-1 border-b border-line-light border-dashed">
                  <View className="w-[45%] flex relative">
                    <Text>EV normal</Text>
                  </View>

                  <View className="w-[20%] flex relative items-center">
                    <Text>
                      <Text>
                        {parkingQuotaGroup?.fixedEvNormal?.count ?? '-'}
                      </Text>
                    </Text>
                  </View>

                  <View className="w-[35%] flex relative items-end">
                    <Text>
                      {displayLots(parkingQuotaGroup.fixedEvNormal.lots)}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row justify-between py-1 border-b border-line-light border-dashed">
                  <View className="w-[45%] flex relative">
                    <Text>EV Supercar</Text>
                  </View>

                  <View className="w-[20%] flex relative items-center">
                    <Text>
                      {parkingQuotaGroup?.fixedEvSupercar?.count ?? '-'}
                    </Text>
                  </View>

                  <View className="w-[35%] flex relative items-end">
                    <Text>
                      {displayLots(parkingQuotaGroup.fixedEvSupercar.lots)}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row justify-between py-1 border-b border-line-light border-dashed">
                  <View className="w-[45%] flex relative">
                    <Text>Non-EV normal</Text>
                  </View>

                  <View className="w-[20%] flex relative items-center">
                    <Text>
                      {parkingQuotaGroup?.fixedNonEvNormal?.count ?? '-'}
                    </Text>
                  </View>

                  <View className="w-[35%] flex relative items-end">
                    <Text>
                      {displayLots(parkingQuotaGroup.fixedNonEvNormal.lots)}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row justify-between py-1 border-b border-line-light border-dashed">
                  <View className="w-[45%] flex relative">
                    <Text>Non-EV Supercar</Text>
                  </View>

                  <View className="w-[20%] flex relative items-center">
                    <Text>
                      {parkingQuotaGroup?.fixedNonEvSupercar?.count ?? '-'}
                    </Text>
                  </View>

                  <View className="w-[35%] flex relative items-end">
                    <Text>
                      {displayLots(parkingQuotaGroup.fixedNonEvSupercar.lots)}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex flex-row w-full bg-light-gray-light px-[4px]">
                <View className="w-[45%] flex relative">
                  <Text size="C1" weight="bold" className=" ">
                    {t('Residential__Float_Parking_lot', 'Float Parking Lot')}
                  </Text>
                </View>

                <View className="w-[20%] flex relative items-center">
                  <Text size="C1" weight="bold" className="w-2/10">
                    {t('Residential__quota', 'Quota')}
                  </Text>
                </View>

                <View className="w-[35%] flex relative items-end">
                  <Text size="C1" weight="bold" className="w-4/10">
                    {t('Residential__lot_number', 'Lot no.')}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row justify-between py-1 border-b border-line-light border-dashed">
                <View className="w-[45%] flex relative">
                  <Text>Non-EV normal</Text>
                </View>

                <View className="w-[20%] flex relative items-center">
                  <Text>
                    {parkingQuotaGroup?.floatNonEvNormal?.count ?? '-'}
                  </Text>
                </View>

                <View className="w-[35%] flex relative items-end">
                  <Text>
                    {displayLots(parkingQuotaGroup.floatNonEvNormal.lots)}
                  </Text>
                </View>
              </View>
            </View>
            <Spacing height={150} />
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
};

export default PropertyDetailScreen;
