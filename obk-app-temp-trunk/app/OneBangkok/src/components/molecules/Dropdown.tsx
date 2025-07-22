import React from 'react';

import {TextInputProps as RNTextInputProps} from 'react-native';

import {useFormContext, UseControllerProps} from 'react-hook-form';
import ControlledDropdown, {DropdownItem} from './ControlledDropdown';

interface DropdownProps extends RNTextInputProps, UseControllerProps {
  labelText: string;
  name: string;
  defaultValue?: string;
  setFormError?: Function;
  onSelect: Function;
  items: DropdownItem[];
}

export const Dropdown = (props: DropdownProps) => {
  const {name, setFormError} = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'Dropdown must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    setFormError && setFormError(true);
    return null;
  }

  return <ControlledDropdown {...props} />;
};
