/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import {Header} from '~/components/molecules';
import {Spacing, Text, TextInput} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';

import {IContentCardWhatHappen, IWhatHappenAll} from '../components/IMarcom';
import WhatHappenBox from '../components/WhatHappenBox';
import {activeOpacity} from '~/constants';
import {t} from 'i18next';
import {logScreenView} from '~/utils/logGA';

const AllWhatHappenScreen = () => {
  const insets = useSafeAreaInsets();
  const currentLanguage = appLanguageState.currentLanguage.get();

  const [objWhatHappenAll, setObjWhatHappenAll] = useState<IWhatHappenAll>({
    lstCategory: [],
    lstWhatHappen: [],
  });

  const [sSearchText, setSSearchText] = useState('');
  const [lstSearch, setLstSearch] = useState<IContentCardWhatHappen[]>([]);

  const [nFilterSel, setNFilterSel] = useState<number>(0);

  const [refreshing, setRefreshing] = useState(false);

  const GetWhatHappen = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
    };
    const res = await Fetch('GetWhatHappenAll', objParam, true);
    return res;
  }, [currentLanguage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetWhatHappen()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          let arrCloneCat = resp.lstCategory;
          let arrAddAll = [{sID: 'All', sCategoryName: 'All'}, ...arrCloneCat];
          resp.lstCategory = arrAddAll;
          setObjWhatHappenAll(resp as IWhatHappenAll);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetWhatHappen]);

  const handleChangeFilter = (nID: number) => {
    setNFilterSel(nID);
  };

  useEffect(() => {
    GetWhatHappen()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjWhatHappenAll(resp as IWhatHappenAll);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetWhatHappen, currentLanguage]);

  useEffect(() => {
    let arrClone = objWhatHappenAll.lstWhatHappen;

    if (sSearchText) {
      arrClone = arrClone.filter(
        f =>
          f.sCategory
            .toLocaleLowerCase()
            .includes(sSearchText.toLocaleLowerCase()) ||
          f.sTitle
            .toLocaleLowerCase()
            .includes(sSearchText.toLocaleLowerCase()) ||
          f.sLocation
            .toLocaleLowerCase()
            .includes(sSearchText.toLocaleLowerCase()) ||
          f.sDate.toLocaleLowerCase().includes(sSearchText.toLocaleLowerCase()),
      );
    }

    const getFirstDayOfWeek = () => {
      let date = new Date();
      const day = date.getDay();
      const diff = date.getDate() - day;
      let dCal = new Date(date.setDate(diff));
      let dResult = new Date(
        dCal.getFullYear(),
        dCal.getMonth(),
        dCal.getDate(),
        0,
        0,
        0,
        0,
      );
      return dResult;
    };
    const getLastDayOfWeek = () => {
      let date = new Date();
      const day = date.getDay();
      const diff = 6 - day;
      let dCal = new Date(date.setDate(date.getDate() + diff));
      let dResult = new Date(
        dCal.getFullYear(),
        dCal.getMonth(),
        dCal.getDate(),
        0,
        0,
        0,
        0,
      );
      return dResult;
    };

    const addHoursToDate = (date: Date, hours: number) => {
      date.setHours(date.getHours() + hours);
      return date;
    };

    const checkOnThisWeek = (
      startDate: Date,
      endDate: Date,
      passSunDate: Date,
      nextSatDate: Date,
    ) => {
      let isOnThisWeek = false;
      let currentDate = startDate;

      while (currentDate <= endDate) {
        if (passSunDate <= currentDate && nextSatDate >= currentDate) {
          isOnThisWeek = true;
        }
        // Increment the current date by one day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return isOnThisWeek;
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    };

    const getLastDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    let arrResult: IContentCardWhatHappen[] = [];
    if (nFilterSel !== 0) {
      let date = new Date();
      let dTodayTemp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
      );
      let dToday = addHoursToDate(dTodayTemp, 7);
      let dPassSun = addHoursToDate(getFirstDayOfWeek(), 7);
      let dNextSat = addHoursToDate(getLastDayOfWeek(), 7);
      let dNextSun = addHoursToDate(getLastDayOfWeek(), 31);
      let dFirstMonth = addHoursToDate(getFirstDayOfMonth(dToday), 7);
      let dLastMonth = addHoursToDate(getLastDayOfMonth(dToday), 7);

      arrClone.forEach(item => {
        if (item.dStart != null && item.dEnd != null) {
          let dStart = addHoursToDate(new Date(item.dStart), 7);
          let dEnd = addHoursToDate(new Date(item.dEnd), 7);

          switch (nFilterSel) {
            case 1:
              //Today
              let isBetweenToday = dStart <= dToday && dEnd >= dToday;
              if (isBetweenToday) {
                arrResult.push(item);
              }
              break;
            case 2:
              //This Week
              let isOnThisWeek = checkOnThisWeek(
                dStart,
                dEnd,
                dPassSun,
                dNextSat,
              );
              if (isOnThisWeek) {
                arrResult.push(item);
              }
              break;
            case 3:
              //This Weekend
              let isOnThisWeekend = checkOnThisWeek(
                dStart,
                dEnd,
                dNextSat,
                dNextSun,
              );
              if (isOnThisWeekend) {
                arrResult.push(item);
              }
              break;
            case 4:
              //This Month
              let isOnThisMonth = checkOnThisWeek(
                dStart,
                dEnd,
                dFirstMonth,
                dLastMonth,
              );
              if (isOnThisMonth) {
                arrResult.push(item);
              }
              break;
          }
        }
      });
    } else {
      arrResult = arrClone;
    }
    setLstSearch(arrResult);
  }, [objWhatHappenAll.lstWhatHappen, sSearchText, nFilterSel]);

  const styles = StyleSheet.create({
    categoryActive: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 1,
      paddingBottom: 1,
      borderRadius: 4,
      backgroundColor: '#1a1919',
    },
    categoryInActive: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 1,
      paddingBottom: 1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#bdbdbd',
    },
  });

  let arrFilter = [
    {nID: 0, sName: t('Mc_SearchAll', 'All')},
    {nID: 1, sName: t('Mc_SearchToday', 'Today')},
    {nID: 2, sName: t('Mc_ThisWeek', 'This Week')},
    {nID: 3, sName: t('Mc_ThisWeekend', 'This Weekend')},
    {nID: 4, sName: t('Mc_ThisMonth', 'This Month')},
  ];

  useEffect(() => {
    logScreenView('AllWhatHappenScreen');
  }, []);

  return (
    <Screen>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <Header title={t('Mc_Event', 'Event') ?? 'Event'} leftAction="goBack" />
      <Spacing height={10} />
      <View className="w-full px-3">
        <TextInput
          onChangeText={text => setSSearchText(text)}
          placeholder={t('Mc_SearchHere', 'Search Here') ?? 'Search Here'}
          rightIcon="search"
          style={{backgroundColor: '#f4f6f7', color: 'black', borderRadius: 10}}
        />
        <Spacing height={15} />
        <ScrollView
          className="gap-2"
          horizontal={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}>
          {arrFilter.map((item, index) => (
            <TouchableOpacity
              key={`${item.nID}-${index}`}
              activeOpacity={activeOpacity}
              style={
                nFilterSel === item.nID
                  ? styles.categoryActive
                  : styles.categoryInActive
              }
              onPress={() => handleChangeFilter(item.nID)}>
              <Text
                style={{fontSize: 14}}
                className={nFilterSel === item.nID ? 'text-white' : ''}>
                {item.sName}
              </Text>
            </TouchableOpacity>
          ))}

          <View className="w-5" />
        </ScrollView>
        <Spacing height={15} />

        <ScrollView
          className={'w-full'}
          style={{
            height: Dimensions.get('window').height - 250,
          }}
          contentContainerStyle={{paddingBottom: insets.bottom}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            {lstSearch.length > 0 ? (
              lstSearch.map((item, index) => (
                <View key={item.sID + '_' + index}>
                  <WhatHappenBox {...item} />
                  <Spacing height={10} />
                </View>
              ))
            ) : (
              <View>
                <Spacing height={20} />
                <Text
                  style={{
                    color: '#7c7c7c',
                    textAlign: 'center',
                  }}>{`${t('Mc_no_data', 'There is no data on')}${
                  arrFilter.find(f => f.nID === nFilterSel)?.sName
                }`}</Text>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </View>
      <FloatingStickyMenu
        type="obNewIcon"
        width={30}
        height={30}
        color="white"
        rotation={0}
      />
    </Screen>
  );
};

export default AllWhatHappenScreen;
