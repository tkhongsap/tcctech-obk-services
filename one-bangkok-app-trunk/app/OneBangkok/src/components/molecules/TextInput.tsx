import React, {forwardRef} from 'react';

import {TextInputProps as RNTextInputProps} from 'react-native';

import {useFormContext, UseControllerProps} from 'react-hook-form';
import ControlledInput from './ControlledInput';

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  labelText?: string;
  name: string;
  defaultValue?: string;
  setFormError?: Function;
  persistentValue?: boolean;
  description?: string;
}

export const TextInput = forwardRef<TextInputProps, TextInputProps>(
  (props, ref) => {
    const {name, setFormError} = props;

    const formContext = useFormContext();

    // Placeholder until input name is initialized
    if (!formContext || !name) {
      const msg = !formContext
        ? 'TextInput must be wrapped by the FormProvider'
        : 'Name must be defined';
      console.error(msg);
      setFormError && setFormError(true);
      return null;
    }

    return <ControlledInput {...props} ref={ref} />;
  },
);
