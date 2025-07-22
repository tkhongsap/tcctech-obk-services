import {Alert, Platform, Pressable, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button, HeadText, Header, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import {Icon, Spacing, Text} from '~/components/atoms';
import dayjs from 'dayjs';
import ParkingTicketQrcode from '../components/ParkingTicketQrcode';
import qrTokenService from '~/services/QRTokenService';
import {debounce, get, isEmpty, isNull} from 'lodash';
import {memberState} from '../store/member';
import getTheme from '~/utils/themes/themeUtils';
import Loading from '~/components/organisms/Loading';
import ParkingDetail from '../components/ParkingDetail';
import {
  ParkingSpaceDetailAndSpaceDetailData,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import faqAction from '~/states/setting/faq/faqAction';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import {Screen} from '~/components/templates';
import {logScreenView} from '~/utils/logGA';
import {StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import CarLocation from '../components/CarLocation';
import CannotLocateCar from '../components/CannotLocateCar';
import ParkingValetButton from '../components/ParkingValetButton';
import firebaseConfigState from '~/states/firebase';
import parkingService from '~/services/parkingService';
import {valetStatus as status} from '../constants/valet';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {useScreenHook} from '~/services/EventEmitter';
import ParkingFeeDetail from '../components/ParkingFeeDetail';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import {
  AddParkingTicketIdType,
  AddParkingTicketType,
  CampaignSequenceResponseData,
  ParkingDetailsGetParkingDetailUid200Response,
} from 'ob-parking-sdk/dist/api';
import {parkingAction} from '../store/parking';

interface IProps {
  qrValue: string;
  parkingTicketData?: WrappedResponseParkingTicketDataData | null;
}

export interface RateDetail {
  en: string;
  th: string;
}

const RenderQrCode = (props: IProps) => {
  const {parkingTicketData, qrValue} = props;
  if (!qrValue) {
    return null;
  }

  if (parkingTicketData) {
    return (
      <ParkingTicketQrcode
        qrValue={qrValue}
        parkingTicketData={parkingTicketData}
      />
    );
  } else {
    return <ParkingTicketQrcode qrValue={qrValue} />;
  }
};

const ParkingLocationDetails = (
  props: ParkingSpaceDetailAndSpaceDetailData,
) => {
  const {floor_name, zone_name, pole_name} = props;

  const ableToLocateCar = floor_name && zone_name && pole_name;
  if (ableToLocateCar) {
    return (
      <CarLocation
        floorName={floor_name}
        zoneName={zone_name}
        poleName={pole_name}
      />
    );
  }
  return <CannotLocateCar />;
};

const ParkingTicketScreen = () => {
  const [parkingTicketData, setParkingTicketData] =
    useState<ParkingSpaceDetailAndSpaceDetailData>();
  const navigation = useNavigation<StackNavigation>();
  const enableValetParking = firebaseConfigState.enable_valet_parking.value;
  const enableImportPhysicalParkingTicket =
    firebaseConfigState.enable_import_physical_parking_ticket.value;
  const enableParkingLocation =
    firebaseConfigState.enable_parking_location.value;
  const enableParkingPayment = firebaseConfigState.enable_parking_payment.value;
  const enableParkingRedemption =
    firebaseConfigState.enable_parking_redemption.value;
  const currentLanguage = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : 'en';

  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DocumentDetailData>();
  const [valetId, setValetId] = useState<number>();
  const [valetStatus, setValetStatus] = useState('');
  const [parkingFee, setParkingFee] = useState<number>(0);
  const [pickUpStation, setPickupStation] = useState('');
  const [updatedTime, setUpdatedTime] = useState(
    `${dayjs()
      .locale(currentLanguage)
      .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`,
  );
  const [campaign, setCampaign] = useState<CampaignSequenceResponseData>();
  const [parkingDetail, setParkingDetail] =
    useState<ParkingDetailsGetParkingDetailUid200Response>();
  const isFocused = useIsFocused();
  const showImportPhysicalParkingTicket = Boolean(
    enableImportPhysicalParkingTicket && !parkingTicketData,
  );

  const updateFetchTime = useCallback(() => {
    setUpdatedTime(
      `${dayjs()
        .locale(currentLanguage)
        .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`,
    );
  }, [currentLanguage]);

  const generateQrCodeOfMember = useCallback(async () => {
    const result = await qrTokenService.generate();
    const qrData = get(result, 'data');

    if (!isNull(qrData) && !isEmpty(qrData)) {
      const tokenString = JSON.stringify(qrData.token);
      setQrValue(tokenString);
      updateFetchTime();
    }
  }, [updateFetchTime]);

  const fetchData = useCallback(async () => {
    await generateQrCodeOfMember();
    await parkingAction.fetchParkingTicket();
    const parkingTicket = await parkingAction.fetchParkingTicket();
    setParkingTicketData(parkingTicket);
    if (enableValetParking) {
      const valetResult = await parkingService.getValetDetail();
      if (valetResult) {
        const id = valetResult.id;
        const valetResultStatus = valetResult.status;
        const station = valetResult.pickUpStation;
        setValetId(id);
        setValetStatus(valetResultStatus);
        setPickupStation(station);
      }
    }

    updateFetchTime();
    setLoading(false);
  }, [generateQrCodeOfMember, enableValetParking, updateFetchTime]);

  const fetchParking = useCallback(async () => {
    if (enableParkingRedemption && parkingTicketData) {
      try {
        const parkingDetailResponse = await OB_PARKING_SDK.client.parkingDetailsGetParkingDetailUid(  
          parkingTicketData?.id,
        );
        if (parkingDetailResponse.data && parkingDetailResponse.status === 200) {
          setParkingDetail(parkingDetailResponse.data);
        }
      } catch (e) {
        console.error("=== parkingDetailsGetParkingDetailUid ===", e)
      }

      try {
        const newParkingDetail = await OB_PARKING_SDK.client.parkingAddParkingTicket(
            memberState.id.value,
            AddParkingTicketType.App,
            AddParkingTicketIdType.MemberId,
          );
        if (
          newParkingDetail.data.parkingDetailId &&
          newParkingDetail.status === 200
        ) {
          // In case create successful then fetch current parking details by uid
          const newParkingDetailResponse =
            await OB_PARKING_SDK.client.parkingDetailsGetParkingDetailUid(
              parkingTicketData?.id,
            );
          setParkingDetail(newParkingDetailResponse.data);
        }
      } catch(e) {
        console.error("=== newParkingDetail parkingDetailsGetParkingDetailUid ===", e)
      }
      const campaignData = await OB_PARKING_SDK.client.campaignIndex();
      if (campaignData.data) {
        setCampaign(campaignData.data.data);
      }
    }
  }, [enableParkingRedemption, parkingTicketData]);

  useEffect(() => {
    if (parkingTicketData && parkingTicketData?.total_fee > 0) {
      setParkingFee(parkingTicketData?.total_fee);
    } else {
      setParkingFee(0);
    }
  }, [parkingTicketData]);

  const fetchTermsAndConditions = useCallback(async () => {
    const document = await faqAction.getFaqDetail(
      'parking-terms-and-conditions',
      currentLanguage,
    );
    if (document) {
      setContent({
        document: {
          id: document.id!,
          title: document.title! as string,
          body: document.body! as string,
        },
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchTermsAndConditions();
    }
  }, [fetchData, generateQrCodeOfMember, isFocused, fetchTermsAndConditions]);

  useEffect(() => {
    if (isFocused && parkingTicketData) {
      setLoading(true);
      fetchParking();
      setLoading(false);
    }
  }, [fetchParking, isFocused, parkingTicketData]);

  useEffect(() => {
    logScreenView('ParkingTicketScreen');
  }, []);
  useEffect(() => {
    if (
      valetStatus === status.pending ||
      valetStatus === status.parked ||
      valetStatus === status.calling ||
      valetStatus === status.delivering ||
      valetStatus === status.ready
    ) {
      logScreenView('Valet Parking');
    }
  }, [valetStatus]);

  useEffect(() => {
    const hasCarLocation =
      parkingTicketData?.floor_name &&
      parkingTicketData?.zone_name &&
      parkingTicketData?.pole_name;

    const isShowingCarLocation =
      enableParkingLocation &&
      hasCarLocation &&
      (!isValetStatusAvailable || !enableValetParking);

    if (isShowingCarLocation) {
      logScreenView('Find my car');
      console.log('Log screen view triggered: Find my car');
    }
  }, [parkingTicketData, enableValetParking, enableParkingLocation]);

  useScreenHook('WebSocket', async event => {
    const data = event.data;
    switch (event.name) {
      case WebSocketEventNames.VALET_STATUS_UPDATED:
        const id = data.detail.id;
        const valetResultStatus = data.detail.status;
        const station = data.detail.pickUpStation;
        setValetId(id);
        setValetStatus(valetResultStatus);
        setPickupStation(station);
        break;
      default:
        break;
    }
  });

  if (loading) {
    return (
      <Screen>
        <Loading isLoading={loading} />
      </Screen>
    );
  }

  const handlePaynowClick = () => {
    if (parkingTicketData?.id) {
      if (enableParkingRedemption) {
        navigation.navigate('ParkingPaymentAndRedemptionScreen', {
          logId: parkingTicketData.id,
          fee: parkingTicketData.total_fee,
        });
      } else if(enableParkingPayment && parkingTicketData?.total_fee) {
        navigation.navigate('ParkingPaymentScreen', {
          logId: parkingTicketData.id,
          fee: parkingTicketData.total_fee,
        });
      }
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const onRefreshPress = debounce(handleRefresh, 500);

  const isValetStatusAvailable =
    valetStatus === status.pending ||
    valetStatus === status.parked ||
    valetStatus === status.calling ||
    valetStatus === status.delivering ||
    valetStatus === status.ready;
  return (
    <Screen>
      <Header leftAction="goBack" />
      <ScrollView className="w-full px-5">
        <Pressable>
          <HeadText
            taglineColor="muted"
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__My_parking_ticket', 'My Parking Ticket')}
          />
          <View className="flex-row justify-between items-center">
            <Text size="C1" weight="regular">
              {updatedTime}
            </Text>
            {enableParkingPayment && (
              <Pressable
                className="flex-row items-center"
                onPress={onRefreshPress}>
                <Icon type="refreshIcon" width={12} height={12} color="white" />
                <Text size="C1" weight="regular" color="navy">
                  {t('General__Refresh', 'Refresh')}
                </Text>
              </Pressable>
            )}
          </View>

          <Spacing height={24} />
          <View className={`${getTheme('border-[1px] border-line')} px-4 pb-8`}>
            <RenderQrCode
              qrValue={qrValue}
              parkingTicketData={parkingTicketData}
            />
            {showImportPhysicalParkingTicket && (
              <Text
                size="B1"
                weight="medium"
                color="navy"
                className="underline text-center"
                onPress={() =>
                  navigation.navigate('ParkingTermAndConditionScreen', {
                    documentDetailData: content,
                  })
                }>
                {t(
                  'Residential__Car_Park_Payment__Read_Term_And_Conditions',
                  'Read Terms and Conditions',
                )}
              </Text>
            )}
            <Spacing height={16} />
            {parkingTicketData && <ParkingDetail data={parkingTicketData} />}
          </View>
          { enableParkingRedemption && parkingTicketData && parkingDetail && campaign && (
            <>
              <Spacing height={24} />
              <ParkingFeeDetail
                title={t('General__Parking_fee_details', 'Parking fee details')}
                buttonAction={() =>
                  navigation.navigate('ParkingAllRecieptScreen', {
                    parkingDetailId: parkingDetail.id,
                  })
                }
                buttonTitle={t(
                  'General__View_all_receipts',
                  'View all receipts',
                )}
                showFreeHour
                icon="next"
                campaign={campaign}
                totalSpending={
                  parkingDetail?.total_amount
                    ? Number(parkingDetail?.total_amount)
                    : 0
                }
              />
            </>
          )}
          {enableValetParking && parkingTicketData && (
            <>
              <Spacing height={40} />
              <ParkingValetButton
                id={valetId!}
                status={valetStatus}
                parkingFee={parkingFee}
                logId={parkingTicketData.id}
                pickUpStation={pickUpStation}
              />
            </>
          )}
          {enableParkingLocation &&
            parkingTicketData &&
            (!isValetStatusAvailable || !enableValetParking) && (
              <>
                <ParkingLocationDetails {...parkingTicketData} />
                <Spacing height={32} />
              </>
            )}

          {showImportPhysicalParkingTicket && (
            <>
              <Spacing height={24} />
              <View className="flex flex-row items-center">
                <View className="h-[0.5] bg-gray-300 flex-1" />
                <Text className="mx-4">or</Text>
                <View className="h-[0.5] bg-gray-300 flex-1" />
              </View>
              <Spacing height={24} />
            </>
          )}
          {parkingTicketData && (
            <Text
              size="B1"
              weight="medium"
              color="navy"
              className="underline"
              onPress={() =>
                navigation.navigate('ParkingTermAndConditionScreen', {
                  documentDetailData: content,
                })
              }>
              {t(
                'Residential__Car_Park_Payment__Read_Term_And_Conditions',
                'Read Terms and Conditions',
              )}
            </Text>
          )}
          {showImportPhysicalParkingTicket && (
            <View className={`${getTheme('border-[1px] border-line')} p-4`}>
              <Text weight="medium">
                {t(
                  'General__Save_ticket_title',
                  'Want to self redeem your parking ticket?',
                )}
              </Text>
              <Spacing height={20} />
              <View className={`${getTheme('border-[0.5px] border-line')}`} />
              <Spacing height={20} />
              <Text>
                {t(
                  'General__Save_ticket_description',
                  'Scan QR Code on your physical ticket to import it to One Bangkok and conveniently self redeem the parking ticket.',
                )}
              </Text>
              <Spacing height={24} />
              <Button
                onPress={() => {
                  navigation.navigate('ImportPhysicalParkingTicketScreen');
                }}
                outlined
                title={t(
                  'General__Save_ticket_button',
                  'Scan to Import Ticket',
                )}
                rightIcon="next"
              />
            </View>
          )}
          <Spacing height={100} />
        </Pressable>
      </ScrollView>
      { (enableParkingRedemption || (parkingFee > 0)) && enableParkingPayment && parkingTicketData && (
        <StickyButton
          title={ enableParkingRedemption? t(
            'General__Pay_now_or_redeem',
            'Pay Now or Redeem For Free Parking',
          ): t('General__Parking_paynow', 'Pay now') }
          rightIcon="next"
          iconHeight={25}
          iconWidth={25}
          onPress={handlePaynowClick}
        />
      )}
    </Screen>
  );
};

export default ParkingTicketScreen;
