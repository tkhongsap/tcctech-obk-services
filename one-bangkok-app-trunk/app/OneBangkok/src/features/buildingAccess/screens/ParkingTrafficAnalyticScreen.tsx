// external libraries
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TrafficRecordData } from 'ob-bms-sdk/dist/api';
import * as OB_BMS_SDK from 'ob-bms-sdk';
// components
import { Header } from '~/components/molecules';
import BottomSheetContent from '~/components/BottomSheetContent';
import TabContent from '~/components/TabContent';
import { Text } from '~/components/atoms';
import Loading from '~/components/organisms/Loading';
// utils
import T from '~/utils/text';
import { removeDuplicatedItemsFromArray } from '~/utils/array';
import getTheme from '~/utils/themes/themeUtils';
// assets
import MapImage from '~/assets/images/parking-gate-map.png';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface DescriptionLocale {
  en: string;
  th: string;
  cs: string;
}

interface ITrafficItemProps {
  uid: string;
  name: string;
  meta: {
    eventId: string;
    monitoringPointSyscode: string;
    monitoringPointName: string;
    laneState: number;
  };
  data: {
    description?: DescriptionLocale;
  };
}

interface IRenderitemProps {
  item: ITrafficItemProps;
}

interface ILoadingProps {
  isLoading: boolean;
}

enum TRAFFIC_DIRECTION {
  IN = 'in',
  OUT = 'out',
}

const LoadingComponent = ({ isLoading }: ILoadingProps) => {
  return (
    <View className="w-full flex-1 justify-center items-center">
      <Loading isLoading={isLoading} />
    </View>
  );
};

const TrafficItem = ({ meta, data, name }: ITrafficItemProps) => {
  let language = appLanguageState.currentLanguage.get();
  if (language === '') {
    language = appLanguageState.defaultLanguage.get();
  }
  const { laneState } = meta;
  const { description } = data;
  const lenStateValue = [
    {
      backgroundColor: getTheme('bg-light-gray'),
      textClor: getTheme('text-dark-teal'),
      label: 'Very light',
    },
    {
      backgroundColor: getTheme('bg-dark-teal'),
      textClor: getTheme('text-white-text'),
      label: 'Light',
    },
    {
      backgroundColor: getTheme('bg-yellow'),
      textClor: getTheme('text-dark-gray'),
      label: 'Moderate',
    },
    {
      backgroundColor: getTheme('bg-dark-red'),
      textClor: getTheme('text-white-text'),
      label: 'Heavy',
    },
  ];
  return (
    <View
      className={clsx(
        'flex-1 flex-row justify-between items-center py-4',
        getTheme('border-b border-line'),
      )}>
      <View>
        <Text weight="medium" className={getTheme('text-dark-gray')}>
          {name}
        </Text>
        <Text size="B2" className={getTheme('text-subtitle-muted')}>
          {description
            ? description[language as keyof DescriptionLocale] || ''
            : ''}
        </Text>
      </View>
      <View
        className={clsx(
          'w-[120px] rounded py-1 px-3',
          lenStateValue[laneState].backgroundColor,
        )}>
        <Text
          size="B2"
          className={clsx('text-center', lenStateValue[laneState].textClor)}>
          {lenStateValue[laneState].label}
        </Text>
      </View>
    </View>
  );
};

const ParkingTrafficAnalyticScreen = () => {
  const [trafficInGate, setTrafficInGate] = useState<TrafficRecordData[]>([]);
  const [trafficOutGate, setTrafficOutGate] = useState<TrafficRecordData[]>([]);
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const renderItem = useCallback(
    ({ item }: IRenderitemProps) => <TrafficItem {...item} />,
    [trafficInGate, trafficOutGate],
  );

  let timerRef: any = useRef<null>(null);

  useEffect(() => {
    fetchTrafficData();
    const pollingCallback = async () => {
      console.log('Polling for traffic record data...');
      await fetchTrafficData();
    };

    const startPolling = () => {
      // polling every 5 minutes
      timerRef.current = setInterval(pollingCallback, 300000);
    };

    const stopPolling = () => {
      clearInterval(timerRef?.current);
    };

    startPolling();

    return () => {
      stopPolling();
    };
  }, []);

  const categorizeTrafficData = (
    direction: TRAFFIC_DIRECTION,
    trafficData: TrafficRecordData[],
  ): TrafficRecordData[] => {
    const filteredData = trafficData.filter(
      item => item.data.direction === direction,
    );
    return removeDuplicatedItemsFromArray(
      filteredData,
      'uid',
    ) as TrafficRecordData[];
  };

  const fetchTrafficData = async () => {
    const result = await OB_BMS_SDK.client.trafficRecordsIndex().catch(err => {
      console.log('fetch traffic record error:', err);
    });
    setUpdatedTime(dayjs().format('D MMM YYYY hh:mma'));
    setIsLoading(false);
    const resultData = result?.data.data;
    if (!resultData) {
      return;
    }
    const directionInData =
      categorizeTrafficData(
        TRAFFIC_DIRECTION.IN,
        resultData as TrafficRecordData[],
      ) || [];
    const directionOutData =
      categorizeTrafficData(
        TRAFFIC_DIRECTION.OUT,
        resultData as TrafficRecordData[],
      ) || [];
    setTrafficInGate(
      directionInData.sort((a, b) => a.name.localeCompare(b.name)),
    );
    setTrafficOutGate(
      directionOutData.sort((a, b) => a.name.localeCompare(b.name)),
    );
  };

  const styles = StyleSheet.create({
    mapImage: {
      height: '57%',
      width: undefined,
    },
  });

  return (
    <>
      <Header
        title={T('General__Parking_traffic_analytic', 'Traffic analytics')}
        leftAction="goBack"
      />
      <Image source={MapImage} resizeMode="contain" style={styles.mapImage} />
      <BottomSheetContent snapPoints={['30%', '60%']}>
        <TabContent
          list={[
            {
              title: T('General__In', 'In'),
              content: (
                <>
                  <View className="pb-3">
                    <Text size="B2" className={getTheme('text-subtitle-muted')}>
                      {T('General__Last_updated', 'Last updated')}:{' '}
                      {updatedTime}
                    </Text>
                  </View>
                  {isLoading ? (
                    <LoadingComponent isLoading={isLoading} />
                  ) : (
                    <BottomSheetFlatList
                      data={trafficInGate}
                      keyExtractor={i => i.uid}
                      renderItem={renderItem}
                      refreshing={false}
                    />
                  )}
                </>
              ),
            },
            {
              title: T('General__Out', 'Out'),
              content: (
                <>
                  <View className="pb-3">
                    <Text size="B2" className={getTheme('text-subtitle-muted')}>
                      {T('General__Last_updated', 'Last updated')}:{' '}
                      {updatedTime}
                    </Text>
                  </View>
                  <BottomSheetFlatList
                    data={trafficOutGate}
                    keyExtractor={i => i.uid}
                    renderItem={renderItem}
                    refreshing={false}
                  />
                </>
              ),
            },
          ]}
        />
      </BottomSheetContent>
    </>
  );
};

export default ParkingTrafficAnalyticScreen;
