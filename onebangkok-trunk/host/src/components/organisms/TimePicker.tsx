import React from 'react';

import {TextInputProps as RNTextInputProps} from 'react-native';

import {useFormContext, UseControllerProps} from 'react-hook-form';
import ControlledTimePicker from '../molecules/TimePickerField/ControlledTimePicker';
import {Dayjs} from 'dayjs';
import {DatePickerTheme} from '../molecules/TimePickerField';

interface TimePickerProps extends RNTextInputProps, UseControllerProps {
  labelText: string;
  name: string;
  defaultValue?: string;
  setFormError?: Function;
  onTimeChange?: Function;
  minTime?: Dayjs | null;
  maxTime?: Dayjs | null;
  themeColor?: DatePickerTheme;
  fixMinute?: string;
  onPress?: () => void;
}

export const TimePicker = (props: TimePickerProps) => {
  const {name, setFormError} = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'TimePicker must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    setFormError && setFormError(true);
    return null;
  }

  return <ControlledTimePicker {...props} />;
};
