import {
  ScrollView,
  View,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScreenContainer} from '../components/ScreenContainer';
import {Icon, Text} from '~/components/atoms';
import t from '~/utils/text';
import {StickyButton} from '~/features/residential/components/StickyButton';
import {Header} from '../components/Header';
import DaysTabSelection from '../components/DaysTabSelection';
import ScenesHorizontal from '../components/ScenesHorizontal';
import ToggleSwitch from '../components/ToggleSwitch';
import StatusSlider from '../components/StatusSlider';
import {modalActions} from '../components/ResidentialModal';
import ModifyScheduleModal from '../components/ModifyScheduleModal';

import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import TimePickerModal from '../components/TimePickerModal';
import WheelTimePickerModal from '../components/WheelTimePicker';
type Data = {id: string; title: string; description: string; screen: string};
type TimingTitle = undefined | 'Timing' | 'Sunrise' | 'Sunset';
type Times = {
  hour: number;
  minute: number;
};
type ScheduleTiming = {
  title: TimingTitle;
  times: Times;
  selected: boolean;
};

const initialData: Data[] = [
  {
    id: 'Action',
    title: 'Action',
    description: 'Description',
    screen: 'ResidentialSchedulesScreen_Action',
  },
  {
    id: 'Temperature',
    title: 'Temperature',
    description: 'Description',
    screen: '-',
  },
];

const initialScenesData = [
  {id: '1', name: 'Scene A', selected: true, icon: 'scHomeIcon'},
  {id: '2', name: 'Scene B', selected: false, icon: 'scHomeIcon'},
  {id: '3', name: 'Scene C', selected: false, icon: 'scHomeIcon'},
];
const initialScheduleTiming: ScheduleTiming[] = [
  {
    title: 'Timing',
    times: {
      hour: 10,
      minute: 0,
    },
    selected: false,
  },
  {
    title: 'Sunrise',
    times: {
      hour: 5,
      minute: 40,
    },
    selected: false,
  },
  {
    title: 'Sunset',
    times: {
      hour: 18,
      minute: 55,
    },
    selected: false,
  },
];

let model = {
  id: '',
  name: '',
  away_temp: 0,
  hg_temp: 0,
  timetable: [
    {
      m_offset: 0,
      zone_id: 0,
    },
  ],
  zones: [
    {
      name: '',
      type: 0,
      id: 0,
      rooms: [
        {
          id: '',
          therm_setpoint_fp: '',
          cooling_setpoint_mode: '',
          cooling_setpoint_temperature: 0,
        },
      ],
      modules: [
        {
          id: '',
          bridge: '',
          on: true,
          target_position: 0,
          brightness: 0,
        },
      ],
    },
  ],
  schedule_type: '',
  cooling_away_temp: 0,
  selected: true,
  timetable_sunrise: [
    {
      zone_id: 0,
      day: 0,
      twilight_offset: 0,
    },
  ],
  timetable_sunset: [
    {
      zone_id: 0,
      day: 0,
      twilight_offset: 0,
    },
  ],
  power_threshold: 0,
  contract_power_nit: '',
  tariff: '',
  tariff_option: '',
  operation: '',
};

const onPressSCheduleDeleteModel = () => {
  modalActions.setContent(
    <ConfirmDeleteModal
      title="Schedule deletion"
      description="Are you sure you want to Delete this schedule?"
    />,
  );
  modalActions.show();
};

const ResidentialSchedulesScreen_DetailSchedule = () => {
  const navigation = useNavigation();
  const [scheduleTimings, setScheduleTimings] = useState<ScheduleTiming[]>(
    initialScheduleTiming,
  );
  const [displayTime, setDisplayTime] = useState<Times>({
    hour: 8,
    minute: 0,
  });

  const paddingWith2Zero = (value: string) => value.padStart(2, '0');
  const onPressModifyScheduleModal = () => {
    modalActions.setContent(<ModifyScheduleModal />);
    modalActions.show();
  };

  const onPressChangeTime = () => {
    const selectedTime = scheduleTimings.find(e => e.selected);
    if (!selectedTime) return;
    modalActions.setContent(
      <WheelTimePickerModal
        time={selectedTime.times}
        setTime={time => {
          setDisplayTime(time);
          setScheduleTimings(prev =>
            prev.map(e => ({...e, times: e.selected ? time : e.times})),
          );
        }}
      />,
    );
    modalActions.show();
  };

  const renderDaytimeButton = ({title, times, selected}: ScheduleTiming) => {
    // const onPress = () => {
    //   setDisplayTime(time);
    //   if (text == 'Sunrise') {
    //     model.timetable_sunrise = [
    //       {
    //         zone_id: 0,
    //         day: 0,
    //         twilight_offset: 0,
    //       },
    //     ];
    //   } else if (text == 'Sunset') {
    //     model.timetable_sunset = [
    //       {
    //         zone_id: 0,
    //         day: 0,
    //         twilight_offset: 0,
    //       },
    //     ];
    //   }
    //   // Alert.alert("", text);
    // };

    const onPress = () => {
      setScheduleTimings(prev =>
        prev.map(item => ({
          ...item,
          selected: title === item.title ? !item.selected : false,
        })),
      );
      setDisplayTime(times);
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{flex: 0.3}}
        activeOpacity={0.8}>
        <Text
          style={[
            {
              textAlign: 'center',
              paddingVertical: 4,
            },
            selected ? styles.buttonTimeOnActive : styles.buttonTimeInActive,
          ]}
          className="flex font-obBold color-black px-4 border border-line-light">
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Sunday"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      {/* className="w-full bg-white p-4 py-10 " */}
      <ScrollView
        style={{backgroundColor: 'white', padding: 16, paddingTop: 40}}>
        {/* TOPIC: My actions schedule */}
        <View className="Flex flex-row mb-3 justify-between items-center">
          <Text className="text-2xl color-black font-obMedium">
          {t('Residential__Home_Automation__My_Actions_Schedule', 'My Actions Schedule')}
          </Text>
          {/* <TouchableOpacity onPress={() => onPressSCheduleDeleteModel()}>
            <Icon
              type="scheduleDelete"
              width={24}
              height={24}
              color="#333333"
            />
          </TouchableOpacity> */}
        </View>
        {/* Action Name */}
        <TextInput
          className="font-obRegular flex flex-col px-4 border border-line-light"
          placeholder={'Action name'}
          value={model.name}
        />

        {/* Daytime  */}
        <View
          style={{
            flex: 3,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          className="mt-4">
          {scheduleTimings.map(
            item => item.title !== undefined && renderDaytimeButton({...item}),
          )}
        </View>

        {/* Input Time */}
        <TouchableOpacity onPress={onPressChangeTime}>
          <Text
            style={{paddingVertical: 38, display: 'flex', textAlign: 'center'}}
            className="mt-4 font-obRegular flex flex-col px-4 border border-line-light">
            {paddingWith2Zero(displayTime.hour.toString())}:
            {paddingWith2Zero(displayTime.minute.toString()).toString()}
          </Text>
        </TouchableOpacity>

        {/* TOPIC: Select one or several days */}
        <View
          style={{alignContent: 'flex-end'}}
          className="flex flex-row justify-between mt-12">
          <Text
            style={{
              display: 'flex',
              alignSelf: 'flex-end',
            }}
            className="text-2xl color-black font-obMedium">
            {t('Residential__Home_Automation__Select_One_Or_Several_Days', 'Select one or\nseveral days')}
          </Text>
          <TouchableOpacity
            className="mb-1"
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              display: 'flex',
            }}
            onPress={() => {}}>
            <Text style={{color: '#014541'}} className="font-obMedium">
            {t('Residential__Home_Automation__Select_All', 'Select All')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Days Tab Selection */}
        <View className="mt-6">
          <DaysTabSelection
            multiSelection={true}
            onDayChanged={(days, pressedDay) => {
              // Alert.alert("", "dayId, " + dayId)
            }}
          />
        </View>

        {/* TOPIC: Scenes */}
        <Text className="text-2xl color-black font-obMedium mt-12 mb-2">
        {t('Residential__Home_Automation__Scenes', 'Scenes')}
        </Text>

        {/* Scenes Items */}
        <ScenesHorizontal data={initialScenesData} />

        {/* Empty Zone */}
        <View style={{marginBottom: 40}} />
        <Text size="N1" weight="medium" color="dark-gray" className="mb-[16px]">
          Room 1
        </Text>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mt-[16px] mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 1
              </Text>
            </View>
            <ToggleSwitch initialValue={true} />
          </View>
          <View className="flex-row items-center justify-between mt-[16px]">
            <Icon
              type={'scMoonIcon'}
              width={12}
              height={12}
              color={'#292929'}
            />
            <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
          </View>
          <StatusSlider step={0} />
        </View>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 2
              </Text>
            </View>
            <ToggleSwitch initialValue={false} />
          </View>
          {/* hide when off */}
          {/* <View className="flex-row items-center justify-between mt-[16px]">
              <Icon
                type={'scMoonIcon'}
                width={12}
                height={12}
                color={'#292929'}
              />
              <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
            </View>
            <StatusSlider step={0} /> */}
        </View>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 3
              </Text>
            </View>
            <ToggleSwitch initialValue={false} />
          </View>
          {/* hide when off */}
          {/* <View className="flex-row items-center justify-between mt-[16px]">
              <Icon
                type={'scMoonIcon'}
                width={12}
                height={12}
                color={'#292929'}
              />
              <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
            </View>
            <StatusSlider step={0} /> */}
        </View>
        <View style={{marginBottom: 40}} />
        <Text size="N1" weight="medium" color="dark-gray" className="mb-[16px]">
          Room 2
        </Text>
        <View className="w-full flex flex-col py-[12px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mt-[16px] mr-auto">
              <Icon
                type="scShutterDeviceIcon"
                width={18}
                height={18}
                color="#292929"
              />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                1st Shutter
              </Text>
            </View>
          </View>
          <View className="flex-row items-center mt-[16px]">
            <View className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px]">
              <Icon
                type={'scArrowDownIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </View>
            <View className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF] mr-[44px]">
              <Icon
                type={'scStopIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </View>
            <View className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-[#EFEFEF]">
              <Icon
                type={'scArrowUpIcon'}
                width={16}
                height={16}
                color={'#014541'}
              />
            </View>
          </View>
        </View>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 1
              </Text>
            </View>
            <ToggleSwitch initialValue={false} />
          </View>
          {/* hide when off */}
          {/* <View className="flex-row items-center justify-between mt-[16px]">
              <Icon
                type={'scMoonIcon'}
                width={12}
                height={12}
                color={'#292929'}
              />
              <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
            </View>
            <StatusSlider step={0} /> */}
        </View>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 2
              </Text>
            </View>
            <ToggleSwitch initialValue={false} />
          </View>
          {/* hide when off */}
          {/* <View className="flex-row items-center justify-between mt-[16px]">
              <Icon
                type={'scMoonIcon'}
                width={12}
                height={12}
                color={'#292929'}
              />
              <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
            </View>
            <StatusSlider step={0} /> */}
        </View>
        <View className="w-full flex flex-col py-[24px] border-b-[1px] border-[#DCDCDC]">
          <View className=" flex flex-row items-center">
            <View className="flex flex-row items-center  mr-auto">
              <Icon type="lightBlack" width={14} height={18} color="#292929" />
              <Text
                size="B2"
                weight="medium"
                color="dark-gray"
                className="ml-[8px]">
                Dimmer 3
              </Text>
            </View>
            <ToggleSwitch initialValue={false} />
          </View>
          {/* hide when off */}
          {/* <View className="flex-row items-center justify-between mt-[16px]">
              <Icon
                type={'scMoonIcon'}
                width={12}
                height={12}
                color={'#292929'}
              />
              <Icon type={'scSunIcon'} width={16} height={16} color={'#292929'} />
            </View>
            <StatusSlider step={0} /> */}
        </View>
        <View style={{marginBottom: 120}} />
      </ScrollView>
      
      <StickyButton
        title={t('Residential__Home_Automation__Validate', 'Validate')}
        rightIcon="next"
        iconHeight={20}
        color="dark-teal"
      />
      {/* <TouchableOpacity
        className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-[16px] justify-between absolute left-0 bottom-0"
        onPress={() => onPressModifyScheduleModal()}>
        <Text size="B1" weight="medium" color="default-inverse">
          Validate
        </Text>
        <Icon type={'next'} width={20} height={20} color={'#fff'} />
      </TouchableOpacity> */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },

  buttonTimeInActive: {
    backgroundColor: 'white',
    color: 'black',
  },
  buttonTimeOnActive: {
    backgroundColor: '#014541',
    color: 'white',
  },
});

export default ResidentialSchedulesScreen_DetailSchedule;
