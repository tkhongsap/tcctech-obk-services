import {ScrollView, View, RefreshControl} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Spacing} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {
  Announcement,
  AnnouncementProps,
  Announcements,
} from '~/features/residential/components/Announcements';
import {
  QuickAction,
  QuickActions,
  Reminder,
} from '~/features/residential/components/QuickActions';
import {Service, Services} from '~/features/residential/components/Services';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import BlockUnitList from '../components/BlockUnitList';
import {HomeContainer} from '~/features/residential/components';
import {
  contactConciergePhoneNumber,
  UnitDetail,
  useResidentialUnitSelectedState,
} from '~/states/residentialTenant/residentialTenantState';
import {NavbarResidentialHome} from '../components/NavbarResidentialHome';
import {FloatingStickyMenu} from '~/features/home/components/FloatingMenu'; // Adjust the path based on where you place the component
import getTheme from '~/utils/themes/themeUtils';
import {isTablet} from '../utils/device';
import t from '~/utils/text';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {apiEventEmitter} from '~/helpers/api';
import authenState from '~/states/authen/authenState';
import {TQuestionnaire} from '../questionnaire/screens/QuestionnaireDetailScreen';
import {useModal} from '../components/ResidentialModal';
import QuestionnaireWelcomeModal from '../questionnaire/components/QuestionnaireWelcomeModal';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notificationAction from '~/features/notification/store';
import firebaseConfigState from '~/states/firebase';

const ResidentialHomeScreen = () => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const navigation = useNavigation();
  const [announcement, setAnnouncement] = useState<AnnouncementProps>({
    title: '',
    announcementList: [],
    contents: [],
  });
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [reminder, setReminder] = useState<Reminder>({
    visitor: {total: '0', unitWiseCount: []},
    parcel: {total: '0', unitWiseCount: []},
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<UnitDetail[]>([]);
  const unitSelectedState = useResidentialUnitSelectedState();
  const [refreshing, setRefreshing] = useState(false);
  const [_, modalActions] = useModal();
  const enableQuestionnaire =
    firebaseConfigState.enable_residential_questionnaire.value || false;

  useIsFocused();

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    preload();
  }, [appLanguageState.currentLanguage.get()]);

  useFocusEffect(
    useCallback(() => {
      loadAfterBack(1);
    }, []),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!authenState.token.value) {
        navigation.reset({routes: [{name: 'SignInScreen'}]});
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Add a listener for the 'unauthorized' event
    const unauthorizedListener = apiEventEmitter.addListener(
      'unauthorized',
      () => {
        // Redirect to the login screen when unauthorized event is received
        navigation.reset({routes: [{name: 'SignInScreen'}]});
      },
    );

    // Cleanup: Remove the listener when the component unmounts
    return () => {
      unauthorizedListener.remove();
    };
  }, [navigation]);

  const preload = async () => {
    try {
      setIsLoading(true);
      const properties = await getTenantProps();
      setProperties(properties);
      const defaultProperty = properties[0];
      if (properties.length >= 1) {
        unitSelectedState.set({
          selectedUnit: defaultProperty.houseNumber,
          defaultUnit: defaultProperty.houseNumber,
          activeIndex: 0,
          selectedProjectId: defaultProperty.projectId,
          projectName: defaultProperty.projectName,
          unitId: defaultProperty.propertyUnitId,
        });
      }
      const selectedProjectId = defaultProperty?.projectId ?? '';
      await Promise.all([
        getQuestionnaires(defaultProperty.propertyUnitId),
        getHomeData(selectedProjectId),
        getAnnouncement(selectedProjectId),
      ]);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const loadAfterBack = async (retry: number = 1) => {
    try {
      const {selectedProjectId, unitId} = unitSelectedState.get({
        noproxy: true,
      });
      const [properties] = await Promise.all([
        getTenantProps(),
        getHomeData(selectedProjectId),
        getAnnouncement(selectedProjectId),
      ]);
      setProperties(properties);
    } catch (error) {
      if (retry >= 1) {
        loadAfterBack(retry - 1);
      } else {
        navigateToErrorScreen();
      }
    } finally {
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const {selectedProjectId, unitId} = unitSelectedState.get({
        noproxy: true,
      });
      const [properties] = await Promise.all([
        getTenantProps(),
        getHomeData(selectedProjectId),
        getAnnouncement(selectedProjectId),
        getQuestionnaires(unitId),
      ]);
      // setProperties([]);
      setProperties(properties);
      // const defaultProperty = properties[0];
      // if (properties.length >= 1) {
      //   unitSelectedState.set({
      //     selectedUnit: defaultProperty.houseNumber,
      //     defaultUnit: defaultProperty.houseNumber,
      //     activeIndex: 0,
      //     selectedProjectId: defaultProperty.projectId,
      //     projectName: defaultProperty.projectName,
      //     unitId: defaultProperty.propertyUnitId,
      //   });
      // }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
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
      screenHook: 'MainPageScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('MainPageScreen'),
    });
  };

  const getHomeData = async (propertyProjectId: string) => {
    const {data} = await serviceMindService.home(propertyProjectId);
    setAnnouncement(data.anouncement);
    setQuickActions(data.quickAction);
    setReminder(data.reminder);
    setServices(data.services);
    const contactConciergeService = (data.services as Service[]).find(
      e => e.type === 'concierge',
    );
    if (contactConciergeService) {
      contactConciergePhoneNumber.set(
        contactConciergeService?.data?.phoneNumber ?? null,
      );
    }
  };

  const getAnnouncement = async (propertyProjectId: string) => {
    const {data} = await serviceMindService.announcements(propertyProjectId);
    setAnnouncementList(data.data);
  };

  const getTenantProps = async () => {
    const {data} = await serviceMindService.properties();
    if (data?.properties?.length === 0) {
      return [];
    }
    return sortTenantPropertiesByDefault(data.properties);
  };

  const sortTenantPropertiesByDefault = (properties: UnitDetail[]) => {
    return properties.sort((a, b) =>
      b.isDefault === a.isDefault ? 0 : b.isDefault ? 1 : -1,
    );
  };

  const getQuestionnaires = async (unitId: string) => {
    try {
      if (!enableQuestionnaire) return;
      const {data} = await serviceMindService.propertyDetail(unitId);

      const propertyDetail = data as UnitDetail;
      const unansweredQuestionnaires = propertyDetail.unansweredQuestionnaires;
      if (unansweredQuestionnaires.length > 0) {
        // check this unitId questionnaires is not disabled
        const isNotShowToday =
          await residentialTenantAction.isQuestionnaireNotShowToday(
            data.property.projectId,
          );
        if (isNotShowToday) {
          return;
        }
        modalActions.setContent(
          <QuestionnaireWelcomeModal
            unitId={data.property.projectId}
            unansweredQuestionnaires={unansweredQuestionnaires}
          />,
        );
        modalActions.setStates({
          animationInTiming: 200,
        });
        modalActions.show();
      }
    } catch (error) {}
  };

  const handleActiveIndexChange = (
    index: number,
    unitNumber: string,
    propertyUnitId: string,
    projectId: string,
  ) => {
    const {selectedProjectId, unitId} = unitSelectedState.get({noproxy: true});
    if (propertyUnitId !== unitId) {
      getQuestionnaires(propertyUnitId);
    }
    if (selectedProjectId !== projectId) {
      getHomeData(projectId);
      getAnnouncement(projectId);
    }
    unitSelectedState.set(state => ({
      ...state,
      activeIndex: index,
      selectedUnit: unitNumber,
      defaultUnit: unitNumber,
      selectedProjectId: projectId,
      unitId: propertyUnitId,
      projectName:
        language === 'th'
          ? properties[index].projectsNameThai
          : properties[index].projectsName,
    }));
  };

  return (
    <>
      <HomeContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <NavbarResidentialHome isRefreshing={refreshing} />
        {!isLoading && properties.length > 0 && (
          <>
            <View
              className={
                isTablet
                  ? getTheme('w-[780px] h-full bg-white')
                  : getTheme('w-full h-full bg-white')
              }>
              <ScrollView
                className={getTheme('w-full h-full')}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                <View className="pb-[140px]">
                  <BlockUnitList
                    data={{
                      defaultUnit: unitSelectedState.defaultUnit.get(),
                      properties,
                      onActiveIndexChange: handleActiveIndexChange,
                      activeIndex: unitSelectedState.activeIndex.get(),
                    }}
                  />

                  <Spacing height={40} />
                  <Announcements
                    title={
                      announcement.title ??
                      t(
                        'Residential__Announcement__News_And_Announcement',
                        'News & Announcement',
                      )
                    }
                    announcementList={announcementList}
                    contents={announcement.contents}
                  />
                  {quickActions.length >= 1 && (
                    <QuickActions
                      quickActions={quickActions}
                      reminder={reminder}
                    />
                  )}
                  {services.length >= 1 && <Services services={services} />}
                </View>
              </ScrollView>
            </View>
            <View />
          </>
        )}
      </HomeContainer>
      {!isLoading && properties.length > 0 && (
        <FloatingStickyMenu
          type="obNewIcon"
          width={30}
          height={30}
          color="white"
          rotation={0}
        />
      )}
    </>
  );
};

export default ResidentialHomeScreen;
