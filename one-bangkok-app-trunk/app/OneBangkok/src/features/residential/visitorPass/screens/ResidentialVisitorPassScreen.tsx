import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HeadText, StickyButton} from '~/components/molecules';
import {Header} from '../../components/Header';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import VisitorPassList from '../components/VisitorPassList';
import clsx from 'clsx';
import {ScreenContainer} from '../../components';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {GuestManagement} from './ResidentialVisitorPassDetailScreen';
import {
  UnitDetail,
  useResidentialUnitSelectedState,
} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {logEvent, logScreenView} from '~/utils/logGA';

export type VisitorPass = {
  id: string;
  visitorName: string;
  propertyProjectName: string;
  propertyUnit: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  idNumber: string;
  email: string;
  isExpired: boolean;
  propertyFloor: string;
  isActive: boolean;
};

type VisitorPassState = {
  active: VisitorPass[];
  expired: VisitorPass[];
};

type Paginate = {
  limit: number;
  page: number;
  total: number;
  count: number;
};

enum Tab {
  ACTIVE = 1,
  EXPIRED = 2,
}

const now = new Date();
const tmr = new Date(new Date().setDate(now.getDate() + 1));
tmr.setHours(23, 59, 59);
now.setHours(0, 0, 0, 0);
const defaultPaginate: Paginate = {
  limit: 10,
  page: 1,
  total: 1,
  count: 1,
};

const ResidentialVisitorPassScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPassState>({
    active: [],
    expired: [],
  });
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ACTIVE);
  const [paginate, setPaginate] = useState<Paginate>(defaultPaginate);
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<UnitDetail[]>([]);
  const unitSelectedState = useResidentialUnitSelectedState();

  useFocusEffect(
    useCallback(() => {
      preload();
    }, [selectedTab]),
  );

  useEffect(() => {
    logScreenView('ResidentialVisitorPassScreen');
    onTabChange(selectedTab);
  }, [selectedTab]);

  const preload = async () => {
    try {
      setIsLoading(true);
      const [_properties, vpResp] = await Promise.all([
        getProperties(),
        getVisitorPasses({...paginate, page: 1}, selectedTab),
      ]);
      setProperties(_properties);
      setPaginate(vpResp.paginate);
      const guestManagements = vpResp.data as GuestManagement[];
      setVisitorPasses(
        mapGuestManagementsToVPState(_properties, guestManagements),
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onTabChange = async (tab: number) => {
    try {
      const [_properties, vpResp] = await Promise.all([
        getProperties(),
        getVisitorPasses({...paginate, page: 1}, tab),
      ]);
      setProperties(_properties);
      setPaginate(vpResp.paginate);
      const guestManagements = vpResp.data as GuestManagement[];
      setVisitorPasses(
        mapGuestManagementsToVPState(_properties, guestManagements),
      );
    } catch (error) {}
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const [_properties, vpResp] = await Promise.all([
        getProperties(),
        getVisitorPasses({...paginate, page: 1}, selectedTab),
      ]);
      setProperties(_properties);
      setPaginate(vpResp.paginate);
      const guestManagements = vpResp.data as GuestManagement[];
      setVisitorPasses(
        mapGuestManagementsToVPState(_properties, guestManagements),
      );
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const mapGuestManagementsToVPState = (
    properties: UnitDetail[],
    gm: GuestManagement[],
  ) => {
    const vps: VisitorPassState = {
      active: [],
      expired: [],
    };

    return gm.reduce((prev, curr) => {
      const {
        id,
        idNumber,
        name,
        unitId,
        date,
        repeatConfig,
        timeConfig,
        isExpired,
        floor,
        email,
        isActive,
      } = curr;
      const property = getPropertyByUnitId(properties, unitId);
      const propertyProjectName =
        language === 'th' ? property?.projectsNameThai : property?.projectName;
      const vp: VisitorPass = {
        id,
        idNumber,
        visitorName: name,
        email,
        propertyProjectName: propertyProjectName || '',
        propertyUnit: property?.houseNumber || '',
        propertyFloor: floor,
        fromDate: date,
        toDate: repeatConfig.isRepeat ? repeatConfig.endDate : date,
        fromTime: timeConfig.isSpecific ? timeConfig.start : '00:00',
        toTime: timeConfig.isSpecific ? timeConfig.end : '23:59',
        isExpired: isExpired === 'true',
        isActive,
      };
      if (isExpired === 'false') {
        prev.active.push(vp);
      } else {
        prev.expired.push(vp);
      }
      return prev;
    }, vps);
  };

  const getVisitorPasses = async (paginate: Paginate, type: number) => {
    const {data} = await serviceMindService.visitorPasses({
      ...paginate,
      type,
      unitId: unitSelectedState.unitId.value,
    });
    return data;
  };

  const getProperties = async () => {
    const {data} = await serviceMindService.properties();
    return data.properties;
  };

  const getPropertyByUnitId = (properties: UnitDetail[], id: string) => {
    return properties?.find(e => e.propertyUnitId === id);
  };

  const getData = async () => {
    try {
      if (
        isLoading ||
        visitorPasses.active.length + visitorPasses.expired.length >=
          paginate.total
      ) {
        return;
      }
      setIsLoading(true);
      const data = await getVisitorPasses(
        {
          ...paginate,
          page: paginate.page + 1,
        },
        selectedTab,
      );
      setPaginate(data.paginate);
      const guestManagements = data.data as GuestManagement[];
      const {active, expired} = mapGuestManagementsToVPState(
        properties,
        guestManagements,
      );
      setVisitorPasses(prev => ({
        active: uniqueData([...prev.active, ...active]),
        expired: uniqueData([...prev.expired, ...expired]),
      }));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueData = (vps: VisitorPass[]) => {
    return Array.from(new Map(vps.map(item => [item.id, item])).values());
  };

  const tabClassName = (tab: Tab) =>
    clsx(
      getTheme(' leading-[17.6px]  justify-center '),
      getTheme(
        selectedTab === tab
          ? 'border-b border-dark-teal-dark'
          : 'border-b border-line',
      ),
    );

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <View className="w-full bg-white">
          <View>
            <Header
              leftAction="goBack"
              title={t(
                'Residential__Visitor_management__Guest_Management',
                'Manage Guest',
              )}
              onPressLeftAction={() => navigation.goBack()}
              bgColor={getTheme('bg-default')}
              leftColor="#292929"
              iconHeight={25}
              iconWidth={25}
            />
          </View>
          <Spacing height={8} />
          <View className="px-5">
            <Text className="text-muted-light">
              {t(
                'Residential__Visitor_management__Guest_Management__Body',
                'Create pass for your guest',
              )}
            </Text>
          </View>
        </View>

        <View className={getTheme('bg-default flex w-full px-5')}>
          <Spacing height={24} />
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => setSelectedTab(Tab.ACTIVE)}
              className={tabClassName(1)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={selectedTab === Tab.ACTIVE ? 'dark-teal' : 'default'}
                weight={selectedTab === Tab.ACTIVE ? 'medium' : 'regular'}>
                {t('Residential__Active', 'Active')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab(Tab.EXPIRED)}
              className={tabClassName(2)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={selectedTab === Tab.EXPIRED ? 'dark-teal' : 'default'}
                weight={selectedTab === Tab.EXPIRED ? 'medium' : 'regular'}>
                {t('Residential__Expired', 'Expired')}
              </Text>
            </TouchableOpacity>
          </View>
          <Spacing height={12} />
        </View>

        <View
          style={{flex: 1, flexGrow: 1}}
          className={getTheme('bg-vp-list z-10 w-full')}>
          <VisitorPassList
            data={
              selectedTab === Tab.ACTIVE
                ? visitorPasses.active
                : visitorPasses.expired
            }
            getData={getData}
            passType={selectedTab === Tab.ACTIVE ? 'active' : 'expired'}
            refreshing={refreshing}
            onRefresh={onRefresh}
            disabled={isLoading}
          />
        </View>
        <Spacing height={50} />
      </ScreenContainer>

      <StickyButton
        title={t(
          'Residential__Visitor_management__Create_visitor_pass',
          'Create Guest Pass',
        )}
        rightIcon="plusIcon"
        iconHeight={20}
        iconWidth={20}
        color="dark-teal"
        onPress={() => {
          logEvent('button_click', {
            screen_name: 'ResidentialVisitorPassScreen',
            feature_name: 'Visitor Registration',
            action_type: 'click',
            bu: 'Residential',
          });
          navigation.navigate('ResidentialCreateVisitorPassScreen');
        }}
      />
    </>
  );
};

export default ResidentialVisitorPassScreen;
