import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import bmsService from '~/services/bmsService';
import {isEmpty} from 'lodash';
import {ServiceRequestData, ServiceRequestStatus} from 'ob-bms-sdk/dist/api';
import getTheme from '~/utils/themes/themeUtils';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DateTime from '~/utils/datetime';
import Loading from '~/components/organisms/Loading';
import {useNavigation} from '~/navigations/AppNavigation';
import {classNameStatus, statusText} from '../constants/buildingAccess';
import {
  createRequestServiceAction,
  useCreateRequestServiceState,
} from '../store/requestService';

const RequestServiceEmpty = () => {
  return (
    <View>
      <Spacing height={150} />
      <Text className="text-center" weight="medium" size="H3">
        {t('General__No_request_created', 'No requests created')}
      </Text>
      <Text className="text-center">
        {t(
          'General__No_request_created_description',
          'You haven’t created any ticket yet.',
        )}
      </Text>
    </View>
  );
};

const RenderCard = ({
  item,
  onPress,
}: {
  item: ServiceRequestData;
  onPress: Function;
}) => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  const diffDateTimeText = DateTime.getDiffDateTimeText(item.created_at);

  const mapStatusText = () => {
    switch (item.status) {
      case ServiceRequestStatus.Submitted:
        return t('General__Submitted', 'Submitted');
      case ServiceRequestStatus.InProgress:
        return t('General__In_progress', 'In progress');
      case ServiceRequestStatus.Done:
        return t('General__Done', 'Done');
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress()}>
      <View
        className={`px-4 py-[20px] ${getTheme('border-[1px] border-line')}`}>
        <View className="flex-row justify-between items-center">
          <View className="w-9/12">
            <Text weight="medium" numberOfLines={1}>
              {item.references}
            </Text>
          </View>
          <View className={`p-[8px] ${classNameStatus[item.status]}`}>
            <Text size="C1">{mapStatusText()}</Text>
          </View>
        </View>
        <Spacing height={22} />
        <Text weight="medium" numberOfLines={1}>
          {item.title}
        </Text>
        <Spacing height={28} />
        <View className="flex-row justify-between">
          <View>
            <Text size="B2">
              {item.issue_type?.display_name[languageSelected]}
            </Text>
            <Text size="B2">{item.tower?.display_name[languageSelected]}</Text>
            <Text size="B2">
              {item.floor?.display_name[languageSelected] ?? item.floor?.name}
            </Text>
          </View>
          <View className="justify-end">
            <Text size="B2">{diffDateTimeText}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface IProps {
  status?: ServiceRequestStatus;
  setIndex?: any;
}

const defaultRequestServiceList = {
  fetchMoreData: true,
  pageNumber: 1,
  pageSize: 25,
  requestServiceList: [],
};

const RequestServiceList = (props: IProps) => {
  const {status, setIndex} = props;
  const [pageData, setPageData] = useState<{
    fetchMoreData: boolean;
    pageNumber: number;
    pageSize: number;
    requestServiceList: any[];
  }>(defaultRequestServiceList);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentSizeData, setContentSizeData] = useState<any>();
  const navigation = useNavigation();
  const {submitted} = useCreateRequestServiceState();

  const onPressRequestService = async (id: string) => {
    const requestServiceDetail = await bmsService.getRequestServiceDetail(id);
    if (requestServiceDetail) {
      navigation.navigate('RequestServiceDetailScreen', {
        data: requestServiceDetail,
      });
    }
  };

  const fetchData = useCallback(async () => {
    if (loading) {
      const requestServiceList = await bmsService.getRequestService(
        pageData.pageNumber,
        pageData.pageSize,
        status,
      );

      if (requestServiceList?.length === pageData.pageSize) {
        setPageData(prevState => ({
          ...prevState,
          pageNumber: pageData.pageNumber + 1,
        }));
      } else {
        setPageData(prevState => ({
          ...prevState,
          fetchMoreData: false,
        }));
      }

      let data = requestServiceList;
      if (!isEmpty(data)) {
        if (!status) {
          data = requestServiceList?.filter(
            requestService => requestService.status != 'done',
          );
        }
        const newData = [...pageData.requestServiceList, ...data];
        setPageData(prevState => ({
          ...prevState,
          requestServiceList: newData,
        }));
      }
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
  }, [loading]);

  useEffect(() => {
    if (submitted.value === true) {
      setPageData(defaultRequestServiceList);
      setLoading(true);
      createRequestServiceAction.setSubmitted(false);

      setIndex && setIndex(0);
    }
  }, [submitted.value]);

  const isToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const paddingToBottom = 80;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <ScrollView
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScroll={({nativeEvent}) => {
        if (
          isToBottom(nativeEvent) &&
          pageData.fetchMoreData &&
          contentSizeData != nativeEvent.contentSize.height
        ) {
          setContentSizeData(nativeEvent.contentSize.height);
          setLoading(true);
        }
      }}>
      <Spacing height={19} />
      <FlatList
        data={pageData.requestServiceList}
        scrollEnabled={false}
        ListEmptyComponent={!loading ? <RequestServiceEmpty /> : <></>}
        contentContainerStyle={{marginBottom: 30}}
        extraData={pageData.requestServiceList}
        keyExtractor={item => `${item.id}`}
        ItemSeparatorComponent={() => <Spacing height={12} />}
        renderItem={({item}: {item: ServiceRequestData}) => {
          return (
            <RenderCard
              item={item}
              onPress={() => onPressRequestService(item.id)}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <View className="h-[50px] w-full items-center">
              <Loading isLoading={loading} />
            </View>
          ) : (
            <></>
          )
        }
      />
    </ScrollView>
  );
};

export default RequestServiceList;
