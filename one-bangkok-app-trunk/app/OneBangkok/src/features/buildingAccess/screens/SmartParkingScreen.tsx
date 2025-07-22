import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Header, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import {useParkingState} from '../store/parking';
import {logScreenView} from '~/utils/logGA';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import SmartParkingInfo from '../components/SmartParkingInfo';
import SmartParkingInfoTab from '../components/SmartParkingInfoTab';
import firebaseConfigState from '~/states/firebase';
import {useAuthorization} from '~/hooks/useAuthorization';
import { isEmpty } from 'lodash';

const SmartParkingScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const {parkingLot} = useParkingState();
  const [dataTab, setDataTab] = useState<any>();
  const [index, setIndex] = useState(0);
  const {checkPermission} = useAuthorization();

  const [parkingLots, setParkingLots] = useState<
    WrappedResponseParkingLotsIndexResponseData[]
  >([...parkingLot.value]);

  useEffect(() => {
    setParkingLots([...parkingLot.value]);
  }, [parkingLot]);

  useEffect(() => {
    logScreenView('SmartParkingScreen');
  }, []);

  const sortName = useCallback(() => {
    return [...parkingLots].sort((a, b) => {
      // Check if names start with 'G'
      if (a.name.startsWith('G') && !b.name.startsWith('G')) return -1;
      if (!a.name.startsWith('G') && b.name.startsWith('G')) return 1;

      if (a.name === 'B1M') return -1;
      if (b.name === 'B1M') return 1;

      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
  }, [parkingLots]);

  const buildTabList = useCallback(() => {
    const sortedData = sortName();
    const routesList: {key: string; title: string}[] = [];
    const renderSceneObj: any = {};

    sortedData.forEach((parkingLot, index) => {
      const nameTab =
        parkingLot.display_name[appLanguageActions.getLanguage()] ??
        parkingLot.name;
      if (
        parkingLot?.name ===
        firebaseConfigState.smart_parking_default_floor.value
      ) {
        setIndex(index);
      }

      let Route = () => <SmartParkingInfo data={parkingLot} />;
      routesList.push({
        key: nameTab.replaceAll(' ', ''),
        title: nameTab,
      });
      renderSceneObj[nameTab.replaceAll(' ', '')] = Route;
    });

    setDataTab({
      renderScene: renderSceneObj,
      routes: routesList,
      data: parkingLots,
    });
  }, [parkingLots]);

  useEffect(() => {
    buildTabList();
  }, [parkingLots, buildTabList]);

  return (
    <View className={`${getTheme('flex-1 bg-default')}`}>
      <Header
        leftAction="goBack"
        title={t('General__Smart_parking', 'Smart Parking')}
      />
      <View style={styles.tabContainer}>
        {dataTab?.renderScene && dataTab?.routes && !isEmpty(dataTab?.routes) && (
          <SmartParkingInfoTab
            sceneMap={dataTab.renderScene}
            routes={dataTab.routes}
            defaultIndex={index}
          />
        )}
      </View>
      {checkPermission('view', 'MyParkingTicket') && (
        <StickyButton
          title={t('General__Parking_ticket', 'Parking Ticket')}
          rightIcon="qrCode"
          iconHeight={25}
          iconWidth={25}
          onPress={() => navigation.navigate('ParkingTicketScreen')}
        />
      )}
    </View>
  );
};

export default SmartParkingScreen;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderBlockColor: '#989898',
    borderBottomWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#464646',
    height: 1,
  },
  tabContainer: {
    flex: 1,
    marginVertical: 10,
  },
});
