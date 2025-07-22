import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {Screen} from '~/components/templates';
import {Button, HeadText, Header, useModal} from '~/components/molecules';
import t from '~/utils/text';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import TextDetailCard from '../components/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {classNameStatus} from '../constants/buildingAccess';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import dayjs from 'dayjs';
import DateTime from '~/utils/datetime';
import {calculateEstimatedCost} from '../components/createACSecondPage';
import {useAccountState} from '~/states/account/accountState';
import {ModalContactOurSupport} from '~/components/organisms/GenericModal';
import {ACRequestStatus} from 'ob-bms-sdk/dist/api';
import {sortedZone} from '~/utils/sorted';
import {logScreenView} from '~/utils/logGA';

export const UntilDate = ({
  dateFrom,
  dateTo,
  durationHour,
}: {
  dateFrom: string;
  dateTo: string;
  durationHour: number;
}) => {
  if (dateFrom) {
    const isSameDate = DateTime.isSame(
      dayjs(dateFrom).toISOString(),
      dayjs(dateFrom).add(durationHour, 'hours').toISOString(),
    );
    if (!isSameDate) {
      return (
        <>
          <Spacing height={24} />
          <TextDetailCard
            label={t('General__Until', 'Until')}
            text={dayjs(dateTo).format('DD MMMM YYYY')}
          />
        </>
      );
    }
    return <View />;
  }
  return <View />;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AirConditionerRequestDetailScreen'
>;

const AirConditionerRequestDetailScreen = ({
  route: {
    params: {data},
  },
}: Props) => {
  const navigation = useNavigation();
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  const [_modalState, modalActions] = useModal();
  const {profile: globalProfile} = useAccountState();
  const profile = globalProfile.value;

  const ModalActionContactOurSupport = () => {
    modalActions.setContent(
      <ModalContactOurSupport onPressCancel={() => modalActions.hide()} />,
    );
    modalActions.show();
  };
  const getNameACZone = useCallback(() => {
    const acZones: string[] = [];
    data.ac_zone?.forEach(acZone => {
      acZones.push(acZone?.ac_zone?.name);
    });
    const sortedZones = sortedZone(acZones)
    return sortedZones?.join(', ');
  }, [data]);
  const getAreaSizeACZone = useCallback(() => {
    let areaSizeAcZone: number = 0;
    data.ac_zone?.forEach(acZone => {
      areaSizeAcZone += acZone?.ac_zone?.area_size;
    });

    return areaSizeAcZone ?? 0;
  }, [data]);

  const mapStatusText = () => {
    switch (data.status) {
      case ACRequestStatus.Submitted:
        return t('General__Submitted', 'Submitted');
      case ACRequestStatus.Rejected:
        return t('General__Rejected', 'Rejected');
      case ACRequestStatus.Approved:
        return t('General__Approved', 'Approved');
    }
  };

  useEffect(() => {
    logScreenView('AirConditionerRequestDetailScreen');
  }, []);

  return (
    <Screen>
      <Header
        leftAction="goBack"
        onPressLeftAction={() => navigation.goBack()}
        title={t('General__Ticket_details', 'Ticket Details')}
      />
      <ScrollView className="w-screen px-4 py-8">
        <TouchableWithoutFeedback>
          <View>
            <View className="flex-row justify-between items-start">
              <View className="w-9/12">
                <HeadText
                  tagline={t('General__Ticket', 'Ticket')}
                  title={data.references}
                  titleSize="H3"
                  titleClamps="leading-[26.4]"
                />
              </View>
              <View className={`p-[8px] ${classNameStatus[data.status]}`}>
                <Text size="C1">{mapStatusText()}</Text>
              </View>
            </View>
            <Spacing height={32} />
            <DetailCard header={t('General__Location', 'Location')}>
              <>
                <Spacing height={12} />
                <TextDetailCard
                  label={t('General__Building', 'Building')}
                  text={data.tower.display_name[languageSelected]}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Floor', 'Floor')}
                  text={
                    data.floor.display_name[languageSelected] ?? data.floor.name
                  }
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Zone', 'Zone')}
                  text={getNameACZone()}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Booking_information', 'Booking information')}>
              <>
                <TextDetailCard
                  label={t('General__Date', 'Date')}
                  text={dayjs(data.from)
                    .locale(languageSelected)
                    .format('DD MMMM YYYY')}
                />
                <UntilDate
                  dateFrom={data.from}
                  dateTo={data.to}
                  durationHour={data.duration_hour}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Time', 'Time')}
                  text={`${dayjs(data.from).format('HH:mm')} - ${dayjs(
                    data.from,
                  )
                    .add(Number(data.duration_hour), 'hours')
                    .format('HH:mm')}`}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Duration', 'Duration')}
                  text={t('General__Hour_hours', '{{hours}} hours', {
                    hours: data.duration_hour,
                  })}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Area', 'Area')}
                  text={t('General__Sq.m', '{{area}} Sq.m', {
                    area: getAreaSizeACZone().toLocaleString() ?? 0,
                  })}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Estimate_cost', 'Estimate cost')}
                  text={t('General__Bath_value', '{{value}} Bath', {
                    value: calculateEstimatedCost(
                      data.duration_hour.toString(),
                      getAreaSizeACZone() ?? 0,
                    ),
                  })}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Request_information', 'Request information')}>
              <>
                <TextDetailCard
                  label={t('General__Requested_by', 'Requested by')}
                  text={t(
                    'no_key',
                    '{{firstName}} {{middleName}} {{lastName}}',
                    {
                      firstName: profile?.first_name,
                      middleName: profile?.middle_name,
                      lastName: profile?.last_name,
                    },
                  )}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Request_date', 'Request date')}
                  text={dayjs(data.created_at)
                    .locale(languageSelected)
                    .format('DD MMMM YYYY')}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Request_time', 'Request time')}
                  text={dayjs(data.created_at).format('HH:mm')}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <>
              <DetailCard
                header={
                  data.status == ACRequestStatus.Rejected
                    ? t('no_key', 'Reason')
                    : t(
                        'Service__Ticket_detail__Change_title',
                        'Changed your mind?',
                      )
                }>
                <>
                  <TextDetailCard
                    text={
                      data.status == ACRequestStatus.Rejected
                        ? data.reason
                        : t(
                            'Service__Ticket_detail__Change_description',
                            'Please get in touch with the operations team in order to cancel your request.',
                          )
                    }
                  />
              
                  <Spacing height={24} />
                  <Button
                    title={t(
                      'General__Contact_our_support',
                      'Contact our support',
                    )}
                    onPress={() => ModalActionContactOurSupport()}
                  />
                </>
              </DetailCard>
            </>
            <Spacing height={80} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Screen>
  );
};

export default AirConditionerRequestDetailScreen;
