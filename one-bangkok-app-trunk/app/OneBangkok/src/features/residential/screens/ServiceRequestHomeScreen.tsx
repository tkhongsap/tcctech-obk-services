import {
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  NativeScrollEvent,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Text, Spacing} from '~/components/atoms';
import {HeadText, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  getServiceRequestAppStatus,
  ServiceRequest,
  ServiceRequestAppStatus,
  ServiceRequestStatusBadge,
  ServiceRequestTab,
} from './ServiceRequestDetailScreen';
import DateTime from '~/utils/datetime';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import DatetimeParser from '../utils/reformatter/datetime';
import {useFocusEffect} from '@react-navigation/native';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';

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

const ServiceRequestHomeScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<ServiceRequestTab>(
    ServiceRequestTab.CURRENT,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState<Paginate>(defaultPaginate);
  const [refreshing, setRefreshing] = useState(false);
  const [currentRequests, setCurrentRequests] = useState<ServiceRequest[]>([]);
  const [pastRequests, setPastRequests] = useState<ServiceRequest[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<UnitDetail[]>([]);

  useFocusEffect(
    useCallback(() => {
      preload();
    }, []),
  );

  const preload = async (retry: number = 2) => {
    try {
      setIsLoading(true);
      const [{_requests, _paginate}, _propertyDetails] = await Promise.all([
        getServiceRequestList({
          currentPage: paginate.current_page,
          perPage: paginate.per_page,
        }),
        getAllPropertyDetails(),
      ]);
      setPropertyDetails(_propertyDetails);
      setPaginate(_paginate);
      const {currents, pasts} = mapToRequestTab(
        mapRequestPropertyDetail(_requests, _propertyDetails),
      );
      setCurrentRequests(currents);
      setPastRequests(pasts);
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

  const mapRequestPropertyDetail = (
    requests: ServiceRequest[],
    propertyDetails: UnitDetail[],
  ) => {
    try {
      return requests.map(request => {
        const property = propertyDetails.find(
          e => e.propertyUnitId === request.reportedByUnitId,
        );
        return {
          ...request,
          floorName: property?.floors[0].floorZoneCode ?? '-',
          projectNameThai:
            property?.projectsNameThai ?? request.reportedByProjectName,
        };
      });
    } catch (error) {
      return requests;
    }
  };

  const mapToRequestTab = (requests: ServiceRequest[]) => {
    try {
      const currents: ServiceRequest[] = [];
      const pasts: ServiceRequest[] = [];

      for (const request of requests) {
        const appStatus = getServiceRequestAppStatus(request.statusCode);
        if (
          appStatus === ServiceRequestAppStatus.DONE ||
          appStatus === ServiceRequestAppStatus.CANCELLED
        ) {
          pasts.push({...request, appStatus, tab: ServiceRequestTab.PAST});
        } else {
          currents.push({
            ...request,
            appStatus,
            tab: ServiceRequestTab.CURRENT,
          });
        }
      }
      return {currents, pasts};
    } catch (error) {
      return {currents: [], pasts: []};
    }
  };

  const getServiceRequestList = async (payload: {
    currentPage: number;
    perPage: number;
  }): Promise<{_requests: ServiceRequest[]; _paginate: Paginate}> => {
    const {data} = await serviceMindService.serviceRequestList(payload);
    const {data: _requests, ..._paginate} = data;
    return {_requests, _paginate};
  };

  const onPressCard = (request: ServiceRequest) => {
    navigation.navigate('ServiceRequestDetailScreen', {request});
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const {_requests, _paginate} = await getServiceRequestList({
        currentPage: defaultPaginate.current_page,
        perPage: defaultPaginate.per_page,
      });
      setPaginate(_paginate);
      const {currents, pasts} = mapToRequestTab(
        mapRequestPropertyDetail(_requests, propertyDetails),
      );
      setCurrentRequests(currents);
      setPastRequests(pasts);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
    }
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
      screenHook: 'ServiceRequestHomeScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ServiceRequestHomeScreen'),
    });
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
      paginate.total > currentRequests.length + pastRequests.length
    ) {
      getNextRequestPage();
    }
  };

  const getNextRequestPage = async () => {
    try {
      setIsLoading(true);
      const {_requests, _paginate} = await getServiceRequestList({
        currentPage: paginate.current_page + 1,
        perPage: paginate.per_page,
      });
      setPaginate(_paginate);
      const {currents, pasts} = mapToRequestTab(
        mapRequestPropertyDetail(_requests, propertyDetails),
      );
      setCurrentRequests(prev => [...prev, ...currents]);
      setPastRequests(prev => [...prev, ...pasts]);
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
        <Header leftAction="goBack" />
        <View className={getTheme('w-full flex-1 bg-white relative')}>
          <View className="pb-10 flex flex-1">
            <View className="px-5">
              <HeadText
                title={t('Residential__Service_request', 'Service request')}
                tagline={t('General__Residential', 'Residences')}
                taglineColor="subtitle-muted"
              />
              <Text className="text-subtitle-muted-light mt-2">
                {t(
                  'Residential__Service_request__des',
                  'Easily create service tickets for requesting resolution of any issue you encounter',
                )}
              </Text>
            </View>
            <View className={'flex flex-row px-4 mt-4'}>
              <Pressable
                onPress={() => setSelectedTab(ServiceRequestTab.CURRENT)}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === ServiceRequestTab.CURRENT
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={
                    selectedTab === ServiceRequestTab.CURRENT
                      ? 'medium'
                      : 'regular'
                  }
                  color={
                    selectedTab === ServiceRequestTab.CURRENT
                      ? 'dark-teal'
                      : 'subtitle-muted'
                  }>
                  {t('Residential__Service_request__Current', 'Current')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedTab(ServiceRequestTab.PAST)}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === ServiceRequestTab.PAST
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={
                    selectedTab === ServiceRequestTab.PAST
                      ? 'medium'
                      : 'regular'
                  }
                  color={
                    selectedTab === ServiceRequestTab.PAST
                      ? 'dark-teal'
                      : 'subtitle-muted'
                  }>
                  {t('Residential__Service_request__Past', 'Past')}
                </Text>
              </Pressable>
            </View>
            <View className="flex flex-col p-4 mt-4 h-full" style={{gap: 12}}>
              <ScrollView
                className="bg-white"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshControl={
                  <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                  />
                }
                onScroll={({nativeEvent}) => onScroll(nativeEvent)}>
                {selectedTab === ServiceRequestTab.CURRENT &&
                  (currentRequests.length === 0 ? (
                    !isLoading && <EmptySRList />
                  ) : (
                    <>
                      {currentRequests.map(request => (
                        <SRCard
                          key={request.id}
                          request={request}
                          onPress={onPressCard}
                          disabled={isLoading}
                        />
                      ))}
                      <Spacing height={300} />
                    </>
                  ))}
                {selectedTab === ServiceRequestTab.PAST &&
                  (pastRequests.length === 0 ? (
                    !isLoading && <EmptySRList />
                  ) : (
                    <>
                      {pastRequests.map(request => (
                        <SRCard
                          key={request.id}
                          request={request}
                          onPress={onPressCard}
                          disabled={isLoading}
                        />
                      ))}
                      <Spacing height={300} />
                    </>
                  ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t(
          'Residential__Service_request__Create_new_ticket',
          'Create new',
        )}
        rightIcon="next"
        color="dark-teal"
        onPress={() => navigation.navigate('ServiceRequestCreateScreen')}
      />
    </>
  );
};
export default ServiceRequestHomeScreen;

const EmptySRList = () => {
  return (
    <View className="flex flex-col items-center h-full">
      <Text weight="medium" size="H3" color="dark-gray" className="mt-[167px]">
        {t(
          'Residential__Service_request__No_requests_created',
          'No requests created',
        )}
      </Text>
      <Text color="mist-gray-700">
        {t(
          'Residential__Service_request__No_requests_created_des',
          'You haven’t created any ticket yet.',
        )}
      </Text>
    </View>
  );
};

interface SRCardProps {
  request: ServiceRequest;
  onPress: (request: ServiceRequest) => void;
  disabled?: boolean;
}
const SRCard = ({request, onPress, disabled}: SRCardProps) => {
  const language =
    appLanguageState.currentLanguage.value ??
    appLanguageState.defaultLanguage.value;
  return (
    <TouchableOpacity
      key={request.id}
      className="flex flex-col w-full bg-white py-[20px] px-[16px] border-[1px] border-[#DCDCDC] mb-[12px]"
      onPress={() => onPress(request)}
      disabled={disabled}>
      <View className="flex flex-row items-center justify-between w-full mb-[16px]">
        <Text weight="medium" color="dark-gray">
          #{request.displayId}
        </Text>
        <ServiceRequestStatusBadge appStatus={request.appStatus} />
      </View>
      <Text weight="medium" color="dark-gray" className="mb-[24px]">
        {request.serviceRequestTypeName}
      </Text>
      <Text size="B2" color="dark-gray" className="">
        {language === 'th'
          ? request.projectNameThai
          : request.reportedByProjectName}
      </Text>
      <Text color="dark-gray" className="my-[2px]">
        {request.reportedByHouseNumber}
      </Text>
      <View className="flex flex-row items-center justify-between w-full">
        <Text size="B2" color="dark-gray" className="">
          {t('General__Floor', 'Floor')} {request.floorName}
        </Text>
        <Text size="B2" color="dark-gray" className="">
          {getDiffDateTimeText(parseInt(request.createdAt))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getDiffDateTimeText = (date: string | number | Date) => {
  const current = DateTime.getCurrentDateTime();

  let diff = DateTime.getDateDiff(date, current.toDate(), 'seconds');
  if (diff <= 60) {
    return t('General__Just_now', 'Just now');
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'minutes');
  if (diff <= 60) {
    return t('General__mins_ago', '{{min}} mins ago', {min: diff});
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'hours');
  if (diff <= 24) {
    return t('General__hours_ago', '{{hour}} hours ago', {hour: diff});
  } else {
    const language = appLanguageActions.getLanguage() || 'en';
    const timestamp = new Date(date).getTime();
    return t('General__date_time', '{{date}} at {{time}}', {
      date: DatetimeParser.toDMY({language, timestamp}),
      time: DatetimeParser.toHM({language, timestamp}),
    });
  }
};
