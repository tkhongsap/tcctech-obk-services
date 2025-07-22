import {
  View,
  NativeScrollEvent,
  TouchableOpacity,
  Pressable,
  ScrollView,
  RefreshControl,
  GestureResponderEvent,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import DateTime from '~/utils/datetime';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {useFocusEffect} from '@react-navigation/native';
import {
  UnitDetail,
  useResidentialUnitSelectedState,
} from '~/states/residentialTenant/residentialTenantState';
import DatetimeParser from '../../utils/reformatter/datetime';
import {ScreenContainer} from '../../components';
import {Header} from '../../components/Header';
import ConfirmChangeUnitOnHouseRulesModal from '../../components/ConfirmChangeUnitOnHouseRulesModal';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {DropdownItem} from '../../visitorPass/components/ControllDropdown';
import {useModal} from '../../components/ResidentialModal';
import {TQuestionnaire} from './QuestionnaireDetailScreen';
import IconVisitor from '~/assets/icons/icon-ob-visitor-outline.svg';
import dayjs from 'dayjs';

enum Tab {
  NEW,
  HISTORY,
}
type Paginate = {
  total: number;
  limit: number;
  count: number;
  page: number;
};
const defaultPaginate: Paginate = {
  total: 1,
  limit: 10,
  count: 1,
  page: 1,
};

const QuestionnaireHomeScreen = () => {
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const unitSelectedState = useResidentialUnitSelectedState();
  const [_, modalActions] = useModal();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.NEW);
  const [isLoading, setIsLoading] = useState(false);
  const [paginate, setPaginate] = useState<Paginate>(defaultPaginate);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState<DropdownItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [questionnaires, setQuestionnaires] = useState<{
    new: TQuestionnaire[];
    histories: TQuestionnaire[];
  }>({new: [], histories: []});

  useEffect(() => {
    getProjects();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedProjectId) preload(selectedTab, selectedProjectId);
    }, [selectedProjectId, selectedTab]),
  );

  const preload = async (tab: Tab, projectId?: string, retry: number = 2) => {
    try {
      setIsLoading(true);
      const {paginate, data} = await getQuestionnaires(
        defaultPaginate,
        tab,
        projectId,
      );
      setPaginate(paginate);
      if (tab === Tab.NEW) setQuestionnaires({new: data, histories: []});
      if (tab === Tab.HISTORY) {
        setQuestionnaires({new: [], histories: data});
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

  const getQuestionnaires = async (
    paginate: Paginate,
    tab: Tab,
    projectId?: string,
  ) => {
    if (tab === Tab.NEW) {
      const {data} = await serviceMindService.questionnaires({
        ...paginate,
        projectId,
      });
      return data;
    } else {
      const {data} = await serviceMindService.questionnairesHistory({
        ...paginate,
        projectId,
      });
      return data;
    }
  };

  const getProjects = async () => {
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
    setProjects(uniqueUnits);
    const projectId = unitSelectedState.selectedProjectId.value;
    const defaultUnit = properties.find(e => e.isDefault) ?? properties[0];
    setSelectedProjectId(projectId || defaultUnit.projectId);
  };

  const getProperties = async (): Promise<UnitDetail[]> => {
    const {data} = await serviceMindService.properties();
    return data.properties;
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
      screenHook: 'QuestionnaireHomeScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('QuestionnaireHomeScreen'),
    });
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onPressTab = () => {
    setSelectedTab(prev => (prev === Tab.NEW ? Tab.HISTORY : Tab.NEW));
  };

  const onPressProject = () => {
    if (selectedProjectId) {
      modalActions.setContent(
        <ConfirmChangeUnitOnHouseRulesModal
          selected={selectedProjectId}
          items={projects}
          onPressDone={setSelectedProjectId}
        />,
      );
      modalActions.show();
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      if (selectedProjectId === undefined) return;
      const {paginate, data} = await getQuestionnaires(
        defaultPaginate,
        selectedTab,
        selectedProjectId,
      );
      setPaginate(paginate);
      if (selectedTab === Tab.NEW) {
        setQuestionnaires({new: data, histories: []});
      }
      if (selectedTab === Tab.HISTORY) {
        setQuestionnaires({new: [], histories: data});
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
    }
  };

  const onScroll = (event: NativeScrollEvent) => {
    const questionnairesLength =
      selectedTab === Tab.NEW
        ? questionnaires.new.length
        : questionnaires.histories.length;
    if (
      isCloseToBottom(event) &&
      !isLoading &&
      paginate.total > questionnairesLength
    ) {
      getNextRequestPage();
    }
  };

  const getNextRequestPage = async () => {
    try {
      setIsLoading(true);
      const response = await getQuestionnaires(
        {...paginate, page: paginate.page + 1},
        selectedTab,
        selectedProjectId,
      );

      setPaginate(paginate);
      if (selectedTab === Tab.NEW) {
        setQuestionnaires(prev => ({
          ...prev,
          new: [...prev.new, ...response.data],
        }));
      }
      if (selectedTab === Tab.HISTORY) {
        setQuestionnaires(prev => ({
          ...prev,
          histories: [...prev.histories, ...response.data],
        }));
      }
      setPaginate(response.paginate);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t('Residential_Questionnaire', 'Questionnaire')}
        bgColor="bg-white"
        titleColor="dark-gray"
        // leftColor="#292929"
        // onPressLeftAction={onPressLeftAction}
      />
      <View className={getTheme('w-full flex-1 bg-white relative')}>
        <View className="pb-10 flex flex-1">
          <View className="px-5">
            {/* <HeadText
              title={t('Residential_Questionnaire', 'Questionnaire')}
              tagline={t('General__Residential', 'Residential')}
              taglineColor="subtitle-muted"
            /> */}
          </View>

          {selectedProjectId && (
            <>
              <View className="px-5 pt-8">
                <Text weight="medium" className="mb-2">
                  {t('General_Project', 'Project')}
                </Text>

                <TouchableOpacity
                  className={
                    'px-4 border flex flex-col border-line-light w-full mb-3 h-[56px]'
                  }
                  onPress={onPressProject}
                  disabled={isLoading}>
                  <View className="py-4 flex flex-row justify-between items-center">
                    <View>
                      <Text className="text-dark-gray-light mt-2 m-0">
                        {
                          projects.find(e => e.value === selectedProjectId)
                            ?.label
                        }
                      </Text>
                    </View>
                    <View className="rotate-90">
                      <Icon
                        type="right"
                        width={20}
                        height={20}
                        color="#292929"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row px-4 mt-4">
                {[Tab.NEW, Tab.HISTORY].map(tab => (
                  <Pressable
                    key={tab}
                    onPress={onPressTab}
                    className={`flex-1 flex-row justify-center py-3 border-b ${
                      selectedTab === tab
                        ? 'border-dark-teal-light'
                        : 'border-line-light'
                    }`}>
                    <Text
                      size="B1"
                      weight={selectedTab === tab ? 'medium' : 'regular'}
                      color={
                        selectedTab === tab ? 'dark-teal' : 'subtitle-muted'
                      }>
                      {tab === Tab.NEW
                        ? t('Residential_Questionnaire_New_tab', 'New')
                        : t('Residential_Questionnaire_History_tab', 'History')}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <ScrollView
                className="bg-white"
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
                refreshControl={
                  <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                  />
                }
                onScroll={({nativeEvent}) => onScroll(nativeEvent)}>
                <View
                  className="flex flex-col p-4 mt-4 h-full mb-16"
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{gap: 12}}>
                  {!isLoading &&
                  questionnaires.new.length === 0 &&
                  questionnaires.histories.length === 0 ? (
                    <EmptyCardList
                      title={
                        selectedTab === Tab.NEW
                          ? t(
                              'Residential_Questionnaire_No_new',
                              'No new questionnaire',
                            )
                          : t(
                              'Residential_Questionnaire_No_history',
                              'No history questionnaire',
                            )
                      }
                      description={t(
                        'Residential_Questionnaire_No_description',
                        "You don't have any questionnaire.",
                      )}
                    />
                  ) : selectedTab === Tab.NEW ? (
                    questionnaires.new.map(questionnaire => (
                      <Card
                        key={questionnaire.id}
                        questionnaire={questionnaire}
                        onPress={() =>
                          navigation.navigate('QuestionnaireCreateScreen', {
                            questionnaire,
                          })
                        }
                      />
                    ))
                  ) : (
                    questionnaires.histories.map(questionnaire => (
                      <Card
                        key={questionnaire.id}
                        questionnaire={questionnaire}
                        onPress={() =>
                          navigation.navigate('QuestionnaireDetailScreen', {
                            questionnaire,
                          })
                        }
                      />
                    ))
                  )}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
export default QuestionnaireHomeScreen;

interface EmptyCardListProps {
  title: string;
  description: string;
}
const EmptyCardList = ({title, description}: EmptyCardListProps) => {
  return (
    <View className="flex flex-col items-center h-full mt-[150px]">
      <IconVisitor type="camera" width={48} height={48} color="black" />
      <Text weight="medium" size="H3" color="dark-gray" className="mt-3">
        {title}
      </Text>
      <Text color="mist-gray-700">{description}</Text>
    </View>
  );
};

interface Props {
  questionnaire: TQuestionnaire;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}
const Card = ({questionnaire, onPress}: Props) => {
  return (
    <TouchableOpacity
      className="flex flex-col px-4 border border-line-light mb-[12px]"
      onPress={onPress}>
      <View className=" py-4 flex flex-row justify-between items-center border-line-light">
        <View>
          <Text
            weight="medium"
            color="default"
            size="B1"
            numberOfLines={2}
            className="max-w-[310px]">
            {questionnaire.title}
          </Text>
          <Text
            weight="regular"
            color="subtitle-muted"
            size="B2"
            numberOfLines={2}
            className="max-w-[280px]">
            {questionnaire.description}
          </Text>
          <View className="mt-5">
            <Text weight="regular" size="B2" color="default">
              {DateAvailable({
                from: Number(questionnaire.fromDate),
                to: Number(questionnaire.toDate),
              })}
            </Text>
            <Text
              weight="regular"
              color="subtitle-muted"
              size="B2"
              numberOfLines={1}
              className="max-w-[280px]">
              {getDiffDateTimeText(Number(questionnaire.createdAt))}
            </Text>
          </View>
        </View>
        <Icon type="arrowRightIcon" height={16} width={16} color="#292929" />
      </View>
    </TouchableOpacity>
  );
};
const DateAvailable = (date: {from: number; to: number}) => {
  if (!date.from || !date.to) {
    return;
  }

  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const start = dayjs(date.from);
  const end = dayjs(date.to);
  const isSameDay = start.isSame(end, 'day');
  const isSameMonth = start.isSame(end, 'month');
  const isSameYear = start.isSame(end, 'year');
  console.log(start, end, isSameDay, isSameMonth, isSameYear);
  let dateString = '';

  if (isSameDay) {
    dateString = DatetimeParser.toDMY({
      language,
      timestamp: start.valueOf(),
    });
  } else if (!isSameMonth) {
    dateString = `${DatetimeParser.toDMY({
      language,
      timestamp: start.valueOf(),
    })} - ${DatetimeParser.toDMY({
      language,
      timestamp: end.valueOf(),
    })}`;
  } else if (!isSameYear) {
    dateString = `${start
      .locale(language)
      .format('DD MMMM')} - ${DatetimeParser.toDMY({
      language,
      timestamp: end.valueOf(),
    })}`;
  } else {
    dateString = `${start
      .locale(language)
      .format('DD')} - ${DatetimeParser.toDMY({
      language,
      timestamp: end.valueOf(),
    })}`;
  }

  return dateString;
};

const getDiffDateTimeText = (date: string | number | Date) => {
  const current = DateTime.getCurrentDateTime();

  let diff = DateTime.getDateDiff(date, current.toDate(), 'seconds');
  if (diff <= 60) {
    return t('General__Just_now', 'Just now');
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'minutes');
  if (diff <= 60) {
    return t('General__mins_ago', '{{min}} mins ago', {min: diff});
  }
  diff = DateTime.getDateDiff(date, current.toDate(), 'hours');
  if (diff <= 24) {
    return t('General__hours_ago', '{{hour}} hours ago', {hour: diff});
  } else {
    const language = appLanguageActions.getLanguage() || 'en';
    const timestamp = new Date(date).getTime();
    return t('General__date_time', '{{date}} at {{time}}', {
      date: DatetimeParser.toDMY({language, timestamp}),
      time: DatetimeParser.toHM({language, timestamp}),
    });
  }
};
