import React from 'react';

import {TextInputProps as RNTextInputProps} from 'react-native';

import {useFormContext, UseControllerProps} from 'react-hook-form';
import ControlledDatePicker from './ControlledDatePicker';
import {DatepickerOptions} from '~/components/molecules';

interface DatePickerProps
  extends RNTextInputProps,
    UseControllerProps,
    DatepickerOptions {
  labelText: string;
  name: string;
  defaultValue?: string;
  setFormError?: Function;
  onDateChange?: Function;
  maxDate?: Date;
  onPress?: () => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const {name, setFormError} = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'DatePicker must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    setFormError && setFormError(true);
    return null;
  }

  return <ControlledDatePicker {...props} />;
};
