import {View, TouchableOpacity, NativeScrollEvent} from 'react-native';
import {ScreenContainer, StickyButton} from '../components';
import {Spacing, Text} from '~/components/atoms';
import React, {useCallback, useEffect, useState} from 'react';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import clsx from 'clsx';
import MaintenanceList from '../components/MaintenanceList';
import {Header} from '../components/Header';
import {
  getMaintenanceAppStatus,
  MaintenanceAppStatus,
  MaintenanceDetail,
  MaintenanceTab,
} from './MaintenanceDetailScreen';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import {logScreenView} from '~/utils/logGA';

type Paginate = {
  total: number;
  per_page: number;
  offset: number;
  to: number;
  last_page: number;
  current_page: number;
  from: number;
};
const defaultPaginate: Paginate = {
  total: 1,
  per_page: 10,
  offset: 0,
  last_page: 1,
  current_page: 1,
  from: 1,
  to: 1,
};

const ResidentialMaintenanceScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [tab, setTab] = useState<MaintenanceTab>(MaintenanceTab.CURRENT);
  const [currentMaintenances, setCurrentMaintenances] = useState<
    MaintenanceDetail[]
  >([]);
  const [pastMaintenances, setPastMaintenances] = useState<MaintenanceDetail[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [maintenancePaginate, setMaintenancePaginate] =
    useState<Paginate>(defaultPaginate);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    logScreenView('ResidentialMaintenanceScreen');
  }, []);

  useFocusEffect(
    useCallback(() => {
      preload();
    }, []),
  );

  const preload = async (retry: number = 2) => {
    try {
      setIsLoading(true);
      const {maintenances, paginate} = await getMaintenances({
        currentPage: maintenancePaginate.current_page,
        perPage: maintenancePaginate.per_page,
      });
      setMaintenancePaginate(paginate);
      const {currents, pasts} = mapToMaintenanceTab(maintenances);
      setCurrentMaintenances(currents);
      setPastMaintenances(pasts);
    } catch (error) {
      if (retry >= 1) {
        preload(retry - 1);
      } else {
        navigateToErrorScreen();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPropertyDetails = async (): Promise<UnitDetail[]> => {
    const {data} = await serviceMindService.properties();
    const properties = data.properties as UnitDetail[];
    return await Promise.all(
      properties.map(async property => {
        const {data} = await serviceMindService.propertyDetail(
          property.propertyUnitId,
        );
        return data.property;
      }),
    );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const {maintenances, paginate} = await getMaintenances({
        currentPage: defaultPaginate.current_page,
        perPage: defaultPaginate.per_page,
      });
      setMaintenancePaginate(paginate);
      const {currents, pasts} = mapToMaintenanceTab(maintenances);
      setCurrentMaintenances(currents);
      setPastMaintenances(pasts);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
    }
  };

  const mapToMaintenanceTab = (maintenances: MaintenanceDetail[]) => {
    try {
      const currents: MaintenanceDetail[] = [];
      const pasts: MaintenanceDetail[] = [];

      for (const maintenance of maintenances) {
        const appStatus = getMaintenanceAppStatus(maintenance.statusCode);
        if (
          appStatus === MaintenanceAppStatus.DONE ||
          appStatus === MaintenanceAppStatus.CANCELLED
        ) {
          pasts.push({...maintenance, appStatus, tab: MaintenanceTab.PAST});
        } else {
          currents.push({
            ...maintenance,
            appStatus,
            tab: MaintenanceTab.CURRENT,
          });
        }
      }
      return {currents, pasts};
    } catch (error) {
      return {currents: [], pasts: []};
    }
  };

  const getMaintenances = async (payload: {
    currentPage: number;
    perPage: number;
  }): Promise<{maintenances: MaintenanceDetail[]; paginate: Paginate}> => {
    const {data} = await serviceMindService.maintenanceRepairList(payload);
    const {data: maintenances, ...paginate} = data;
    return {maintenances, paginate};
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'ResidentialMaintenanceScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ResidentialMaintenanceScreen'),
    });
  };

  const tabClassName = (_tab: MaintenanceTab) => {
    return clsx(
      getTheme(' leading-[17.6px] justify-center '),
      getTheme(
        tab === _tab
          ? 'border-b border-dark-teal-dark'
          : 'border-b border-line',
      ),
    );
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onScroll = (event: NativeScrollEvent) => {
    if (
      isCloseToBottom(event) &&
      !isLoading &&
      maintenancePaginate.total >
        currentMaintenances.length + pastMaintenances.length
    ) {
      getNextRequestPage();
    }
  };

  const getNextRequestPage = async () => {
    try {
      setIsLoading(true);
      const {maintenances, paginate} = await getMaintenances({
        currentPage: maintenancePaginate.current_page + 1,
        perPage: maintenancePaginate.per_page,
      });
      setMaintenancePaginate(paginate);
      const {currents, pasts} = mapToMaintenanceTab(maintenances);
      setCurrentMaintenances(prev => [...prev, ...currents]);
      setPastMaintenances(prev => [...prev, ...pasts]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <View className="w-full bg-white">
          <Header
            leftAction="goBack"
            onPressLeftAction={() => navigation.goBack()}
            bgColor={getTheme('bg-default')}
            leftColor={'#292929'}
            iconHeight={25}
            iconWidth={25}
          />
          <Spacing height={8} />
          <View className="px-5">
            <HeadText
              tagline={t('General__Residential', 'Residences')}
              title={t(
                'Residential__Maintenance__Maintenance_and_Repair',
                'Maintenance & Repairs',
              )}
              description={t(
                'Residential__Maintenance__Body',
                'Easily create tickets for maintenance & repair solutions',
              )}
              titleColor="default"
              taglineColor="subtitle-muted"
              descriptionColor="subtitle-muted"
              descriptionSpacing={16}
            />
          </View>
        </View>

        <View className={getTheme('bg-default flex w-full')}>
          <Spacing height={16} />
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => setTab(MaintenanceTab.CURRENT)}
              className={tabClassName(MaintenanceTab.CURRENT)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={tab === MaintenanceTab.CURRENT ? 'dark-teal' : 'default'}
                weight={tab === MaintenanceTab.CURRENT ? 'medium' : 'regular'}>
                {t('Residential__Maintenance__Current', 'Current')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(MaintenanceTab.PAST)}
              className={tabClassName(MaintenanceTab.PAST)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={tab === MaintenanceTab.PAST ? 'dark-teal' : 'default'}
                weight={tab === MaintenanceTab.PAST ? 'medium' : 'regular'}>
                {t('Residential__Maintenance__Past', 'Past')}
              </Text>
            </TouchableOpacity>
          </View>
          <Spacing height={12} />
        </View>

        <View
          style={{flex: 1, flexGrow: 1}}
          className={getTheme('bg-vp-list z-10')}>
          <MaintenanceList
            data={
              tab === MaintenanceTab.CURRENT
                ? currentMaintenances
                : pastMaintenances
            }
            isLoading={isLoading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onScroll={onScroll}
          />
        </View>
      </ScreenContainer>

      <StickyButton
        title={t('Residential__Maintenance__Create_new_Ticket', 'Create new')}
        className="bg-dark-teal-dark"
        rightIcon="plusIcon"
        iconHeight={20}
        iconWidth={20}
        onPress={() => {
          navigation.navigate('MaintenanceCreate');
        }}
      />
    </>
  );
};

export default ResidentialMaintenanceScreen;
