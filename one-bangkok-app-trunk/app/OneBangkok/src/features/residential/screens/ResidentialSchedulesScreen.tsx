import {
  ScrollView,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon, Text} from '~/components/atoms';
import {Header} from '../components/Header';
import {
  CoolingSchedule,
  EventSchedule,
} from '~/states/residentialSchedule/residentialScheduleState';
import {useFocusEffect} from '@react-navigation/native';
import {RefreshControl} from 'react-native-gesture-handler';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import {ShortDay} from '../components/FacilitiesList';

type Menu = {
  id: string;
  title: string;
  description: string;
  screen: string;
  onPress: (event: GestureResponderEvent) => void;
};

const ResidentialSchedulesScreen = () => {
  const navigation = useNavigation();
  const [coolingSchedules, setCoolingSchedules] = useState<CoolingSchedule[]>(
    [],
  );
  const [eventSchedules, setEventSchedules] = useState<EventSchedule[]>([]);
  const menus: Menu[] = [
    {
      id: 'Action',
      title: t('Residential__Home_Automation__Actions', 'Actions'),
      description: t(
        'Residential__Home_Automation__Description',
        'Description',
      ),
      screen: 'ResidentialSchedulesScreen_Action',
      onPress: () => {
        if (eventSchedules.length >= 1) {
          navigation.navigate('ResidentialSchedulesScreen_Action', {
            selectedDay: currentDayOfWeek(),
          });
        } else {
          navigation.navigate('ActionScheduleWelcome');
        }
      },
    },
    {
      id: 'Temperature',
      title: t('Home_Automation__Temperature', 'Temperature'),
      description: t(
        'Residential__Home_Automation__Description',
        'Description',
      ),
      screen: 'TemperatureSchedule',
      onPress: () => {
        if (coolingSchedules.length >= 1) {
          navigation.navigate('TemperatureSchedule');
        } else {
          navigation.navigate('CoolingScheduleWelcome');
        }
      },
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  useFocusEffect(
    useCallback(() => {
      preload();
    }, []),
  );

  const currentDayOfWeek = () => {
    const date = new Date();
    const daysOfWeek: ShortDay[] = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];
    return daysOfWeek[date.getDay()];
  };

  const preload = async () => {
    try {
      setIsLoading(true);
      await getSchedules();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getSchedules();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const getSchedules = async () => {
    setCoolingSchedules(await residentialScheduleAction.getCoolingSchedules());
    setEventSchedules(await residentialScheduleAction.getEventSchedules());
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t('Residential__Home_Automation__Schedules', 'Schedules')}
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      <ScrollView
        style={{height: 0}}
        className="w-full bg-white p-4 py-10 "
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {menus.map(({id, title, description, onPress}, index) => (
          <View
            key={id}
            className="flex flex-col px-4 border border-line-light"
            style={{marginTop: index === 0 ? 0 : 12}}>
            <TouchableOpacity
              className=" py-4 flex flex-row justify-between items-center border-line-light"
              onPress={onPress}
              disabled={isLoading}>
              <View>
                <Text weight="medium" color="default" size="B1">
                  {title}
                </Text>
                <Text weight="regular" color="subtitle-muted" size="B2">
                  {description}
                </Text>
              </View>
              <Icon
                type="arrowRightIcon"
                height={16}
                width={16}
                color="#292929"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};
export default ResidentialSchedulesScreen;
