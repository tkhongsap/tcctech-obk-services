/* eslint-disable react-hooks/exhaustive-deps */
import {View, ScrollView, NativeScrollEvent} from 'react-native';
import {ScreenContainer, StickyButton} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing} from '~/components/atoms';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CreateAmenityBookingFirstStep from '~/features/residential/components/AmenityBooking/CreateAmenityBookingFirstStep';
import CreateAmenityBookingSecondStep from '~/features/residential/components/AmenityBooking/CreateAmenityBookingSecondStep';
import CreateAmenityBookingThirdStep, {
  generateHourlyTimeRanges,
} from '~/features/residential/components/AmenityBooking/CreateAmenityBookingThirdStep';
import CreateAmenityBookingFinalStep from '~/features/residential/components/AmenityBooking/CreateAmenityBookingFinalStep';
import t from '~/utils/text';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import dayjs from 'dayjs';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {TAvailableTimeListSelect} from './ResidentialAmenityBookingAvailableTimeScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {set} from 'lodash';
// import ControlledSelectList from '~/components/molecules/buildingAccess/ControlledSelectList';

enum Step {
  FIRST,
  SECOND,
  THIRD,
  FINAL,
}

type FacilityPagination = {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type Facility = {
  _id: string;
  id: string;
  __v: number;
  start: string;
  end: string;
  name: string;
  nameEn: string;
  nameTh: string;
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

type Condition = {
  reserve: {
    _id: string;
    __t: string;
    __v: number;
    name: string;
    enabled: boolean;
    deleted: boolean;
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

type Editor = {
  _id: string;
  id: string;
  email: string;
  displayName: string;
  ssoProviders: null;
};

export type TFacilityConditionQuota = {
  currentMonth: number;
  nextMonth: number;
  twoMonthsLater: number;
};

export type TFacilityConditionDetail = {
  textCondition: string;
  textConditionEn: string;
  minPeriod: number;
  maxPeriod: number;
  advanceBooking: number;
  capacity: number;
};

export type FacilityUtility = {
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

const defaultFacilityPaginate: FacilityPagination = {
  totalDocs: 1,
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasNextPage: false,
  hasPrevPage: false,
  prevPage: null,
  nextPage: null,
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AmenityBookingCreateScreen'
>;

const AmenityBookingCreateScreen = ({route: {params}}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>(Step.FIRST);
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityPaginate, setFacilityPaginate] = useState<FacilityPagination>(
    defaultFacilityPaginate,
  );
  const [selectedFacility, setSelectedFacility] = useState<Facility>();
  const now = dayjs();
  let todayCheck = now;
  if (
    now.hour() >=
    (selectedFacility?.condition.reserve.period.end
      ? parseInt(selectedFacility.condition.reserve.period.end.split(':')[0])
      : 22)
  ) {
    todayCheck = now.add(1, 'day');
  }

  const today = todayCheck.format('YYYY-MM-DD');
  const [date, setDate] = useState(todayCheck.format('YYYY-MM-DD'));
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [clickStickyAtStep, setClickStickyAtStep] = useState<Step>();
  const [details, setDetails] = useState<string>();
  const [allAvailableTimes, setAllAvailableTimes] = useState<
    TAvailableTimeListSelect[]
  >([]);
  const [hasError, setHasError] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [bookedList, setBookedList] = useState<Facility[]>([]);
  const [wordSelectTime, setWordSelectTime] = useState<string | undefined>(
    t('Residential__Amenity_Booking__Available_time_Select', 'Available time'),
  );

  const getBookedList = async (date: string) => {
    try {
      const start = dayjs(date).format('YYYY-MM-DD');
      const end = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
      const {data} = await serviceMindService.getAmenityBookingsInit({
        start,
        end,
        history: false,
        facility: selectedFacility?.id,
      });
      setBookedList(data as Facility[]);
      return data as Facility[];
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
    const load = async () => {
      await getBookedList(date);
    };
    load();
    setAllAvailableTimes(params.availableTimeList);
    const selectedAvailableTimeList = params.availableTimeList.filter(
      e => e.selected,
    );
    if (selectedAvailableTimeList.length !== 0) {
      const start = selectedAvailableTimeList[0];
      const end =
        selectedAvailableTimeList[selectedAvailableTimeList.length - 1];
      setWordSelectTime(
        `${dateToTimeString(start.value.split('|')[0])} - ${dateToTimeString(
          end.value.split('|')[1],
        )}`,
      );
      const bookedTimeList = bookedList.map(e => ({
        start: dateToTimeString(e.start),
        end: dateToTimeString(e.end),
      }));
      bookedTimeList
        .map(e => generateHourlyTimeRanges(e.start, e.end))
        .flatMap(e => e)
        .map(e => {
          if (selectedAvailableTimeList.some(time => time.name === e.name)) {
            setHasError(true);
          }
        });
    }
    setHasError(false);
  }, [params]);

  useFocusEffect(
    useCallback(() => {
      preload();
    }, []),
  );

  useEffect(() => {
    const dateTimeCheck = dayjs()
      .add(
        selectedFacility?.condition?.condition?.advanceBooking as number,
        'day',
      )
      .format(
        dayjs()
          .add(
            selectedFacility?.condition?.condition?.advanceBooking as number,
            'day',
          )
          .isSame(dayjs(), 'day')
          ? 'YYYY-MM-DDTHH:mm:ss'
          : 'YYYY-MM-DDT00:00:00',
      );

    const nextHalfHourFromDateTimeCheck = dayjs(dateTimeCheck)
      .add(30, 'minute')
      .startOf('minute')
      .set('minute', (Math.ceil(dayjs(dateTimeCheck).minute() / 30) * 30) % 60)
      .format('HH:mm');

    setDate(
      dayjs(today)
        .add(
          selectedFacility?.condition?.condition?.advanceBooking as number,
          'day',
        )
        .format(
          dayjs().isSame(dayjs(), 'day')
            ? 'YYYY-MM-DDTHH:mm:ss'
            : 'YYYY-MM-DDT00:00:00',
        ),
    );
    if (selectedFacility?.condition?.reserve?.period) {
      setIsLoading(true);
      let {start, end} = selectedFacility?.condition?.reserve?.period;
      if (dayjs(today).isSame(dayjs(dateTimeCheck), 'day')) {
        start = nextHalfHourFromDateTimeCheck;
      }
      const availableTimes = generateHourlyTimeRanges(start, end);
      setAllAvailableTimes(availableTimes);
      setIsLoading(false);
    }
  }, [selectedFacility]);

  const preload = async () => {
    try {
      setIsLoading(true);
      const {docs, paginate} = await getFacilities({
        page: facilityPaginate.page,
        limit: facilityPaginate.limit,
      });
      setFacilities(docs);
      setFacilityPaginate(paginate);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getFacilities = async (req: {page: number; limit: number}) => {
    const property = await residentialTenantAction.getDefaultUnit();
    const {data} = await serviceMindService.getAmenityBookingFacilities({
      ...req,
      types: 'room',
      tower: property?.projectsName,
    });
    const {docs, ...paginate} = data;
    return {docs, paginate};
  };

  const onPressSticky = () => {
    setClickStickyAtStep(step);
    scrollViewRef.current?.scrollTo({y: 0, animated: true});

    if (hasError) return;
    if (step === Step.THIRD) {
      const selectedAvailableTimeList = allAvailableTimes.filter(
        e => e.selected,
      );
      if (selectedAvailableTimeList.length === 0) return;
      updateTimePeriod(selectedAvailableTimeList);
    }
    if (step !== Step.FINAL) {
      setStep(step + 1);
    }
    if (step === Step.FINAL) {
      createBooking();
    }
  };

  const updateTimePeriod = (
    selectedAvailableTimeList: TAvailableTimeListSelect[],
  ) => {
    const start = selectedAvailableTimeList[0];
    const end = selectedAvailableTimeList[selectedAvailableTimeList.length - 1];
    setTimePeriod(
      `${dateToTimeString(start.value.split('|')[0])} - ${dateToTimeString(
        end.value.split('|')[1],
      )}`,
    );
  };

  const createBooking = async () => {
    try {
      setIsLoading(true);
      const splittedTimePeriod = timePeriod.split('-');
      const start = timeToDateString(date, splittedTimePeriod[0].trim());
      const end = timeToDateString(date, splittedTimePeriod[1].trim());
      const [person, residenceId] = await Promise.all([
        residentialTenantAction.getResidentPerson(),
        residentialTenantAction.getResidenceId(),
      ]);
      // const {status, data} = await serviceMindService.createAmenityBooking({
      const {status} = await serviceMindService.createAmenityBooking({
        id: selectedFacility!.id,
        residenceId,
        title: selectedFacility?.name,
        start,
        end,
        details: details ?? null,
        persons: [
          {
            name: person?.identifier,
            email: person?.uid,
            isOrganizer: true,
            isAttendee: false,
          },
        ],
      });
      if (status === 200) {
        navigateToSuccessScreen();
        // navigateToSuccessScreen(data.data?.displayId ?? '');
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  // const navigateToSuccessScreen = (displayId: string) => {
  const navigateToSuccessScreen = () => {
    navigation.dispatch(
      StackActions.replace('AnnouncementResidentialScreen', {
        type: 'success',
        title: t(
          'Residential__Announcement__Booking__success',
          'Your booking was successfully created.',
        ),
        message: '',
        // messageDescription: `#${displayId}`,
        buttonText: t('Residential__Home_Automation__Done', 'Done'),
        screenHook: 'AmenityBookingHomeScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('AmenityBookingHomeScreen'),
      }),
    );
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t(
        'Residential__Unsuccessful__Page',
        'Your booking was unsuccessfully created, please reselect time slot.',
      ),
      message: '',
      buttonText: t(
        'Residential__Unsuccessful__Back_to_explore',
        'Available Time',
      ),
      screenHook: 'AmenityBookingCreateScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => {
        setStep(Step.THIRD);
        navigation.navigate('AmenityBookingCreateScreen', {
          availableTimeList: params.availableTimeList,
        });
      },
    });
  };

  const onPressFacility = (facility: Facility) => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
    setSelectedFacility(facility);
    setHasError(false);
    setStep(Step.SECOND);
  };

  const onPressLeftAction = () => {
    setHasError(false);
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
    if (step === Step.SECOND) {
      setWordSelectTime(
        t(
          'Residential__Amenity_Booking__Available_time_Select',
          'Available time',
        ),
      );
    }
    if (step !== Step.FIRST) setStep(prev => prev - 1);
    else navigation.goBack();
  };

  const dateToTimeString = (date: string) => {
    return dayjs(date).format('HH:mm');
  };

  const timeToDateString = (date: string, time: string) => {
    date = dayjs(date).format('YYYY-MM-DD');
    return dayjs(`${date} ${time}`).format('YYYY-MM-DDTHH:mm:ss');
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
      facilityPaginate.totalDocs > facilities.length &&
      step == Step.FIRST
    ) {
      getNextFacilities();
    }
  };

  const onDateChangedFilter = (date: string) => {
    setHasError(false);
    setDate(date);
    const dateTimeCheck = dayjs()
      .add(
        selectedFacility?.condition?.condition?.advanceBooking as number,
        'day',
      )
      .format(
        dayjs()
          .add(
            selectedFacility?.condition?.condition?.advanceBooking as number,
            'day',
          )
          .isSame(dayjs(), 'day')
          ? 'YYYY-MM-DDTHH:mm:ss'
          : 'YYYY-MM-DDT00:00:00',
      );

    const nextHalfHourFromDateTimeCheck = dayjs(dateTimeCheck)
      .add(30, 'minute')
      .startOf('minute')
      .set('minute', (Math.ceil(dayjs(dateTimeCheck).minute() / 30) * 30) % 60)
      .format('HH:mm');

    setDate(
      dayjs(date)
        .add(
          selectedFacility?.condition?.condition?.advanceBooking as number,
          'day',
        )
        .format(
          dayjs().isSame(dayjs(), 'day')
            ? 'YYYY-MM-DDTHH:mm:ss'
            : 'YYYY-MM-DDT00:00:00',
        ),
    );
    if (selectedFacility?.condition?.reserve?.period) {
      setIsLoading(true);
      let {start, end} = selectedFacility?.condition?.reserve?.period;
      if (dayjs(date).isSame(dayjs(dateTimeCheck), 'day')) {
        start = nextHalfHourFromDateTimeCheck;
      }
      const availableTimes = generateHourlyTimeRanges(start, end);
      setAllAvailableTimes(availableTimes);
    }

    setWordSelectTime(
      t(
        'Residential__Amenity_Booking__Available_time_Select',
        'Available time',
      ),
    );
  };

  const getNextFacilities = async () => {
    try {
      setIsLoading(true);
      const {docs, paginate} = await getFacilities({
        page: facilityPaginate.page + 1,
        limit: facilityPaginate.limit,
      });
      setFacilities(prev => [...prev, ...docs]);
      setFacilityPaginate(paginate);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ScreenContainer
        className="w-full bg-white"
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t('Residential__Amenity_Booking_page_step', 'Book Amenity')}
          bgColor="bg-white"
          titleColor="dark-gray"
          // leftColor="#292929"
          onPressLeftAction={onPressLeftAction}
        />

        <View className="w-full flex-1">
          <View className="flex flex-row">
            <View className={`px-[16px] pt-5 w-full`}>
              <DynamicStepContainers
                totalSteps={4}
                currentStep={step}
                handleStepPress={setStep}
              />
            </View>
          </View>
          <ScrollView
            className="w-full bg-[#FDFDFD]"
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={({nativeEvent}) => onScroll(nativeEvent)}>
            {step === Step.FIRST && (
              <CreateAmenityBookingFirstStep
                facilities={facilities}
                onPress={onPressFacility}
              />
            )}
            {step === Step.SECOND && selectedFacility && (
              <CreateAmenityBookingSecondStep facility={selectedFacility} />
            )}
            {step === Step.THIRD && selectedFacility && (
              <CreateAmenityBookingThirdStep
                facility={selectedFacility}
                allAvailableTimes={allAvailableTimes}
                setAllAvailableTimes={setAllAvailableTimes}
                details={details}
                onDetailsChanged={setDetails}
                initialDate={date}
                onDateChanged={onDateChangedFilter}
                setIsLoading={setIsLoading}
                disabled={isLoading}
                hasError={clickStickyAtStep === Step.THIRD}
                setHasError={setHasError}
                hasSelected={hasSelected}
                wordSelectTime={
                  wordSelectTime ??
                  t(
                    'Residential__Amenity_Booking__Available_time_Select',
                    'Available time',
                  )
                }
              />
            )}
            {step === Step.FINAL && selectedFacility && (
              <CreateAmenityBookingFinalStep
                facility={selectedFacility}
                date={date}
                timePeriod={timePeriod}
                details={details}
                hasError={hasError}
                onPressEditBookingDetails={() => setStep(Step.THIRD)}
                onPressEditRemark={() => setStep(Step.THIRD)}
              />
            )}
            <Spacing height={120} />
          </ScrollView>
        </View>
      </ScreenContainer>
      {step !== Step.FIRST && hasError != true && (
        <StickyButton
          title={renderStepContent(step)}
          className="bg-dark-teal-dark"
          rightIcon="next"
          iconHeight={20}
          iconWidth={20}
          onPress={onPressSticky}
          disabled={isLoading}
        />
      )}
    </>
  );
};

const renderStepContent = (step: Step) => {
  if (step === Step.FINAL) {
    return t('Residential__Amenity_Booking__Create_All_good', 'Book');
  } else if (step === Step.SECOND) {
    return t('Residential__Amenity_Booking__Accept_and_Booking', 'Accept');
  } else {
    return t('General__Next', 'Next');
  }
};

export default AmenityBookingCreateScreen;
