import React, {useCallback, useEffect, useState} from 'react';

import {Header} from '~/components/molecules/Header';

import {HeadText, modalActions} from '~/components/molecules';
import t from '~/utils/text';

import {Spacing, Text} from '~/components/atoms';
import TabSlider, {tabData} from '../../../components/molecules/TabSlider';

import CollapsiblePageNavigation, {
  CollapsibleBody,
  CollapsibleHead,
} from '~/components/organisms/CollapsiblePageNavigation';
import {Image, TouchableOpacity, View} from 'react-native';
import NotificationList from '../components/NotificationList';
import noNotificationImage from '~/assets/images/image-no-notification.png';
import notificationAction from '../store';
import {Screen} from '~/components/templates/Screen';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import NotificationListAction from '../components/NotificationListAction';
import {Confirmation} from '~/components/organisms/GenericModal';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import {ActionTitle} from '../components/ActionTitle';
import {hideLoading, showLoading} from '~/states/loadingState';
import {logScreenView} from '~/utils/logGA';
import {MessageGetIndexResult} from 'ob-notification-sdk/dist/api';
import {notificationActiveTabState} from '~/states/notification/notificationState';

const DefaultNoNotification = () => {
  return (
    <View className="px-6 flex flex-col justiy-center items-center w-screen pt-[100px]">
      {/* todo: will change to lottie when uxui provide the file */}
      <Image
        className="max-h-[48px] max-w-[48px]"
        source={noNotificationImage}
      />
      <Text size="H2" weight="medium">
        {t('Notifications__All_notification__Empty_header', 'No notifications')}
      </Text>
      <Text className="text-center" color="subtitle-muted">
        {t(
          'Notifications__All_notification__Empty_body',
          'You currently have no notifications. Any upcoming updates will automatically be displayed as notifications',
        )}
      </Text>
    </View>
  );
};

const initialPage = -1;
const initialTotalPage = 0;
const initialTotalMessage = 0;
const initialPageMetaData = {
  total: initialTotalPage,
  page: initialPage,
  messages: initialTotalMessage,
};
const AllNotificationsScreen = () => {
  const defaultAll = {
    name: 'All',
    text: t('General__All', 'All'),
    description: t('General__All_Notifications', 'All Notifications'),
    badge: 0,
  };
  const defaultCategoryList: tabData[] = [defaultAll];

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [pageData, setPageData] = useState({
    ...initialPageMetaData,
    categoryLists: defaultCategoryList,
    notificationList: [],
  });

  const [scrollToTop, setScrollToTop] = useState<boolean>(false);
  const [needRefreshing, setNeedRefreshing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [needFetch, setFetch] = useState<boolean>(false);
  const [needFetchCategory, setFetchCategory] = useState<boolean>(true);
  const [showNotificationAction, setShowNotificationAction] =
    useState<boolean>(false);
  const navigation = useNavigation();

  const resetEdit = () => {
    setInclude([]);
    setExclude([]);
    setSelectedAll(false);
    setSelectedCount(0);
    setEdit(!edit);
    setShowNotificationAction(false);
  };

  const resetAllStatePagination = () => {
    setPageData(prevState => ({
      ...prevState,
      ...initialPageMetaData,
      notificationList: [],
    }));
  };

  const autoSelectActiveTab = (name: string) => {
    if (categoryLists.length > 1) {
      const index = categoryLists.findIndex(
        category => category.name === notificationActiveTabState.value,
      );
      onPressTab(index);
    }
    if (activeCategory?.description === name && !loadingActiveTab) {
      setLoadingActiveTab(true);
      setLoading(false);
    }
  };

  const onPressTab = (index: number) => {
    if (activeTabIndex !== index) {
      resetAllStatePagination();
      setActiveTabIndex(index);
      setFetch(true);
    }
    setScrollToTop(true);
  };

  const setNotificationList = (list: any) => {
    setPageData(prevState => ({
      ...prevState,
      notificationList: list,
    }));
  };

  const setPageMetaData = (total: number, messages: number, page: number) => {
    setPageData(prevState => ({
      ...prevState,
      total,
      messages,
      page,
    }));
  };

  const setCategoryList = (value: any) => {
    setPageData(prevState => ({
      ...prevState,
      categoryLists: value,
    }));
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingActiveTab, setLoadingActiveTab] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [include, setInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onceActive, setOnceActive] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    const fetchCategory = pageData.categoryLists[activeTabIndex]?.name;
    setFetch(false);
    setRefreshing(false);
    const result = await notificationAction.fetchNotificationPagiantion(
      fetchCategory,
      pageData.page + 1,
      pageData.total,
    );

    setLoading(false);
    if (result && result.data) {
      setPageMetaData(
        result.meta?.total_pages ?? 0,
        result.meta?.total ?? 0,
        pageData.page + 1,
      );
      const newList = pageData.notificationList.concat(result?.data);
      setNotificationList(newList);
    } else {
      setPageMetaData(0, 0, 1);
      setNotificationList([]);
    }
  }, [
    activeTabIndex,
    pageData.categoryLists,
    pageData.notificationList,
    pageData.page,
    pageData.total,
  ]);

  const fetchCategoryList = useCallback(async () => {
    setFetchCategory(false);
    const fetchCategory = await notificationAction.getCategoryList();
    const fetchUnreads = await notificationAction.getAllUnreadMessageCategory();
    if (fetchCategory && fetchUnreads) {
      const map = new Map(
        fetchUnreads.map((data: {name: any; total: any}) => {
          return [data.name, data.total];
        }),
      );
      const clone = [{...defaultAll, badge: map.get('All')}];
      fetchCategory.forEach(category =>
        clone.push({
          name: category.name,
          text: category.name,
          description: category.name,
          badge: map.get(category.name),
        }),
      );
      setCategoryList(clone);
      if (!onceActive && notificationActiveTabState.value !== 'All') {
        const activeIndex = fetchCategory.findIndex(
          obj => obj.name === notificationActiveTabState.value,
        );
        setActiveTabIndex(activeIndex);
        setOnceActive(true);
        setLoadingActiveTab(true);
        return;
      }
    }
    setLoadingActiveTab(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (needFetchCategory) {
      setLoading(true);
      fetchCategoryList();
    }
    if (needFetch && !loading) {
      setLoading(true);
      fetchData();
    }
    if (needRefreshing) {
      setNeedRefreshing(false);
      fetchCategoryList();
    }
    if (notificationActiveTabState.value !== 'All' && !loadingActiveTab) {
      autoSelectActiveTab(notificationActiveTabState.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchCategoryList,
    fetchData,
    loading,
    needFetch,
    needFetchCategory,
    needRefreshing,
  ]);

  useEffect(() => {
    if (selectedCount === 0) {
      setShowNotificationAction(false);
    } else {
      setShowNotificationAction(true);
    }
  }, [selectedCount]);

  const resetScrollToTop = () => {
    setScrollToTop(false);
  };
  const onEndReached = async () => {
    if (!loading) {
      setFetch(true);
    }
  };
  const handleOnRefresh = () => {
    resetAllStatePagination();
    setRefreshing(true);
    setNeedRefreshing(true);
  };

  const markAsRead = async (id: string) => {
    const notification = pageData.notificationList.find(n => n.id === id);
    if (notification && !notification.read) {
      // Mark the notification as read
      await notificationAction.markAsRead(id);

      // Decrease the badge count for the specific category and 'All'
      const updatedCategories = pageData.categoryLists.map(category => {
        if (
          category.name === notification.category ||
          category.name === 'All'
        ) {
          return {
            ...category,
            badge: category.badge > 0 ? category.badge - 1 : 0,
          };
        }
        return category;
      });

      // Update the category list in the page data
      setPageData(prevState => ({
        ...prevState,
        categoryLists: updatedCategories,
      }));

      // Update the notification list
      const newNotificationList = pageData.notificationList.map(notif => {
        if (notif.id === id) {
          return {...notif, read: true};
        }
        return notif;
      });
      setNotificationList(newNotificationList);
    }
  };

  const handleOnPress = async (id: string) => {
    markAsRead(id);
    setIsLoading(true);
    try {
      const result = await notificationAction.getMessage(id);
      setIsLoading(false);
      if (result) {
        navigation.navigate('NotificationDetailScreen', {
          messageData: result as MessageGetIndexResult,
        });
      } else {
        console.error('Failed to fetch notification details');
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      setIsLoading(false);
    }
  };

  const onSelected = (id: string) => {
    if (selectedAll) {
      if (exclude.includes(id)) {
        // If the ID is in the exclude array, remove it
        setExclude(exclude.filter(item => item !== id));
        setSelectedCount(prevCount => prevCount + 1); // Decrease selected count
      } else {
        // If the ID is not in the exclude array, add it
        setExclude([...exclude, id]);
        setSelectedCount(prevCount => prevCount - 1); // Increase selected count
      }
    } else {
      if (include.includes(id)) {
        // If the ID is in the include array, remove it$
        setInclude(include.filter(item => item !== id));
        setSelectedCount(prevCount => prevCount - 1); // Decrease selected count
      } else {
        // If the ID is not in the include array, add it
        setInclude([...include, id]);
        setSelectedCount(prevCount => prevCount + 1); // Increase selected count
      }
    }
  };

  const checked = (id: string) => {
    if (selectedAll) {
      return !exclude.includes(id);
    } else {
      return include.includes(id);
    }
  };

  const onSelectAll = () => {
    setSelectedAll(true);
    const allIdMessage = pageData.notificationList.map(i => i.id);
    setInclude(allIdMessage);
    setExclude([]);
    setSelectedCount(pageData.notificationList.length); // Set selected count to the total message count
  };

  const onDeselect = () => {
    setSelectedAll(false);
    setInclude([]);
    setExclude([]);
    setSelectedCount(0); // Set selected count to the total message count
  };

  const onGoback = () => {
    notificationActiveTabState.set('All');
    navigation.goBack();
  };

  const goToAnnouncementScreen = () => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__back_to_explore', 'Back to Explore'),
      screenHook: 'AllNotificationScreen',
    });
  };

  const onDeleteContinue = async () => {
    showLoading();
    const result = await notificationAction.deletes(include, exclude);
    hideLoading();
    modalActions.hide();
    resetEdit();
    if (!result) {
      goToAnnouncementScreen();
    }
    handleOnRefresh();
  };

  const onDelete = () => {
    modalActions.setContent(
      <Confirmation
        title={t('Drawer__Delete_nofi__Header', 'Confirm deletion')}
        description={t(
          'Drawer__Delete_nofi__Body',
          'Are you sure you want to delete these {{noti}} messages?',
          {
            noti: selectedCount,
          },
        )}
        onContinue={onDeleteContinue}
        onCancel={() => modalActions.hide()}
        ConfirmButtonColor="fire-engine-red"
        ConfirmButtonOutlined={true}
      />,
    );
    modalActions.show();
  };

  const onReadContinue = async () => {
    const result = await notificationAction.reads(include, exclude);
    modalActions.hide();
    resetEdit();
    if (!result) {
      goToAnnouncementScreen();
    }
    handleOnRefresh();
  };

  const onRead = () => {
    modalActions.setContent(
      <Confirmation
        title={t('General__Mark_as_read', 'Mark as read')}
        description={t(
          'Drawer__Mark_as_read__Body',
          'Are you sure you want to mark these {{noti}} messages as read?',
          {
            noti: selectedCount,
          },
        )}
        onContinue={onReadContinue}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };

  useScreenHook('AllNotificationScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('HomeScreen');
          break;
        }
        break;
      default:
        break;
    }
  });

  const [headerHeight, setHeaderHeight] = useState(0);
  const {categoryLists} = pageData;
  const activeCategory = categoryLists[activeTabIndex];
  useEffect(() => {
    logScreenView('AllNotificationScreen');
    return () => {
      notificationActiveTabState.set('All');
    };
  }, []);

  return (
    <Screen isLoading={isLoading}>
      <Header onPressLeftAction={onGoback} leftAction="goBack" />

      {!needFetchCategory && (
        <View style={{flex: 1}}>
          {/* Sticky Header Content */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              zIndex: 10,
              paddingHorizontal: 20,
            }}>
            <HeadText
              title={t('General__Notifications', 'Notifications')}
              tagline={t('General__One_bangkok', 'One Bangkok')}
              taglineColor="muted"
            />
            <Spacing height={24} />
            {loadingActiveTab && (
              <TabSlider
                activeIndex={activeTabIndex}
                onPress={onPressTab}
                tabList={pageData.categoryLists}
              />
            )}
            <View className="flex flex-row justify-between text-center relative z-9 my-3">
              <ActionTitle
                description={activeCategory?.description}
                onDeselect={onDeselect}
                onSelectAll={onSelectAll}
                edit={edit}
                selectedAll={selectedAll}
              />
              {selectedCount > 0 && (
                <Text size="B2" weight="medium">
                  {`${selectedCount} ${t('General__Selected', 'Selected')}`}
                </Text>
              )}
              <TouchableOpacity>
                <Text
                  className={getTheme('text-primary')}
                  onPress={() => {
                    edit ? resetEdit() : setEdit(true);
                  }}>
                  {edit
                    ? t('General__Cancel', 'Cancel')
                    : t('General__Edit', 'Edit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Collapsible Section */}
          <CollapsiblePageNavigation
            scrollToTop={scrollToTop}
            headerHeight={headerHeight > 0 ? headerHeight : 170}
            onScrollToTop={resetScrollToTop}>
            <CollapsibleHead />
            <CollapsibleBody>
              <NotificationList
                className="w-screen"
                headerHeight={headerHeight}
                data={pageData.notificationList}
                loading={loading}
                onEndReached={onEndReached}
                onRefresh={handleOnRefresh}
                refreshing={refreshing}
                onPress={handleOnPress}
                edit={edit}
                onSelected={onSelected}
                checked={checked}
                allowFetch={!edit}
                islastPage={pageData.page + 1 > pageData.total}
                ListEmptyComponent={
                  pageData.notificationList.length === 0 &&
                  !loading &&
                  !refreshing
                    ? DefaultNoNotification
                    : null
                }
              />
            </CollapsibleBody>
          </CollapsiblePageNavigation>
        </View>
      )}

      {showNotificationAction && (
        <View className="absolute inset-x-0 bottom-0">
          <NotificationListAction
            leftActionTitle={t('General__Delete', 'Delete')}
            rightActionTitle={t('General__Mark_as_read', 'Mark as Read')}
            leftAction={onDelete}
            rightAction={onRead}
          />
        </View>
      )}
    </Screen>
  );
};
export default AllNotificationsScreen;
