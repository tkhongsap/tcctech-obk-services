import {
  View,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  Platform,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import {ScreenContainer} from '../components';
import {Spacing, Text} from '~/components/atoms';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import clsx from 'clsx';
import ParcelBoxList from '../components/ParcelBoxList';
import {useResidentialUnitSelectedState} from '~/states/residentialTenant/residentialTenantState';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {ParcelList} from '../components/ParcelBoxCard';
import {useFocusEffect} from '@react-navigation/native';

export type ParcelBox = {
  id: string;
  status: string;
  image_url: string;
  parcel_type: string;
  location: string;
  acceptee: string;
  carrier: string;
  tracking: string;
  description: string;
  remark: string;
};

type ParcelStatus = {
  id: string;
  orgId: string;
  projectId: string;
  statusName: string;
  statusId: number;
  listOrder: number;
  isDefault: boolean;
  unreadParcelCount: number;
  readParcelCount: number;
};

type Paginate = {
  total: number;
  limit: number;
  count: number;
  page: number;
};

const defaultPaginate = {
  total: 0,
  limit: 10,
  count: 10,
  page: 1,
};

const ParcelBoxScreen = () => {
  const unitSelectedState = useResidentialUnitSelectedState();
  const selectedProjectId = unitSelectedState.selectedProjectId.value;
  const selectedUnitId = unitSelectedState.unitId.value;
  const [statusList, setStatusList] = useState<ParcelStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginate, setPaginate] = useState<Paginate>({...defaultPaginate});
  const [selectedStatusId, setSelectedStatusId] = useState<number>();
  const [parcels, setParcels] = useState<ParcelList[]>([]);
  const {width} = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      selectedStatusId && loadAfterBack(selectedStatusId);
    }, [selectedStatusId]),
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getParcelStatusList();
      setStatusList(sortByOrderList(data));
      const {statusId} = data.find(e => e.isDefault) || data[0];
      setSelectedStatusId(statusId);
      await onSelectedParcelStatus(statusId);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const loadAfterBack = async (selectedStatusId: number) => {
    try {
      setIsLoading(true);
      const [newParcelStatus, newParcels] = await Promise.all([
        getParcelStatusList(),
        getParcelsByStatus(
          selectedStatusId,
          defaultPaginate.limit,
          defaultPaginate.page,
        ),
      ]);
      setStatusList(newParcelStatus);
      setParcels(newParcels.data);
      setPaginate(newParcels.paginate);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      const parcelStatus = selectedStatusId ?? statusList[0].statusId;
      const [newParcelStatus, newParcels] = await Promise.all([
        getParcelStatusList(),
        getParcelsByStatus(
          parcelStatus,
          defaultPaginate.limit,
          defaultPaginate.page,
        ),
      ]);
      setStatusList(newParcelStatus);
      setParcels(newParcels.data);
      setPaginate(newParcels.paginate);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  const getParcelStatusList = async () => {
    try {
      const {data} = await serviceMindService.parcelStatusList(
        selectedProjectId,
        selectedUnitId,
      );
      return data.data as ParcelStatus[];
    } catch (error) {
      return [];
    }
  };

  const getParcelsByStatus = async (
    parcelStatus: number,
    limit: number,
    page: number,
  ) => {
    const {data} = await serviceMindService.parcels(
      selectedProjectId,
      selectedUnitId,
      parcelStatus,
      page,
      limit,
    );
    return data;
  };

  const onSelectedParcelStatus = async (parcelStatus: number) => {
    try {
      const [statusListResp, parcelsResp] = await Promise.all([
        getParcelStatusList(),
        getParcelsByStatus(
          parcelStatus,
          defaultPaginate.limit,
          defaultPaginate.page,
        ),
      ]);
      setStatusList(sortByOrderList(statusListResp));
      setParcels(parcelsResp.data);
      setPaginate(parcelsResp.paginate);
      listRef.current &&
        listRef.current.scrollToIndex({animated: true, index: 0});
    } catch (error) {}
  };

  const sortByOrderList = (list: ParcelStatus[]): ParcelStatus[] => {
    return list.sort((a, b) => a.listOrder - b.listOrder);
  };

  const tabClassName = (index: number) =>
    clsx(
      getTheme('leading-[17.6px] justify-center flex-row items-center px-4'),
      getTheme(
        selectedStatusId === index
          ? 'border-b border-dark-teal-dark'
          : 'border-b border-line',
      ),
    );

  const onPress = (id: string) => {
    // Update the read status if it has not been read yet.
    const parcel = parcels.find(e => e.id === id && !e.readStatus);
    if (parcel) {
      setParcels(prev =>
        prev.map(e => (e.id === id ? {...e, readStatus: true} : e)),
      );

      // decrease unreadParcelCount
      selectedStatusId &&
        setStatusList(prev =>
          prev.map(e =>
            e.statusId === selectedStatusId
              ? {
                  ...e,
                  unreadParcelCount:
                    e.unreadParcelCount >= 1
                      ? e.unreadParcelCount - 1
                      : e.unreadParcelCount,
                }
              : e,
          ),
        );
    }
  };

  const parcelCountFormat = (count: number) => (count > 99 ? '99+' : count);

  const onScrollParcelBox = async (event: NativeScrollEvent) => {
    if (isCloseToBottom(event) && !isLoading) {
      await fetchNextParcelsPage();
    }
  };

  const fetchNextParcelsPage = async () => {
    try {
      if (!selectedStatusId) return;
      if (parcels.length >= paginate.total) return;
      setIsLoading(true);
      const page = paginate.page + 1;
      const data = await getParcelsByStatus(
        selectedStatusId,
        paginate.limit,
        page,
      );
      setParcels(prev => [...prev, ...data.data]);
      setPaginate(data.paginate);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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

  const mappingStatusLanguage = (status: string) => {
    switch (status) {
      case 'Received':
        return t('Residential__Parcel_Box__Received', 'New');
      case 'Delivered':
        return t('Residential__Parcel_Box__Delivered', 'Success');
      case 'Returned':
        return t('Residential__Parcel_Box__Returned', 'Return');
      case 'Return':
        return t('Residential__Parcel_Box__Returned', 'Return');
      case 'Pick Up':
        return t('Residential__Parcel_Box__Pick_up', 'Pick Up');
      case 'Picked Up':
        return t('Residential__Parcel_Box__Pick_up', 'Pick Up');
      default:
        return status;
    }
  };

  const onPressStatus = (statusId: number) => {
    setSelectedStatusId(statusId);
    onSelectedParcelStatus(statusId);
  };

  return (
    <ScreenContainer
      isLoading={isLoading}
      bgColor="#ffffff"
      barStyle="dark-content">
      <View className="w-full bg-white">
        <Header
          leftAction="goBack"
          title={t('Residential__Home__Mail_And_Parcel', 'Mail & Parcel')}
          bgColor="bg-white"
          titleColor="dark-gray"
          leftColor={'#292929'}
          iconHeight={25}
          iconWidth={25}
        />
        <Spacing height={8} />
      </View>

      <View className={getTheme('bg-default flex w-full')}>
        <Spacing height={16} />

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex flex-row">
            {statusList.map(({statusId, statusName, unreadParcelCount}) => (
              <TouchableOpacity
                key={statusId}
                onPress={() => onPressStatus(statusId)}
                className={tabClassName(statusId)}
                style={{
                  height: 47,
                  minWidth: width / 3,
                  flexBasis: 'auto',
                  gap: 10,
                }}>
                <Text
                  className="leading-[22px]"
                  color={
                    selectedStatusId === statusId
                      ? 'dark-teal'
                      : 'subtitle-muted'
                  }
                  weight={selectedStatusId === statusId ? 'medium' : 'regular'}>
                  {mappingStatusLanguage(statusName)}
                </Text>
                {unreadParcelCount >= 1 && (
                  <View
                    className={getTheme(
                      `${
                        selectedStatusId === statusId
                          ? 'bg-dark-teal-dark'
                          : 'bg-subtitle-muted-dark'
                      } p-1 px-2 h-[20px] justify-center items-center`,
                    )}>
                    <Text
                      color="white"
                      size="B2"
                      className={
                        Platform.OS === 'ios'
                          ? 'leading-[16px]'
                          : 'leading-[13px]'
                      }>
                      {parcelCountFormat(unreadParcelCount)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Spacing height={12} />
      </View>
      <View
        style={{flex: 1, flexGrow: 1}}
        className={getTheme('bg-vp-list z-10 w-full')}>
        <ParcelBoxList
          ref={listRef}
          parcels={parcels}
          onPress={onPress}
          isLoading={isLoading}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          onScroll={onScrollParcelBox}
        />
      </View>
    </ScreenContainer>
  );
};

export default ParcelBoxScreen;
