import {ImmutableObject, useHookstate} from '@hookstate/core';
import React from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackComponent,
  View,
} from 'react-native';
import {Colors} from '../constants/Colors';
import s from '../constants/Styles';
import DatePicker from 'react-native-date-picker';
import CustomInputText from './CustomInputText';
import {BlurView} from '@react-native-community/blur';
import CustomButton from './CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTime from '../utils/datetime';
import T from '../utils/text';

type Props = {
  open: boolean;
  date: Date;
  onPressCancel: () => void;
  onPressDone: (value: Date) => void;
};

const DatePickerModal = ({open, date, onPressCancel, onPressDone}: Props) => {
  const state = useHookstate({
    date: date,
  });

  const _onPressDone = () => {
    onPressDone(state.date.value);
    onPressCancel();
  };

  const onDateChange = (date: Date) => {
    state.set(p => {
      p.date = date;
      return p;
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={styles.container}>
      {open ? (
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          blurRadius={1}
          downsampleFactor={1}
        />
      ) : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={onPressCancel}>
        <View style={styles.modalView}>
          <TouchableWithoutFeedback onPress={onPressCancel}>
            <View style={{flex: 1}} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalTabContainer}>
              <CustomButton style={{padding: 12}} onPress={onPressCancel}>
                <Text style={[s.textB1Medium, {color: Colors.blue}]}>
                  {T('General__Cancel', 'Cancel')}
                </Text>
              </CustomButton>
              <View
                style={{
                  flex: 1,
                }}
              />
              <CustomButton style={{padding: 12}} onPress={_onPressDone}>
                <Text style={[s.textB1Medium, {color: Colors.blue}]}>
                  {T('General__Done', 'Done')}
                </Text>
              </CustomButton>
              <View pointerEvents="none" style={styles.title}>
                <Text style={[s.textB1Medium, {alignSelf: 'center'}]}>
                  {DateTime.formatDate(state.date.value.toString())}
                </Text>
              </View>
            </View>
            <DatePicker
              style={styles.datePicker}
              open={open}
              date={state.date.value}
              mode="date"
              onConfirm={date => {}}
              onCancel={() => {}}
              androidVariant={'iosClone'}
              textColor={'#ffffff'}
              dividerHeight={0}
              onDateChange={onDateChange}
            />
            <View style={{height: 24 + insets.bottom}} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    width: '100%',
    height: '100%',
  },
  modalView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.black100,
    width: '100%',
    paddingTop: 24,
  },
  modalTabContainer: {flexDirection: 'row', paddingHorizontal: 15},
  title: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  datePicker: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 50,
    shadowColor: Colors.white100,
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: {height: 0, width: 0},
  },
});

export default DatePickerModal;
