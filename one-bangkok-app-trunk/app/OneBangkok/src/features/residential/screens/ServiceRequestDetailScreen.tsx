import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ScreenContainer} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing, Text} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import ContactConciergeModal from '~/features/residential/components/AmenityBooking/ContactConciergeModal';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {phoneCall} from '../utils/phoneCall';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';
import {logEvent} from '~/utils/logGA';

export enum ServiceRequestTab {
  CURRENT,
  PAST,
}
export type ServiceRequest = {
  id: string;
  orgId: string;
  companyId: string;
  projectId: string;
  displayId: string;
  shortDescription: string;
  description: string;
  caseTypeId: string;
  eventTypeId: string;
  eventSubTypeId: string;
  assetId: string;
  locationType: string;
  propertyUnitId: string;
  commonAreaId: string;
  tenantId: string;
  cmStatusId: string;
  scheduledAt: string;
  sourceOfRequest: number;
  createdBy: null;
  createdAt: string;
  updatedBy: null;
  updatedAt: string;
  reportedByUnitId: string;
  reportedByTenantId: string;
  reportedByUnitNumber: string;
  reportedByHouseNumber: string;
  reportedByBuildingName: string;
  reportedByProjectName: string;
  caseTypeName: string;
  serviceRequestTypeId: string;
  serviceRequestTypeCode: string;
  serviceRequestTypeName: string;
  statusCode: ServiceRequestAPIStatusCode;
  statusName: string;
  s3Url: string;
  appStatus: ServiceRequestAppStatus;
  tab: ServiceRequestTab;
  floorName: string;
  projectNameThai: string;
};
export enum ServiceRequestAppStatus {
  SUBMITTED,
  IN_PROGRESS,
  DONE,
  CANCELLED,
}
export enum ServiceRequestAPIStatusCode {
  NEW = 'NEW',
  ACKNOWLEDGE = 'ACK',
  ASSIGNED = 'ASN',
  IN_PROGRESS = 'IP',
  COMPLETED = 'COM',
  CLOSED = 'CLS',
  CANCELLED = 'CNL',
}
export const serviceRequestSubmittedStatuses = [
  ServiceRequestAPIStatusCode.NEW,
];
export const serviceRequestInProgressStatuses = [
  ServiceRequestAPIStatusCode.ACKNOWLEDGE,
  ServiceRequestAPIStatusCode.ASSIGNED,
  ServiceRequestAPIStatusCode.IN_PROGRESS,
  ServiceRequestAPIStatusCode.COMPLETED,
];
export const serviceRequestDoneStatuses = [ServiceRequestAPIStatusCode.CLOSED];
export const serviceRequestCancelledStatuses = [
  ServiceRequestAPIStatusCode.CANCELLED,
];

export const getServiceRequestAppStatus = (
  apiStatus: ServiceRequestAPIStatusCode,
): ServiceRequestAppStatus => {
  if (serviceRequestSubmittedStatuses.some(status => status === apiStatus)) {
    return ServiceRequestAppStatus.SUBMITTED;
  }
  if (serviceRequestCancelledStatuses.some(status => status === apiStatus)) {
    return ServiceRequestAppStatus.CANCELLED;
  }
  if (serviceRequestDoneStatuses.some(status => status === apiStatus)) {
    return ServiceRequestAppStatus.DONE;
  }
  return ServiceRequestAppStatus.IN_PROGRESS;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ServiceRequestDetailScreen'
>;

const ServiceRequestDetailScreen = ({
  route: {
    params: {request},
  },
}: Props) => {
  const language =
    appLanguageState.currentLanguage.value ??
    appLanguageState.defaultLanguage.value;
  const navigation = useNavigation();
  const [liveChatAvatar, setLiveChatAvatar] = useState<string>('');
  const [conciergePhoneNumber, setConciergePhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    if (request.s3Url) {
      Image.getSize(
        request.s3Url,
        (width, height) => {
          const aspectRatio = height / width;
          setImageHeight(screenWidth * aspectRatio);
        },
        error => {
          console.log('Error loading image size:', error);
        },
      );
    }
  }, [request]);

  const preload = async () => {
    try {
      setIsLoading(true);
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
            screen_name: 'ServiceRequestDetailScreen',
            feature_name: 'Live Chat with Concierge/Juristic',
            action_type: 'click',
            bu: 'Residential',
          });
          navigation.navigate('ResidentialLiveChatScreen', {
            conciergeAvatar: liveChatAvatar,
          });
        }}
        onPressContactConcierge={() => phoneCall(conciergePhoneNumber)}
        phoneNumber={conciergePhoneNumber}
      />,
    );
    modalActions.show();
  };

  const displayAppointmentAt = (timestamp: string) => {
    try {
      if (!timestamp || timestamp === '') return '-';
      const language =
        appLanguageState.currentLanguage.value ||
        appLanguageState.defaultLanguage.value;
      return t('General__date_time', '{{date}} at {{time}}', {
        date: DatetimeParser.toDMY({
          language,
          timestamp: Number(timestamp),
        }),
        time: DatetimeParser.toHM({
          language,
          timestamp: Number(timestamp),
        }),
      });
    } catch (error) {
      return '-';
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
          'Residential__Service_request__Ticket_Details',
          'Ticket Details',
        )}
        bgColor="bg-vp-list"
        titleColor="dark-gray"
        leftColor="#292929"
      />
      <ScrollView
        className="w-full bg-[#FDFDFD]"
        showsVerticalScrollIndicator={false}>
        <View className="px-4 mb-[-100vh] flex flex-col">
          <View className="flex flex-row items-start justify-between w-full">
            <View className="flex flex-col items-start">
              <Text size="B2" className="text-[#57756C]">
                {t('Residential__Ticket', 'Ticket')}
              </Text>
              <Text size="H3" weight="medium">
                #{request.displayId}
              </Text>
            </View>
            <ServiceRequestStatusBadge appStatus={request.appStatus} />
          </View>
          <Spacing height={16} />
          {request.s3Url && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ResidentialPreviewImageScreen', {
                    imageUrl: request.s3Url,
                    title: t(
                      'Residential__Service_request__detail',
                      'Request Service Detail',
                    ),
                  })
                }>
                <Image
                  style={{width: '100%', height: 266}}
                  resizeMethod="auto"
                  resizeMode="cover"
                  source={{uri: request.s3Url}}
                  className="w-full"
                />
              </TouchableOpacity>
              <Spacing height={24} />
            </>
          )}

          <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
            <View className="flex flex-row items-center justify-start py-[20px] w-full ">
              <Text weight="medium">
                {t('Residential__Location', 'Location')}
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
                  {language === 'th'
                    ? request.projectNameThai
                    : request.reportedByProjectName}
                </Text>
              </View>

              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('Residential__Service_request__Unit', 'Unit')}
                </Text>
                <Text>{request.reportedByHouseNumber}</Text>
              </View>

              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('General__Floor', 'Floor')}
                </Text>
                <Text>
                  {t('General__Floor', 'Floor')} {request.floorName}
                </Text>
              </View>
            </View>
          </View>
          <Spacing height={24} />
          <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
            <View className="flex flex-row items-center justify-start py-[20px] w-full ">
              <Text weight="medium">{t('General__Issue', 'Issue')}</Text>
            </View>
            <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
            <View
              className="py-[20px] flex flex-col items-start"
              style={{gap: 24}}>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t(
                    'Residential__Service_request__Service_type',
                    'Service type',
                  )}
                </Text>
                <Text>{request.serviceRequestTypeName}</Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t('Residential__Maintenance__Description', 'Description')}
                </Text>
                <Text>{request.description || '-'}</Text>
              </View>
              <View style={{gap: 4}}>
                <Text size="C1" color="subtitle-muted">
                  {t(
                    'Residential__Maintenance__Appointment_date',
                    'Appointment date',
                  )}
                </Text>
                <Text>{displayAppointmentAt(request.scheduledAt)}</Text>
              </View>
            </View>
          </View>
          <Spacing height={24} />
          {request.tab === ServiceRequestTab.CURRENT &&
            request.appStatus !== ServiceRequestAppStatus.IN_PROGRESS && (
              <View className="flex flex-col border-[1px] border-[#dcdcdc] px-[16px]">
                <View className="flex flex-row items-center justify-start py-[20px] w-full ">
                  <Text weight="medium">
                    {t(
                      'Residential__Amenity_Booking__Changed_your_mind',
                      'Changed your mind?',
                    )}
                  </Text>
                </View>
                <View className="w-full border-t-[1px] border-[#dcdcdc]"></View>
                <View
                  className="py-[20px] flex flex-col items-start"
                  style={{gap: 24}}>
                  <View style={{gap: 4}}>
                    <Text>
                      {t(
                        'Residential__Amenity_Booking__Changed_your_mind_des',
                        'Please get in touch with the operations team in order to cancel your request.',
                      )}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="w-full h-[48px] flex items-center justify-center border-[1px] border-[#014541] bg-[#E4E4E4]"
                    onPress={onPressContactConciergeModal}
                    disabled={isLoading}>
                    <Text weight="medium" color="dark-teal">
                      {t(
                        'Residential__Amenity_Booking__Contact_concierge',
                        'Contact concierge',
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </View>
        <Spacing height={1000} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default ServiceRequestDetailScreen;

interface ServiceRequestStatusBadgeProps {
  appStatus: ServiceRequestAppStatus;
}
export const ServiceRequestStatusBadge = ({
  appStatus,
}: ServiceRequestStatusBadgeProps) => {
  switch (appStatus) {
    case ServiceRequestAppStatus.CANCELLED:
      return (
        <View className="p-[8px] bg-[#FFE1DF] border-[1px] border-[#A5170F]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Cancelled', 'Cancelled')}
          </Text>
        </View>
      );
    case ServiceRequestAppStatus.SUBMITTED:
      return (
        <View className="p-[8px] bg-[#FFFEC1] border-[1px] border-[#D19500]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Submitted', 'Submitted')}
          </Text>
        </View>
      );
    case ServiceRequestAppStatus.IN_PROGRESS:
      return (
        <View className="p-[8px] bg-[#D6F2FF] border-[1px] border-[#068EFF]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__In_progress', 'In progress')}
          </Text>
        </View>
      );
    case ServiceRequestAppStatus.DONE:
      return (
        <View className="p-[8px] bg-[#DFF9E5] border-[1px] border-[#1E7735]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Done', 'Done')}
          </Text>
        </View>
      );
    default:
      return (
        <View className="p-[8px] bg-[#FFFEC1] border-[1px] border-[#D19500]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Submitted', 'Submitted')}
          </Text>
        </View>
      );
  }
};
