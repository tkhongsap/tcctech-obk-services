import {Alert, StyleSheet, View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text} from '~/components/atoms';
import InputSearch from '../components/InputSearch';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconActionButton from '../components/IconActionButton';

import IconComfort from '../../../assets/icons/icon_change_temperature_comfort.svg';
import IconECO from '../../../assets/icons/icon_change_temperature_eco.svg';
import IconNight from '../../../assets/icons/icon_change_temperature_night.svg';
import IconAdd from '../../../assets/icons/icon_change_temperature_add.svg';
import {useNavigation} from '@react-navigation/native';
type Temperature = {
  title: string;
  value: string;
};
const initialData: Temperature = {
  title: 'Away',
  value: '30.0',
};
const ResidentialChangeTemperature = () => {
  const navigation = useNavigation();
  const onPressCallback = (index: number) => {
    Alert.alert(JSON.stringify({index}));
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
      <View className="w-full bg-[#ffffff] h-[100vh]">
        {/* Current section */}
        <View className="pt-4 pl-2 pr-2">
          {/* TOPIC: Special modes */}
          <Text className="font-obMedium">Special modes</Text>

          {/* Current temperature */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ResidentialChangeTemperature_Edit')
            }
            style={styles.buttonCurrentTemperature}>
            <Text className="font-obMedium">{initialData.title}</Text>
            <View style={{display: 'flex', flexDirection: 'row', gap: 6}}>
              <Text className="font-obMedium">{initialData.value}</Text>
              <Icon
                type="arrowRightIcon"
                height={16}
                width={16}
                color="#292929"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Grey line */}
        <View style={styles.line} />

        {/* Custom section */}
        <View className="pt-4 pl-2 pr-2">
          {/* TOPIC: Custom temperatures */}
          <Text className="mt-6 font-obMedium mb-2">Custom temperatures</Text>
          {/* Icon Action Button */}
          <IconActionButton
            icon={<IconComfort />}
            title={'Comfort'}
            index={0}
            onPress={() =>
              navigation.navigate('ResidentialChangeTemperature_EditCustom')
            }
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
export default ResidentialChangeTemperature;
