import {
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Text, Spacing} from '~/components/atoms';
import {isTablet} from '../utils/device';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import {StickyButton} from '../components';
import {BookingStatus} from './AmenityBookingDetailScreen';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import dayjs from 'dayjs';
import DateTime from '~/utils/datetime';
import DatetimeParser from '../utils/reformatter/datetime';
import {useFocusEffect} from '@react-navigation/native';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {logScreenView} from '~/utils/logGA';
// import {Facility} from '../components/AmenityBooking/CreateAmenityBookingFirstStep';

type FacilityUtility = {
  _id: string;
  amount: number;
  id: {
    _id: string;
    nameTh: string;
    nameEn: string;
    icon: string;
    isFixed: boolean;
    deleted: boolean;
    _search: string;
    __v: number;
  };
};
type Editor = {
  _id: string;
  id: string;
  email: string;
  displayName: string;
  ssoProviders: null;
};

type TFacilityConditionQuota = {
  currentMonth: number;
  nextMonth: number;
  twoMonthsLater: number;
};

type TFacilityConditionDetail = {
  textCondition: string;
  textConditionEn: string;
  minPeriod: number;
  maxPeriod: number;
  advanceBooking: number;
  capacity: number;
};

type Condition = {
  reserve: {
    _id: string;
    __t: string;
    __v: number;
    name: string;
    enabled: boolean;
    deleted: boolean;
    details: string;
    checkinTimeAllow: null;
    isApproveRequired: boolean;
    isCheckinRequired: boolean;
    isInvitation: boolean;
    reserveTimeLimit: string;
    releaseTime: string;
    isIndividually: boolean;
    isAllowSameTime: boolean;
    isAllowExtendTime: boolean;
    cluster: string;
    facilities: string[];
    advanceBooking: number;
    period: {
      start: string;
      end: string;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
  quota: TFacilityConditionQuota;
  condition: TFacilityConditionDetail;
};

type Facility = {
  _id: string;
  id: string;
  __v: number;
  name: string;
  nameTh: string;
  nameEn: string;
  details: string;
  type: string;
  utilities: FacilityUtility[];
  area: {
    _id: string;
    id: string;
    name: string;
    th: string;
    en: string;
  };
  areadetail: {
    _id: string;
    id: string;
    name: string;
    th: string;
    en: string;
  };
  sync: any[];
  deleted: boolean;
  image: string;
  imageUrl: string;
  imageBase64: string;
  thumbnailUrl: string;
  condition: Condition;
  createdAt: string;
  updatedAt: string;
  createdBy: Editor;
  updatedBy: Editor;
};
type PersonAccess = {
  _id: string;
  type: string;
  data: string;
  timestamp: string;
};
type Person = {
  _id: string;
  name: string;
  email: string;
  isOrganizer: boolean;
  isAttendee: boolean;
  access: PersonAccess[];
};
type AmenityBooking = {
  _id: string;
  displayId: number;
  type: string;
  service: string;
  statuses: {
    currentStatus: BookingStatus;
    timeline: any[];
  };
  title: string;
  isSync: boolean;
  isHook: boolean;
  isInvite: boolean;
  isOnlineMeeting: boolean;
  details: string;
  start: string;
  end: string;
  persons: Person[];
  facilities: Facility[];
  createdBy: string;
  deleted: boolean;
  __t: string;
  ref_: string;
  createdAt: string;
  updatedAt: string;
  initial_start: string;
  initial_end: string;
  __v: number;
  updatedBy: string;
};

type Tab = 'Booking' | 'History';

const doneStatuses: BookingStatus[] = [BookingStatus.CHECKED_OUT];
const cancelledStatuses: BookingStatus[] = [
  BookingStatus.RELEASED,
  BookingStatus.CANCELED,
  BookingStatus.REJECTED,
];

const GET_BOOKINGS_START_YEAR = dayjs().startOf('year').format('YYYY-MM-DD');
const GET_BOOKINGS_START_DATE = dayjs().format('YYYY-MM-DD');
const GET_BOOKINGS_END_DATE = dayjs()
  .add(60, 'day')
  .set('hour', 23)
  .set('minute', 59)
  .set('second', 59)
  .format('YYYY-MM-DDTHH:mm:ss');

const AmenityBookingHomeScreen = () => {
  const navigation = useNavigation();
  const bookingListRef = useRef<ScrollView>(null);
  const [selectedTab, setSelectedTab] = useState<Tab>('Booking');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [amenityBookings, setAmenityBookings] = useState<AmenityBooking[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageBooing, setPageBooking] = useState(1);
  const [pageHistory, setPageHistory] = useState(1);

  useEffect(() => {
    logScreenView('AmenityBookingHomeScreen');
  }, []);

  useFocusEffect(
    useCallback(() => {
      preload(selectedTab);
      setPageBooking(1);
      setPageHistory(1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab]),
  );

  const preload = async (selectedTab: Tab) => {
    try {
      setIsLoading(true);
      const bookings = await getAmenityBookings(selectedTab);
      setAmenityBookings(bookings);
      if (bookingListRef.current) {
        await sleep(100);
        bookingListRef.current.scrollTo({y: 0, animated: true});
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const bookings = await getAmenityBookings(selectedTab);
      setAmenityBookings(bookings);
      setPageBooking(1);
      setPageHistory(1);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const getAmenityBookings = async (selectedTab: Tab) => {
    return await getAmenityBookingsByStatus(selectedTab === 'History');
  };

  const sleep = (ms: number) =>
    new Promise<void>(resolve => setTimeout(resolve, ms));

  const getAmenityBookingsByStatus = async (
    history: boolean,
  ): Promise<AmenityBooking[]> => {
    const params: {
      start: string;
      end: string;
      history: boolean;
      status?: string;
      page: number;
      perpage: number;
    } = {
      start: history ? GET_BOOKINGS_START_YEAR : GET_BOOKINGS_START_DATE,
      end: history
        ? dayjs().format('YYYY-MM-DDTHH:mm:ss')
        : GET_BOOKINGS_END_DATE,
      history,
      page: 1,
      perpage: 10,
    };
    const {data} = await serviceMindService.getAmenityBookings(params);
    const bookings = data as AmenityBooking[];
    return bookings;
  };

  const checktab = selectedTab === 'Booking' ? pageBooing : pageHistory;
  const loadMoreData = async () => {
    if (isLoadingMore) return; // Prevent multiple triggers
    setIsLoadingMore(true);

    try {
      const params = {
        start:
          selectedTab == 'History'
            ? GET_BOOKINGS_START_YEAR
            : GET_BOOKINGS_START_DATE,
        end: GET_BOOKINGS_END_DATE,
        history: selectedTab == 'History' ? true : false,
        page: checktab + 1, // Update this dynamically based on your pagination logic
        perpage: 10,
      };
      let {data} = await serviceMindService.getAmenityBookings(params);
      if (data.length > 0) {
        // data = (data as AmenityBooking[]).sort(
        //   (a, b) =>
        //     stringToTimestamp(a.createdAt) - stringToTimestamp(b.createdAt),
        // );
        amenityBookings.push(...data);
        if (selectedTab === 'Booking') {
          setPageBooking(checktab + 1);
        } else {
          setPageHistory(checktab + 1);
        }
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  const handleScroll = async ({nativeEvent}: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isNearBottom && !isLoadingMore) {
      await loadMoreData();
    }
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t('Residential__Amenity_Booking', 'Book Amenity')}
          bgColor="bg-white"
          titleColor="dark-gray"
          // leftColor="#292929"
          onPressLeftAction={() => navigation.goBack()}
        />
        <View
          className={
            isTablet
              ? getTheme('w-[780px] flex flex-1 bg-white relative')
              : getTheme('w-full flex flex-1 bg-white relative')
          }>
          <View className="pb-10 flex flex-1">
            <View className="px-5">
              {/* <HeadText
                title={t('Residential__Amenity_Booking', 'Create Booking')}
                tagline={t('General__Residential', 'Residences')}
                taglineColor="subtitle-muted"
                titleClamps="leading-[44px]"
              /> */}

              {/* <Text className="text-subtitle-muted-light mt-2">
                {t(
                  'Residential__Amenity_Booking__subtitle',
                  'You can easily arrange a booking for the facility room',
                )}
              </Text> */}
            </View>
            <View className={'flex flex-row px-4 mt-4'}>
              <Pressable
                onPress={() => {
                  setSelectedTab('Booking');
                  setPageHistory(1);
                }}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === 'Booking'
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={selectedTab === 'Booking' ? 'medium' : 'regular'}
                  color={
                    selectedTab === 'Booking' ? 'dark-teal' : 'subtitle-muted'
                  }>
                  {t('Residential__Amenity_Booking__Booking', 'Booking')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedTab('History');
                  setPageBooking(1);
                }}
                className={`flex-1 flex-row justify-center py-3 border-b ${
                  selectedTab === 'History'
                    ? 'border-dark-teal-light'
                    : 'border-line-light'
                }`}>
                <Text
                  size="B1"
                  weight={selectedTab === 'History' ? 'medium' : 'regular'}
                  color={
                    selectedTab === 'History' ? 'dark-teal' : 'subtitle-muted'
                  }>
                  {t('Residential__Amenity_Booking__History', 'History')}
                </Text>
              </Pressable>
            </View>
            {amenityBookings.length === 0 ? (
              !isLoading && (
                <View className="flex flex-col p-4 h-full" style={{gap: 12}}>
                  {EmptyAmenityBooking()}
                </View>
              )
            ) : (
              <View className="flex flex-col p-4" style={{gap: 12}}>
                <AmenityBookingList
                  bookings={amenityBookings}
                  ref={bookingListRef}
                  tab={selectedTab}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  onScroll={handleScroll}
                  isLoadingMore={isLoadingMore}
                />
              </View>
            )}
          </View>
        </View>
      </ScreenContainer>
      <StickyButton
        title={t(
          'Residential__Amenity_Booking__Create_New_Booking',
          'Create Booking',
        )}
        rightIcon="next"
        color="dark-teal"
        onPress={() =>
          navigation.navigate('AmenityBookingCreateScreen', {
            availableTimeList: [],
          })
        }
      />
    </>
  );
};
export default AmenityBookingHomeScreen;

const EmptyAmenityBooking = () => {
  return (
    <View className=" bg-white">
      <View className="flex flex-col items-center h-full">
        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <Text
            weight="medium"
            size="H3"
            color="dark-gray"
            className="mt-[70%]">
            {t(
              'Residential__Amenity_Booking__No_booking_created',
              'No booking',
            )}
          </Text>
        ) : (
          <Text
            weight="medium"
            size="H3"
            color="dark-gray"
            className="mt-[50%]">
            {t(
              'Residential__Amenity_Booking__No_booking_created',
              'No booking',
            )}
          </Text>
        )}
        {/* <Text color="mist-gray-700">
          {t(
            'Residential__Amenity_Booking__No_booking_created_subtitle',
            'You haven’t created any ticket yet.',
          )}
        </Text> */}
      </View>
      <Spacing height={300} />
    </View>
  );
};

type AmenityBookingListProps = {
  bookings: AmenityBooking[];
  refreshing: boolean;
  tab: string;
  onRefresh: () => void;
  onScroll: (event: {nativeEvent: any}) => void;
  isLoadingMore: boolean;
};
const AmenityBookingList = React.forwardRef<
  ScrollView,
  AmenityBookingListProps
>(({bookings, refreshing, tab, onRefresh, onScroll, isLoadingMore}, ref) => {
  return (
    <ScrollView
      className="pt-4"
      showsVerticalScrollIndicator={false}
      ref={ref}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={onScroll}
      scrollEventThrottle={16} // Adjust for better performance
    >
      {bookings.map(booking => (
        <AmenityBookingCard booking={booking} tab={tab} key={booking._id} />
      ))}
      {isLoadingMore && (
        <View className="flex items-center py-4">
          <Text>Loading more...</Text>
        </View>
      )}
      <Spacing height={300} />
    </ScrollView>
  );
});

type AmenityBookingCardProps = {
  booking: AmenityBooking;
  tab: string;
};
const AmenityBookingCard = ({booking, tab}: AmenityBookingCardProps) => {
  const navigation = useNavigation();
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

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
      const timestamp = new Date(date).getTime();
      return t('General__date_time', '{{date}} at {{time}}', {
        date: DatetimeParser.toDMY({language, timestamp}),
        time: DatetimeParser.toHM({language, timestamp}),
      });
    }
  };

  const stringToTimestamp = (datetime: string) => {
    try {
      return dayjs(datetime).utcOffset(7).valueOf();
    } catch (error) {
      return 0;
    }
  };

  const getBuilding = (facility: Facility) => {
    try {
      return language === 'th'
        ? facility.areadetail.th.split('|')[0]
        : facility.areadetail.en.split('|')[0];
    } catch (error) {
      return '-';
    }
  };

  const getFloor = (facility: Facility) => {
    try {
      let floor = facility.areadetail.en.split('|')[1].trim();
      if (language === 'th') {
        floor = facility.areadetail.th.split('|')[1].trim();
      }
      return floor;
    } catch (error) {
      return facility.areadetail.en.split('|')[1].trim() ?? '-';
    }
  };

  const getName = (facility: Facility) => {
    try {
      return language === 'th' ? facility.nameTh : facility.nameEn;
    } catch (error) {
      return '-';
    }
  };

  return (
    <TouchableOpacity
      id={booking._id}
      onPress={() => {
        navigation.navigate('AmenityBookingDetailScreen', {
          booking,
          tab,
        });
      }}
      className="flex flex-col w-full bg-white py-[20px] px-[16px] border-[1px] border-[#DCDCDC] mb-[12px]">
      <View className="flex flex-row items-center justify-between w-full mb-[16px]">
        <Text weight="regular" color="dark-gray">
          {/* #{booking._id} */}
        </Text>
        <StatusBadge status={booking.statuses.currentStatus} tab={tab} />
      </View>
      <Text
        weight="medium"
        color="dark-gray"
        className="mb-[24px]"
        numberOfLines={3}>
        {getName(booking.facilities[0])}
      </Text>
      <Text size="B2" color="dark-gray" className="">
        {DatetimeParser.toDMY({
          language,
          timestamp: stringToTimestamp(booking.start),
        })}
        ,{' '}
        {`${DatetimeParser.toHM({
          language,
          timestamp: stringToTimestamp(booking.start),
        })} - ${DatetimeParser.toHM({
          language,
          timestamp: stringToTimestamp(booking.end),
        })}`}
      </Text>
      <Text size="B2" color="dark-gray" className="">
        {getBuilding(booking.facilities[0])}
      </Text>
      <View className="flex flex-row items-center justify-between w-full">
        <Text size="B2" color="dark-gray" className="">
          {getFloor(booking.facilities[0])}
        </Text>
        <Text size="B2" color="dark-gray" className="">
          {getDiffDateTimeText(booking.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type StatusBadgeProps = {
  status: BookingStatus;
  tab: string;
};
export const StatusBadge = ({status, tab}: StatusBadgeProps) => {
  const isDone = doneStatuses.some(e => e === status);
  const isCancelled = cancelledStatuses.some(e => e === status);
  const isTabSpecific = tab === 'History';

  if (isDone) {
    return (
      <View className="p-[8px] border-[1px] border-[#DCDCDC]">
        <Text color="dark-gray" size="C1">
          {t('Residential__Amenity_Booking__Done', 'Completed')}
        </Text>
      </View>
    );
  } else if (isCancelled) {
    return (
      <View className="p-[8px] border-[1px] border-[#DCDCDC]">
        <Text color="dark-gray" size="C1">
          {t('Residential__Amenity_Booking__Cancelled', 'Cancelled')}
        </Text>
      </View>
    );
  } else if (isTabSpecific) {
    return (
      <View className="p-[8px] border-[1px] border-[#DCDCDC]">
        <Text color="dark-gray" size="C1">
          {t('Residential__Amenity_Booking__Done', 'Done')}
        </Text>
      </View>
    );
  } else {
    return (
      <View className="p-[8px] border-[1px] border-[#DCDCDC]">
        <Text color="dark-gray" size="C1">
          {t('Residential__Amenity_Booking__Confirmed', 'Confirmed')}
        </Text>
      </View>
    );
  }
};
