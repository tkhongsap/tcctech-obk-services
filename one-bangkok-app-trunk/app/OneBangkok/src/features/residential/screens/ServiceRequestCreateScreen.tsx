import {View, ScrollView} from 'react-native';
import {ScreenContainer, StickyButton} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import CreateServiceRequestFirstStep, {
  ServiceRequestType,
} from '~/features/residential/components/ServiceRequest/CreateServiceRequestFirstStep';
import CreateServiceRequestSecondStep from '~/features/residential/components/ServiceRequest/CreateServiceRequestSecondStep';
import t from '~/utils/text';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import {useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import {StackActions} from '@react-navigation/native';

enum Step {
  FIRST,
  SECOND,
}

const ServiceRequestCreateScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>(Step.FIRST);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceRequestTypes, setServiceRequestTypes] = useState<
    ServiceRequestType[]
  >([]);
  const [selectedType, setSelectedType] = useState<string>();
  const [selectedTypeName, setSelectedTypeName] = useState<string>();
  const [picture, setPicture] = useState<string>();
  const [pictureName, setPictureName] = useState<string>('unknown.png');
  const [clickStickyAtStep, setClickStickyAtStep] = useState<Step>();
  const [description, setDescription] = useState<string>();
  const [defaultResidentProperty, setDefaultResidentProperty] =
    useState<UnitDetail>();

  useEffect(() => {
    preload();
  }, []);

  const preload = async () => {
    try {
      setIsLoading(true);
      const [{data}, property] = await Promise.all([
        serviceMindService.serviceRequestTypes(),
        residentialTenantAction.getDefaultUnit(),
      ]);
      setServiceRequestTypes(data.data);

      if (property) {
        const {data} = await serviceMindService.propertyDetail(
          property.propertyUnitId,
        );
        setDefaultResidentProperty(data.property);
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const onPressSticky = () => {
    setClickStickyAtStep(step);
    if (!selectedType) return;
    if (step === Step.FIRST) setStep(Step.SECOND);
    else createServiceRequest();
  };

  const onPressLeftAction = () => {
    if (isLoading) return;
    if (step === Step.SECOND) setStep(Step.FIRST);
    else navigation.goBack();
  };

  const onSelectedType = (value: string) => {
    const selected = serviceRequestTypes.find(e => e.id === value);
    setSelectedType(value);
    setSelectedTypeName(selected?.name);
  };

  const onPressEditIntStep2 = () => {
    if (isLoading) return;
    setStep(Step.FIRST);
  };

  const createServiceRequest = async () => {
    try {
      setIsLoading(true);
      const {status, data} = await serviceMindService.createServiceRequest({
        description: description ?? null,
        serviceRequestTypeId: selectedType,
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
  const navigateToSuccessScreen = (displayId: string) => {
    navigation.dispatch(
      StackActions.replace('AnnouncementResidentialScreen', {
        type: 'success',
        title: t(
          'Residential__Announcement__Request__success',
          'Your feedback was sent',
        ),
        message: t(
          'Residential__Announcement__Service_Request_success__Body',
          'Your have successfully \ncreated a service request ticket with ',
        ),
        messageDescription: `#${displayId}`,
        buttonText: t('Residential__Home_Automation__Done', 'Done'),
        screenHook: 'ServiceRequestHomeScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('ServiceRequestHomeScreen'),
      }),
    );
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
      screenHook: 'ServiceRequestCreateScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ServiceRequestCreateScreen'),
    });
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Create_service_request',
            'Create a service request',
          )}
          bgColor="bg-vp-list"
          titleColor="dark-gray"
          leftColor="#292929"
          onPressLeftAction={onPressLeftAction}
        />
        <View className="w-full flex-1">
          <View className="flex flex-row">
            <View className={`px-[16px] pt-5 w-full`}>
              <DynamicStepContainers
                totalSteps={2}
                currentStep={step}
                handleStepPress={setStep}
                disabled={isLoading}
              />
            </View>
          </View>
          <ScrollView
            className="w-full bg-[#FDFDFD]"
            showsVerticalScrollIndicator={false}>
            {step === Step.FIRST && (
              <CreateServiceRequestFirstStep
                serviceRequestTypes={serviceRequestTypes}
                initialType={selectedType}
                onSelectedType={onSelectedType}
                initialPicture={picture}
                onUploadedPicture={setPicture}
                onUpdatedPictureName={setPictureName}
                hasError={clickStickyAtStep === Step.FIRST}
                initialDescription={description}
                onDescriptionChanged={setDescription}
                disabled={isLoading}
              />
            )}
            {step === Step.SECOND &&
              selectedTypeName &&
              defaultResidentProperty && (
                <CreateServiceRequestSecondStep
                  propertyDetail={defaultResidentProperty}
                  serviceType={selectedTypeName}
                  description={description}
                  picture={picture}
                  onPressEditIssue={onPressEditIntStep2}
                  onPressEditPicture={onPressEditIntStep2}
                />
              )}
            <Spacing height={200} />
          </ScrollView>
        </View>
      </ScreenContainer>
      <StickyButton
        title={
          step === Step.FIRST
            ? t('Residential__Home_Automation__Next', 'Next')
            : t(
                'Residential__All_good_button_title',
                'All good, Submit Booking',
              )
        }
        className="bg-dark-teal-dark"
        rightIcon="next"
        iconHeight={20}
        iconWidth={20}
        disabled={isLoading}
        onPress={onPressSticky}
      />
    </>
  );
};

export default ServiceRequestCreateScreen;
