import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenContainer} from '../components';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import TextDetailCard from '../components/AddToMicro/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {classNameStatus} from '../constants/residential';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';
import DetailCardParcel from '../components/DetailCardParcel';

type ParcelImage = {
  id: string;
  entityId: string;
  entityType: string;
  s3Url: string;
  title: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  orgId: string;
  s3Path: string;
  record_id: string;
  source_rid: string;
  plantLotId: string;
  workPlanScheduleLocationTaskId: string;
  refImageUrl: string;
  watermarkedImageS3Path: string;
};

export type ParcelDetail = {
  id: string;
  orgId: string;
  companyId: string;
  trackingNumber: string;
  carrierId: string;
  parcelConditionId: string;
  parcelTypeId: string;
  parcelStatus: number;
  parcelPriority: number;
  pickedUpType: number;
  description: string;
  receivedDate: string;
  receivedBy: string;
  pickedUpAt: string;
  qrCode: string;
  barcode: string;
  signature: string;
  parcelViewStatus: string;
  isPendingForApproval: boolean;
  displayId: string;
  isActive: true;
  storageLocationId: string;
  moderationStatus: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  readStatus: bigint;
  deliveryDate: string;
  arrivedOn: string;
  returnedOn: string;
  deliveryLocationId: string;
  returnedLocationId: string;
  cancelledOn: string;
  returnedToId: string;
  receiver: {
    id: string;
    orgId: string;
    companyId: string;
    projectId: string;
    buildingId: string;
    unitId: string;
    parcelId: string;
    tenantId: string;
    ownerId: string;
    residentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    address: string;
  };
  sender: {
    orgId: string;
    id: string;
    parcelId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    address: string;
  };
  propertyData: {
    companyName: string;
    projectName: string;
    buildingName: string;
    buildingPhaseCode: string;
    unitNumber: string;
  };
  parcelStatusDetail: {
    id: string;
    orgId: string;
    projectId: string;
    statusName: string;
    statusId: number;
    listOrder: number;
    isDefault: boolean;
  };
  receivedLocation: {
    id: string;
    orgId: string;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
  };
  deliveredLocation: {
    id: number;
    orgId: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: number;
    createdAt: number;
    updatedBy: number;
    updatedAt: number;
  };
  returnedTo: {
    id: number;
    orgId: number;
    code: string;
    name: string;
    mobileNo: string;
    website: string;
    address: string;
    isActive: boolean;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    updatedBy: number;
  };
  carrier: {
    id: string;
    orgId: string;
    code: string;
    name: string;
    mobileNo: string;
    website: string;
    address: string;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
  };
  parcelConditionDetail: {
    id: string;
    parcelCondition: string;
    description: string;
    orgId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    isActive: boolean;
    listOrder: string;
  };
  parcelTypeDetail: {
    id: string;
    parcelType: string;
    description: string;
    orgId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    isActive: boolean;
    icon: {
      id: number;
      entityId: number;
      entityType: string;
      s3Url: string;
      title: string;
      name: string;
      createdAt: number;
      updatedAt: number;
      isActive: true;
      orgId: number;
      s3Path: string;
      record_id: string;
      source_rid: string;
      refImageUrl: string;
    };
  };
  parcelImages: ParcelImage[];
  deliveredImages: ParcelImage[];
  rejectImages: ParcelImage[];
  returnImages: ParcelImage[];
  cancelImages: ParcelImage[];
  returnRemark: string;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ParcelBoxDetailScreen'
>;

const ParcelBoxDetailScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [parcel, setParcel] = useState<ParcelDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    getParcel(id);
  }, [id]);

  useEffect(() => {
    if (parcel) {
      updateReadStatus();
      const image = getImage(parcel);
      setImage(image);
      if (image) {
        Image.getSize(image, (width, height) => {
          setAspectRatio(width / height); // Calculate aspect ratio
        });
      }
    }
  }, [parcel]);

  const getParcel = async (parcelId: string) => {
    try {
      setIsLoading(true);
      const {data} = await serviceMindService.parcelDetail(parcelId);
      setParcel(data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateReadStatus = async () => {
    try {
      if (parcel && !parcel.readStatus) {
        await serviceMindService.parcelUpdateReadStatus(parcel.id);
      }
    } catch (error) {}
  };

  const isReturnedType = () => {
    return (
      parcel &&
      parcel.parcelStatusDetail.statusName.toLowerCase().includes('returned')
    );
  };

  const parseDateFormat = (timestamp: number) => {
    try {
      if (!timestamp) return '-';
      return `${DatetimeParser.toDMY({language, timestamp})} ${
        language === 'en' ? 'at ' : ''
      }${DatetimeParser.toHM({language, timestamp})}`;
    } catch (error) {
      return '';
    }
  };

  const onPressImage = () => {
    if (!parcel) return;
    navigation.navigate('ResidentialParcelBoxImagePreviewScreen', {
      imageUrl: image ?? '',
    });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const {data} = await serviceMindService.parcelDetail(id);
      setParcel(data.data);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const mappingStatusLanguage = (status: string) => {
    switch (status) {
      case 'Received':
        return t('Residential__Parcel_Box__Received', 'New');
      case 'Delivered':
        return t('Residential__Parcel_Box__Delivered', 'Success');
      case 'Returned':
        return t('Residential__Parcel_Box__Returned', 'Return');
      case 'Return':
        return t('Residential__Parcel_Box__Returned', 'Return');
      case 'Pick Up':
        return t('Residential__Parcel_Box__Pick_up', 'Pick Up');
      case 'Picked Up':
        return t('Residential__Parcel_Box__Pick_up', 'Pick Up');
      default:
        return status;
    }
  };

  const getImage = (parcel: ParcelDetail) => {
    try {
      const status = parcel.parcelStatusDetail.statusName;
      if (status === 'Delivered') {
        return parcel.deliveredImages[0].s3Url;
      } else if (status === 'Picked Up') {
        return parcel.deliveredImages[0].s3Url;
      } else if (status === 'Pick Up') {
        return parcel.deliveredImages[0].s3Url;
      } else if (status === 'Returned') {
        return parcel.returnImages[0].s3Url;
      } else {
        return parcel.parcelImages[0].s3Url;
      }
    } catch (error) {
      return '';
    }
  };

  const parcelDateTitle = (parcelType: string) => {
    parcelType = parcelType.toLowerCase();
    switch (parcelType) {
      case 'returned':
        return t('Residential__Returned_on', 'Date');
      case 'delivered':
        return t('Residential__Delivery_date', 'Date');
      case 'picked up':
        return t('Residential__Parcel_Box__Pick_up_date', 'Pick up date');
      case 'pick up':
        return t('Residential__Parcel_Box__Pick_up_date', 'Pick up date');
      default:
        return t('Residential__Arrived_on', 'Arrived on');
    }
  };

  const parcelDatetime = (parcel: ParcelDetail) => {
    const parcelType = parcel.parcelStatusDetail.statusName.toLowerCase();
    switch (parcelType) {
      case 'returned':
        return parcel.returnedOn;
      case 'delivered':
        return parcel.deliveryDate;
      case 'picked up':
        return parcel.deliveryDate;
      case 'pick up':
        return parcel.deliveryDate;
      default:
        return parcel.arrivedOn;
    }
  };

  const getLocation = (parcel: ParcelDetail) => {
    try {
      const parcelType = parcel.parcelStatusDetail.statusName.toLowerCase();
      switch (parcelType) {
        case 'returned':
          return parcel.returnedTo.name;
        case 'delivered':
          return parcel.deliveredLocation.name;
        case 'picked up':
          return parcel.deliveredLocation.name;
        case 'pick up':
          return parcel.deliveredLocation.name;
        default:
          return parcel.receivedLocation.name;
      }
    } catch (error) {
      return '-';
    }
  };

  const isDeliveredOrPickedUp = (parcelStatusName: string) => {
    try {
      parcelStatusName = parcelStatusName.toLowerCase();
      return (
        parcelStatusName === 'delivered' ||
        parcelStatusName === 'picked up' ||
        parcelStatusName === 'pick up'
      );
    } catch (error) {
      return false;
    }
  };

  return (
    <ScreenContainer
      isLoading={isLoading}
      bgColor="#ffffff"
      barStyle="dark-content">
      <Header
        leftAction="goBack"
        title={t('Residential__Parcel_Detail', 'Parcel Detail')}
        iconHeight={25}
        iconWidth={25}
        bgColor="bg-white"
        titleColor="dark-gray"
      />
      {parcel && (
        <ScrollView
          className="w-full px-6"
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }>
          <TouchableWithoutFeedback>
            <View className="flex w-full">
              <Spacing height={24} />

              <View className="flex-row justify-between">
                <HeadText
                  tagline={t('Residential__Parcel', 'Parcel')}
                  title={parcel.displayId}
                  titleColor="default"
                  taglineWeight="regular"
                  titleSize="H3"
                  taglineColor="subtitle-muted"
                  descriptionColor="subtitle-muted"
                  tagSpacing={0}
                />

                <View
                  className={`p-[4px] px-2 h-[26px] ${
                    classNameStatus[
                      parcel.parcelStatusDetail.statusName.toLowerCase()
                    ]
                  }`}>
                  <Text size="C1">
                    {mappingStatusLanguage(
                      parcel.parcelStatusDetail.statusName,
                    )}
                  </Text>
                </View>
              </View>

              {image && (
                <TouchableOpacity onPress={onPressImage}>
                  <Spacing height={24} />
                  <Image
                    source={{uri: image}}
                    style={{width: '100%', aspectRatio}}
                    resizeMethod="scale"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              <Spacing height={24} />
              <DetailCardParcel header={''}>
                <>
                  <TextDetailCard
                    label={t('Residential__Parcel_type', 'Parcel Type')}
                    text={parcel?.parcelTypeDetail?.parcelType ?? '-'}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Acceptee', 'Acceptee')}
                    text={`${parcel.receiver.firstName} ${parcel.receiver.lastName}`}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Carrier', 'Carrier')}
                    text={parcel?.carrier?.name || '-'}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Tracking_no', 'Tracking no.')}
                    text={parcel?.trackingNumber || '-'}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={
                      isReturnedType()
                        ? t('Residential__Returned_to', 'Return')
                        : t('Residential__Location', 'Location')
                    }
                    text={getLocation(parcel)}
                  />
                  {isDeliveredOrPickedUp(
                    parcel.parcelStatusDetail.statusName,
                  ) && (
                    <>
                      <Spacing height={24} />
                      <TextDetailCard
                        label={t('Residential__Arrived_on', 'Arrived on')}
                        text={parseDateFormat(parseInt(parcel.arrivedOn))}
                      />
                    </>
                  )}
                  <Spacing height={24} />
                  <TextDetailCard
                    label={parcelDateTitle(
                      parcel.parcelStatusDetail.statusName,
                    )}
                    text={parseDateFormat(parseInt(parcelDatetime(parcel)))}
                  />
                </>
              </DetailCardParcel>

              <Spacing height={40} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
      {Platform.OS === 'ios' && <Spacing height={100} />}
    </ScreenContainer>
  );
};

export default ParcelBoxDetailScreen;
