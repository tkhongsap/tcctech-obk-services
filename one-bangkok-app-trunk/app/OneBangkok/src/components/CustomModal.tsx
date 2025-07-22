import {ImmutableObject, useHookstate} from '@hookstate/core';
import React, {useEffect} from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  InteractionManager,
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
import TextButton from './TextButton';
import t from '../utils/text';
import OBSpacing from './OBSpacing';

type Props = {
  open: boolean;
  text: string;
  withCancelButton?: boolean;
  cancelText?: string;
  onPressCancel?: () => void;
  confirmText?: string;
  onPressConfirm?: () => void;
  confirmButtonBackgroundColor?: string;
  cancelButtonTextColor?: string;
  cancalButtonBorderColor?: string;
};

const CustomModal = ({
  open,
  text,
  withCancelButton,
  cancelText,
  onPressCancel,
  confirmText,
  onPressConfirm,
  confirmButtonBackgroundColor,
  cancelButtonTextColor,
  cancalButtonBorderColor,
}: Props) => {
  confirmButtonBackgroundColor = confirmButtonBackgroundColor ?? Colors.blue;
  confirmText = confirmText ?? t('General__confirm', 'Confirm');
  cancelText = cancelText ?? t('General__Cancel', 'Cancel');
  cancelButtonTextColor = cancelButtonTextColor ?? Colors.blue;
  cancalButtonBorderColor = cancalButtonBorderColor ?? Colors.blue;

  const insets = useSafeAreaInsets();

  const windowWidth = Dimensions.get('window').width;

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
            <Text style={s.textB1Medium}>{text}</Text>
            <View style={{height: 16}} />
            <TextButton
              text={confirmText}
              width={windowWidth - 64}
              height={43}
              backgroundColor={confirmButtonBackgroundColor}
              onPress={onPressConfirm}
            />
            {withCancelButton ? (
              <View>
                <OBSpacing height={16} />
                <TextButton
                  text={cancelText}
                  width={windowWidth - 64}
                  height={43}
                  borderWidth={1}
                  borderColor={cancalButtonBorderColor}
                  textColor={cancelButtonTextColor}
                  onPress={onPressCancel}
                />
              </View>
            ) : null}
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
    paddingHorizontal: 32,
  },
});

export default CustomModal;
