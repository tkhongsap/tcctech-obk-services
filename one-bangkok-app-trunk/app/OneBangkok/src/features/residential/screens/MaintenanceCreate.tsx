import {View, ScrollView} from 'react-native';
import {ScreenContainer, StickyButton} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Spacing} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import CreateMaintenanceRepairFistPage, {
  CommonArea,
  MaintenanceRepairEventType,
} from '~/features/residential/components/CreateMaintenanceRepairFistPage';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import CreateMaintenanceRepairSecondPage from '~/features/residential/components/CreateMaintenanceRepairSecondPage';
import {StackActions} from '@react-navigation/native';

enum Step {
  FIRST,
  SECOND,
}

const MaintenanceCreate = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>(Step.FIRST);
  const [isLoading, setIsLoading] = useState(false);
  const [clickStickyAtStep, setClickStickyAtStep] = useState<Step>();
  const [maintenanceTypes, setMaintenanceTypes] = useState<
    MaintenanceRepairEventType[]
  >([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [defaultResidentProperty, setDefaultResidentProperty] =
    useState<UnitDetail>();
  const [selectedTypeId, setSelectedTypeId] = useState<string>();
  const [selectedAreaId, setSelectedAreaId] = useState<string>();
  const [selectedLocationId, setSelectedLocationId] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [picture, setPicture] = useState<string>();
  const [pictureName, setPictureName] = useState<string>();

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    const getMaintenanceRepairTypesByLocation = async (
      locationType: number,
    ) => {
      try {
        const {data} = await serviceMindService.maintenanceRepairTypes(
          locationType,
        );
        setMaintenanceTypes(data.data);
      } catch (error) {}
    };
    if (selectedAreaId) {
      getMaintenanceRepairTypesByLocation(Number(selectedAreaId));
    }
  }, [selectedAreaId]);

  const preload = async (retry: number = 3) => {
    try {
      setIsLoading(true);
      const [{data: maintenanceTypesResp}, {data: commonAreasResp}, property] =
        await Promise.all([
          serviceMindService.maintenanceRepairTypes(),
          serviceMindService.commonAreas(),
          residentialTenantAction.getDefaultUnit(),
        ]);
      setMaintenanceTypes(maintenanceTypesResp.data);
      setCommonAreas(commonAreasResp.data);
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

  const onPressSticky = () => {
    setClickStickyAtStep(step);
    if (!selectedTypeId || !selectedAreaId || !selectedLocationId) return;
    if (step === Step.FIRST) setStep(Step.SECOND);
    else createMaintenanceRepair();
  };

  const createMaintenanceRepair = async () => {
    try {
      setIsLoading(true);
      const {status, data} = await serviceMindService.createMaintenanceRepair({
        description: description?.trim() || null,
        eventTypeId: parseInt(selectedTypeId!),
        locationType: parseInt(selectedAreaId!),
        commonAreaId: parseInt(selectedLocationId!),
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
          'Residential__Announcement__Maintenance_success__Body',
          'Your have successfully \ncreated a maintenance with ',
        ),
        messageDescription: `#${displayId}`,
        buttonText: t('Residential__Home_Automation__Done', 'Done'),
        screenHook: 'ResidentialMaintenanceScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('ResidentialMaintenanceScreen'),
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
      screenHook: 'MaintenanceCreate',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('MaintenanceCreate'),
    });
  };

  const onPressLeftAction = () => {
    if (step === Step.SECOND) setStep(Step.FIRST);
    else navigation.goBack();
  };

  const onPressEditIntStep2 = () => {
    if (isLoading) return;
    setStep(Step.FIRST);
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
            'Residential__Maintenance__Create_Maintenance_and_Repair',
            'Create Maintenance & Repair',
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
          <ScrollView className="w-full bg-[#FDFDFD]">
            {step === Step.FIRST && (
              <CreateMaintenanceRepairFistPage
                maintenanceRepairTypes={maintenanceTypes}
                commonAreas={commonAreas}
                initialType={selectedTypeId}
                onSelectedType={setSelectedTypeId}
                initialArea={selectedAreaId}
                onSelectedArea={setSelectedAreaId}
                initialLocation={selectedLocationId}
                onSelectedLocation={setSelectedLocationId}
                initialPicture={picture}
                onUploadedPicture={setPicture}
                onUpdatedPictureName={setPictureName}
                hasError={clickStickyAtStep === Step.FIRST}
                initialDescription={description}
                onDescriptionChanged={setDescription}
              />
            )}
            {step === Step.SECOND && (
              <CreateMaintenanceRepairSecondPage
                areaId={selectedAreaId ?? ''}
                area={
                  selectedAreaId === '1'
                    ? t(
                        'Residential__Maintenance__In_residence',
                        'In-residence',
                      )
                    : t(
                        'Residential__Maintenance__Common_facility',
                        'Common Facility',
                      )
                }
                location={
                  commonAreas.find(e => e.commonAreaId === selectedLocationId)!
                    .commonAreaName
                }
                maintenanceType={
                  maintenanceTypes.find(e => e.id === selectedTypeId)!
                    .description
                }
                description={description}
                picture={picture}
                onPressEditLocation={onPressEditIntStep2}
                onPressEditIssue={onPressEditIntStep2}
                onPressEditPicture={onPressEditIntStep2}
              />
            )}
            <Spacing height={150} />
          </ScrollView>
        </View>
      </ScreenContainer>
      <StickyButton
        title={
          step === Step.SECOND
            ? t(
                'Residential__All_good_button_title',
                'All good, create request',
              )
            : t('General__Next', 'Next')
        }
        className="bg-dark-teal-dark"
        rightIcon="next"
        iconHeight={20}
        iconWidth={20}
        onPress={onPressSticky}
        disabled={isLoading}
      />
    </>
  );
};

export default MaintenanceCreate;
