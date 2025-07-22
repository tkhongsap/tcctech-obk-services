import {Alert, StyleSheet, View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import IconActionButton from '../components/IconActionButton';
import IconComfort from '../../../assets/icons/icon_change_temperature_comfort.svg';
import IconECO from '../../../assets/icons/icon_change_temperature_eco.svg';
import IconNight from '../../../assets/icons/icon_change_temperature_night.svg';
import IconAdd from '../../../assets/icons/icon_change_temperature_add.svg';
import {useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import StatusSliderTrackMark from '../components/StatusSliderTrackMark';
import ToggleSwitch from '../components/ToggleSwitch';

type Temperature = {
  title: string;
  airTemperature: number;
  airTemperatureMin: number;
  airTemperatureMax: number;
  on: boolean;
};
const initialData: Temperature = {
  title: 'Away',
  airTemperature: 24.5,
  airTemperatureMin: 16,
  airTemperatureMax: 39.5,
  on: false,
};
const sliderBarStep = 0.5;
// const displaySliderOffTrackAtValue =
//   initialData.airTemperatureMin - sliderBarStep;
// initialData.airTemperatureMin -= 1;

const ResidentialChangeTemperature_Edit = () => {
  const navigation = useNavigation();
  const onPressCallback = (index: number) => {
    Alert.alert(JSON.stringify({index}));
  };
  const [selectedTemperature, setSelectedTemperature] = useState(
    initialData.airTemperature,
  );
  const [selectedToggleSwitch, setSelectedToggleSwitch] = useState(
    initialData.on,
  );
  const [disabledSliderBar, setDisabledSliderBar] = useState(!initialData.on);

  const onToggle = (on: boolean) => {
    setSelectedToggleSwitch(on);
    setDisabledSliderBar(!on);
  };
  return (
    <ScreenContainer bgColor={'#1A1919'} barStyle="light-content">
      <Header
        leftAction="goBack"
        title="Change temperature"
        bgColor="bg-jet-black"
        titleColor="white"
        leftColor="white"
      />
      <View style={{flex: 1, width: '100%'}} className="bg-[#ffffff]">
        <View style={{flex: 1}}>
          <ScrollView>
            {/* Current section */}
            <View className="pt-4 pl-2 pr-2">
              {/* TOPIC: Special modes */}
              <Text className="font-obMedium">Special modes</Text>

              {/* Current temperature */}
              <View style={styles.buttonCurrentTemperature}>
                <Text className="font-obMedium">{initialData.title}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 12,
                    alignItems: 'center',
                  }}>
                  <Text className="font-obMedium mr-[12px]">
                    {/* {selectedTemperature <= displaySliderOffTrackAtValue
                      ? 'Off'
                      : `${selectedTemperature} °C`} */}
                    {!disabledSliderBar && `${selectedTemperature} °C`}
                  </Text>
                  <ToggleSwitch
                    initialValue={selectedToggleSwitch}
                    onToggle={onToggle}
                  />
                </View>
              </View>
            </View>

            {/* Status slider */}
            <View className="ml-2 mr-2 pt-8 pb-8 pl-2 pr-2 border-[1px] border-[#DCDCDC] mb-[12px]">
              <StatusSliderTrackMark
                step={sliderBarStep}
                initialValue={selectedToggleSwitch ? selectedTemperature : 0}
                onValueChange={setSelectedTemperature}
                minimumValue={initialData.airTemperatureMin}
                maximumValue={initialData.airTemperatureMax}
                trackMarkStep={3}
                disabled={disabledSliderBar}
              />
            </View>

            {/* Grey line */}
            <View style={[styles.line, {marginTop: 18}]} />

            {/* Custom section */}
            <View className="pt-4 pl-2 pr-2">
              {/* TOPIC: Custom temperatures */}
              <Text className="mt-6 font-obMedium mb-2">
                Custom temperatures
              </Text>
              {/* Icon Action Button */}
              <IconActionButton
                icon={<IconComfort />}
                title={'Comfort'}
                index={0}
                onPress={onPressCallback}
              />
              <IconActionButton
                icon={<IconECO />}
                title={'Eco'}
                index={1}
                onPress={onPressCallback}
              />
              <IconActionButton
                icon={<IconNight />}
                title={'Night'}
                index={2}
                onPress={onPressCallback}
              />
              <IconActionButton
                displayActionIcon={false}
                icon={<IconAdd />}
                title={'Add a new set of temperatures'}
                index={3}
                onPress={() =>
                  navigation.navigate('ResidentialChangeTemperature_AddNewSet')
                }
              />
            </View>
          </ScrollView>
        </View>

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
    alignItems: 'center',
  },
});
export default ResidentialChangeTemperature_Edit;
