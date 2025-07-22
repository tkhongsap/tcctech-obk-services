import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import {Button, HeadText} from '~/components/molecules';
import TextDetailCard from '../components/AddToMicro/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components';
import DatetimeParser from '../utils/reformatter/datetime';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {modalActions} from '../components/ResidentialModal';
import ContactConciergeModal from '../components/AmenityBooking/ContactConciergeModal';
import {phoneCall} from '../utils/phoneCall';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {logEvent} from '~/utils/logGA';

export enum MaintenanceAppStatus {
  SUBMITTED,
  IN_PROGRESS,
  DONE,
  CANCELLED,
}
export enum MaintenanceAPIStatusCode {
  NEW = 'NEW',
  ACKNOWLEDGE = 'ACK',
  ASSIGNED = 'ASN',
  IN_PROGRESS = 'IP',
  COMPLETED = 'COM',
  CLOSED = 'CLS',
  CANCELLED = 'CNL',
}
export const MaintenanceSubmittedStatuses = [MaintenanceAPIStatusCode.NEW];
export const MaintenanceInProgressStatuses = [
  MaintenanceAPIStatusCode.ACKNOWLEDGE,
  MaintenanceAPIStatusCode.ASSIGNED,
  MaintenanceAPIStatusCode.IN_PROGRESS,
  MaintenanceAPIStatusCode.COMPLETED,
];
export const MaintenanceDoneStatuses = [MaintenanceAPIStatusCode.CLOSED];
export const MaintenanceCancelledStatuses = [
  MaintenanceAPIStatusCode.CANCELLED,
];

export enum MaintenanceTab {
  CURRENT,
  PAST,
}

export type MaintenanceDetail = {
  orgId: string;
  id: string;
  companyId: string;
  projectId: string;
  displayId: string;
  caseTypeId: string;
  shortDescription: string;
  description: string;
  priorityId: string;
  eventTypeId: string;
  eventSubTypeId: string;
  assetId: string;
  locationType: number;
  propertyUnitId: string;
  commonAreaId: string;
  tenantId: string;
  cmStatusId: string;
  scheduledAt: string;
  sourceOfRequest: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  reportedByUnitId: string;
  reportedByTenantId: string;
  projectName: string;
  unitNumber: string;
  commonAreaName: string;
  buildingName: string;
  caseTypeName: string;
  eventTypeName: string;
  eventCategoryName: string;
  createdByName: string;
  statusCode: MaintenanceAPIStatusCode;
  statusName: string;
  s3Url: string;
  sqNo: string;
  tab: MaintenanceTab;
  projectNameThai: string;
  appStatus: MaintenanceAppStatus;
  houseNumber: string;
  reportedByBuildingName: string;
  reportedByHouseNumber: string;
  reportedByProjectName: string;
  reportedByProjectNameTh: string;
  reportedByUnitNumber: string;
  eventTypeDescription: string;
  reportedByFloors: {
    floorDescription: string;
    floorDescriptionTh: string;
    floorId: number;
    floorZoneCode: string;
  }[];
};

export const getMaintenanceAppStatus = (
  apiStatus: MaintenanceAPIStatusCode,
): MaintenanceAppStatus => {
  if (MaintenanceSubmittedStatuses.some(status => status === apiStatus)) {
    return MaintenanceAppStatus.SUBMITTED;
  }
  if (MaintenanceCancelledStatuses.some(status => status === apiStatus)) {
    return MaintenanceAppStatus.CANCELLED;
  }
  if (MaintenanceDoneStatuses.some(status => status === apiStatus)) {
    return MaintenanceAppStatus.DONE;
  }
  return MaintenanceAppStatus.IN_PROGRESS;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'MaintenanceDetailScreen'
>;

const MaintenanceDetailScreen = ({
  route: {
    params: {maintenance},
  },
}: Props) => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const navigation = useNavigation<StackNavigation>();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [liveChatAvatar, setLiveChatAvatar] = useState<string>('');
  const [conciergePhoneNumber, setConciergePhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    if (maintenance.s3Url) {
      Image.getSize(maintenance.s3Url, (width, height) => {
        setAspectRatio(width / height);
      });
    }
  }, [maintenance]);

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
            screen_name: 'MaintenanceDetailScreen',
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

  const getFloor = () => {
    try {
      const floor = maintenance.reportedByFloors[0].floorZoneCode;
      return `${t('General__Floor', 'Floor')} ${floor}`;
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
        iconHeight={25}
        iconWidth={25}
      />
      <ScrollView className="w-full px-6">
        <TouchableWithoutFeedback>
          <View className="flex w-full">
            <Spacing height={24} />

            <View className="flex-row justify-between">
              <HeadText
                tagline={t('General__Ticket', 'Ticket')}
                title={`#${maintenance.displayId}`}
                titleColor="default"
                taglineWeight="regular"
                titleSize="H3"
                taglineColor="subtitle-muted"
                descriptionColor="subtitle-muted"
                tagSpacing={0}
              />

              <MaintenanceStatusBadge appStatus={maintenance.appStatus} />
            </View>
            <Spacing height={16} />
            {maintenance.s3Url && (
              <>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    navigation.navigate('ResidentialPreviewImageScreen', {
                      imageUrl: maintenance.s3Url,
                      title: t(
                        'Residential__Maintenance__Detail',
                        'Maintenance & Repair Detail',
                      ),
                    });
                  }}>
                  <Image
                    source={{uri: maintenance.s3Url}}
                    style={{width: '100%', height: 266}}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Spacing height={20} />
              </>
            )}
            <DetailCard
              header={t('Residential__Service_request__Location', 'Location')}>
              {maintenance.locationType === 1 ? (
                <>
                  <TextDetailCard
                    label={t('General__Building', 'Building')}
                    text={
                      language === 'th'
                        ? maintenance.reportedByProjectNameTh
                        : maintenance.reportedByProjectName
                    }
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Guest_Management_Unit', 'Unit')}
                    text={maintenance.reportedByHouseNumber}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('General__Floor', 'Floor')}
                    text={getFloor()}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Maintenance__Area', 'Area')}
                    text={t(
                      'Residential__Maintenance__In_residence',
                      'In-residence',
                    )}
                  />
                </>
              ) : (
                <>
                  <TextDetailCard
                    label={t('Residential__Maintenance__Area', 'Area')}
                    text={t(
                      'Residential__Maintenance__Common_facility',
                      'Common Facility',
                    )}
                  />
                  <Spacing height={24} />
                  <TextDetailCard
                    label={t('Residential__Maintenance__Location', 'Location')}
                    text={maintenance.commonAreaName ?? '-'}
                  />
                </>
              )}
            </DetailCard>

            <Spacing height={24} />
            <DetailCard header={t('General__Issue', 'Issue')}>
              <>
                <TextDetailCard
                  label={t(
                    'Residential__Maintenance__Maintenance_and_Repair_Type',
                    'Maintenance & repair type',
                  )}
                  text={maintenance.eventTypeDescription ?? '-'}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t(
                    'Residential__Maintenance__Description',
                    'Description',
                  )}
                  text={maintenance.description ?? '-'}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t(
                    'Residential__Maintenance__Appointment_date',
                    'Appointment date',
                  )}
                  text={displayAppointmentAt(maintenance.scheduledAt)}
                />
              </>
            </DetailCard>
            {maintenance.tab === MaintenanceTab.CURRENT &&
              maintenance.appStatus !== MaintenanceAppStatus.IN_PROGRESS && (
                <View>
                  <Spacing height={24} />
                  <DetailCard
                    header={t(
                      'Residential__Changed_your_mind',
                      'Changed your mind?',
                    )}>
                    <>
                      <TextDetailCard
                        text={t(
                          'Residential__Maintenance_contact_desc',
                          'Please get in touch with the operations team in order to cancel your request.',
                        )}
                      />
                      <Spacing height={24} />
                      <View className="flex w-full">
                        <Button
                          title={t(
                            'Residential__Contact_concierge',
                            'Contact concierge',
                          )}
                          color="light-teal"
                          onPress={onPressContactConciergeModal}
                          disabled={isLoading}
                        />
                      </View>
                    </>
                  </DetailCard>
                </View>
              )}
          </View>
        </TouchableWithoutFeedback>
        <Spacing height={100} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default MaintenanceDetailScreen;

interface MaintenanceStatusBadgeProps {
  appStatus: MaintenanceAppStatus;
}
export const MaintenanceStatusBadge = ({
  appStatus,
}: MaintenanceStatusBadgeProps) => {
  switch (appStatus) {
    case MaintenanceAppStatus.CANCELLED:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#FFE1DF] border-[1px] border-[#A5170F]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Cancelled', 'Cancelled')}
          </Text>
        </View>
      );
    case MaintenanceAppStatus.SUBMITTED:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#FFFEC1] border-[1px] border-[#D19500]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Submitted', 'Submitted')}
          </Text>
        </View>
      );
    case MaintenanceAppStatus.IN_PROGRESS:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#D6F2FF] border-[1px] border-[#068EFF]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__In_progress', 'In progress')}
          </Text>
        </View>
      );
    case MaintenanceAppStatus.DONE:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#DFF9E5] border-[1px] border-[#1E7735]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Done', 'Done')}
          </Text>
        </View>
      );
    default:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#FFFEC1] border-[1px] border-[#D19500]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Submitted', 'Submitted')}
          </Text>
        </View>
      );
  }
};
