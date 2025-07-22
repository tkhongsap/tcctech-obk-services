import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenContainer} from '../../components';
import {Header} from '../../components/Header';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import dayjs from 'dayjs';
import {Button} from '~/components/molecules';
import TextDetailCard from '../components/TextDetailCard';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import getTheme from '~/utils/themes/themeUtils';
import Config from 'react-native-config';
import Share from 'react-native-share';
import {useModal} from '../../components/ResidentialModal';
import {VisitorPass} from './ResidentialVisitorPassScreen';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ConfirmDeactivateVisitorPassModal from '../../components/ConfirmDeactivateVisitorPassModal';
import {createVisitorPassAction} from '../store';
import DatetimeParser from '../../utils/reformatter/datetime';
import {Day} from '../components/SelectSpecificDay';

export type GuestManagement = {
  id: string;
  name: string;
  email: string;
  idNumber: string;
  buildingId: string;
  unitId: string;
  floorId: string;
  residentId: string;
  repeatConfig: {
    isRepeat: boolean;
    type: number;
    date: string;
    days: string[];
    endDate: string;
  };
  timeConfig: {
    isSpecific: boolean;
    start: string;
    end: string;
  };
  createdByName: string;
  date: string;
  isExpired: string;
  building: string;
  unit: string;
  floor: string;
  isRepeat: string;
  sqNo: string;
  visitorScheduleId: string;
  isActive: boolean;
};

type GuestManagementDetail = GuestManagement & {
  orgId: string;
  companyId: string;
  isActive: true;
  sourceOfRequest: number;
  qrCodeData: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  idNumber: null;
  accessTimeConfigId: string;
  resident: string;
};

type VisitorPassDetail = VisitorPass & {
  idNumber: string;
  email: string;
  isExpired: boolean;
  propertyFloor: string;
};

type DateInfo = {
  from: string;
  to: string;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialVisitorPassDetailScreen'
>;

const ExpireTag = () => {
  return (
    <View
      className={getTheme(
        'flex justify-center items-center px-[24px] bg-error-200 h-[48px] w-full',
      )}>
      <Text color="fire-engine-red" className="italic">
        {t('Residential__Visitor_pass_expired', 'Expired Guest Pass')}
      </Text>
    </View>
  );
};

const ResidentialVisitorPassDetailScreen = ({
  route: {
    params: {visitorPass},
  },
}: Props) => {
  const [_, modalActions] = useModal();
  const navigation = useNavigation<StackNavigation>();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const [isLoading, setIsLoading] = useState(true);
  const [visitorPassDetail, setVisitorPassDetail] = useState<GuestManagement>();

  const shortDayToDay: {[key: string]: Day} = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const vpDetailResp = await getVisitorPassDetail(visitorPass.id);
      setVisitorPassDetail(vpDetailResp.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getVisitorPassDetail = async (id: string) => {
    const {data} = await serviceMindService.visitorPassDetail(id);
    return data;
  };

  const visitorsDestroy = async () => {
    try {
      setIsLoading(true);
      if (!visitorPass.id) return;
      const {status, data} = await serviceMindService.deleteVisitorPass(
        visitorPass.id,
      );
      if (status === 200) {
        modalActions.hide();
        navigation.navigate('ResidentialVisitorPassScreen');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnPressDelete = () => {
    modalActions.setContent(
      <ConfirmDeactivateVisitorPassModal
        onPressDelete={() => visitorsDestroy()}
      />,
    );
    modalActions.show();
  };

  const handleOnPressReactivate = () => {
    if (!visitorPassDetail) return;
    createVisitorPassAction.set({
      name: visitorPassDetail.name,
      idNumber: visitorPassDetail.idNumber,
      email: visitorPassDetail.email,
      buildingId: visitorPassDetail.buildingId,
      unitId: visitorPassDetail.unitId,
      floorId: visitorPassDetail.floorId,
      // elevatorId: visitorPassDetail.elevatorId,
      date: visitorPassDetail.date,
      timeConfig: {
        isSpecific: visitorPassDetail.timeConfig.isSpecific,
        start: visitorPassDetail.timeConfig.start,
        end: visitorPassDetail.timeConfig.end,
      },
      repeatConfig: {
        isRepeat: visitorPassDetail.repeatConfig.isRepeat,
        type: visitorPassDetail.repeatConfig.type,
        date: visitorPassDetail.repeatConfig.date,
        days: visitorPassDetail.repeatConfig.days,
        endDate: visitorPassDetail.repeatConfig.endDate,
      },
      isEdit: true,
    });
    navigation.navigate('ResidentialCreateVisitorPassScreen');
  };

  const DateItem = (date: DateInfo) => {
    const start = dayjs(date.from);
    const end = dayjs(date.to);
    const isSameDay = start.isSame(end, 'day');
    const isSameMonth = start.isSame(end, 'month');
    const isSameYear = start.isSame(end, 'year');

    let dateString = '';

    if (isSameDay) {
      dateString = DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      });
    } else if (!isSameMonth) {
      dateString = `${start
        .locale(language)
        .format('DD MMMM')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else if (!isSameYear) {
      dateString = `${DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      })} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else {
      dateString = `${start
        .locale(language)
        .format('DD')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    }

    return dateString;
  };

  const dateUntilValue = visitorPassDetail?.repeatConfig.isRepeat
    ? visitorPassDetail.repeatConfig.endDate
    : null;
  const dateValid = visitorPass.fromDate;
  const startTime = visitorPass.fromTime;
  const endTime = visitorPass.toTime;

  const startDateTime = dayjs(`${dateValid} ${startTime}`, 'YYYY-MM-DD HH:mm');
  let endDateTime = dayjs(`${dateValid} ${endTime}`, 'YYYY-MM-DD HH:mm');

  let isCrossDay = false;
  if (endDateTime.isBefore(startDateTime)) {
    isCrossDay = true;
    endDateTime = endDateTime.add(1, 'day');
  }

  const calculatedDateUntil =
    !dateUntilValue && isCrossDay ? endDateTime : null;

  const TimeItem = (time: DateInfo) => {
    return `${time.from} - ${time.to}`;
  };

  const handlePress = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const baseWebviewUrl = Config.WEB_VIEW_RESIDENT_URL;
    const webviewUrl = `${baseWebviewUrl}?visit_schedule_id=${visitorPassDetail?.visitorScheduleId}`;
    try {
      await Share.open({
        url: webviewUrl,
        email: visitorPass.email,
      });
    } catch (error) {
      console.log('user does not share');
      // Alert.alert(error.message);
    }
  };

  const mappingRepeatType = (key: number) => {
    switch (key) {
      case 1:
        return t(
          'Residential__Visitor_management__Visitor_create_2__Everyday',
          'EveryDay',
        );
      case 2:
        return t(
          'Residential__Visitor_management__Visitor_create_2__Every_date',
          'Every {{day}} of the month',
        ).replace(
          '{{day}}',
          dayjs(visitorPass.fromDate).get('date').toString(),
        );
      case 3:
        return `${t(
          'Residential__Visitor_management__Visitor_create_2__Every',
          'Every',
        )} ${visitorPassDetail?.repeatConfig.days
          ?.map(e => shortDayToDay[e])
          .map(f => mappingLanguageDays(f))
          .join(', ')}`;
      default:
        return '';
    }
  };

  const mappingLanguageDays = (day: Day) => {
    switch (day) {
      case 'Monday':
        return t('Residential__Monday', 'Monday');
      case 'Tuesday':
        return t('Residential__Tuesday', 'Tuesday');
      case 'Wednesday':
        return t('Residential__Wednesday', 'Wednesday');
      case 'Thursday':
        return t('Residential__Thursday', 'Thursday');
      case 'Friday':
        return t('Residential__Friday', 'Friday');
      case 'Saturday':
        return t('Residential__Saturday', 'Saturday');
      case 'Sunday':
        return t('Residential__Sunday', 'Sunday');
      case 'Weekend':
        return t('Residential__Weekend', 'Weekend');
      case 'Weekday':
        return t('Residential__Weekday', 'Weekday');
      default:
        break;
    }
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Visitor_management__Guest_Information',
          'Guest Information',
        )}
        iconHeight={25}
        iconWidth={25}
      />
      <ScrollView className="w-full px-6">
        <TouchableWithoutFeedback>
          <View className="flex w-full">
            <Spacing height={24} />
            {visitorPass.isExpired && <ExpireTag />}
            {visitorPass.isExpired && <Spacing height={24} />}
            <Text size="H3" weight="medium">
              {visitorPass.visitorName}
            </Text>
            {/* <Spacing height={6} />
            <Text size="B2" color="muted-400">
              {visitorPassDetail.visitor.company_name}
            </Text> */}
            <Spacing height={24} />
            <DetailCard
              header={t('Residential__Personal_info', 'Personal Information')}>
              <>
                <TextDetailCard
                  label={t('Residential__Full_name', 'Name')}
                  text={visitorPass.visitorName}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Email', 'Email')}
                  text={visitorPass.email}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Id', 'ID number')}
                  text={visitorPass.idNumber || '-'}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('Residential__Access_detail', 'Access details')}>
              <>
                <TextDetailCard
                  label={t('Residential__Valid_on', 'Valid on')}
                  text={DatetimeParser.toDMY({
                    language,
                    timestamp: dayjs(visitorPass.fromDate).valueOf(),
                  })}
                />
                <Spacing height={24} />
                {(dateUntilValue || calculatedDateUntil) && (
                  <>
                    <TextDetailCard
                      label={t('Residential__Until', 'Until')}
                      text={DatetimeParser.toDMY({
                        language,
                        timestamp: dayjs(
                          dateUntilValue || calculatedDateUntil,
                        ).valueOf(),
                      })}
                    />
                    <Spacing height={24} />
                  </>
                )}
                <TextDetailCard
                  label={t('Residential__Time', 'Time')}
                  text={TimeItem({
                    from: visitorPass.fromTime,
                    to: visitorPass.toTime,
                  })}
                />
                <Spacing height={24} />

                {visitorPassDetail?.repeatConfig.isRepeat && (
                  <>
                    <TextDetailCard
                      label={t('Residential__Repeat', 'Repeat')}
                      text={mappingRepeatType(
                        visitorPassDetail?.repeatConfig.type,
                      )}
                    />
                    <Spacing height={24} />
                  </>
                )}
                <TextDetailCard
                  label={t('Residential__Building', 'Building')}
                  text={visitorPass.propertyProjectName || '-'}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Guest_Management_Unit', 'Unit')}
                  text={visitorPass.propertyUnit}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Floor', 'Floor')}
                  text={visitorPass.propertyFloor}
                />
              </>
            </DetailCard>

            <Spacing height={24} />
            <View className="flex w-full">
              {!visitorPass.isExpired && (
                <>
                  <View className="flex w-full">
                    <Button
                      className="bg-[#E4E4E4] border-l-[#BDBDBD]"
                      title={t('Residential__Share', 'Share')}
                      onPress={handlePress}
                      color="light-teal"
                    />
                  </View>
                  <Spacing height={24} />
                </>
              )}
              <Button
                className={
                  visitorPass.isExpired ? 'bg-[#E4E4E4] border-l-[#BDBDBD]' : ''
                }
                title={
                  visitorPass.isExpired
                    ? t('Residential__Reactivate', 'Reactivate Guest Pass')
                    : t(
                        'Residential__Delete_visitor_pass',
                        'Deactivate Guest Pass',
                      )
                }
                color={visitorPass.isExpired ? 'light-teal' : 'fire-engine-red'}
                outlined={!visitorPass.isExpired}
                onPress={
                  visitorPass.isExpired
                    ? handleOnPressReactivate
                    : handleOnPressDelete
                }
                disabled={isLoading}
              />
            </View>
            <Spacing height={40} />
          </View>
        </TouchableWithoutFeedback>
        {Platform.OS === 'ios' && <Spacing height={100} />}
      </ScrollView>
    </ScreenContainer>
  );
};

export default ResidentialVisitorPassDetailScreen;
