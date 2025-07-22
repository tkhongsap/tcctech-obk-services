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
import {DatePickerField, DatepickerOptions} from './DatePickerField';

export interface DropdownItem {
  label: string;
  value: string;
}

interface ControlledInputProps
  extends RNTextInputProps,
    UseControllerProps,
    DatepickerOptions {
  labelText?: string;
  name: string;
  defaultValue?: string;
  error?: boolean;
  placeholder?: string;
  onDateChange?: Function;
  maxDate?: Date;
  onPress?: () => void;
}
const ControlledDatePicker = (props: ControlledInputProps) => {
  const formContext = useFormContext();
  const {formState} = formContext;

  const {
    name,
    rules,
    defaultValue,
    placeholder,
    className,
    onDateChange,
    labelText,
    maxDate,
    minDate,
    disabled,
    onPress,
  } = props;

  const {field} = useController({name, rules, defaultValue});
  const hasError = Boolean(formState?.errors[name]);

  return (
    <>
      <Controller
        render={() => (
          <DatePickerField
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            icon={'calendar'}
            IconColor={disabled ? '#989898' : '#000000'}
            onPress={onPress}
            style={
              disabled
                ? styles.pickerDisable
                : hasError
                ? styles.pickerError
                : styles.picker
            }
            labelText={labelText}
            value={field.value}
            onChange={value => {
              field.onChange(value);
              onDateChange && onDateChange(value);
            }}
            placeholder={placeholder}
            className={className}
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
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
  pickerError: {
    borderTopColor: '#ED2015',
    borderLeftColor: '#ED2015',
    borderRightColor: '#ED2015',
    borderBottomColor: '#ED2015',
    backgroundColor: '#FFF2F1',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
  pickerDisable: {
    borderColor: '#EFEFEF',
    borderWidth: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
});

export default ControlledDatePicker;
