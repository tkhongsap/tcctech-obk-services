import {Linking, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import t from '~/utils/text';
import {Spacing, Text} from '../atoms';
import {Button, buttonColorVariant} from '../molecules';
import WheelPicker from 'react-native-wheely';
import {useFocusEffect} from '@react-navigation/native';
import {createHoursArray} from '../molecules/TimePickerField/constants';
import firebaseConfigState from '~/states/firebase';

//TODO: I not sure, should create file modal genaric to folder?
export const ExitConfirmation = ({onContinue, onCancel}: any) => {
  return (
    <>
      <Text size="B1" weight="medium">
        {t('General__Leave_now?', 'Leave now?')}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__Warning_leave_page__Body',
          'All previous information entered will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('General__Leave_this_page', 'Leave this page')}
          onPress={onContinue}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

interface ConfirmationProps {
  title: string;
  description: string;
  textConfirmButton?: string;
  textCancelButton?: string;
  onContinue: any;
  onCancel: any;
  ConfirmButtonOutlined?: boolean;
  CancelButtonOutlined?: boolean;
  ConfirmButtonColor?: keyof typeof buttonColorVariant;
  CancelButtonColor?: keyof typeof buttonColorVariant;
}

export const Confirmation = (props: ConfirmationProps) => {
  const {
    title,
    description,
    textConfirmButton = t('General__Confirm', 'Confirm'),
    textCancelButton = t('General__Cancel', 'Cancel'),
    onContinue,
    onCancel,
    ConfirmButtonOutlined,
    CancelButtonOutlined = true,
    ConfirmButtonColor = 'navy',
    CancelButtonColor = 'light-gray',
  } = props;
  return (
    <>
      <Text size="B1" weight="medium">
        {title}
      </Text>
      <Text color="subtitle-muted" size="B2">
        {description}
      </Text>
      <Spacing height={16} />
      <View>
        {textConfirmButton && (
          <>
            <Button
              title={textConfirmButton}
              color={ConfirmButtonColor}
              outlined={ConfirmButtonOutlined}
              onPress={onContinue}
            />
            <Spacing height={10} />
          </>
        )}
        <Button
          title={textCancelButton}
          color={CancelButtonColor}
          outlined={CancelButtonOutlined}
          onPress={onCancel}
        />
        <Spacing height={16} />
      </View>
    </>
  );
};

interface SelectHoursProps {
  onPressCancel: any;
  onPressDone: any;
  value: string;
  maxHours?: string;
}

export const SelectHours = (props: SelectHoursProps) => {
  const {onPressCancel, onPressDone, value, maxHours = '23'} = props;
  const [hourList, setHourList] = useState<string[]>([...createHoursArray(25)]);
  const [forceRerender, setForceRerender] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const textHours = t('General__Hours', ' hours');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let _cloneHour = hourList;
        let _maxHour = Number(maxHours);
        await setForceRerender(true);
        if (_maxHour !== 0) {
          const clone = hourList.slice(1, _maxHour + 1);
          await setHourList(clone);
          _cloneHour = clone;
        } else {
          await setHourList(['00']);
          _cloneHour = ['00'];
        }
        if (value) {
          // find from list that might have custom min/max lenght of hour and minute
          const _hour = _cloneHour.findIndex(
            _value => _value.replace(textHours, '') === value,
          );

          if (_hour >= 0) {
            await setSelectedHour(_hour);
          }
        }
        await setForceRerender(false);
      })();
    }, []),
  );

  const handleOnPressDone = () => {
    const submittedHourStr = `${hourList[selectedHour]}`;
    onPressDone(submittedHourStr);
  };
  const style = StyleSheet.create({
    container2: {width: '100%', alignItems: 'center'},
    indicator: {
      backgroundColor: '#EFEFEF',
      borderRadius: 0,
    },
    itemText: {
      fontSize: 16,
      paddingHorizontal: 40,
      fontWeight: '400',
      color: '#292929',
      fontFamily: 'OneBangkok-Regular',
    },
    item: {},
  });

  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="time-picker-cancel-id"
          color="primary"
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {hourList[selectedHour]}
        </Text>
        <Text
          testID="time-picker-done-id"
          color={'primary'}
          weight="medium"
          className="text-right"
          onPress={handleOnPressDone}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      {
        <View className="flex-row justify-center">
          {!forceRerender && (
            <WheelPicker
              selectedIndex={selectedHour >= 0 ? selectedHour : 0}
              options={hourList}
              onChange={index => {
                setSelectedHour(index);
              }}
              selectedIndicatorStyle={style.indicator}
              containerStyle={style.container2}
              opacityFunction={index => (index > 2 ? 0 : 1)}
              itemStyle={style.item}
              itemTextStyle={style.itemText}
              itemHeight={32}
            />
          )}
        </View>
      }
    </>
  );
};

export const ModalContactOurSupport = ({onPressCancel}: any) => {
  return (
    <>
      <Text size="B1" weight="medium">
        {t('General__Contact_our_support', 'Contact our support')}
      </Text>
      <Text color="subtitle-muted" size="B2">
        {t(
          'Drawer__Contact_support__Description',
          'If you need assistance, please feel free to contact our support team',
        )}
      </Text>
      <Spacing height={16} />
      <Button
        title={`${firebaseConfigState.contract.email_contract_center.value}`}
        color={'stroke'}
        outlined={true}
        onPress={() =>
          Linking.openURL(
            `mailto:${firebaseConfigState.contract.email_contract_center.value}`,
          )
        }
        iconColor="#FFFFFE"
        leftIcon="mailIcon"
      />
      <Spacing height={12} />
      <Button
        title={`${firebaseConfigState.contract.call_contract_center.value}`}
        color={'stroke'}
        outlined={true}
        onPress={() =>
          Linking.openURL(
            `tel://${firebaseConfigState.contract.call_contract_center.value}`,
          )
        }
        leftIcon="phoneIcon"
      />
      <Spacing height={24} />

      <Button
        title={t('General__Cancel', 'Cancel')}
        color={'fire-engine-red'}
        outlined={true}
        onPress={onPressCancel}
      />
    </>
  );
};
