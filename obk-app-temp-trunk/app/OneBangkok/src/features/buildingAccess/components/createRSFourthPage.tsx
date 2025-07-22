import {ScrollView, Image, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {HeadText, StickyButton} from '~/components/molecules';
import {Spacing} from '~/components/atoms';
import t from '~/utils/text';
import DetailCard from '~/features/buildingAccess/components/DetailCard';
import {useNavigation} from '~/navigations/AppNavigation';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import TextDetailCard from './TextDetailCard';
import {memberState} from '../store/member';
import {hideLoading, showLoading} from '~/states/loadingState';
import {
  createRequestServiceAction,
  useCreateRequestServiceState,
} from '../store/requestService';
import {buildingAccessState} from '../store/buildingAccess';
import {issueTypeState} from '../store/issueTypes';
import {isEmpty} from 'lodash';
import bmsService from '~/services/bmsService';
import uploadImageService from '~/services/uploadImage';

const RenderImage = ({
  pathImage,
  onPreviousStep,
}: {
  pathImage?: string;
  onPreviousStep: any;
}) => {
  if (!isEmpty(pathImage)) {
    return (
      <DetailCard
        header={t('General__Picture', 'Picture')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={() => onPreviousStep && onPreviousStep(1)}>
        <>
          <Image
            source={{
              uri: pathImage,
            }}
            resizeMode="contain"
            className="h-[262px] items-end pr-1 pt-2"
            style={{backgroundColor: '#EFEFEF'}}
          />
        </>
      </DetailCard>
    );
  }
  return <View />;
};

interface CreateRSFourthPageProps {
  onPreviousStep: Function;
}
const CreateRSFourthPage = ({onPreviousStep}: CreateRSFourthPageProps) => {
  const createRequestServiceState = useCreateRequestServiceState();
  const requestServiceState = createRequestServiceState.value;
  const navigation = useNavigation();
  const tower = buildingAccessState.towers.value?.find(
    e => e.id === requestServiceState.towerId,
  );
  const floor = tower?.floors.find(
    floor => floor.id === requestServiceState.floorId,
  );

  const issueType = issueTypeState.issueType.value?.find(
    issueType => issueType.id === requestServiceState.issueTypeId,
  );

  const state = useHookstate(appLanguageState);
  const defaultSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  const onPressNext = async () => {
    showLoading();
    let image;
    if (requestServiceState.image) {
      image = await uploadImageService.uploadImage(requestServiceState.image);
      if (image.status !== 200) {
        announcementError();
        return;
      }
    }
    const result = await bmsService.createRequestService({
      image_url: [image?.data?.imageUrl ?? ''],
      tower_id: requestServiceState.towerId,
      floor_id: requestServiceState.floorId,
      issue_type_id: requestServiceState.issueTypeId,
      title: requestServiceState.title,
      description: requestServiceState.description,
      requester_id: memberState.id.value,
    });
    if (result?.status !== 200) {
      hideLoading();
      announcementError();
    } else {
      hideLoading();
      navigation.navigate('AnnouncementScreen', {
        type: 'success',
        title: t('Announcement__Request_sent__Title', 'Your request was sent'),
        message: t(
          'Announcement__Request_sent__Description',
          'Your have successfully created a building service ticket with',
        ),
        messageDescription: result.data?.data?.references,
        buttonText: t('General__Done', 'Done'),
        screenHook: 'CreateRequestService',
      });
    }

    createRequestServiceAction.reset();
  };

  useScreenHook('CreateRequestService', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        createRequestServiceAction.setSubmitted(true);
        navigation.navigate('RequestServiceScreen');
        break;
      default:
        break;
    }
  });

  const announcementError = () => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__Back_to_explore', 'Back to Explore'),
      screenHook: 'CreateRequestService',
    });
  };
  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <TouchableWithoutFeedback>
          <View>
            <HeadText
              tagline={t('General__Review', 'Review')}
              title={t('Visitor_pass__Visitor_create_3__Header', "Let's check\nif everything is correct")}
              titleSize="H3"
              titleClamps="leading-[26.4]"
            />
            <Spacing height={32} />
            <DetailCard
              header={t('General__Location', 'Location')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(3)}>
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
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Issue', 'Issue')}
              headerRight={t('General__Edit', 'Edit')}
              headerRightAction={() => onPreviousStep && onPreviousStep(2)}>
              <>
                <TextDetailCard
                  label={t('General__Issue_type', 'Issue type')}
                  text={issueType?.display_name[defaultSelected]}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Title', 'Title')}
                  text={createRequestServiceState.title.value}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Description', 'Description')}
                  text={createRequestServiceState.description.value}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <RenderImage
              pathImage={createRequestServiceState.image.value}
              onPreviousStep={onPreviousStep}
            />
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
export default CreateRSFourthPage;
