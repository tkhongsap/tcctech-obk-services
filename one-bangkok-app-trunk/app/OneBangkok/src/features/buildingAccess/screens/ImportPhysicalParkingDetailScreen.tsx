import {Screen} from '~/components/templates';
import React, {useCallback, useEffect, useState} from 'react';
import {Header, HeadText, StickyButton, useModal} from '~/components/molecules';
import {Pressable, ScrollView, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import dayjs from 'dayjs';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {useIsFocused} from '@react-navigation/native';
import {
  RootStackParamList,
  StackNavigation,
  useNavigation,
} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import getTheme from '~/utils/themes/themeUtils';
import {
  ParkingSpaceDetailAndSpaceDetailData,
  ParkingTicketData,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import ParkingTicketQrcode from '../components/ParkingTicketQrcode';
import faqAction from '~/states/setting/faq/faqAction';
import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import qrTokenService from '~/services/QRTokenService';
import {debounce, get, isEmpty, isNull} from 'lodash';
import Loading from '~/components/organisms/Loading';
import ParkingDetail from '../components/ParkingDetail';
import firebaseConfigState from '~/states/firebase';
import parkingService from '~/services/parkingService';
import {valetStatus as status} from '../constants/valet';
import CarLocation from '../components/CarLocation';
import CannotLocateCar from '../components/CannotLocateCar';
import ParkingValetButton from '../components/ParkingValetButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Confirmation} from '~/components/organisms/GenericModal';
import {AnnouncementType, SpecialWidgetType} from '~/components/Announcement';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';

interface IProps {
  qrValue: string;
  parkingTicketData?: WrappedResponseParkingTicketDataData | null;
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

const goToAnnoucement = (
  navigation: StackNavigation,
  type: AnnouncementType,
  title: string,
  message: string,
  buttonText: string,
  specialWidget?: SpecialWidgetType,
) => {
  navigation.navigate('AnnouncementScreen', {
    type,
    title,
    message,
    buttonText,
    screenHook: 'ImportPhysicalParkingDetailScreen',
    specialWidget,
  });
};
interface IRenderConfirmSavingTicket {
  onContinue: Function;
  onCancel: Function;
}

const ConfirmSavingTicketModal = ({
  onContinue,
  onCancel,
}: IRenderConfirmSavingTicket) => {
  return (
    <Confirmation
      title={t('Drawer__Save_ticket__Title', 'Confirm saving parking ticket')}
      description={t(
        'Drawer__Save_ticket__Description',
        'You are saving this parking ticket to your account. Do you confirm saving this ticket?',
      )}
      onCancel={() => onCancel()}
      onContinue={() => onContinue()}
    />
  );
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ImportPhysicalParkingDetailScreen'
>;

const ImportPhysicalParkingDetailScreen = ({
  route: {
    params: {logId},
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const currentLanguage = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : 'en';
  const enableParkingLocation =
    firebaseConfigState.enable_parking_location.value;
  const enableValetParking = firebaseConfigState.enable_valet_parking.value;
  const enableParkingPayment = firebaseConfigState.enable_parking_payment.value;

  const [updatedTime, setUpdatedTime] = useState(
    `${dayjs()
      .locale(currentLanguage)
      .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`,
  );
  const [parkingTicketData, setParkingTicketData] =
    useState<ParkingTicketData>();
  const [qrValue, setQrValue] = useState('');
  const [content, setContent] = useState<DocumentDetailData>();
  const [loading, setLoading] = useState(true);
  const [valetId, setValetId] = useState<number>();
  const [valetStatus, setValetStatus] = useState('');
  const [pickUpStation, setPickupStation] = useState('');
  const [parkingFee, setParkingFee] = useState(0);
  const [shouldGoBackToImportTicket, setShouldGoBackToImportTicket] =
    useState(true);
  const saveParkingTicket = async () => {
    modalActions.hide();
    setLoading(true);
    const res = await OB_BMS_SDK.client.parkingTicketsImport({
      logId: logId,
    });
    if (res.status === 200) {
      setShouldGoBackToImportTicket(false);
      goToAnnoucement(
        navigation,
        'success',
        t(
          'Announcement__Save_ticket__Success_title',
          'Receipt imported successfully',
        ),
        t(
          'Save_ticket__Success_discription',
          'Your parking ticket has been imported successfully. You can view you digital parking ticket now.',
        ),
        t('General__Done', 'Done'),
      );
    } else {
      goToAnnoucement(
        navigation,
        'invalid',
        t(
          'Announcement__Save_ticket__Error_title',
          'Parking ticket cannot be saved',
        ),
        t(
          'Announcement__Save_ticket__Error_description',
          'There is a problem saving this parking ticket. Please check and try again. \n \nPlease contact our support \n023 456 789 or support@onebangkok.com',
        ),
        t('General__Try_again', 'Try again'),
        'contactSupport',
      );
      setShouldGoBackToImportTicket(false);
    }
    setLoading(false);
  };

  const openModal = () => {
    modalActions.setContent(
      <ConfirmSavingTicketModal
        onContinue={() => saveParkingTicket()}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };
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
      setLoading(false);
    }
  }, [updateFetchTime]);

  const fetchQrCodeOfMember = useCallback(async () => {
    const result = await qrTokenService.get();
    const qrData = get(result, 'data');
    if (isNull(qrData) || isEmpty(qrData)) {
      await generateQrCodeOfMember();
    } else {
      const tokenString = JSON.stringify(qrData.token);

      setQrValue(tokenString);
    }
  }, [generateQrCodeOfMember]);

  const fetchData = useCallback(async () => {
    const res = await OB_BMS_SDK.client.parkingTicketsIndex('log_id', logId);
    const parkingData = res?.data?.data as ParkingTicketData[];
    if (parkingData && parkingData.length > 0) {
      await fetchQrCodeOfMember();
      setParkingTicketData(parkingData[0]);

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
    } else {
      goToAnnoucement(
        navigation,
        'invalid',
        t('Announcement__Save_ticket__Invalid_tile', 'Invalid parking ticket'),
        t(
          'Announcement__Save_ticket__Invalid_description',
          'This parking ticket cannot be imported. This maybe due to this parking has previously been imported. Please check and try again. \n \nPlease contact our support',
        ),
        t('General__Try_again', 'Try again'),
        'contactSupport',
      );
    }
  }, [
    fetchQrCodeOfMember,
    updateFetchTime,
    enableValetParking,
    logId,
    navigation,
  ]);

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
    if (parkingTicketData && parkingTicketData?.total_fee > 0) {
      setParkingFee(parkingTicketData?.total_fee);
    } else {
      setParkingFee(0);
    }
  }, [parkingTicketData]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchTermsAndConditions();
    }
  }, [fetchData, fetchTermsAndConditions, isFocused]);

  useScreenHook('ImportPhysicalParkingDetailScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'invalid') {
          shouldGoBackToImportTicket
            ? navigation.navigate('ImportPhysicalParkingTicketScreen')
            : navigation.goBack();
          break;
        } else if (event.from.params.type === 'success') {
          navigation.navigate('ParkingTicketScreen');
          break;
        }
        break;
      default:
        break;
    }
  });

  const handleRefresh = () => {
    setLoading(true);
    generateQrCodeOfMember();
  };

  const onRefreshPress = debounce(handleRefresh, 500);

  if (loading) {
    return (
      <Screen>
        <Loading isLoading={loading} />
      </Screen>
    );
  }

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
            {!parkingTicketData && (
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
                {t('no_key', 'Read Terms and Conditions')}
              </Text>
            )}
            <Spacing height={4} />
            {parkingTicketData && <ParkingDetail data={parkingTicketData} />}
          </View>
          {enableValetParking && parkingTicketData && (
            <>
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
                <Spacing height={24} />
                <ParkingLocationDetails {...parkingTicketData} />
                <Spacing height={32} />
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
              {t('no_key', 'Read Terms and Conditions')}
            </Text>
          )}
          <Spacing height={24} />
        </Pressable>
      </ScrollView>
      {parkingTicketData && (
        <View className="w-full">
          <StickyButton
            title={t('General__Save_ticket', 'Save Parking Ticket')}
            rightIcon="next"
            onPress={() => openModal()}
          />
        </View>
      )}
    </Screen>
  );
};

export default ImportPhysicalParkingDetailScreen;
