import React from 'react';
import {TextInputProps as RNTextInputProps, StyleSheet} from 'react-native';

import {
  useController,
  useFormContext,
  UseControllerProps,
  Controller,
} from 'react-hook-form';
import {HelperText, Spacing} from '~/components/atoms';
import {isEmpty} from 'lodash';
import {DatePickerTheme, TimePickerField} from './index';
import {Dayjs} from 'dayjs';

interface ControlledTimePickerProps
  extends RNTextInputProps,
    UseControllerProps {
  labelText?: string;
  defaultValue?: string;
  error?: boolean;
  placeholder?: string;
  onTimeChange?: Function;
  minTime?: Dayjs | null;
  maxTime?: Dayjs | null;
  themeColor?: DatePickerTheme;
  fixMinute?: string;
  fixMinutes?: string[];
  onPress?: () => void;
}
const ControlledTimePicker = (props: ControlledTimePickerProps) => {
  const formContext = useFormContext();
  const {formState} = formContext;

  const {
    name,
    rules,
    defaultValue,
    placeholder,
    className,
    onTimeChange,
    labelText,
    minTime,
    maxTime,
    themeColor,
    disabled,
    fixMinute,
    fixMinutes,
    onPress,
  } = props;

  const {field} = useController({name, rules, defaultValue});
  const hasError = Boolean(formState?.errors[name]);

  return (
    <>
      <Controller
        render={() => (
          <TimePickerField
            disabled={disabled}
            style={disabled ? styles.pickerDisabled : styles.picker}
            labelText={labelText}
            value={field.value}
            onChange={value => {
              field.onChange(value);
              onTimeChange && onTimeChange(value);
            }}
            placeholder={placeholder}
            className={className}
            minTime={minTime}
            maxTime={maxTime}
            themeColor={themeColor}
            fixMinute={fixMinute}
            fixMinutes={fixMinutes}
            error={!isEmpty(formState.errors[name]?.message)}
            onPress={onPress}
          />
        )}
        name={name}
      />
      {hasError && (
        <>
          <Spacing height={2} />
          <HelperText
            text={formState.errors[name]?.message as string}
            error={!isEmpty(formState.errors[name]?.message)}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    borderTopColor: '#292929',
    borderLeftColor: '#292929',
    borderRightColor: '#292929',
    borderBottomColor: '#292929',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
    color: '#292929',
  },
  pickerDisabled: {
    borderTopColor: '#EFEFEF',
    borderLeftColor: '#EFEFEF',
    borderRightColor: '#EFEFEF',
    borderBottomColor: '#EFEFEF',
    shadowColor: '#EFEFEF',
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
    color: '#989898',
  },
});

export default ControlledTimePicker;
