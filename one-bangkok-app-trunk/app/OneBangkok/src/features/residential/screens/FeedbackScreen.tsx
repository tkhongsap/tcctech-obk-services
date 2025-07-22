import {TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import FeedbackList from '../components/FeedbackList';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import {
  FeedbackAppStatus,
  FeedbackDetail,
  FeedbackTab,
  getFeedbackAppStatus,
} from './FeedbackDetailScreen';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import clsx from 'clsx';

type Paginate = {
  total: number;
  per_page: number;
  offset: number;
  to: number;
  last_page: number;
  current_page: number;
  from: number;
};
const defaultPaginate: Paginate = {
  total: 1,
  per_page: 100,
  offset: 0,
  last_page: 1,
  current_page: 1,
  from: 1,
  to: 1,
};

const FeedbackScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [tab, setTab] = useState<FeedbackTab>(FeedbackTab.CURRENT);
  const [currentFeedbacks, setCurrentFeedbacks] = useState<FeedbackDetail[]>(
    [],
  );
  const [pastFeedbacks, setPastFeedbacks] = useState<FeedbackDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPaginate, setCurrentPaginate] =
    useState<Paginate>(defaultPaginate);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      preload();
    }, []),
  );

  const preload = async (retry: number = 2) => {
    try {
      setIsLoading(true);
      const {feedbacks, paginate} = await getFeedbacks({
        currentPage: currentPaginate.current_page,
        perPage: currentPaginate.per_page,
      });
      setCurrentPaginate(paginate);
      const {currents, pasts} = mapToFeedbackTab(feedbacks);
      setCurrentFeedbacks(currents);
      setPastFeedbacks(pasts);
    } catch (error) {
      if (retry >= 1) {
        await preload(retry - 1);
      } else {
        navigateToErrorScreen();
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const {feedbacks, paginate} = await getFeedbacks({
        currentPage: defaultPaginate.current_page,
        perPage: defaultPaginate.per_page,
      });
      setCurrentPaginate(paginate);
      const {currents, pasts} = mapToFeedbackTab(feedbacks);
      setCurrentFeedbacks(currents);
      setPastFeedbacks(pasts);
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setRefreshing(false);
    }
  };

  const mapToFeedbackTab = (feedbacks: FeedbackDetail[]) => {
    try {
      const currents: FeedbackDetail[] = [];
      const pasts: FeedbackDetail[] = [];

      for (const feedback of feedbacks) {
        const appStatus = getFeedbackAppStatus(feedback.statusCode);
        if (
          appStatus === FeedbackAppStatus.DONE ||
          appStatus === FeedbackAppStatus.CANCELLED
        ) {
          pasts.push({...feedback, appStatus, tab: FeedbackTab.PAST});
        } else {
          currents.push({
            ...feedback,
            appStatus,
            tab: FeedbackTab.CURRENT,
          });
        }
      }
      return {currents, pasts};
    } catch (error) {
      return {currents: [], pasts: []};
    }
  };

  const getFeedbacks = async (payload: {
    currentPage: number;
    perPage: number;
  }): Promise<{feedbacks: FeedbackDetail[]; paginate: Paginate}> => {
    const {data} = await serviceMindService.feedbackList(payload);
    const {data: feedbacks, ...paginate} = data;
    return {feedbacks, paginate};
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
      screenHook: 'FeedbackScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('FeedbackScreen'),
    });
  };

  const tabClassName = (_tab: FeedbackTab) => {
    return clsx(
      getTheme(' leading-[17.6px] justify-center '),
      getTheme(
        tab === _tab
          ? 'border-b border-dark-teal-dark'
          : 'border-b border-line',
      ),
    );
  };

  const getNextFeedbackPage = async () => {
    try {
      if (
        !isLoading &&
        currentPaginate.total > currentFeedbacks.length + pastFeedbacks.length
      )
        return;
      setIsLoading(true);
      const {feedbacks, paginate} = await getFeedbacks({
        currentPage: currentPaginate.current_page + 1,
        perPage: currentPaginate.per_page,
      });
      setCurrentPaginate(paginate);
      const {currents, pasts} = mapToFeedbackTab(feedbacks);
      setCurrentFeedbacks(prev => [...prev, ...currents]);
      setPastFeedbacks(prev => [...prev, ...pasts]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <View className="w-full bg-white">
          <Header
            leftAction="goBack"
            onPressLeftAction={() => navigation.goBack()}
            bgColor={getTheme('bg-default')}
            leftColor={'#292929'}
            iconHeight={25}
            iconWidth={25}
          />
          <View className="px-5">
            <HeadText
              tagline={t('Residential__Residential', 'Residences')}
              title={t('Residential__Feedback', 'Feedback')}
              description={t(
                'Residential__Feedback__Feedback__Body',
                'You can effortlessly generate feedback to formally report any issues you may encounter',
              )}
              titleColor="default"
              taglineColor="subtitle-muted"
              descriptionColor="subtitle-muted"
              descriptionSpacing={16}
              descriptionClassName="leading-[24px]"
            />
          </View>
          <Spacing height={16} />
        </View>

        <View className={getTheme('bg-default flex w-full')}>
          <Spacing height={16} />
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => setTab(FeedbackTab.CURRENT)}
              className={tabClassName(FeedbackTab.CURRENT)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={tab === FeedbackTab.CURRENT ? 'dark-teal' : 'default'}
                weight={tab === FeedbackTab.CURRENT ? 'medium' : 'regular'}>
                {t('Residential__Maintenance__Current', 'Current')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(FeedbackTab.PAST)}
              className={tabClassName(FeedbackTab.PAST)}
              style={{height: 47, width: '50%'}}>
              <Text
                className="text-center"
                color={tab === FeedbackTab.PAST ? 'dark-teal' : 'default'}
                weight={tab === FeedbackTab.PAST ? 'medium' : 'regular'}>
                {t('Residential__Maintenance__Past', 'Past')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{flex: 1, flexGrow: 1}}
          className={getTheme('bg-vp-list z-10 mt-4')}>
          <FeedbackList
            data={
              tab === FeedbackTab.CURRENT ? currentFeedbacks : pastFeedbacks
            }
            isLoading={isLoading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            getData={getNextFeedbackPage}
          />
        </View>
      </ScreenContainer>

      <StickyButton
        title={t('Residential__Feedback__Create_new_feedback', 'Create new')}
        className="bg-dark-teal-dark"
        rightIcon="plusIcon"
        iconHeight={20}
        iconWidth={20}
        onPress={() => {
          navigation.navigate('CreateFeedbackScreen');
        }}
      />
    </>
  );
};

export default FeedbackScreen;
