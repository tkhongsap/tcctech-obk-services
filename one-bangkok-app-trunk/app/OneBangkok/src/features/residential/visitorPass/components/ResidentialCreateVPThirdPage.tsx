import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import React, {useState} from 'react';
import {HeadText, StickyButton} from '~/components/molecules';
import {Spacing} from '~/components/atoms';
import t from '~/utils/text';
import dayjs from 'dayjs';
import {createVisitorPassAction, useCreateVisitorPassState} from '../store';
import {StackActions, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {AnnouncementResidentialScreenEventNames} from '~/screens/AnnouncementResidentialScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import TextDetailCard from './TextDetailCard';
import {hideLoading, showLoading} from '~/states/loadingState';
import DetailCard from './DetailCard';
import DatetimeParser from '../../utils/reformatter/datetime';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Day} from './SelectSpecificDay';

interface Props {
  onPreviousStep: Function;
}
const ResidentialCreateVPThirdPage = ({onPreviousStep}: Props) => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const createVisitorPassState = useCreateVisitorPassState();
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setIsLoading] = useState(false);

  const dateUntilValue = createVisitorPassState.repeatConfig.isRepeat.value
    ? createVisitorPassState.repeatConfig.endDate.value
    : null;
  const building = createVisitorPassState.buildingName.value;
  const unit = createVisitorPassState.unitName.value;
  const floor = createVisitorPassState.floorName.value;
  const isRepeat = createVisitorPassState.repeatConfig.isRepeat.value;
  const repeatDays = createVisitorPassState.repeatConfig.days.value;

  const shortDayToDay: {[key: string]: Day} = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  const dateValid = createVisitorPassState.date.value;
  const startTime = createVisitorPassState.timeConfig.start.value;
  const endTime = createVisitorPassState.timeConfig.end.value;

  const startDateTime = dayjs(`${dateValid} ${startTime}`, 'YYYY-MM-DD HH:mm');
  let endDateTime = dayjs(`${dateValid} ${endTime}`, 'YYYY-MM-DD HH:mm');

  let isCrossDay = false;
  if (endDateTime.isBefore(startDateTime)) {
    isCrossDay = true;
    endDateTime = endDateTime.add(1, 'day');
  }

  const calculatedDateUntil =
    !dateUntilValue && isCrossDay ? endDateTime : null;

  const onPressNext = async () => {
    try {
      showLoading();
      setIsLoading(true);
      const result = await createVisitorPassAction.createPass();
      if (result?.status !== 200) {
        hideLoading();
        navigation.navigate('AnnouncementResidentialScreen', {
          type: 'error',
          title: t(
            'Residential__Something_went_wrong',
            'Something \nwent wrong',
          ),
          message: t(
            'Residential__Announcement__Error_generic__Body',
            'Please wait a bit before trying again',
          ),
          buttonText: t('Residential__Back_to_explore', 'Back to Explore'),
          screenHook: 'ResidentialCreateVisitorPassScreen',
          onPressBack: () => {
            navigation.navigate('ResidentialHomeScreen');
          },
          buttonColor: 'dark-teal',
        });
      } else {
        const messageDescription = createVisitorPassState.name.value;
        createVisitorPassAction.reset();
        hideLoading();
        navigation.dispatch(
          StackActions.replace('AnnouncementResidentialScreen', {
            type: 'success',
            title: t(
              'Residential__Announcement__Visitor_success__Header',
              'Created Successfully',
            ),
            message: t(
              'Residential__Announcement__Visitor_success__Body',
              'Your have created a visitor pass for ',
            ),
            messageDescription,
            buttonText: t('Residential__Home_Automation__Done', 'Done'),
            onPressBack: () => {
              navigation.navigate('ResidentialVisitorPassScreen');
            },
            screenHook: 'ResidentialVisitorPassScreen',
            buttonColor: 'dark-teal',
          }),
        );
      }
    } catch (error) {
      navigation.navigate('AnnouncementResidentialScreen', {
        type: 'error',
        title: t('Residential__Something_went_wrong', 'Something \nwent wrong'),
        message: t(
          'Residential__Announcement__Error_generic__Body',
          'Please wait a bit before trying again',
        ),
        buttonText: t('Residential__Back_to_explore', 'Back to Explore'),
        screenHook: 'ResidentialCreateVisitorPassScreen',
          onPressBack: () => {
            createVisitorPassAction.reset();
            navigation.navigate('ResidentialHomeScreen');
          },
        buttonColor: 'dark-teal',
      });
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  useScreenHook('ResidentialVisitorPassScreen', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementResidentialScreenEventNames.CONTINUE:
        createVisitorPassAction.reset();
        navigation.navigate('ResidentialVisitorPassScreen');
        break;
      default:
        break;
    }
  });

  const mappingRepeatType = (key: number) => {
    switch (key) {
      case 1:
        return t(
          'Residential__Visitor_management__Visitor_create_2__Everyday',
          'EveryDay',
        );
      case 2:
        return t(
          'Residential__Visitor_management__Visitor_create_2__Every_date',
          'Every {{day}} of the month',
        ).replace(
          '{{day}}',
          dayjs(createVisitorPassState.date.value).get('date').toString(),
        );
      case 3:
        return `${t(
          'Residential__Visitor_management__Visitor_create_2__Every',
          'Every',
        )} ${repeatDays
          ?.map(e => shortDayToDay[e])
          .map(f => mappingLanguageDays(f))
          .join(', ')}`;
      default:
        return '';
    }
  };

  const mappingLanguageDays = (day: Day) => {
    switch (day) {
      case 'Monday':
        return t('Residential__Monday', 'Monday');
      case 'Tuesday':
        return t('Residential__Tuesday', 'Tuesday');
      case 'Wednesday':
        return t('Residential__Wednesday', 'Wednesday');
      case 'Thursday':
        return t('Residential__Thursday', 'Thursday');
      case 'Friday':
        return t('Residential__Friday', 'Friday');
      case 'Saturday':
        return t('Residential__Saturday', 'Saturday');
      case 'Sunday':
        return t('Residential__Sunday', 'Sunday');
      case 'Weekend':
        return t('Residential__Weekend', 'Weekend');
      case 'Weekday':
        return t('Residential__Weekday', 'Weekday');
      default:
        break;
    }
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <TouchableWithoutFeedback>
          <View>
            <HeadText
              tagline={t('Residential__Review', 'Review')}
              title={t(
                'Residential__Visitor_management__Visitor_create_3__Header',
                'Please verify if everything is correct',
              )}
              titleSize="H3"
              titleClamps="leading-[26.4]"
            />
            <Spacing height={32} />
            <DetailCard
              header={t('Residential__Personal_info', 'Personal Information')}
              headerRight={t('Residential__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(2)}
              disabled={isLoading}>
              <>
                <Spacing height={12} />
                <TextDetailCard
                  label={t('Residential__Full_name', 'Name')}
                  text={createVisitorPassState.name.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Email', 'Email')}
                  text={createVisitorPassState.email.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Id', 'ID number')}
                  text={createVisitorPassState.idNumber.value || '-'}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('Residential__Access_detail', 'Access details')}
              headerRight={t('Residential__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(1)}
              disabled={isLoading}>
              <>
                <TextDetailCard
                  label={t('Residential__Valid_on', 'Valid on')}
                  text={DatetimeParser.toDMY({
                    language,
                    timestamp: dayjs(
                      createVisitorPassState.date.value,
                    ).valueOf(),
                  })}
                />
                {(dateUntilValue || calculatedDateUntil) && (
                  <>
                    <Spacing height={24} />
                    <TextDetailCard
                      label={t('Residential__Until', 'Until')}
                      text={DatetimeParser.toDMY({
                        language,
                        timestamp: dayjs(
                          dateUntilValue || calculatedDateUntil,
                        ).valueOf(),
                      })}
                    />
                  </>
                )}
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Time', 'Time')}
                  text={`${createVisitorPassState.timeConfig.start.value} - ${createVisitorPassState.timeConfig.end.value}`}
                />
                <Spacing height={24} />
                {isRepeat && (
                  <>
                    <TextDetailCard
                      label={t('Residential__Repeat', 'Repeat')}
                      text={mappingRepeatType(
                        createVisitorPassState.repeatConfig.type.value!,
                      )}
                    />
                    <Spacing height={24} />
                  </>
                )}
                <TextDetailCard
                  label={t('Residential__Building', 'Building')}
                  text={building}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Guest_Management_Unit', 'Unit')}
                  text={unit}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('Residential__Floor', 'Floor')}
                  text={floor}
                />
              </>
            </DetailCard>
            <Spacing height={80} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StickyButton
        title={t('Residential__Next', 'Next')}
        onPress={onPressNext}
        rightIcon="next"
        color="dark-teal"
        disabled={isLoading}
      />
    </>
  );
};
export default ResidentialCreateVPThirdPage;
