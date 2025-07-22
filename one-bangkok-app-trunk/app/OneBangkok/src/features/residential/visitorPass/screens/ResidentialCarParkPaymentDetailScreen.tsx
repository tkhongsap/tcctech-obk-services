import React, {useCallback, useEffect, useState} from 'react';
import {Header, StickyButton} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {memberAction} from '../store/member';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {
  ParkingRedemptionRateResult,
  ParkingTicketsIndexTypeEnum,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import {ScrollView} from 'react-native-gesture-handler';
import ParkingDetail from '../components/ParkingDetail';
import getTheme from '~/utils/themes/themeUtils';
import {Pressable, View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {ListSelect} from '../components/SelectList';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {useForm} from 'react-hook-form';
import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import DatetimeParser from '../../utils/reformatter/datetime';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {useResidentialUnitSelectedState} from '~/states/residentialTenant/residentialTenantState';
import {useModal} from '../../components/ResidentialModal';
import {logEvent, logScreenView} from '~/utils/logGA';

type SelectedParkingRate = {
  name: string;
  value: string;
};
type CarParkPayment = WrappedResponseParkingTicketDataData & {
  parkingRate: SelectedParkingRate;
};

// const mockCarParkPayment: CarParkPayment = {
//   id: '',
//   ticket_number: '',
//   plate_number: '',
//   vehicle_type: '',
//   parked_at: '',
//   total_fee: 0,
//   vehicle_type_id: 1,
//   member_type_id: 0,
//   rate_detail: {
//     en: '',
//     th: '',
//   },
//   parkingRate: {
//     name: '',
//     value: '',
//   },
// };
const mockParkingDetail: WrappedResponseParkingTicketDataData = {
  id: '',
  ticket_number: '',
  plate_number: '',
  vehicle_type: '',
  parked_at: '',
  total_fee: 0,
  vehicle_type_id: 1,
  member_type_id: 0,
  rate_detail: {
    en: '',
    th: '',
  },
};

// const mockParkingRateDetail: ListSelect[] = [
//   {
//     code: 0,
//     detail: {
//       en: 'Free 4 Hours After 30 Baht Per Hour',
//       th: 'ฟรี 4 ชั่วโมงแรก ชั่วโมงต่อไปคิด 30 บาทต่อชั่วโมง',
//     },
//   },
//   {
//     code: 1,
//     detail: {
//       en: 'First 4 hours free, 40 baht for the 5th hour, 30 baht per hour after that. (DisAllowed)',
//       th: 'ฟรี 4 ชั่วโมงแรก ชั่วโมงที่ 5 คิด 40 บาท ชั่วโมงต่อไปคิด 30 บาทต่อชั่วโมง (ห้ามใช้)',
//     },
//   },
//   {
//     code: 1003,
//     detail: {
//       en: 'Free 4 Hours After 50 Baht Per Hour',
//       th: 'ฟรี 4 ชั่วโมง หลังจากนั้นเก็บคนขับ 50 บาท',
//     },
//   },
//   {
//     code: 1032,
//     detail: {
//       en: 'Free 10 Hours (INV)After 30 Baht Per Hour',
//       th: 'ฟรี 10 ชั่วโมง (เรียกเก็บ) หลังจากนั้นเก็บคนขับ 30 บาท',
//     },
//   },
//   {
//     code: 1042,
//     detail: {
//       en: 'Free 24 Hours After 30 Baht Per Hour',
//       th: 'ฟรี 24 ชั่วโมง หลังจากนั้นเก็บคนขับ 30 บาท',
//     },
//   },
// ];

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialCarParkPaymentDetailScreen'
>;

const ResidentialCarParkPaymentDetailScreen = ({
  route: {
    params: {token, internalQr},
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();

  const [parkingDetail, setParkingDetail] =
    useState<WrappedResponseParkingTicketDataData>(mockParkingDetail);
  // const [parkingRateDetail, setParkingRateDetail] = useState<ListSelect[]>(mockParkingRateDetail);
  // const [carParkPayment, setCarParkPayment] = useState<CarParkPayment>(mockCarParkPayment);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRate, setSelectedRate] =
    useState<ParkingRedemptionRateResult>();
  // const [remark, setRemark] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [logId, setLogId] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [subCode, setSubCode] = useState('');
  const [totalFee, setTotalFee] = useState(0);
  const [content, setContent] = useState<DocumentDetailData>();
  const unitSelectedState = useResidentialUnitSelectedState();
  const navigation = useNavigation();
  // const {...methods} = useForm({
  //   mode: 'onSubmit',
  //   reValidateMode: 'onSubmit',
  // });

  const currentLanguage =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

  const preLoad = async () => {
    try {
      setIsLoading(true);
      let redemptionId = '';
      let type: ParkingTicketsIndexTypeEnum = 'member_id';
      if (internalQr) {
        const tokenDetail = await memberAction.getTokenDetail(token);
        let accountId = tokenDetail!.account_id;
        if (tokenDetail!.type === 'visitor_pass') {
          const inviteDetail = await memberAction.getInviteDetail(
            tokenDetail?.id!,
          );
          redemptionId = inviteDetail?.uid!;
          type = 'invite_id';
        } else if (tokenDetail!.type === 'qr') {
          const personId = await memberAction.getPersonId(accountId);
          redemptionId = personId;
        }
      } else {
        redemptionId = token;
        type = 'log_id';
      }

      const parkingDetailResult = await memberAction.getParkingDetail(
        redemptionId,
        type,
      );
      if (parkingDetailResult === undefined) {
        navigation.dispatch(
          StackActions.replace('ResidentialTicketInvalidScreen', {
            description: t(
              'Residential__Car_Park_Payment__Ticket_invalid_desc',
              'Please refresh the QR code and try again.',
            ),
          }),
        );
        return;
      }

      // const vehicleTypeId = parkingDetailResult?.vehicle_type_id;
      // const memberTypeId = parkingDetailResult?.member_type_id;
      const parkingLogId = parkingDetailResult?.id ?? '';
      // const departmentId = 0;
      //  memberState.id.set();
      // await memberAction.getMemberId();
      // console.log('memberState.id.value:', memberState.id.value);
      // const rateDetails = await memberAction.getRateDetail(
      //   redemptionId,
      //   memberTypeId!,
      //   vehicleTypeId!,
      //   departmentId,
      // );
      setSubCode((parkingDetailResult as any)?.sub_code);
      setLogId(parkingLogId);
      setTicketId(redemptionId);
      setTicketType(type);
      setTotalFee(Number(parkingDetailResult?.total_fee || 0));
      setParkingDetail(parkingDetailResult!);
      setSelectedRate({
        code: 0,
        detail: parkingDetailResult!.rate_detail,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      navigation.dispatch(
        StackActions.replace('ResidentialTicketInvalidScreen', {
          description: t(
            'Residential__Car_Park_Payment__Ticket_invalid_desc',
            'Please refresh the QR code and try again.',
          ),
        }),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      preLoad();
      fetchTermsAndConditions();
    }, [internalQr, currentLanguage, modalActions, navigation, token]),
  );

  const handleOnContinueEvent = (event: ScreenHookEventType) => {
    if (event.from.params.type === 'success') {
      navigation.navigate('ResidentialVisitorPassHomeScreen');
    } else {
      navigation.navigate('ResidentialParkingRedemptionScreen', {
        hookFrom: 'CAR_PARK_PAYMENT',
      });
    }
  };

  useScreenHook('ResidentialCarParkPaymentDetailScreen', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event);
        break;
      default:
        break;
    }
  });

  const onPressPayNow = () => {
    logEvent('button_click', {
      screen_name: 'ResidentialCarParkPaymentDetailScreen',
      feature_name: 'Car Park Payment',
      action_type: 'click',
      bu: 'Residential',
    });

    navigation.navigate('ResidentialCarParkPaymentScreen', {
      ticketId: ticketId,
      ticketType: ticketType,
      fee: totalFee,
      logId: logId,
      subCode: subCode,
    });
  };

  const fetchTermsAndConditions = useCallback(async () => {
    try {
      const projectId = unitSelectedState.selectedProjectId.value;
      const {data, status} = await serviceMindService.termCondition(projectId);
      if (status === 200) {
        setContent({
          document: {
            id: data.data.id,
            title: data.data.title,
            body: data.data.term,
          },
        });
      }
    } catch (error) {
      console.log('error fetchTermsAndConditions: ', error);
    }
  }, [currentLanguage]);

  const parseDateFormat = (timestamp: number, language: string) => {
    return t('General__date_time', '{{date}} at {{time}}', {
      date: DatetimeParser.toDMY({language, timestamp}),
      time: DatetimeParser.toHM({language, timestamp}),
    });
  };

  useEffect(() => {
    logScreenView('ResidentialCarParkPaymentDetailScreen');
  }, []);

  return (
    <Screen isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Bill_And_Payment__Car_Park_Payment',
          'Car Park Payment',
        )}
      />
      <ScrollView className="w-full px-5">
        <View className="flex flex-col items-start">
          <Text size="B1" weight="regular" color="subtitle-muted">
            {parseDateFormat(Date.now(), currentLanguage)}
          </Text>
        </View>
        <Spacing height={28} />
        <Pressable>
          {parkingDetail?.id && (
            <View className={`${getTheme('border-[1px] border-line')} px-4`}>
              <View className={`${getTheme('w-full items-center px-4 py-6')}`}>
                <View>
                  <View className="flex items-center ">
                    <Text weight="medium" size="H1">
                      {parkingDetail.plate_number}
                    </Text>
                    <Text color="muted" size="B2">
                      {t(
                        'Residential__Car_Park_Payment__License_plate',
                        'License Plate',
                      )}
                    </Text>
                  </View>
                  <Spacing height={24} />
                  <Image
                    source={require('~/assets/images/img_mock_qr.png')}
                    className="w-[200px] h-[200px]"
                  />
                  <Spacing height={16} />
                </View>
              </View>
              <ParkingDetail data={parkingDetail} selectedRate={selectedRate} />
            </View>
          )}
          <Spacing height={32} />
        </Pressable>
        {parkingDetail?.id && (
          <TouchableOpacity>
            <Text
              size="B1"
              weight="medium"
              color="dark-teal"
              className="underline"
              onPress={() =>
                navigation.navigate(
                  'ResidentialCarParkTermAndConditionScreen',
                  {
                    documentDetailData: content,
                  },
                )
              }>
              {t(
                'Residential__Car_Park_Payment__Read_Term_And_Conditions',
                'Terms and Conditions',
              )}
            </Text>
          </TouchableOpacity>
        )}
        <Spacing height={40} />
      </ScrollView>
      {parkingDetail?.id && totalFee > 0 && (
        <StickyButton
          title={t('Residential__Car_Park_Payment__Pay_Now', 'Pay now')}
          rightIcon="next"
          color="dark-teal"
          onPress={onPressPayNow}
        />
      )}
    </Screen>
  );
};

export default ResidentialCarParkPaymentDetailScreen;
