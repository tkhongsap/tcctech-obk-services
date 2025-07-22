import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import IconHome from '../../../assets/icons/icon-home.svg';
import IconElevator from '../../../assets/icons/icon-ob-elevator.svg';
import IconCalendar from '../../../assets/icons/icon-ob-calendar-outline.svg';
import IconVisitor from '../../../assets/icons/icon-ob-visitor-outline.svg';
import IconStarCalendar from '../../../assets/icons/icon-calendar-star.svg';
import IconSmile from '../../../assets/icons/icon-ob-smile-white.svg';
import {isTablet} from '../utils/device';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import {useResidentialUnitSelectedState} from '~/states/residentialTenant/residentialTenantState';
import dayjs from 'dayjs';
import serviceMindService from '~/services/residentialService/ServiceMindService';

type Action = 'LIFT_CALLING' | 'HOME_AUTOMATION' | 'AMENITY_BOOKING';
export type QuickAction = {
  icon: string;
  title: string;
  url: string;
  action: Action;
};

type ReminderUnitWiseCount = {
  unitId: string;
  projectId: string;
  count: string;
};
export type Reminder = {
  visitor: {
    total: string;
    unitWiseCount: ReminderUnitWiseCount[];
  };
  parcel: {
    total: string;
    unitWiseCount: ReminderUnitWiseCount[];
  };
};

type QuickActionProps = {
  quickActions: QuickAction[];
  reminder: Reminder;
};

export const QuickActions = ({quickActions, reminder}: QuickActionProps) => {
  const navigation = useNavigation();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const enableCallLift =
    firebaseConfigState.enable_residential_call_lift.value || false;
  const enableHomeAutomation =
    firebaseConfigState.enable_residential_home_automation.value || false;
  const enableAmenityBooking =
    firebaseConfigState.enable_residential_amenity_booking.value || false;
  const enableGuestManagement =
    firebaseConfigState.enable_residential_guest_management.value || false;
  const enableMailParcel =
    firebaseConfigState.enable_residential_mail_and_parcel.value || false;
  const newQuickActions = quickActions.filter(
    e => e.action !== 'AMENITY_BOOKING',
  );
  const amenityBooking = quickActions.find(e => e.action === 'AMENITY_BOOKING');
  const unitSelectedState = useResidentialUnitSelectedState();
  const unitId = unitSelectedState.unitId.value;
  const [parcelCount, setParcelCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [amenityCount, setAmenityCount] = useState(0);

  const GET_BOOKINGS_START_NOW = dayjs().format('YYYY-MM-DD');
  const GET_BOOKINGS_END_DATE = dayjs().add(60, 'day').format('YYYY-MM-DD');

  const fetchAmenityBookingsCount = async () => {
    const params = {
      start: GET_BOOKINGS_START_NOW,
      end: GET_BOOKINGS_END_DATE,
      history: false,
      page: 1,
      perpage: 10,
    };

    try {
      const response = await serviceMindService.getAmenityBookingsCount(params);
      const {total} = response.data;
      setAmenityCount(total);
    } catch (error) {
      console.error('Error fetching amenity bookings count:', error);
      setAmenityCount(0);
    }
  };

  useEffect(() => {
    fetchAmenityBookingsCount();
    const {visitor, parcel} = countByUnitId(reminder, unitId);
    setParcelCount(parcel);
    setVisitorCount(visitor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, reminder]);

  const getIcon = (action: Action) => {
    switch (action) {
      case 'LIFT_CALLING':
        return <IconElevator color="#FFFFFF" width="16" height="16" />;
      case 'HOME_AUTOMATION':
        return <IconHome color="#FFFFFF" width="16" height="16" />;
      case 'AMENITY_BOOKING':
        return <IconCalendar color="#FFFFFF" width="16" height="16" />;
      // case 'Smart Parking':
      //   return <IconCalendar color="#FFFFFF" width="16" height="16" />;
      // case 'Emergency call':
      //   return <IconMock color="#FFFFFF" width="18" height="18" />;
      default:
        return <></>;
    }
  };

  const getNavigation = (quickAction: QuickAction) => {
    const {action, title} = quickAction;
    switch (action) {
      case 'LIFT_CALLING':
        return enableCallLift
          ? navigation.navigate('ElevatorScreen')
          : navigation.navigate('RestrictedAccessScreen', {title});
      case 'HOME_AUTOMATION':
        return enableHomeAutomation
          ? navigation.navigate('AutomationHomeScreen')
          : navigation.navigate('RestrictedAccessScreen', {title});
      case 'AMENITY_BOOKING':
        return enableAmenityBooking
          ? navigation.navigate('AmenityBookingHomeScreen')
          : navigation.navigate('RestrictedAccessScreen', {title});
      default:
        return navigation.navigate('RestrictedAccessScreen', {title});
    }
  };

  const onPressGuestManagement = () => {
    return enableGuestManagement
      ? navigation.navigate('ResidentialVisitorPassScreen')
      : navigation.navigate('RestrictedAccessScreen', {
          title: t(
            'Residential__Home__Guest_Management_no_enter',
            'Guest Management',
          ),
        });
  };

  const onPressMailParcel = () => {
    return enableMailParcel
      ? navigation.navigate('ParcelBoxScreen')
      : navigation.navigate('RestrictedAccessScreen', {
          title: t('Residential__Home__Mail_And_Parcel', 'Mail & Parcel'),
        });
  };

  const onPressAmenityBooking = (title: string) => {
    return enableAmenityBooking
      ? navigation.navigate('AmenityBookingHomeScreen')
      : navigation.navigate('RestrictedAccessScreen', {title});
  };

  const countByUnitId = (reminder: Reminder, unitId: string) => {
    try {
      return {
        visitor: parseInt(
          reminder.visitor?.unitWiseCount?.find(e => e.unitId === unitId)
            ?.count ?? '0',
        ),
        parcel: parseInt(
          reminder.parcel?.unitWiseCount?.find(e => e.unitId === unitId)
            ?.count ?? '0',
        ),
      };
    } catch (error) {
      return {visitor: 0, parcel: 0};
    }
  };

  return (
    <View className="flex-1 flex-col py-8 bg-[#F4F6F7]">
      <View className="flex-1 flex-col px-4">
        <View className="flex flex-row justify-between items-center">
          <Text size="H4" color="default" weight="medium">
            {t('Residential__Home__Quick_Actions', 'Quick Actions')}
          </Text>
        </View>

        <View
          className="flex flex-row justify-between w-full h-fit mt-[16px]"
          style={{gap: 12}}>
          {newQuickActions.map(item => (
            <TouchableOpacity
              key={item.action}
              onPress={() => getNavigation(item)}
              className={
                'flex-1 flex-col bg-dark-teal-light px-[10px] pb-[10px] border border-[#DCDCDC] h-[126px] justify-end pt-[40px]'
              }>
              {getIcon(item.action)}
              <Text
                className={getTheme(
                  `text-[#FDFDFD] my-2 mt-auto ${
                    language !== 'th' && 'max-w-[90px]'
                  }`,
                )}
                size="B2"
                weight="regular">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          className="flex-1 flex-row justify-between w-full py-4"
          style={{gap: 12}}>
          <TouchableOpacity
            className={
              isTablet
                ? getTheme(
                    'flex-1 flex-col p-3 pt-8 justify-end bg-[#014541] aspect-auto',
                  )
                : getTheme(
                    'aspect-square p-3 flex-1 flex-col justify-end bg-[#014541]',
                  )
            }
            onPress={() => onPressAmenityBooking(amenityBooking?.title ?? '')}>
            {Badge({count: amenityCount})}
            <IconStarCalendar color="#FFFFFF" width="16" height="16" />
            <View className={getTheme('mt-1 h-10 flex flex-col justify-end')}>
              <Text
                size="B2"
                weight="regular"
                className={getTheme('text-[#FDFDFD]')}>
                {t('Residential__Amenity_Booking_2_line', 'Book\nAmenity')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              isTablet
                ? getTheme(
                    'flex-1 flex-col p-3 pt-8 justify-end bg-[#014541] aspect-auto',
                  )
                : getTheme(
                    'aspect-square p-3 flex-1 flex-col justify-end bg-[#014541] w-[150px]',
                  )
            }
            onPress={onPressGuestManagement}>
            {Badge({count: visitorCount})}
            <IconVisitor color="#FFFFFF" width="16" height="16" />
            <View className={getTheme('mt-1 h-10 flex flex-col justify-end')}>
              <Text
                size="B2"
                weight="regular"
                className={getTheme(`text-[#FDFDFD] break-words`)}>
                {t('Residential__Home__Guest_Management', 'Manage\nGuest')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              isTablet
                ? getTheme(
                    'flex-1 flex-col p-3 pt-8 justify-end bg-[#014541] aspect-auto',
                  )
                : getTheme(
                    'aspect-square p-3 flex-1 flex-col justify-end bg-[#014541]',
                  )
            }
            onPress={onPressMailParcel}>
            {Badge({count: parcelCount})}
            <IconSmile color="#FFFFFF" width="16" height="16" />
            <View className={getTheme('mt-1 h-10 flex flex-col justify-end')}>
              <Text
                size="B2"
                weight="regular"
                className={getTheme('text-[#FDFDFD]')}>
                {t(
                  'Residential__Home__Mail_And_Parcel_2_line',
                  'Mail &\nParcel',
                )}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

type BadgeProps = {
  count: number;
};
const Badge = ({count}: BadgeProps) => {
  if (count === 0) return null;
  const display = count > 99 ? '99+' : count;
  return (
    <View className="w-[24px] h-[16px] bg-white absolute top-[13px] right-[13px] rounded-[2px] flex items-center justify-center">
      <Text size="C1" color="dark-teal">
        {display}
      </Text>
    </View>
  );
};
