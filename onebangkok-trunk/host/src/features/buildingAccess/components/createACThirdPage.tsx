import {ScrollView, Image, TouchableWithoutFeedback, View} from 'react-native';
import React, {useCallback} from 'react';
import {HeadText, StickyButton} from '~/components/molecules';
import {Spacing} from '~/components/atoms';
import t from '~/utils/text';
import DetailCard from '~/features/buildingAccess/components/DetailCard';
import {useNavigation} from '~/navigations/AppNavigation';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import TextDetailCard from './TextDetailCard';
import {memberState} from '../store/member';
import {hideLoading, showLoading} from '~/states/loadingState';
import {buildingAccessState} from '../store/buildingAccess';
import {find, isEmpty} from 'lodash';
import bmsService from '~/services/bmsService';
import {
  createAirConditionerRequestAction,
  useCreateAirConditionerRequestState,
} from '../store/airConditionerRequest';
import dayjs from 'dayjs';
import {calculateEstimatedCost} from './createACSecondPage';
import {UntilDate} from '../screens/AirConditionerRequestDetailScreen';
import {sortedZone} from '~/utils/sorted';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
interface CreateACThirdPageProps {
  onPreviousStep: Function;
}
const CreateACThirdPage = ({onPreviousStep}: CreateACThirdPageProps) => {
  const createAirConditionerRequestState =
    useCreateAirConditionerRequestState();
  const airConditionerRequestState = createAirConditionerRequestState.value;
  const navigation = useNavigation();
  const tower = buildingAccessState.towers.value?.find(
    e => e.id === airConditionerRequestState.towerId,
  );
  const floor = tower?.floors.find(
    floor => floor.id === airConditionerRequestState.floorId,
  );

  const getNameACZone = useCallback(() => {
    const acZones: string[] = [];
    createAirConditionerRequestState.acZoneId.value?.forEach(selected => {
      const existingZone = find(buildingAccessState.acZone.value, {
        id: selected,
      });
      if (existingZone) {
        acZones.push(existingZone.name);
      }
    });
    const sortedZones = sortedZone(acZones);
    return sortedZones?.join(', ');
  }, [createAirConditionerRequestState.acZoneId.value]);

  const getArea = useCallback(() => {
    let zoneArea: number = 0;

    createAirConditionerRequestState.acZoneId.value?.forEach(selected => {
      const existingZone = find(buildingAccessState.acZone.value, {
        id: selected,
      });

      if (existingZone) {
        zoneArea += existingZone?.area_size;
      }
    });

    return zoneArea || 0;
  }, [buildingAccessState.acZone.value]);

  const defaultSelected = appLanguageActions.getLanguage();

  const onPressNext = async () => {
    showLoading();
    const result = await bmsService.createAirConditionerRequest({
      tower_id: airConditionerRequestState.towerId,
      floor_id: airConditionerRequestState.floorId,
      ac_zone_id: airConditionerRequestState.acZoneId,
      date: dayjs(airConditionerRequestState.dateTimeStart).toISOString(),
      duration: Number(airConditionerRequestState.duration),
      requester_id: memberState.id.value,
    });
    if (result?.status !== 200) {
      hideLoading();
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: t('General__Something_went_wrong', 'Something\nwent wrong'),
        message: t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
        buttonText: t('General__Back_to_explore', 'Back to Explore'),
        screenHook: 'CreateAirConditionerRequest',
      });
    } else {
      hideLoading();
      navigation.navigate('AnnouncementScreen', {
        type: 'success',
        title: t('Announcement__Request_sent__Title', 'Your request was sent'),
        message: t(
          'Announcement__Request_sent__Description_otac',
          'You will be notified once the request is reviewed.',
        ),
        messageDescription: t('no_key', 'Request ID {{references}}', {
          references: result.data?.data?.references,
        }),
        buttonText: t('General__Done', 'Done'),
        screenHook: 'CreateAirConditionerRequest',
      });
    }
    createAirConditionerRequestAction.reset();
  };

  useScreenHook('CreateAirConditionerRequest', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        createAirConditionerRequestAction.setSubmitted(true);
        navigation.navigate('AirConditionerRequestScreen');
        break;
      default:
        break;
    }
  });

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <TouchableWithoutFeedback>
          <View>
            <HeadText
              tagline={t('General__Review', 'Review')}
              title={t(
                'Visitor_pass__Visitor_create_3__Header',
                "Let's check\nif everything is correct",
              )}
              titleSize="H3"
              titleClamps="leading-[26.4]"
            />
            <Spacing height={32} />
            <DetailCard
              header={t('General__Location', 'Location')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(2)}>
              <>
                <Spacing height={12} />
                <TextDetailCard
                  label={t('General__Building', 'Building')}
                  text={tower?.display_name[defaultSelected]}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Floor', 'Floor')}
                  text={floor?.display_name[defaultSelected]}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Zone', 'Zone')}
                  text={getNameACZone() ?? '-'}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Booking_information', 'Booking information')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(1)}>
              <>
                <TextDetailCard
                  label={t('General__Date', 'Date')}
                  text={dayjs(airConditionerRequestState.date).format(
                    'DD MMMM YYYY',
                  )}
                />
                <UntilDate
                  dateFrom={airConditionerRequestState.dateTimeStart}
                  dateTo={
                    !isEmpty(airConditionerRequestState.dateTimeStart)
                      ? dayjs(airConditionerRequestState.dateTimeStart)
                          .add(
                            Number(airConditionerRequestState.duration),
                            'hours',
                          )
                          .toISOString()
                      : dayjs().toISOString()
                  }
                  durationHour={Number(airConditionerRequestState.duration)}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Time', 'Time')}
                  text={`${dayjs(
                    airConditionerRequestState.dateTimeStart,
                  ).format('HH:mm')} - ${dayjs(
                    airConditionerRequestState.dateTimeStart,
                  )
                    .add(Number(airConditionerRequestState.duration), 'hours')
                    .format('HH:mm')}`}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Duration', 'Duration')}
                  text={t('General__Hour_hours', '{{hours}} hours', {
                    hours: airConditionerRequestState.duration,
                  })}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Area', 'Area')}
                  text={t('General__Sq.m', '{{area}} Sq.m', {
                    area: getArea().toLocaleString() ?? 0,
                  })}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Estimate_cost', 'Estimate cost')}
                  text={t('General__Bath_value', '{{value}} Bath', {
                    value: calculateEstimatedCost(
                      airConditionerRequestState.duration,
                      getArea() ?? 0,
                    ),
                  })}
                />
              </>
            </DetailCard>
            <Spacing height={80} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StickyButton
        title={t('General__Create_request', 'All good, create request')}
        onPress={onPressNext}
        rightIcon="next"
      />
    </>
  );
};
export default CreateACThirdPage;
