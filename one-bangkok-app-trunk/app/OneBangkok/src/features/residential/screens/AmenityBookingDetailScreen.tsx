import {View, ScrollView, TouchableOpacity} from 'react-native';
import {ScreenContainer} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing, Text} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import ContactConciergeModal from '~/features/residential/components/AmenityBooking/ContactConciergeModal';
import CancelAmenityBookingModal from '~/features/residential/components/AmenityBooking/CancelAmenityBookingModal';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';
// import {StatusBadge} from './AmenityBookingHomeScreen';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {phoneCall} from '../utils/phoneCall';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  Facility,
  FacilityUtility,
} from '../components/AmenityBooking/CreateAmenityBookingFirstStep';
import {logEvent} from '~/utils/logGA';

export enum BookingStatus {
  INITIALIZED = 'initialized',
  APPROVED = 'approved',
  CHECKED_IN = 'checkedin',
  CHECKED_OUT = 'checkedout',
  RELEASED = 'released',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
}

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

export type BookingFacility = {
  _id: string;
  name: string;
  nameTh: string;
  nameEn: string;
  type: string;
  condition: {
    reserve: string;
  };
  utilities: FacilityUtility[];
};

export type AmenityBooking = {
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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AmenityBookingDetailScreen'
>;

const AmenityBookingDetailScreen = ({
  route: {
    params: {booking, tab},
  },
}: Props) => {
  const navigation = useNavigation();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const [isLoading, setIsLoading] = useState(false);
  const [liveChatAvatar, setLiveChatAvatar] = useState<string>('');
  const [conciergePhoneNumber, setConciergePhoneNumber] = useState<string>('');
  const [dataFacilities, setDataFacilities] = useState<AmenityBooking>();
  const [isCancelled, setIsCancelled] = useState(false);
  useEffect(() => {
    preload();
    setIsCancelled(tab == 'History' ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preload = async () => {
    try {
      setIsLoading(true);
      const {status, data} =
        await serviceMindService.getAmenityBookingFacilitiesId(booking._id);

      if (status == 200) {
        console.log('getAmenityBookingFacilitiesId -------->', data);
        setDataFacilities(data);
      }
      const [_liveChatAvatar, _conciergePhoneNumber] = await Promise.all([
        residentialTenantAction.getLiveChatAvatar(),
        residentialTenantAction.getContactConciergePhoneNumber(),
      ]);
      _liveChatAvatar && setLiveChatAvatar(_liveChatAvatar);
      _conciergePhoneNumber && setConciergePhoneNumber(_conciergePhoneNumber);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onPressContactConciergeModal = () => {
    modalActions.setContent(
      <ContactConciergeModal
        onPressLiveChat={() => {
          logEvent('button_click', {
            screen_name: 'AmenityBookingDetailScreen',
            feature_name: 'Live Chat with Concierge/Juristic',
            action_type: 'click',
            bu: 'Residential',
          });
          navigation.navigate('ResidentialLiveChatScreen', {
            conciergeAvatar: liveChatAvatar,
          });
        }}
        phoneNumber={conciergePhoneNumber}
        onPressContactConcierge={() => phoneCall(conciergePhoneNumber)}
      />,
    );
    modalActions.show();
  };

  const onPressCancelAmenityBookingModal = () => {
    modalActions.setContent(
      <CancelAmenityBookingModal onConfirm={cancelBooking} />,
    );
    modalActions.show();
  };

  const cancelBooking = async () => {
    try {
      setIsLoading(true);
      const {status} = await serviceMindService.updateAmenityBooking({
        id: booking._id,
        statuses: {currentStatus: 'canceled'},
      });
      if (status === 200) {
        navigation.goBack();
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const stringToTimestamp = (datetime: string) => {
    try {
      return new Date(datetime).getTime();
    } catch (error) {
      return 0;
    }
  };
  const getName = (facility: Facility) => {
    try {
      return language == 'th' ? facility.nameTh : facility.nameEn;
    } catch (error) {
      return '-';
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
      screenHook: 'AmenityBookingDetailScreen',
      buttonColor: 'dark-teal',
      onPressBack: () =>
        navigation.navigate('AmenityBookingDetailScreen', {booking, tab}),
    });
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Amenity_Booking__Booking_Details',
          'Booking Details',
        )}
        bgColor="bg-white"
        titleColor="dark-gray"
        // leftColor="#292929"
      />
      <ScrollView className="w-full bg-[#FDFDFD]">
        <View className="px-4 pb-10 flex flex-col" style={{gap: 16}}>
          <View className="flex flex-row items-start justify-between w-full mb-[16px]">
            <View className="flex flex-col items-start">
              <Text size="B2" className="text-[#57756C]">
                {/* {t('Residential__Amenity_Booking__Booking_No', 'Booking No.')} */}
              </Text>
              {/* <Text size="B2" weight="regular">
                #{booking._id}
              </Text> */}
            </View>
            <StatusBadge status={booking.statuses.currentStatus} />
          </View>
          <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
            <View className="flex flex-row items-center justify-start py-[20px] w-full ">
              <Text weight="medium">
                {t(
                  'Residential__Amenity_Booking__Booking_Details',
                  'Booking Details',
                )}
              </Text>
            </View>
            <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
            <View
              className="py-[20px] flex flex-col items-start"
              style={{gap: 24}}>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('General__Building', 'Building')}
                </Text>
                <Text size="B2">
                  {dataFacilities?.facilities[0].area.name.split('|')[0]}
                </Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('General__Floor', 'Floor')}
                </Text>
                <Text>
                  {dataFacilities?.facilities[0].area.name.split('|')[1]}
                </Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('Residential__Amenity_Booking__Room_name', 'Room Name')}
                </Text>
                <Text>{getName(booking.facilities[0])}</Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('Residential__Amenity_Booking__Date', 'Date')}
                </Text>
                <Text>
                  {DatetimeParser.toDMY({
                    language,
                    timestamp: stringToTimestamp(booking.start),
                  })}
                </Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('Residential__Amenity_Booking__Time', 'Booking Time')}
                </Text>
                <Text>
                  {`${DatetimeParser.toHM({
                    language,
                    timestamp: stringToTimestamp(booking.start),
                  })} - ${DatetimeParser.toHM({
                    language,
                    timestamp: stringToTimestamp(booking.end),
                  })}`}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
            <View className="flex flex-row items-center justify-start py-[20px] w-full ">
              <Text weight="medium">
                {t('Residential__Amenity_Booking__Remark_des', 'Remark')}
              </Text>
            </View>
            <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
            <View
              className="py-[20px] flex flex-col items-start"
              style={{gap: 24}}>
              <View style={{gap: 4}}>
                <Text>{dataFacilities?.details}</Text>
              </View>
            </View>
          </View>
          {!isCancelled && (
            <TouchableOpacity
              className="w-full h-[48px] flex items-center justify-center border-[1px] border-[#014541] bg-[#E4E4E4]"
              onPress={onPressContactConciergeModal}
              disabled={isLoading}>
              <Text weight="medium" color="dark-teal">
                {t(
                  'Residential__Amenity_Booking__Contact_concierge',
                  'Contact Concierge',
                )}
              </Text>
            </TouchableOpacity>
          )}
          {!isCancelled && (
            <TouchableOpacity
              className="w-full h-[48px] flex items-center justify-center border-[1px] border-[#ED2015]"
              onPress={onPressCancelAmenityBookingModal}
              disabled={isLoading}>
              <Text weight="medium" color="error">
                {t(
                  'Residential__Amenity_Booking__Cancel_amenity_booking',
                  'Cancel Book Amenity',
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Spacing height={100} />
      </ScrollView>
    </ScreenContainer>
  );
};

const doneStatuses: BookingStatus[] = [BookingStatus.CHECKED_OUT];
const cancelledStatuses: BookingStatus[] = [
  BookingStatus.RELEASED,
  BookingStatus.CANCELED,
  BookingStatus.REJECTED,
];

type StatusBadgeProps = {
  status: BookingStatus;
};
export const StatusBadge = ({status}: StatusBadgeProps) => {
  const isDone = doneStatuses.some(e => e === status);
  const isCancelled = cancelledStatuses.some(e => e === status);

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
export default AmenityBookingDetailScreen;
