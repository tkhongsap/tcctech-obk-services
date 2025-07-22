import {View, ScrollView} from 'react-native';
import {ScreenContainer, StickyButton} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing, Text} from '~/components/atoms';
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
import BuildingUnusualReportFirstStep from '../components/BuildingUnusualReportComponent/BuildingUnusualReportFirstStep';
import BuildingUnusualReportSecondStep from '../components/BuildingUnusualReportComponent/BuildingUnusualReportSecondStep';
import urgenService from '~/services/urgenService/urgenService';
import {set, values} from 'lodash';
import {use} from 'i18next';

enum Step {
  FIRST,
  SECOND,
  FINISH,
}
interface DropdownOptions {
  name: string;
  value: string;
}

const BuildingUnusualReportScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>(Step.FIRST);
  const [isLoading, setIsLoading] = useState(false);

  const [serviceRequestTypes, setServiceRequestTypes] = useState<
    ServiceRequestType[]
  >([]);

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>();
  const [selectedFloors, setSelectedFloors] = useState<string>();
  const [selectedTypeName, setSelectedTypeName] = useState<string>();

  const [allLocation, setAllLocation] = useState<any[]>([]);

  const [picture, setPicture] = useState<string>();
  const [pictureName, setPictureName] = useState<string>('unknown.png');
  const [clickStickyAtStep, setClickStickyAtStep] = useState<Step>();
  const [description, setDescription] = useState<string>();
  const [srEvent, setSrEvnet] = useState<string>();
  const [defaultResidentProperty, setDefaultResidentProperty] =
    useState<UnitDetail>();

  const [requireForm, setRequireFrom] = useState<string[]>([]);
  interface DropdownOptions {
    name: string;
    value: string;
  }

  const [typePromblemDropdownData, setTypePromblemDropdownData] = useState<
    DropdownOptions[]
  >([]);
  const [buildingDropdownData, setBuildingDropdownData] = useState<
    DropdownOptions[]
  >([]);

  useEffect(() => {
    preload();
  }, []);
  const preload = async () => {
    try {
      setIsLoading(true);
      const events = await urgenService.event();
      var earthquakeevent = events.find(e => e.name_th === 'EARTHQUAKE')?.id;
      setSrEvnet(earthquakeevent);
      const problem = await urgenService.problem();
      const location = await urgenService.location();
      var problemDropdownData: DropdownOptions[] = problem.map(x => ({
        name: x.name_th,
        value: x.id,
      }));
      var buildingDropdownData: DropdownOptions[] = location.building.map(
        x => ({
          name: String(x),
          value: String(x),
        }),
      );
      setTypePromblemDropdownData(problemDropdownData);
      setBuildingDropdownData(buildingDropdownData);
      setAllLocation(location);
    } catch (error) {
      console.log(error);
      //navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const onValidateForm = (): string[] => {
    const validate: string[] = [];

    if (!selectedType || selectedType.length === 0) {
      validate.push('R_TYPE');
    }
    if (!description) {
      validate.push('R_DESCRIPTION');
    }
    if (!picture) {
      validate.push('R_PICTURE');
    }
    if (!selectedBuilding) {
      validate.push('R_BUILDING');
    }

    setRequireFrom(validate);
    return validate;
  };
  const onPressSticky = () => {
    setClickStickyAtStep(step);
    const validate = onValidateForm();
    if (validate.length > 0 && step === Step.FIRST) return;
    if (step === Step.FIRST) {
      setStep(Step.SECOND);
    } else if (step === Step.SECOND) {
      createServiceRequest();
    }
    if (step === Step.FINISH) {
      navigation.navigate('MainPageScreen');
    }
  };

  const onPressLeftAction = () => {
    if (isLoading) return;
    if (step === Step.SECOND) setStep(Step.FIRST);
    else navigation.goBack();
  };

  const onSelectedType = (value: string[]) => {};

  const onSelectedBuilding = (value: string) => {
    const selected = serviceRequestTypes.find(e => e.id === value);
  };

  const onSelectedFloor = (value: string) => {
    const selected = serviceRequestTypes.find(e => e.id === value);
  };

  const onPressEditIntStep2 = () => {
    if (isLoading) return;
    setStep(Step.FIRST);
  };

  const createServiceRequest = async () => {
    try {
      setIsLoading(true);
      let location = selectedBuilding + ' ' + selectedFloors;
      const requestBody = {
        title: 'Report Unusual',
        description: description,
        status: 'Pending',
        comment: '',
        location: location,
        image: picture,
        priority: '',
        srEventId: [srEvent],
        srProblemId: selectedType,
        srEventOther: '',
        srProblemOther: '',
        files: [
          {
            fileName: pictureName,
            base64Data: picture,
          },
        ],
      };
      const response = await urgenService.createUrgent(requestBody);

      setStep(Step.FINISH);
      setIsLoading(false);
    } catch (err) {}
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
      title: t('General__Something_went_wrong', 'Something \nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('General__Back_to_explore', 'Back to Explore'),
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
          // title={t('General__Create_service_request', 'Create Service Request')}
          title={'Report Unusual'}
          bgColor="bg-vp-list"
          titleColor="dark-gray"
          leftColor="#292929"
          onPressLeftAction={onPressLeftAction}
        />
        <View className="w-full flex-1">
          <View className="flex flex-row">
            <View className={`px-[16px] pt-5 w-full`}>
              <DynamicStepContainers
                totalSteps={3}
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
              <BuildingUnusualReportFirstStep
                serviceRequestTypes={serviceRequestTypes}
                initialType={selectedType}
                onSelectedType={onSelectedType}
                onSelectedBuilding={onSelectedBuilding}
                onSelectedFloor={onSelectedFloor}
                initialPicture={picture}
                allLocation={allLocation}
                onUploadedPicture={setPicture}
                onUpdatedPictureName={setPictureName}
                initialDescription={description}
                onDescriptionChanged={setDescription}
                onSelectedTypeChanged={setSelectedType}
                onSelectedBuildingChanged={setSelectedBuilding}
                onSelectedFloorChanged={setSelectedFloors}
                disabled={isLoading}
                hasError={clickStickyAtStep === Step.FIRST}
                requireForm={requireForm}
                typeDropdown={typePromblemDropdownData}
                buildingDropdown={buildingDropdownData}
              />
            )}

            {step === Step.SECOND && (
              <BuildingUnusualReportSecondStep
                onPressEditIssue={onPressEditIntStep2}
                propertyDetail={defaultResidentProperty as UnitDetail}
                onPressEditPicture={onPressEditIntStep2}
                promblemType={selectedType as string[]}
                description={description}
                picture={picture}
                floor={selectedFloors as string}
                building={selectedBuilding as string}
                disabled={isLoading}
                prombileTypeList={typePromblemDropdownData}
              />
            )}

            {step === Step.FINISH && (
              <View className="px-4 pb-10 pt-4 flex flex-col" style={{gap: 20}}>
                <Text weight="bold" size="H2">
                  {'Thank for report unusual'}
                </Text>
              </View>
            )}
            <Spacing height={200} />
          </ScrollView>
        </View>
      </ScreenContainer>
      <StickyButton
        title={
          step === Step.FIRST
            ? t('Residential__Home_Automation__Next', 'Next')
            : step === Step.SECOND
            ? t(
                'Residential__All_good_button_title',
                'All good, create request',
              )
            : 'Go To Home'
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

export default BuildingUnusualReportScreen;
