/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {activeOpacity} from '~/constants';
import residentialTenantState, {
  residentialPersonaActive,
} from '~/states/residentialTenant/residentialTenantState';
import IconHome from '../../../assets/icons/icon-home.svg';
import IconMyProperty from '../../../assets/icons/icon_my_property.svg';
import IconHouseRules from '../../../assets/icons/icon_houseRules.svg';
import IconFeedback from '../../../assets/icons/icon_feedback.svg';
import IconDirectory from '../../../assets/icons/icon_directory.svg';
import IconQuestionnaire from '../../../assets/icons/icon_questionnaire.svg';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';

type ResidenceMenu = {
  key: string;
  name: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type Props = {
  closeDrawer: () => void;
  scrollToBottom: () => void;
};

const ResidenceMenu = ({closeDrawer, scrollToBottom}: Props) => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const enableResidential =
    firebaseConfigState.enable_residential.value || false;
  const isPropertyOwner = residentialTenantState.isPropertyOwner.value;
  const isResident = residentialTenantState.isResident.value;
  const enableFeedback =
    firebaseConfigState.enable_residential_feedback.value || false;
  const enable_contact_directory =
    firebaseConfigState.enable_residential_contact_directory.value || false;
  const enable_house_rules =
    firebaseConfigState.enable_residential_house_rules.value || false;
  const enableMyProperty =
    firebaseConfigState.enable_residential_my_property.value || false;
  const enableQuestionnaire =
    firebaseConfigState.enable_residential_questionnaire.value || false;
  const language = appLanguageState.currentLanguage.get();

  const initResidenceMenu: ResidenceMenu[] = [
    {
      key: 'HOME',
      name: t('General__Home', 'Home'),
      icon: <IconHome color="#1A1919" width="20" height="20" />,
      onPress: () => {
        closeDrawer();
        navigation.navigate('ResidentialHomeScreen');
      },
    },
    {
      key: 'FEEDBACK',
      name: t('General__Feedback', 'Feedback'),
      icon: <IconFeedback color="#1A1919" width="20" height="20" />,
      onPress: () =>
        enableFeedback
          ? navigation.navigate('FeedbackScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: t('General__Feedback', 'Feedback'),
            }),
    },
    {
      key: 'CONTACT_DIRECTORY',
      name: t('General__Contact_directory', 'Contact Directory'),
      icon: <IconDirectory color="#1A1919" width="20" height="20" />,
      onPress: () =>
        enable_contact_directory
          ? navigation.navigate('DirectoryContactScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: t('General__Contact_directory', 'Contact Directory'),
            }),
    },
    {
      key: 'HOUSE_RULES',
      name: t('Residential__House_rules_and_others', 'House Rules & Others'),
      icon: <IconHouseRules color="#1A1919" width="20" height="20" />,
      onPress: () =>
        enable_house_rules
          ? navigation.navigate('HouseRulesCategoriesScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: t(
                'Residential__House_rules_and_others',
                'House Rules & Others',
              ),
            }),
    },
    {
      key: 'MY_PROPERTY',
      name: t('General__My_property', 'My Property'),
      icon: <IconMyProperty color="#1A1919" width="20" height="20" />,
      onPress: () =>
        enableMyProperty
          ? navigation.navigate('PropertyScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: t('General__My_property', 'My Property'),
            }),
    },
    {
      key: 'QUESTIONNAIRE',
      name: t('Residential_Questionnaire', 'Questionnaire'),
      icon: <IconQuestionnaire color="#1A1919" width="20" height="20" />,
      onPress: () =>
        enableQuestionnaire
          ? navigation.navigate('QuestionnaireHomeScreen')
          : navigation.navigate('RestrictedAccessScreen', {
              title: t('Residential_Questionnaire', 'Questionnaire'),
            }),
    },
  ];
  const [residenceMenu, setResidenceMenu] =
    useState<ResidenceMenu[]>(initResidenceMenu);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setResidenceMenu(initResidenceMenu);
    validatePermission();
  }, [isPropertyOwner, isResident, residentialTenantState.tenantId.value]);

  useEffect(() => {
    setResidenceMenu(initResidenceMenu);
    validatePermission();
  }, [language]);

  const validatePermission = () => {
    try {
      if (!isPropertyOwner && !isResident) {
        // hide My Property
        setResidenceMenu(prev => prev.filter(e => e.key !== 'MY_PROPERTY'));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, scrollToBottom]);

  if (!enableResidential || !residentialPersonaActive.get()) return null;

  return (
    !isLoading && (
      <View>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => setIsOpen(prev => !prev)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text weight="medium" size="H3">
              {t('General__Residential', 'Residences')}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          <FlatList
            scrollEnabled={false}
            data={residenceMenu}
            extraData={residenceMenu}
            renderItem={({item}) => {
              return (
                <View
                  className="py-4 border-b border-gray-300 justify-center"
                  key={item.key}>
                  <TouchableOpacity
                    testID="drawer-settings-id"
                    activeOpacity={activeOpacity}
                    onPress={item.onPress}
                    disabled={isLoading}>
                    <View className="flex flex-row items-center">
                      {item.icon}
                      <Spacing width={12} />
                      <Text size="H4" color="dark-gray">
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <Spacing height={50} />
        </View>
      </View>
    )
  );
};

export default ResidenceMenu;
