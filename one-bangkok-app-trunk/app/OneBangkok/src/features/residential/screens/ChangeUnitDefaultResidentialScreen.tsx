import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import getTheme from '~/utils/themes/themeUtils';
import {Text, Spacing} from '~/components/atoms';
import {isTablet} from '../utils/device';
import {HeadText, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import ConfirmChangingDefaultModal from '~/features/residential/components/ChangeUnitDefaultResidential/ConfirmChangingDefaultModal';
import {modalActions} from '../components/ResidentialModal';
import SelectList, {
  ListSelect,
} from '~/features/residential/components/ChangeUnitDefaultResidential/SelectList';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import appLanguageState from '~/states/appLanguage/appLanguageState';

enum Step {
  SELECT_PROJECT,
  SELECT_UNIT,
}

const ChangeUnitDefaultResidentialScreen = () => {
  const navigation = useNavigation();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const [properties, setProperties] = useState<UnitDetail[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECT_PROJECT);
  const [projects, setProjects] = useState<ListSelect[]>([]);
  const [units, setUnits] = useState<ListSelect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ListSelect>({
    value: '',
    name: '',
  });
  const [selectedUnit, setSelectedUnit] = useState<ListSelect>({
    value: '',
    name: '',
  });

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    try {
      setIsLoading(true);
      const {data} = await serviceMindService.properties();
      const properties = data.properties as UnitDetail[];
      setProperties(properties);
      const uniqueProjectIds = Array.from(
        new Set(properties.map(e => e.projectId)).values(),
      );
      const uniqueProjects = uniqueProjectIds.map(e => {
        const property = properties.find(p => p.projectId === e);
        if (property) {
          return {
            value: e,
            name:
              language === 'th'
                ? property.projectsNameThai
                : property.projectsName,
          };
        }
        return {value: e, name: ''};
      });
      setProjects(uniqueProjects);
      const defaultProject = properties.find(e => e.isDefault);
      if (defaultProject) {
        setSelectedProject({
          value: defaultProject.projectId,
          name:
            language === 'th'
              ? defaultProject.projectsNameThai
              : defaultProject.projectsName,
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onPressRequestModal = (propertyUnitId: string) => {
    modalActions.setContent(
      <ConfirmChangingDefaultModal
        onConfirm={() => updateDefaultProperty(propertyUnitId)}
      />,
    );
    modalActions.show();
  };

  const onPress = async () => {
    try {
      if (currentStep === Step.SELECT_PROJECT) {
        const selectedUnits = properties.filter(
          e => e.projectId === selectedProject?.value,
        );
        setUnits(
          selectedUnits.map(e => ({
            value: e.propertyUnitId,
            name: e.houseNumber,
          })),
        );
        const defaultUnit =
          selectedUnits.find(e => e.isDefault) ?? selectedUnits[0];
        setSelectedUnit({
          value: defaultUnit.propertyUnitId,
          name: defaultUnit.houseNumber,
        });
        setCurrentStep(Step.SELECT_UNIT);
      } else if (currentStep === Step.SELECT_UNIT) {
        onPressRequestModal(selectedUnit.value);
      }
    } catch (error) {}
  };

  const updateDefaultProperty = async (propertyUnitId: string) => {
    try {
      setIsLoading(true);
      await serviceMindService.updateDefaultProperty(propertyUnitId);
      navigation.navigate('AccountInfoScreen');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onPressLeftAction = () => {
    if (currentStep >= 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <ScreenContainer
        bgColor="#FFFFFF"
        barStyle="dark-content"
        isLoading={isLoading}>
        {projects.length > 0 && (
          <View
            className={
              isTablet
                ? getTheme('w-[780px] flex flex-1 bg-white relative h-screen')
                : getTheme('w-full flex flex-1 bg-white relative h-screen pb-6')
            }>
            <Header
              leftAction="goBack"
              title={t('General__Default_residential', 'Default Residential')}
              onPressLeftAction={onPressLeftAction}
            />
            <Spacing height={24} />
            {currentStep === Step.SELECT_PROJECT && (
              <StepSelection
                headerTitle={t(
                  'General__Default_residential',
                  'Default Residential',
                )}
                headerTagline={t('General__Residential', 'Residences')}
                title={t(
                  'General__Select_default_project',
                  'Select Default Project',
                )}
                data={projects}
                selected={selectedProject.value}
                onSelected={setSelectedProject}
              />
            )}
            {currentStep === Step.SELECT_UNIT && (
              <StepSelection
                headerTitle={selectedProject.name}
                headerTagline={t('General_Project', 'Project')}
                title={t('General__Select_default_unit', 'Select Default Unit')}
                data={units}
                selected={selectedUnit.value}
                onSelected={setSelectedUnit}
              />
            )}
          </View>
        )}
      </ScreenContainer>
      {projects.length > 0 && (
        <StickyButton
          title={t('General__Continue', 'Continue')}
          rightIcon="next"
          color="navy"
          onPress={onPress}
          disabled={isLoading}
        />
      )}
    </>
  );
};
export default ChangeUnitDefaultResidentialScreen;

type StepProps = {
  headerTitle: string;
  headerTagline: string;
  title: string;
  data: ListSelect[];
  selected: string;
  onSelected: (selected: ListSelect) => void;
};
const StepSelection = ({
  headerTitle,
  headerTagline,
  title,
  data,
  selected,
  onSelected,
}: StepProps) => {
  const onPress = (value: string) => {
    onSelected({value, name: data.find(e => e.value === value)?.name ?? ''});
  };
  return (
    <View className="flex-1 flex">
      <View className="px-5">
        <HeadText
          title={headerTitle}
          tagline={headerTagline}
          taglineColor="subtitle-muted"
          titleClamps="leading-[44px]"
        />
      </View>
      <Spacing height={40} />
      <View className="px-5">
        <Text color="dark-gray" weight="medium" className="">
          {title}
        </Text>
        <Spacing height={12} />
        <SelectList data={data} selected={selected} onPress={onPress} />
      </View>
    </View>
  );
};
