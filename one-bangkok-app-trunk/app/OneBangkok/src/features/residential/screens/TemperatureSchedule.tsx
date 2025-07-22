import {View, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text, Spacing} from '~/components/atoms';
import FacilitiesList, {
  CoolingScheduleDetail,
  SDReadableTimetable,
  ShortDay,
} from '../components/FacilitiesList';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import React, {useCallback, useEffect, useState} from 'react';
import OptionTemperatureModal from '../components/OptionTemperatureModal';
import OptionTemperatureScheduleModal from '../components/OptionTemperatureScheduleModal';
import {modalActions} from '../components/ResidentialModal';
import {
  CoolingSchedule,
  coolingScheduleSelectedId,
} from '~/states/residentialSchedule/residentialScheduleState';
import netatmoService from '~/services/residentialService/NetatmoService';
import {useFocusEffect} from '@react-navigation/native';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';

const TemperatureSchedule = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState<CoolingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<CoolingSchedule>();
  const [scheduleDetail, setScheduleDetail] = useState<CoolingScheduleDetail>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    selectedSchedule && getSchedule(selectedSchedule.id);
  }, [selectedSchedule]);

  useEffect(() => {
    selectedSchedule &&
      setSelectedSchedule(prev => schedules.find(e => e.id === prev?.id));
  }, [schedules]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (coolingScheduleSelectedId.value) {
          const coolingSchedules =
            await residentialScheduleAction.getCoolingSchedules();
          setSchedules(coolingSchedules);
          const schedule = coolingSchedules.find(
            e => e.id === coolingScheduleSelectedId.value,
          );
          setSelectedSchedule(schedule);
          coolingScheduleSelectedId.set(null);
        }
      } catch (error) {}
    };

    fetchData();
  }, [coolingScheduleSelectedId.value]);

  useFocusEffect(
    useCallback(() => {
      loadAfterBack();
    }, []),
  );

  const loadAfterBack = async () => {
    try {
      setIsLoading(true);
      await refresh();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const preload = async () => {
    try {
      setIsLoading(true);
      const coolingSchedules =
        await residentialScheduleAction.getCoolingSchedules();
      setSchedules(coolingSchedules);
      const defaultSelected =
        coolingSchedules.find(e => e.selected) ?? coolingSchedules[0];
      setSelectedSchedule(defaultSelected);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    const [_, coolingSchedules] = await Promise.all([
      residentialScheduleAction.getHome(),
      residentialScheduleAction.getCoolingSchedules(),
    ]);
    setSchedules(coolingSchedules);
  };

  const onSelectSchedule = async (schedule: CoolingSchedule) => {
    try {
      setIsLoading(true);
      if (schedule.id !== selectedSchedule?.id) setSelectedSchedule(schedule);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getSchedule = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await netatmoService.getHomeSchedule(id);
      const schedule = data.body.homes[0].schedules as CoolingScheduleDetail;
      schedule.readable_timetable = shiftTimetableSundayToFirst(
        schedule.readable_timetable,
      );
      setScheduleDetail(schedule);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const shiftTimetableSundayToFirst = (timetable: SDReadableTimetable) => {
    const {Sun, ...days} = timetable;
    return {Sun, ...days};
  };

  const onPressConfigModal = () => {
    if (selectedSchedule) {
      modalActions.setContent(
        <OptionTemperatureModal
          schedules={schedules}
          schedule={selectedSchedule}
          onEnabledSchedule={updateEnabledSchedule}
        />,
      );
      modalActions.show();
    }
  };

  const updateEnabledSchedule = (enabledScheduleId: string) => {
    setSchedules(prev =>
      prev.map(schedule => ({
        ...schedule,
        selected: schedule.id === enabledScheduleId,
      })),
    );
    setSelectedSchedule(prev => prev && {...prev, selected: true});

    // update home state
    residentialScheduleAction.getHome();
  };

  const onPressOptionScheduleModal = () => {
    if (selectedSchedule) {
      modalActions.setContent(
        <OptionTemperatureScheduleModal
          initialSelectedSchedule={selectedSchedule}
          schedules={schedules}
          onChanged={onSelectSchedule}
        />,
      );
      modalActions.show();
    }
  };

  const onPressBar = (selectedDay: ShortDay) => {
    selectedSchedule &&
      navigation.navigate('ResidentialTemperatureSchedulesDay', {
        selectedSchedule,
        selectedDay,
      });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refresh();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Home_Automation__Temperature_Schedule',
          'Temperature Schedule',
        )}
        titleColor="dark-gray"
        bgColor="bg-white"
      />

      <ScrollView
        className="w-full bg-white"
        style={{gap: 12}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View className="pt-10 pb-20">
          {selectedSchedule && (
            <View className="mb-1 px-4 flex-row justify-between">
              <TouchableOpacity
                onPress={onPressOptionScheduleModal}
                disabled={isLoading}
                className="flex-row grow"
                style={{gap: 4}}>
                <Text
                  size="H4"
                  weight="medium"
                  numberOfLines={1}
                  className="max-w-[85%] break-all">
                  {selectedSchedule.name}
                </Text>
                <View className="rotate-90 ml-[-4px]">
                  <Icon type="right" width={14} height={14} color="#292929" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressConfigModal}
                disabled={isLoading}>
                <Icon type="horizontal" width={20} height={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}

          <Text
            className="px-4 mb-2"
            color="subtitle-muted"
            size="B1"
            weight="regular">
            {selectedSchedule?.selected
              ? t('Residential__Home_Automation__Active', 'Active')
              : t('Residential__Home_Automation__Disabled', 'Disabled')}
          </Text>

          {scheduleDetail && (
            <FacilitiesList
              scheduleDetail={scheduleDetail}
              onPress={onPressBar}
              disabled={isLoading}
            />
          )}
        </View>
        <Spacing height={45} />
      </ScrollView>

      {/* <TouchableOpacity
        className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-4 justify-between absolute left-0 bottom-0"
        onPress={() => navigation.navigate('ResidentialChangeTemperature')}>
        <Text size="B1" weight="medium" color="default-inverse">
          Change temperature
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </TouchableOpacity> */}
    </ScreenContainer>
  );
};

export default TemperatureSchedule;
