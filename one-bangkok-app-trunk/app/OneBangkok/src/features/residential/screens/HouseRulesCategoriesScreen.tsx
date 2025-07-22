import {ScrollView, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {ScreenContainer} from '../components/ScreenContainer';
import {
  UnitDetail,
  useResidentialUnitSelectedState,
} from '~/states/residentialTenant/residentialTenantState';
import {TextField} from '../components/AddToMicro/TextField';
import {DropdownItem} from '~/components/molecules/ControlledDropdown';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {useModal} from '../components/ResidentialModal';
import ConfirmChangeUnitOnHouseRulesModal from '../components/ConfirmChangeUnitOnHouseRulesModal';

export type HouseRuleCategory = {
  id: string;
  projectId: string;
  categoryKey: string;
  isMain: boolean;
  name: string;
  image: string;
};

const HouseRulesCategoriesScreen = () => {
  const [_, modalActions] = useModal();
  const navigation = useNavigation();
  const unitSelectedState = useResidentialUnitSelectedState();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [units, setUnits] = useState<DropdownItem[]>([]);
  const [selectedUnitProjectId, setSelectedUnitProjectId] = useState<string>();
  const [categories, setCategories] = useState<HouseRuleCategory[]>([]);
  const [filterCategories, setFilterCategories] = useState<HouseRuleCategory[]>(
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectedUnitProjectId &&
      onSelectedUnitProjectIdChanged(selectedUnitProjectId);
  }, [selectedUnitProjectId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const properties = await getProperties();
      const uniqueProjectIds = Array.from(
        new Set(properties.map(e => e.projectId)).values(),
      );
      const uniqueUnits = uniqueProjectIds.map(e => {
        const property = properties.find(p => p.projectId === e);
        if (property) {
          return {
            value: e,
            label:
              language === 'th'
                ? property.projectsNameThai
                : property.projectsName,
          };
        }
        return {value: e, label: ''};
      });
      setUnits(uniqueUnits);
      const projectId = unitSelectedState.selectedProjectId.value;
      const defaultUnit = properties.find(e => e.isDefault) ?? properties[0];
      setSelectedUnitProjectId(projectId || defaultUnit.projectId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async (
    projectId: string,
  ): Promise<HouseRuleCategory[]> => {
    const {data} = await serviceMindService.houseRulesCategories(projectId);
    return data.data;
  };

  const getProperties = async (): Promise<UnitDetail[]> => {
    const {data} = await serviceMindService.properties();
    return data.properties;
  };

  const onSelectedUnitProjectIdChanged = async (projectId: string) => {
    try {
      const categories = await getCategories(projectId);
      setCategories(categories);
      setFilterCategories(categories);
    } catch (error) {}
  };

  const isEmptyString = (value: string) => {
    return value === undefined || value.trim().replace(' ', '').length === 0;
  };

  const onSearchTextChange = (value: string) => {
    try {
      if (isEmptyString(value)) {
        setFilterCategories(categories);
      } else {
        value = value.trim().toLowerCase();
        const searched = categories.filter(e =>
          e.name.trim().toLowerCase().includes(value),
        );
        setFilterCategories(searched);
      }
    } catch (error) {}
  };

  const onPressCategory = (category: HouseRuleCategory) => {
    setFilterCategories(categories);
    navigation.navigate('HouseRuleScreen', {category});
  };

  const onPressUnit = () => {
    if (selectedUnitProjectId) {
      modalActions.setContent(
        <ConfirmChangeUnitOnHouseRulesModal
          selected={selectedUnitProjectId}
          items={units}
          onPressDone={setSelectedUnitProjectId}
        />,
      );
      modalActions.show();
    }
  };

  return (
    <ScreenContainer
      bgColor="#FFFFFF"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t('Residential__House_rules_and_others', 'House Rules & Others')}
      />

      {!isLoading && (
        <ScrollView
          className="w-full bg-white"
          contentContainerStyle={{paddingBottom: 40}}>
          <View style={{flexDirection: 'column'}}>
            <View className="px-5">
              <Text className="text-subtitle-muted-light mt-10">
                {t('Residential__Description', 'Description')}
              </Text>
            </View>

            <View className="px-5 pt-5">
              <Text weight="medium" className="mb-2">
                {t('General_Project', 'Project')}
              </Text>

              <TouchableOpacity
                onPress={onPressUnit}
                className={
                  'px-4 border flex flex-col border-line-light w-full mb-3 h-[56px]'
                }>
                <View className="py-4 flex flex-row justify-between items-center">
                  <View>
                    <Text className="text-dark-gray-light mt-2 font-medium m-0">
                      {
                        units.find(e => e.value === selectedUnitProjectId)
                          ?.label
                      }
                    </Text>
                  </View>
                  <View className="rotate-90">
                    <Icon type="right" width={20} height={20} color="#292929" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View className="px-5 pt-8">
              <View className="justify-center">
                <TextField
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  placeholder={t('Residential__Search', 'Search')}
                  className="placeholder:!not-italic !text-red h-[56px]"
                  rightIcon="search"
                  IconColor="#bdbdbd"
                  onChangeText={onSearchTextChange}
                />
              </View>
            </View>

            <View className="w-full px-5 pt-8">
              <Text weight="medium" className="mb-2">
                {t('Residential__Document_category', 'Document Category')}
              </Text>
              <View className="w-full">
                {filterCategories.map(category => (
                  <TouchableOpacity
                    onPress={() => onPressCategory(category)}
                    className={
                      'px-4 border flex flex-col border-line-light w-full mb-3 min-h-[56px]'
                    }
                    key={category.id}>
                    <View className="py-4 flex flex-row justify-between items-center">
                      <View>
                        <Text
                          weight="medium"
                          className="text-dark-gray-light mt-2 font-medium m-0 w-[280px]">
                          {category.name}
                        </Text>
                      </View>
                      <View className="">
                        <Icon
                          type="right"
                          width={16}
                          height={16}
                          color="#292929"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {Platform.OS === 'ios' && <Spacing height={80} />}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default HouseRulesCategoriesScreen;
