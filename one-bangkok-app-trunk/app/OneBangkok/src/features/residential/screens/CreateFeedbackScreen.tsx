import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer, StickyButton} from '../components';
import CreateFBFirstPage, {
  FeedbackTopic,
} from '../components/CreateFBFirstPage';
import CreateFBSecondPage from '../components/CreateFBSecondPage';
import {StackActions} from '@react-navigation/native';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import {Header} from '../components/Header';

enum Step {
  FIRST,
  SECOND,
}

const CreateFeedbackScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>(Step.FIRST);
  const [feedbackTopics, setFeedbackTopics] = useState<FeedbackTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState<string>();
  const [pictureName, setPictureName] = useState<string>();
  const [defaultResidentProperty, setDefaultResidentProperty] =
    useState<UnitDetail>();
  const [clickStickyAtStep, setClickStickyAtStep] = useState<Step>();
  const [errorRequireDescription, setErrorRequireDescription] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  const preload = async (retry: number = 3) => {
    try {
      setIsLoading(true);
      const [{data}, property] = await Promise.all([
        serviceMindService.feedbackTypes(),
        residentialTenantAction.getDefaultUnit(),
      ]);
      setFeedbackTopics(data.data);
      if (property) {
        const {data} = await serviceMindService.propertyDetail(
          property.propertyUnitId,
        );
        setDefaultResidentProperty(data.property);
      }
    } catch (error) {
      if (retry >= 1) {
        preload(retry - 1);
      } else {
        navigateToErrorScreen();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createMaintenanceRepair = async () => {
    try {
      setIsLoading(true);
      const {status, data} = await serviceMindService.createFeedback({
        description: description ?? null,
        feedbackTypeId: parseInt(selectedTopic!),
        propertyUnitId: defaultResidentProperty?.propertyUnitId,
        image:
          picture !== undefined
            ? {
                fileName: pictureName,
                resourceUrl: picture,
              }
            : null,
      });
      if (status === 200) {
        navigateToSuccessScreen(data.data.displayId);
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'CreateFeedbackScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('CreateFeedbackScreen'),
    });
  };

  const navigateToSuccessScreen = (displayId: string) => {
    navigation.dispatch(
      StackActions.replace('AnnouncementResidentialScreen', {
        type: 'success',
        title: t(
          'Residential__Announcement__Feedback__success',
          'Your feedback was sent',
        ),
        message: t(
          'Residential__Announcement__Feedback_success__Body',
          'Your have successfully \ncreated a feedback with ',
        ),
        messageDescription: `#${displayId}`,
        buttonText: t('Residential__Home_Automation__Done', 'Done'),
        screenHook: 'FeedbackScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('FeedbackScreen'),
      }),
    );
  };

  const onPressLeftAction = () => {
    if (step === Step.SECOND) setStep(Step.FIRST);
    else navigation.goBack();
  };

  const onPressEditIntStep2 = () => {
    if (isLoading) return;
    setStep(Step.FIRST);
  };

  const onPressSticky = () => {
    setClickStickyAtStep(step);
    if (!description) setErrorRequireDescription(true);
    if (!selectedTopic || !description) return;
    if (step === Step.FIRST) setStep(Step.SECOND);
    else createMaintenanceRepair();
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t('Residential__Feedback__Create_feedback', 'Submit feedback')}
          onPressLeftAction={onPressLeftAction}
        />
        <View
          className={getTheme('flex flex-row w-screen h-[40px] bg-default')}>
          <View className={`px-[16px] w-full`}>
            <DynamicStepContainers
              totalSteps={2}
              currentStep={step}
              handleStepPress={setStep}
              disabled={isLoading}
            />
          </View>
        </View>
        <ScrollView
          className="w-full px-6"
          showsVerticalScrollIndicator={false}>
          {step === Step.FIRST && (
            <CreateFBFirstPage
              topics={feedbackTopics}
              initialTopic={selectedTopic}
              onSelectedTopic={setSelectedTopic}
              initialDescription={description}
              onDescriptionChanged={setDescription}
              initialPicture={picture}
              onUploadedPicture={setPicture}
              onUpdatedPictureName={setPictureName}
              disabled={isLoading}
              hasError={clickStickyAtStep === Step.FIRST}
              errorRequireDescription={errorRequireDescription}
              setErrorRequireDescription={setErrorRequireDescription}
            />
          )}
          {step === Step.SECOND && selectedTopic && (
            <CreateFBSecondPage
              topic={feedbackTopics.find(e => e.id === selectedTopic)!.name}
              description={description}
              picture={picture}
              onPressEditPicture={onPressEditIntStep2}
              onPressEditTopic={onPressEditIntStep2}
            />
          )}
        </ScrollView>
      </ScreenContainer>
      <StickyButton
        title={
          step === Step.FIRST
            ? t('Residential__Next', 'Next')
            : t(
                'Residential__Feedback__All_good_create_feedback',
                'All good, create feedback',
              )
        }
        color="dark-teal"
        rightIcon="next"
        disabled={isLoading}
        onPress={onPressSticky}
      />
    </>
  );
};

export default CreateFeedbackScreen;
