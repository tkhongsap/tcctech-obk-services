import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import bmsService from '~/services/bmsService';
import {ACRequestResponse, ACRequestStatus} from 'ob-bms-sdk/dist/api';
import getTheme from '~/utils/themes/themeUtils';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DateTime from '~/utils/datetime';
import Loading from '~/components/organisms/Loading';
import {useNavigation} from '~/navigations/AppNavigation';
import {classNameStatus} from '../constants/buildingAccess';

import {
  createAirConditionerRequestAction,
  useCreateAirConditionerRequestState,
} from '../store/airConditionerRequest';
import dayjs from 'dayjs';
import { sortedZone } from '~/utils/sorted';

const AirConditionerRequestEmpty = () => {
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

const DateTimeCard = ({
  date,
  dateCompare,
  durationHour,
}: {
  date: string;
  dateCompare: string;
  durationHour: number;
}) => {
  let dateString = date;
  let dateCompareString = dayjs(dateCompare).format('DD MMMM YYYY');
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  if (DateTime.isSameWithType(date, dateCompare, 'day')) {
    dateString = t('no_key', '{{dateFull}} | {{start}} - {{end}}', {
      dateFull: dayjs(date).locale(languageSelected).format('DD MMMM YYYY'),
      start: dayjs(date).format('HH:mm'),
      end: dayjs(date).add(durationHour, 'hours').format('HH:mm'),
    });
  } else if (DateTime.isSameWithType(date, dateCompare, 'month')) {
    dateString = t('no_key', '{{date}} - {{dateFull}} | {{start}} - {{end}}', {
      date: dayjs(date).locale(languageSelected).format('DD'),
      dateFull: dateCompareString,
      start: dayjs(date).format('HH:mm'),
      end: dayjs(date).add(durationHour, 'hours').format('HH:mm'),
    });
  } else if (DateTime.isSameWithType(date, dateCompare, 'year')) {
    dateString = t('no_key', '{{date}} - {{dateFull}} | {{start}} - {{end}}', {
      date: dayjs(date).locale(languageSelected).format('DD MMMM'),
      dateFull: dateCompareString,
      start: dayjs(date).format('HH:mm'),
      end: dayjs(date).locale(languageSelected).add(durationHour, 'hours').format('HH:mm'),
    });
  } else {
    dateString = t('no_key', '{{date}} - {{dateFull}} | {{start}} - {{end}}', {
      date: dayjs(date).format('DD MMMM YYYY'),
      dateFull: dateCompareString,
      start: dayjs(date).format('HH:mm'),
      end: dayjs(date).locale(languageSelected).add(durationHour, 'hours').format('HH:mm'),
    });
  }

  return (
    <Text size="B2" numberOfLines={1}>
      {dateString}
    </Text>
  );
};

const RenderCard = ({
  item,
  onPress,
}: {
  item: ACRequestResponse;
  onPress: Function;
}) => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';

  const getNameACZone = useCallback(() => {
    const acZones: string[] = [];
    item.ac_zone?.forEach(acZone => {
      acZones.push(acZone?.ac_zone?.name);
    });
    const sortedZones = sortedZone(acZones)

    return sortedZones?.join(', ');
  }, [item.ac_zone]);

  const mapStatusText = () => {
    switch (item.status) {
      case ACRequestStatus.Submitted:
        return t('General__Submitted', 'Submitted');
      case ACRequestStatus.Rejected:
        return t('General__Rejected', 'Rejected');
      case ACRequestStatus.Approved:
        return t('General__Approved', 'Approved');
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
        <Spacing height={20} />
        <Text weight="medium" numberOfLines={1}>
          {item.tower?.display_name[languageSelected]}
        </Text>
        <Text size="B2" color="subtitle-muted">
          {t('no_key', '{{floor}} | {{zone}}', {
            floor:
              item.floor?.display_name[languageSelected] ?? item.floor?.name,
            zone: getNameACZone(),
          })}
        </Text>
        <Spacing height={24} />
        <View className="flex-row justify-between">
          <View>
            <DateTimeCard
              date={dayjs(item.from).toISOString()}
              dateCompare={dayjs(item.to).toISOString()}
              durationHour={item.duration_hour}
            />
            <Text size="B2" weight="medium">
              {t('General__Bath_value', '{{value}} Bath', {
                value: Number(item.estimated_cost).toLocaleString(),
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type AirConditionerTab = 'pass' | 'scheduled';
interface IProps {
  type?: AirConditionerTab;
  setIndex?: any;
}

const defaultAirConditionerRequestList = {
  fetchMoreData: true,
  pageNumber: 1,
  pageSize: 25,
  requestServiceList: [],
};

const AirConditionerRequestList = (props: IProps) => {
  const {type, setIndex} = props;
  const [pageData, setPageData] = useState<{
    fetchMoreData: boolean;
    pageNumber: number;
    pageSize: number;
    requestServiceList: ACRequestResponse[] | null | undefined;
  }>(defaultAirConditionerRequestList);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentSizeData, setContentSizeData] = useState<any>();
  const navigation = useNavigation();
  const {submitted} = useCreateAirConditionerRequestState();

  const onPressAirConditionerRequest = async (id: string) => {
    const requestServiceDetail =
      await bmsService.getAirConditionerRequestDetail(id);
    if (requestServiceDetail) {
      navigation.navigate('AirConditionerRequestDetailScreen', {
        data: requestServiceDetail,
      });
    }
  };

  const fetchData = useCallback(async () => {
    if (loading) {
      let requestServiceList: ACRequestResponse[] | null | undefined = [];
      if (type === 'scheduled') {
        requestServiceList = await bmsService.getAirConditionerRequest(
          pageData.pageNumber,
          pageData.pageSize,
          dayjs().toISOString(),
        );
      } else {
        requestServiceList = await bmsService.getAirConditionerRequest(
          pageData.pageNumber,
          pageData.pageSize,
          undefined,
          dayjs().toISOString(),
        );
      }

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
      setPageData(prevState => ({
        ...prevState,
        requestServiceList: requestServiceList,
      }));
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
  }, [loading]);

  useEffect(() => {
    if (submitted.value === true) {
      setPageData(defaultAirConditionerRequestList);
      setLoading(true);
      createAirConditionerRequestAction.setSubmitted(false);
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
        ListEmptyComponent={!loading ? <AirConditionerRequestEmpty /> : <></>}
        contentContainerStyle={{marginBottom: 30}}
        extraData={pageData.requestServiceList}
        keyExtractor={item => `${item.id}`}
        ItemSeparatorComponent={() => <Spacing height={12} />}
        renderItem={({item}: {item: ACRequestResponse}) => {
          return (
            <RenderCard
              item={item}
              onPress={() => onPressAirConditionerRequest(item.id)}
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

export default AirConditionerRequestList;
