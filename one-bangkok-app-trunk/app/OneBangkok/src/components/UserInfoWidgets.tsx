import {View, Image, Text, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import T from '~/utils/text';
import CustomButton from './CustomButton';
import CustomInputText from './CustomInputText';

const buildGenderItem = (
  gender: string,
  selectedGender: string,
  onPressGenderItem: (value: string) => void,
) => {
  const isSelected = gender == selectedGender;
  return (
    <CustomButton
      onPress={() => {
        onPressGenderItem(gender);
      }}>
      <View
        className={`h-[43px] px-6 rounded-[2px] border border-sky-500 justify-start items-center inline-flex flex-row ${
          isSelected ? 'bg-sky-500' : ''
        }`}>
        <View
          className={`w-4 h-4 rounded-full border ${
            isSelected ? 'border-neutral-50' : 'border-sky-500'
          }`}
          style={[
            styles.checkBox,
            isSelected ? {borderColor: Colors.white100} : null,
          ]}>
          {isSelected ? (
            <Image
              className="w-[11.64px] h-[11.64px] relative"
              source={require('../../assets/images/icon_tick.png')}
            />
          ) : null}
        </View>
        <View style={{width: 8}} />
        <Text
          className={`text-neutral-50 text-base leading-tight ${
            isSelected ? 'font-bold' : 'font-normal'
          }`}>
          {T('General__' + gender.toString(), 'General__' + gender.toString())}
        </Text>
      </View>
    </CustomButton>
  );
};

export const buildGender = (
  selectedGender: string,
  onPressGenderItem: (value: string) => void,
) => {
  return (
    <View>
      {buildGenderItem('female', selectedGender, onPressGenderItem)}
      <View style={{height: 12}} />
      {buildGenderItem('male', selectedGender, onPressGenderItem)}
      <View style={{height: 12}} />
      {buildGenderItem('nonbinary', selectedGender, onPressGenderItem)}
    </View>
  );
};

export const buildDateOfBirth = (openDatePicker: () => void, value: string) => {
  return (
    <CustomButton onPress={openDatePicker}>
      <View pointerEvents={'none'}>
        <CustomInputText
          className="text-stone-300 text-xl font-medium leading-tight tracking-tight h-[56px] text-center"
          placeholder={T(
            'SignUpEnterInfoScreen__date_of_birth_input_text_placeholder',
            'Date of birth',
          )}
          maxLength={6}
          keyboardType="number-pad"
          pointerEvents="none"
          value={value}
        />
      </View>
    </CustomButton>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    borderColor: Colors.blue,
    borderRadius: 999,
    borderWidth: 1,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
