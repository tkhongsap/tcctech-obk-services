import React, {useCallback, useEffect, useState} from 'react';
import {Header, StickyButton, useModal} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {memberAction, memberState} from '../store/member';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {
  ParkingTicketsIndexTypeEnum,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import {ScrollView} from 'react-native-gesture-handler';
import {Confirmation} from '~/components/organisms/GenericModal';
import ParkingDetail from '../components/ParkingDetail';
import getTheme from '~/utils/themes/themeUtils';
import {Pressable, View, Image, TouchableOpacity} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {ListSelect} from '../components/SelectList';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {find, isEmpty} from 'lodash';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {useForm} from 'react-hook-form';
import {logScreenView} from '~/utils/logGA';

type SelectedParkingRate = {
  name: string;
  value: string;
};
type CarParkPayment = WrappedResponseParkingTicketDataData & {
  parkingRate: SelectedParkingRate;
};

const mockCarParkPayment: CarParkPayment = {
  id: 'mock-123456789',
  vehicle_type_id: 0,
  member_type_id: 0,
  rate_detail: {
    th: 'ทดสอบ',
    en: 'Test',
  },
  parked_at: '2024-08-14T07:42:50.600Z',
  total_fee: 220,
  vehicle_type: 'Car',
  ticket_number: '0000000001',
  plate_number: '3กข 1234',
  parkingRate: {
    name: '1 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '1',
  },
};
const mockParkingDetail: WrappedResponseParkingTicketDataData = {
  id: 'mock-123456789',
  vehicle_type_id: 0,
  member_type_id: 0,
  rate_detail: {
    th: 'ทดสอบ',
    en: 'Test',
  },
  parked_at: '2024-08-14T07:42:50.600Z',
  total_fee: 220,
  vehicle_type: 'Car',
  ticket_number: '0000000001',
  plate_number: '3กข 1234',
};

const mockParkingRateDetail: ListSelect[] = [
  {
    name: '1 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '1',
  },
  {
    name: '2 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '2',
  },
  {
    name: '4 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '3',
  },
  {
    name: '8 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '4',
  },
  {
    name: '12 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '5',
  },
  {
    name: '24 hour free of charge, from hours onwards charge 30 Baht per hour',
    value: '6',
  },
];

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CarParkPaymentDetailScreen'
>;

const CarParkPaymentDetailScreen = ({
  route: {
    params: {token, internalQr},
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();

  const [parkingDetail, setParkingDetail] =
    useState<WrappedResponseParkingTicketDataData>(mockParkingDetail);
  const [parkingRateDetail, setParkingRateDetail] = useState<ListSelect[]>(
    mockParkingRateDetail,
  );
  const [carParkPayment, setCarParkPayment] =
    useState<CarParkPayment>(mockCarParkPayment);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRate, setSelectedRate] = useState('');
  const [remark, setRemark] = useState('');
  const maxLengthTextInput = 100;

  const navigation = useNavigation();
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  let language = appLanguageState.currentLanguage.get();
  if (language === '') {
    language = appLanguageState.defaultLanguage.get();
  }

  const handleOnPress = async () => {
    if (isEmpty(selectedRate)) {
      modalActions.setContent(
        <Confirmation
          title={t('General__Something_went_wrong', 'Something went wrong')}
          description={t(
            'General__Please_select_rate',
            'Please selected at least one rate',
          )}
          onContinue={() => {
            modalActions.hide();
          }}
          onCancel={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
        />,
      );
      modalActions.show();
    } else {
      setIsLoading(true);

      const selectedRateDetail = find(parkingRateDetail, {value: selectedRate});
      const message = selectedRateDetail?.name;

      const result = await memberAction.redemption(
        memberState.id.value,
        parkingDetail.id,
        selectedRate,
        remark,
      );

      if (result) {
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t(
            'Announcement__Redemption_success__Title',
            'Redemption successful',
          ),
          message: message!,
          buttonText: t('General__Back_to_redemption', 'Go back to redemption'),
          screenHook: 'CarParkPaymentDetailScreen',
        });
      } else {
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: t('General__Something_went_wrong_2', 'Something\nwent wrong'),
          message: t(
            'Announcement__Error_generic__Body',
            'Please wait and try again soon.',
          ),
          buttonText: t('General__Bacl_to_scan_qr', 'Back to scan QR code'),
          screenHook: 'CarParkPaymentDetailScreen',
        });
      }

      setIsLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedRate(value);
  };

  const preLoad = useCallback(async () => {
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
      const vehicleTypeId = parkingDetailResult?.vehicle_type_id;
      const memberTypeId = parkingDetailResult?.member_type_id;
      const rateDetails = await memberAction.getRateDetail(
        memberState.id.value,
        vehicleTypeId!,
        memberTypeId!,
      );

      if (!parkingDetailResult || !rateDetails) {
        modalActions.setContent(
          <Confirmation
            title={t('General__Something_went_wrong', 'Something went wrong')}
            description={t(
              'Drawer__Redemption__Description',
              'We’re unable to scan the parking ticket. Please check you camera before trying again.',
            )}
            onContinue={() => {
              modalActions.hide();
              navigation.navigate('BuildingServiceScreen');
            }}
            onCancel={() => {
              modalActions.hide();
              navigation.navigate('BuildingServiceScreen');
            }}
          />,
        );
        modalActions.show();
      }
      setParkingDetail(parkingDetailResult);
      const rateArray: ListSelect[] = [];
      for (const rate of rateDetails!) {
        rateArray.push({
          name: rate.detail[language],
          value: rate.code.toString(),
        });
      }

      setParkingRateDetail(rateArray);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      modalActions.setContent(
        <Confirmation
          title={t('General__Something_went_wrong', 'Something went wrong')}
          ConfirmButtonColor="dark-teal"
          description={t(
            'Drawer__Redemption__Description',
            'We’re unable to scan the parking ticket. Please check you camera before trying again.',
          )}
          onContinue={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
          onCancel={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
        />,
      );
      modalActions.show();
    }
  }, [internalQr, language, modalActions, navigation, token]);

  useEffect(() => {
    logScreenView('CarParkPaymentDetailScreen');
  }, []);

  // useEffect(() => {
  //   preLoad();
  // }, [preLoad]);

  const handleOnContinueEvent = (event: ScreenHookEventType) => {
    if (event.from.params.type === 'success') {
      navigation.navigate('BuildingServiceScreen');
    } else {
      navigation.navigate('ParkingRedemptionScreen', {
        hookFrom: 'CAR_PARK_PAYMENT',
      });
    }
  };

  useScreenHook('CarParkPaymentDetailScreen', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event);
        break;
      default:
        break;
    }
  });

  const ParkingRedemptionPaymentPromptPay = () => {
    navigation.navigate('ParkingRedemptionPaymentPromptPay');
  };

  const onPressPayNow = () => {
    navigation.navigate('ParkingRedemptionPaymentMethod');
  };

  return (
    <Screen isLoading={isLoading}>
      <Header leftAction="goBack" title="Car Park Payment" />
      <ScrollView className="w-full px-5">
        <View className="flex flex-col items-start">
          <Text size="B1" weight="regular" color="subtitle-muted">
            Monday 24 June 2023 at 13:49
          </Text>
        </View>
        <Spacing height={28} />
        <Pressable>
          {parkingDetail && (
            <View className={`${getTheme('border-[1px] border-line')} px-4`}>
              <View className={`${getTheme('w-full items-center px-4 py-6')}`}>
                <View>
                  <View className="flex items-center ">
                    <Text weight="medium" size="H1">
                      {t('no_key', `${parkingDetail.plate_number}`)}
                    </Text>
                    <Text color="muted" size="B2">
                      {t('General__License_plate', 'License Plate')}
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
              <ParkingDetail data={parkingDetail} />
            </View>
          )}
          <Spacing height={32} />
        </Pressable>

        <TouchableOpacity>
          <Text
            size="B1"
            weight="medium"
            color="dark-teal"
            className="underline">
            Terms and Conditions
          </Text>
        </TouchableOpacity>
        <Spacing height={40} />
      </ScrollView>
      <StickyButton
        title={t('General__Pay_Now', 'Pay Now')}
        rightIcon="next"
        color="dark-teal"
        onPress={onPressPayNow}
      />
    </Screen>
  );
};

export default CarParkPaymentDetailScreen;
