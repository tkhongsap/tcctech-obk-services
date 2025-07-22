import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Screen} from '~/components/templates';
import {HeadText, Header, Button, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import dayjs from 'dayjs';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {memberAction} from '../store/member';
import FloorList from '../components/FloorList';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import AreaList from '../components/AreaList';
import {useScreenHook} from '~/services/EventEmitter';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {useParkingState} from '../store/parking';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import firebaseConfigState from '~/states/firebase';
import SmartParkingInfo from '../components/SmartParkingInfo';
import {logEvent, logScreenView} from '~/utils/logGA';

const SmartParkingScreen = () => {
  const layout = useWindowDimensions();
  const navigation = useNavigation<StackNavigation>();
  const [dataTab, setDataTab] = useState<any>();
  const [index, setIndex] = useState(0);
  const {parkingLot} = useParkingState();

  const [parkingLots, setParkingLots] =
    useState<WrappedResponseParkingLotsIndexResponseData>(parkingLot.value);
  const [routes] = React.useState([
    {key: 'first', title: t('General__Zones', 'Zones')},
    {key: 'second', title: t('General__Floors', 'Floors')},
  ]);
  const languages = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : appLanguageState.defaultLanguage.get();
  const FirstRoute = () => <AreaList data={parkingLots} />;

  const SecondRoute = () => <FloorList data={parkingLots} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      activeColor="#464646"
      renderLabel={({route, focused}) => (
        <Text size="B1" color={focused ? 'default' : 'muted-400'}>
          {route.title}
        </Text>
      )}
      android_ripple={{color: 'white'}}
    />
  );

  useScreenHook('WebSocket', async event => {
    const data = event.data;

    switch (event.name) {
      case WebSocketEventNames.PARKING_AVAILABILITY_UPDATED:
        setParkingLots(data);
        break;
      default:
        break;
    }
  });
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
  }, [parkingLots, sortName]);

  useEffect(() => {
    logScreenView('SmartParkingScreen');
    buildTabList();
  }, [parkingLots, buildTabList]);
  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_smart_parking.png')}>
        <Header
          leftAction="goBack"
          onPressLeftAction={() => navigation.goBack()}
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
        />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__Smart_parking', 'Smart Parking')}
            description={`${dayjs()
              .locale(languages)
              .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`}
            titleColor="default-inverse"
            taglineColor="sky-blue"
            descriptionColor="line"
            descriptionSpacing={16}
          />
        </View>
      </HeaderImage>
      <ScrollView className="w-full" scrollEnabled={false}>
        <View className="flex px-7 w-full">
          <Spacing height={24} />
          <View
            className={getTheme('flex w-full')}
            style={{height: layout.height / 1.78}}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
              lazy
            />
          </View>
        </View>
      </ScrollView>
      <StickyButton
        title={t('General__Parking_ticket', 'Parking Ticket')}
        rightIcon="qrCode"
        iconHeight={25}
        iconWidth={25}
        onPress={() => {
          logEvent('button_click', {
            screen_name: 'SmartParkingScreen',
            feature_name: 'Visitor QR Parking Access',
            action_type: 'click',
            bu: 'Residential',
          });
          navigation.navigate('ParkingTicketScreen');
        }}
      />
    </Screen>
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
});
