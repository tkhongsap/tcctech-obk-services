import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Screen} from '~/components/templates';
import {Header} from '~/components/molecules/Header';
import t from '~/utils/text';
import {Icon, Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import {Button, HeadText} from '~/components/molecules';
import TextDetailCard from '../components/AddToMicro/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import ContactConciergeModal from '../components/AmenityBooking/ContactConciergeModal';
import {modalActions} from '../components/ResidentialModal';
import {phoneCall} from '../utils/phoneCall';
import DatetimeParser from '../utils/reformatter/datetime';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {logEvent} from '~/utils/logGA';

export enum FeedbackAppStatus {
  SUBMITTED,
  ACKNOWLEDGE,
  DONE,
  CANCELLED,
}
export enum FeedbackAPIStatusCode {
  NEW = 'NEW',
  ACKNOWLEDGE = 'ACK',
  CLOSED = 'CLS',
  CANCELLED = 'CNL',
}
export const FeedbackSubmittedStatuses = [FeedbackAPIStatusCode.NEW];
export const FeedbackAcknowledgeStatuses = [FeedbackAPIStatusCode.ACKNOWLEDGE];
export const FeedbackDoneStatuses = [FeedbackAPIStatusCode.CLOSED];
export const FeedbackCancelledStatuses = [FeedbackAPIStatusCode.CANCELLED];
export enum FeedbackTab {
  CURRENT,
  PAST,
}

export const getFeedbackAppStatus = (
  apiStatus: FeedbackAPIStatusCode,
): FeedbackAppStatus => {
  if (FeedbackSubmittedStatuses.some(status => status === apiStatus)) {
    return FeedbackAppStatus.SUBMITTED;
  }
  if (FeedbackAcknowledgeStatuses.some(status => status === apiStatus)) {
    return FeedbackAppStatus.ACKNOWLEDGE;
  }
  if (FeedbackDoneStatuses.some(status => status === apiStatus)) {
    return FeedbackAppStatus.DONE;
  }
  if (FeedbackCancelledStatuses.some(status => status === apiStatus)) {
    return FeedbackAppStatus.CANCELLED;
  }
  return FeedbackAppStatus.CANCELLED;
};

export type FeedbackDetail = {
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
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  reportedByUnitId: string;
  reportedByTenantId: string;
  reportedByUnitNumber: string;
  reportedByHouseNumber: string;
  reportedByBuildingName: string;
  reportedByProjectName: string;
  caseTypeName: string;
  statusCode: FeedbackAPIStatusCode;
  statusName: string;
  s3Url: string;
  tab: FeedbackTab;
  appStatus: FeedbackAppStatus;
  feedbackTypeCode: string;
  feedbackTypeId: string;
  feedbackTypeName: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'FeedbackDetailScreen'>;

const FeedbackDetailScreen = ({
  route: {
    params: {feedback},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [liveChatAvatar, setLiveChatAvatar] = useState<string>('');
  const [conciergePhoneNumber, setConciergePhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadImageError, setLoadImageError] = useState(false);
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    if (feedback.s3Url) {
      Image.getSize(
        feedback.s3Url,
        (width, height) => {
          setAspectRatio(width / height);
        },
        error => {
          setLoadImageError(true);
        },
      );
    }
  }, [feedback]);

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
            screen_name: 'FeedbackDetailScreen',
            feature_name: 'Live Chat with Concierge/Juristic',
            action_type: 'click',
            bu: 'Residential',
          });
          navigation.navigate('ResidentialLiveChatScreen', {
            conciergeAvatar: liveChatAvatar,
          });
        }}
        phoneNumber={conciergePhoneNumber}
        onPressContactConcierge={() => phoneCall(conciergePhoneNumber)}
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

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('Residential__Feedback_Details', 'Feedback Details')}
        iconHeight={25}
        iconWidth={25}
      />
      <ScrollView className="w-full px-6">
        <TouchableWithoutFeedback>
          <View className="flex w-full">
            <Spacing height={24} />

            <View className="flex-row justify-between">
              <HeadText
                tagline={t('Residential__Ticket', 'Ticket')}
                title={`#${feedback.displayId}`}
                titleColor="default"
                taglineWeight="regular"
                titleSize="H3"
                taglineColor="subtitle-muted"
                descriptionColor="subtitle-muted"
                tagSpacing={0}
              />
              <FeedbackStatusBadge appStatus={feedback.appStatus} />
            </View>
            <Spacing height={16} />
            {feedback.s3Url && !loadImageError && (
              <>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    navigation.navigate('ResidentialPreviewImageScreen', {
                      imageUrl: feedback.s3Url,
                      title: t(
                        'Residential__Feedback__detail',
                        'Feedback Detail',
                      ),
                    });
                  }}>
                  <Image
                    source={{uri: feedback.s3Url}}
                    style={{width: '100%', height: 266}}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Spacing height={28} />
              </>
            )}
            <DetailCard header={t('Residential__Detail', 'Detail')}>
              <>
                <TextDetailCard
                  label={t('Residential__Topic', 'Topic')}
                  text={feedback.feedbackTypeName}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t(
                    'Residential__Maintenance__Description',
                    'Description',
                  )}
                  text={feedback.description}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t(
                    'Residential__Maintenance__Appointment_date',
                    'Appointment date',
                  )}
                  text={displayAppointmentAt(feedback.scheduledAt)}
                />
              </>
            </DetailCard>
            {feedback.tab === FeedbackTab.CURRENT &&
              feedback.appStatus === FeedbackAppStatus.SUBMITTED && (
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
                          'Residential__Changed_your_mind__Body',
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
                          onPress={onPressContactConciergeModal}
                          color="light-teal"
                          disabled={isLoading}
                        />
                      </View>
                    </>
                  </DetailCard>
                </View>
              )}

            <Spacing height={24} />

            <Spacing height={40} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Screen>
  );
};

export default FeedbackDetailScreen;

interface FeedbackStatusBadgeProps {
  appStatus: FeedbackAppStatus;
}
export const FeedbackStatusBadge = ({appStatus}: FeedbackStatusBadgeProps) => {
  switch (appStatus) {
    case FeedbackAppStatus.ACKNOWLEDGE:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#D6F2FF] border-[1px] border-[#068EFF]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Feedback_acknowledge', 'Acknowledge')}
          </Text>
        </View>
      );
    case FeedbackAppStatus.SUBMITTED:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#FFFEC1] border-[1px] border-[#D19500]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Submitted', 'Submitted')}
          </Text>
        </View>
      );
    case FeedbackAppStatus.DONE:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#DFF9E5] border-[1px] border-[#1E7735]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Done', 'Done')}
          </Text>
        </View>
      );
    default:
      return (
        <View className="p-[4px] px-2 h-[26px] bg-[#FFE1DF] border-[1px] border-[#A5170F]">
          <Text color="dark-gray" size="C1">
            {t('Residential__Service_request__Cancelled', 'Cancelled')}
          </Text>
        </View>
      );
  }
};
