import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import StatusSlider from '../components/StatusSlider';
import TextInputWithCancel from '../components/TextInputWithCancel';
import ToggleSwitch from '../components/ToggleSwitch';
import FanSpeedBar from '../components/FanSpeedBar';

type Props = {
  room: string;
  airStatusOn: boolean;
  airTemperature: number;
  airTemperatureMin: number;
  airTemperatureMax: number;
  fanStatus: '0' | '1' | '2' | '3';
};
const mockData: Props = {
  room: 'Living Room',
  airStatusOn: true,
  airTemperature: 24.5,
  airTemperatureMin: 16,
  airTemperatureMax: 39.5,
  fanStatus: '0',
};

const ResidentialChangeTemperature_AddNewSet = () => {
  const speeds = ['0', '1', '2', '3'];
  const [selectedSpeed, setSelectedSpeed] = useState<string>(
    mockData.fanStatus,
  );
  const [selectedTemperature, setSelectedTemperature] = useState(
    mockData.airTemperature,
  );
  const [airStatusOn, setAirStatusOn] = useState(mockData.airStatusOn);

  const handleSpeedPress = (speed: string) => {
    setSelectedSpeed(speed);
  };

  return (
    <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
      <Header
        leftAction="goBack"
        title="Add a new set of temperatures"
        titleColor="dark-gray"
        bgColor="bg-white"
      />

      <View
        style={{backgroundColor: 'white', flex: 1}}
        className="w-full h-full">
        <ScrollView className="mt-8 ml-2 mr-2">
          {/* TOPIC: Special modes */}
          <Text className="font-obRegular">Name</Text>

          {/* Name of the set of temperatures */}
          <TextInputWithCancel
            onPress={() => {}}
            placeholder="Temperatures set name"
          />

          {/* Message section */}
          <View className="m-4 mt-6 mb-0">
            <Text className="font-obBold">{'Room temperatures'}</Text>
            <Text style={{marginTop: 4, lineHeight: 23, color: 'gray'}}>
              {'Modification are applied to all time slots' +
                `\n` +
                'where these temperatures are being used.'}
            </Text>
          </View>

          {/* Grey line */}
          <View style={[styles.line, {marginTop: 18}]} />

          {/* Living room section */}
          <View className="pt-4">
            <View
              className="flex flex-row justify-between items-center"
              style={{gap: 8}}>
              <View className="flex flex-row items-center" style={{gap: 8}}>
                <Icon
                  type={'obLivingRoom'}
                  width={24}
                  height={24}
                  color={'#292929'}
                />
                <Text weight="medium" size="B1">
                  {mockData.room}
                </Text>
              </View>

              {/* Toggle Switch  */}
              <ToggleSwitch
                initialValue={airStatusOn}
                onToggle={setAirStatusOn}
              />
            </View>

            {/* Temperature bar */}
            <View style={{gap: 2}}>
              <View className="w-full flex-row items-center justify-between mt-2">
                <Text size="C1" weight="regular">
                  {mockData.airTemperatureMin} °C
                </Text>
                <Text size="C1" weight="bold">
                  {selectedTemperature} °C
                </Text>
                <Text size="C1" weight="regular">
                  {mockData.airTemperatureMax} °C
                </Text>
              </View>
              <StatusSlider
                step={0.5}
                disabled={!airStatusOn}
                minimumValue={mockData.airTemperatureMin}
                maximumValue={mockData.airTemperatureMax}
                initialValue={selectedTemperature}
                onValueChange={setSelectedTemperature}
              />
            </View>

            {/* Fan Speed bar */}
            <View
              className="flex flex-row justify-between items-center py-4"
              style={{gap: 8}}>
              <View className="flex flex-row items-center" style={{gap: 8}}>
                <Icon
                  type={'scFanIcon'}
                  width={18}
                  height={18}
                  color={'#292929'}
                />
                <Text weight="medium" size="B1">
                  Fan speed
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center justify-between ">
              <FanSpeedBar
                disabled={!airStatusOn}
                speeds={speeds}
                selectedSpeed={selectedSpeed}
                onSpeedPress={handleSpeedPress}
              />
            </View>
          </View>

          {/* Grey line */}
          <View style={[styles.line, {marginTop: 18}]} />
        </ScrollView>

        {/* Validate section button */}
        <TouchableOpacity
          style={{justifyContent: 'space-between'}}
          className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-[16px] left-0 bottom-0">
          <Text size="B1" weight="medium" color="default-inverse">
            Validate
          </Text>
          <Icon type={'next'} width={20} height={20} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
  line: {
    width: '100%',
    height: 1.2,
    opacity: 0.2,
    backgroundColor: 'grey',
  },
  buttonCurrentTemperature: {
    // backgroundColor: 'red',
    display: 'flex',
    marginTop: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 20,
  },
});
export default ResidentialChangeTemperature_AddNewSet;
