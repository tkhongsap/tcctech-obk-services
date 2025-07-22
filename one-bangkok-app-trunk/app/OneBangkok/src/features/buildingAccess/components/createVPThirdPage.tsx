import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import React, {useRef} from 'react';
import {HeadText, StickyButton} from '~/components/molecules';
import {Spacing} from '~/components/atoms';
import t from '~/utils/text';
import DetailCard from '~/features/buildingAccess/components/DetailCard';
import dayjs from 'dayjs';
import {createVisitorPassAction, useCreateVisitorPassState} from '../store';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import TextDetailCard from './TextDetailCard';
import {memberState} from '../store/member';
import {hideLoading, showLoading} from '~/states/loadingState';
import {find, isEmpty} from 'lodash';

interface CreateVPThirdPageProps {
  onPreviousStep: Function;
}

const CreateVPThirdPage = ({onPreviousStep}: CreateVPThirdPageProps) => {
  const createVisitorPassState = useCreateVisitorPassState();
  const navigation = useNavigation<StackNavigation>();
  const isDisabledRef = useRef(false);

  const tower = memberState.towers.value?.find(
    e => e.id === createVisitorPassState.towerId.value,
  );
  const location = tower?.locations.find(
    location => location.id === createVisitorPassState.floorId.value,
  );

  const floorId = location.floor_id;
  const floor = find(tower.floors, {id: floorId});
  const state = useHookstate(appLanguageState);
  const defaultSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';

  const dateUntilValue = createVisitorPassState.dateUntil.value;
  const repetitionType = createVisitorPassState.repetition.value?.type;
  const repetitionValue = createVisitorPassState.repetition.value?.value;

  const RepetitionValue = () => {
    let value;
    switch (repetitionType) {
      case 'EVERYDAY':
        value = t('Visitor_pass__Visitor_create_2__Everyday', 'EveryDay');
        return value;
      case 'WEEKDAY':
        value = t(
          'Visitor_pass__Visitor_create_2__Every_day',
          'Every {{day}}',
          {
            day: dayjs.weekdays()[
              dayjs(repetitionValue?.toString()).get('day')
            ],
          },
        );
        return value;
      case 'DAY_IN_MONTH':
        value = t(
          'Visitor_pass__Visitor_create_2__Every_date',
          'Every {{day}} of the month',
          {
            day: repetitionValue,
          },
        );
        return value;
    }
  };

  const onPressNext = async () => {
    showLoading();
    if (!isDisabledRef.current) {
      isDisabledRef.current = true;
      const result = await createVisitorPassAction.createPass();
      if (result?.status !== 200) {
        isDisabledRef.current = false;
        hideLoading();
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: t('General__Something_went_wrong', 'Something\nwent wrong'),
          message: t(
            'Announcement__Error_generic__Body',
            'Please wait and try again soon.',
          ),
          buttonText: t('General__Back_to_explore', 'Back to Explore'),
          screenHook: 'CreateVisitorPass',
        });
      } else {
        hideLoading();
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t(
            'Announcement__Visitor_success__Header',
            'Created successfully',
          ),
          message: t(
            'Announcement__Visitor_success__Body',
            'Your have created a visitor pass for ',
          ),
          messageDescription: createVisitorPassState.name.value,
          buttonText: t('General__Done', 'Done'),
          screenHook: 'CreateVisitorPass',
        });
      }
    }
  };

  useScreenHook('CreateVisitorPass', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        createVisitorPassAction.reset();
        navigation.navigate('VisitorPassScreen');
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
              header={t('General__Personal_info', 'Personal information')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(2)}>
              <>
                <Spacing height={12} />
                <TextDetailCard
                  label={t('General__Name', 'Name')}
                  text={createVisitorPassState.name.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Email', 'Email')}
                  text={createVisitorPassState.email.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Company_name', 'Company name')}
                  text={createVisitorPassState.companyName.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Id_passport', 'ID number/Passport number')}
                  text={
                    !isEmpty(createVisitorPassState.reference.value)
                      ? createVisitorPassState.reference.value
                      : '-'
                  }
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Access_detail', 'Access details')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(1)}>
              <>
                <TextDetailCard
                  label={t('General__Valid_on', 'Valid on')}
                  text={dayjs(createVisitorPassState.date.value).format(
                    'DD MMMM YYYY',
                  )}
                />
                {dateUntilValue && (
                  <>
                    <Spacing height={24} />
                    <TextDetailCard
                      label={t('General__Until', 'Until')}
                      text={dayjs(dateUntilValue).format('DD MMMM YYYY')}
                    />
                  </>
                )}
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Time', 'Time')}
                  text={`${dayjs(createVisitorPassState.from.value).format(
                    'HH:mm',
                  )} - ${dayjs(createVisitorPassState.to.value).format(
                    'HH:mm',
                  )}`}
                />
                {repetitionType && (
                  <>
                    <Spacing height={24} />
                    <TextDetailCard
                      label={t('General__Repeat', 'Repeat')}
                      text={RepetitionValue()!}
                    />
                  </>
                )}
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Building', 'Building')}
                  text={
                    tower?.display_name?.[defaultSelected] ||
                    tower?.display_name?.en
                  }
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Floor', 'Floor')}
                  text={
                    floor?.display_name[defaultSelected] ||
                    floor?.display_name.en
                  }
                />
              </>
            </DetailCard>
            <Spacing height={80} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={onPressNext}
        rightIcon="next"
      />
    </>
  );
};

export default CreateVPThirdPage;
