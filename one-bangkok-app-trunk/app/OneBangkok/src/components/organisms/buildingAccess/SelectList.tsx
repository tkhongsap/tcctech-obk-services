import React from 'react';

import {useFormContext} from 'react-hook-form';
import ControlledSelectList, {
  ControlledSelectListProps,
} from '~/components/molecules/buildingAccess/ControlledSelectList';

interface SelectListProps extends ControlledSelectListProps {
  name: string;
  setFormError?: Function;
}

export const SelectList = (props: SelectListProps) => {
  const {name, setFormError} = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'RadioLsit must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    setFormError && setFormError(true);
    return null;
  }

  return <ControlledSelectList {...props} />;
};
